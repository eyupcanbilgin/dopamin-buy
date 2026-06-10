"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/store/use-cart-store";

export function ReflectionCard() {
  const reflection = useCartStore((state) => state.latestOrder?.reflection ?? null);
  const setLatestOrderReflection = useCartStore((state) => state.setLatestOrderReflection);
  const [whyWanted, setWhyWanted] = useState(reflection?.whyWanted ?? "");
  const [needed, setNeeded] = useState(reflection?.needed ?? "");
  const [feeling, setFeeling] = useState(reflection?.feeling ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setWhyWanted(reflection?.whyWanted ?? "");
    setNeeded(reflection?.needed ?? "");
    setFeeling(reflection?.feeling ?? "");
  }, [reflection]);

  function saveReflection() {
    setLatestOrderReflection({
      whyWanted,
      needed,
      feeling,
      updatedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2 font-semibold text-navy">
        <BookOpenCheck className="h-5 w-5 text-primary" aria-hidden="true" />
        Kısa yansıma
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Cevaplar kusursuz olmak zorunda değil. Birkaç kelime bile isteğin şeklini anlamaya yardım
        eder.
      </p>
      <div className="mt-4 grid gap-4">
        <ReflectionField
          id="why-wanted"
          label="Bu ürünü neden istedin?"
          value={whyWanted}
          onChange={setWhyWanted}
        />
        <ReflectionField
          id="really-needed"
          label="Gerçekten ihtiyacın var mıydı?"
          value={needed}
          onChange={setNeeded}
        />
        <ReflectionField
          id="current-feeling"
          label="Şu an nasıl hissediyorsun?"
          value={feeling}
          onChange={setFeeling}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs leading-5 text-muted-foreground">
          Dopamin tıbbi değerlendirme yapmaz; bu alan yalnızca kişisel farkındalık notudur.
        </p>
        <Button type="button" onClick={saveReflection}>
          Kaydet
        </Button>
      </div>
      {saved ? <p className="mt-3 text-sm font-medium text-saved">Yansıma kaydedildi.</p> : null}
    </section>
  );
}

function ReflectionField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-20"
      />
    </div>
  );
}
