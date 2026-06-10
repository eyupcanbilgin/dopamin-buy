import type { Prisma, PrismaClient } from "@prisma/client";

type AuditClient = PrismaClient | Prisma.TransactionClient;

type AuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string;
  summary: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createAdminAuditLog(prisma: AuditClient, input: AuditLogInput) {
  await prisma.adminAuditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      summary: input.summary,
      metadata: input.metadata ?? undefined,
    },
  });
}
