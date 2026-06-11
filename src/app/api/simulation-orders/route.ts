import {
  AddressType,
  SimulationOrderStatus,
  SimulationPaymentMethod,
  type Prisma,
} from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getPrisma } from "@/lib/prisma";
import { publicMutationRateLimit, rateLimitRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const simulationOrderLineSchema = z.object({
  productId: z.string().trim().min(1).max(120).optional(),
  quantity: z.coerce.number().int().min(1).max(9),
  name: z.string().trim().min(1).max(180),
  categoryName: z.string().trim().min(1).max(120),
  price: z.coerce.number().min(0).max(5_000_000),
  image: z.string().trim().max(500).optional(),
});

const simulationOrderLogSchema = z.object({
  id: z.string().trim().regex(/^SNL-\d{4}-[A-Z0-9]{6,12}$/),
  createdAt: z.string().datetime(),
  lines: z.array(simulationOrderLineSchema).min(1).max(50),
  total: z.coerce.number().min(0).max(20_000_000),
  avoidedSpending: z.coerce.number().min(0).max(20_000_000),
  urgeBefore: z.coerce.number().int().min(1).max(10).nullable(),
  urgeAfter: z.coerce.number().int().min(1).max(10).nullable(),
  triggers: z.array(z.string().trim().max(40)).max(12).default([]),
  delivery: z
    .object({
      city: z.string().trim().min(2).max(32),
      district: z.string().trim().min(2).max(32),
      addressType: z.enum(["home", "work", "family", "random"]),
      fictionalAddress: z.string().trim().min(8).max(160),
    })
    .nullable(),
  shipping: z
    .object({
      optionId: z.enum(["standard-simulation", "fast-relief", "same-day-feeling"]),
    })
    .nullable(),
  payment: z
    .object({
      methodId: z.enum(["simulated-doply-card", "simulated-cash", "complete-without-spending"]),
    })
    .nullable(),
});

const addressTypeMap: Record<"home" | "work" | "family" | "random", AddressType> = {
  home: AddressType.HOME,
  work: AddressType.WORK,
  family: AddressType.FAMILY,
  random: AddressType.RANDOM,
};

const paymentMethodMap: Record<string, SimulationPaymentMethod> = {
  "simulated-doply-card": SimulationPaymentMethod.SIMULATED_DOPLY_CARD,
  "simulated-cash": SimulationPaymentMethod.SIMULATED_CASH_ON_DELIVERY,
  "complete-without-spending": SimulationPaymentMethod.COMPLETE_WITHOUT_SPENDING,
};

export async function POST(request: NextRequest) {
  const rateLimitError = rateLimitRequest(request, publicMutationRateLimit);

  if (rateLimitError) {
    return rateLimitError;
  }

  const payload = await request.json().catch(() => null);
  const parsed = simulationOrderLogSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Sanal sipariş kaydı doğrulanamadı.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    await logSimulationOrder(parsed.data);
    return NextResponse.json({ ok: true, logged: true }, { status: 201 });
  } catch (error) {
    console.warn("doply_simulation_order_log_failed", {
      simulationNumber: parsed.data.id,
      itemCount: parsed.data.lines.length,
      reason: error instanceof Error ? error.message : "unknown",
    });

    return NextResponse.json({ ok: true, logged: false }, { status: 202 });
  }
}

async function logSimulationOrder(data: z.infer<typeof simulationOrderLogSchema>) {
  const prisma = getPrisma();
  const existing = await prisma.simulationOrder.findUnique({
    where: { simulationNumber: data.id },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const candidateProductIds = Array.from(
    new Set(data.lines.map((line) => line.productId).filter((id): id is string => Boolean(id))),
  );
  const existingProducts = candidateProductIds.length
    ? await prisma.product.findMany({
        where: { id: { in: candidateProductIds } },
        select: { id: true },
      })
    : [];
  const validProductIds = new Set(existingProducts.map((product) => product.id));
  const totalValueCents = toCents(data.total);
  const savedMoneyCents = toCents(data.avoidedSpending);

  await prisma.$transaction(async (transaction) => {
    const order = await transaction.simulationOrder.create({
      data: {
        simulationNumber: data.id,
        status: SimulationOrderStatus.COMPLETED,
        totalValueCents,
        savedMoneyCents,
        addressType: data.delivery ? addressTypeMap[data.delivery.addressType] : null,
        deliveryCity: data.delivery?.city ?? null,
        deliveryDistrict: data.delivery?.district ?? null,
        generatedFictionalAddress: data.delivery?.fictionalAddress ?? null,
        simulationPaymentMethod: data.payment ? paymentMethodMap[data.payment.methodId] : null,
        urgeScoreBefore: data.urgeBefore,
        urgeScoreAfter: data.urgeAfter,
        completedAt: new Date(data.createdAt),
        items: {
          create: data.lines.map((line) => ({
            productId: line.productId && validProductIds.has(line.productId) ? line.productId : null,
            productName: line.name,
            categoryName: line.categoryName,
            quantity: line.quantity,
            unitPriceCents: toCents(line.price),
            totalPriceCents: toCents(line.price * line.quantity),
            imageUrl: line.image || null,
          })),
        },
      },
      select: { id: true },
    });

    const checkIns: Prisma.UrgeCheckInCreateManyInput[] = [];

    if (data.urgeBefore) {
      checkIns.push({ simulationOrderId: order.id, score: data.urgeBefore });
    }

    if (data.urgeAfter) {
      checkIns.push({ simulationOrderId: order.id, score: data.urgeAfter });
    }

    if (checkIns.length > 0) {
      await transaction.urgeCheckIn.createMany({ data: checkIns });
    }

    await transaction.savedMoneyEvent.create({
      data: {
        simulationOrderId: order.id,
        amountCents: savedMoneyCents,
        reason: "Sanal Sipariş tamamlandı; gerçek ödeme oluşturulmadı.",
      },
    });
  });

  console.info("doply_simulation_order_created", {
    simulationNumber: data.id,
    itemCount: data.lines.length,
    totalValueCents,
    savedMoneyCents,
    paymentMethod: data.payment?.methodId ?? null,
    triggerCount: data.triggers.length,
  });
}

function toCents(value: number) {
  return Math.round(value * 100);
}
