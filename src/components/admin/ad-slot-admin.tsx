"use client";

import { useEffect, useMemo, useState } from "react";
import { Megaphone, Save, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdPlacementId } from "@/lib/ad-config";
import { adPlacementOptions } from "@/lib/ad-config";
import { formatOrderDate } from "@/lib/format";

type AdminAdSlot = {
  id: string;
  slug: string;
  name: string;
  placement: string;
  title: string;
  body: string;
  label: "Reklam" | "Sponsorlu";
  sponsorName: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  frequencyCap: number;
  isActive: boolean;
  sortOrder: number;
  updatedAt: string;
};

type FormState = {
  name: string;
  placement: AdPlacementId;
  title: string;
  body: string;
  label: "Reklam" | "Sponsorlu";
  sponsorName: string;
  ctaLabel: string;
  ctaHref: string;
  frequencyCap: string;
  isActive: boolean;
  sortOrder: string;
};

const defaultFormState: FormState = {
  name: "",
  placement: "homepage-banner",
  title: "",
  body: "",
  label: "Sponsorlu",
  sponsorName: "",
  ctaLabel: "",
  ctaHref: "",
  frequencyCap: "3",
  isActive: true,
  sortOrder: "0",
};

export function AdSlotAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [slots, setSlots] = useState<AdminAdSlot[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const authHeaders = useMemo(
    () => ({
      "x-dopamin-admin-key": adminKey,
    }),
    [adminKey],
  );

  useEffect(() => {
    if (!adminKey.trim()) {
      return;
    }

    void fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  async function fetchSlots() {
    if (!adminKey.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/ad-slots", { headers: authHeaders });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Reklam alanları alınamadı.");
      }

      setSlots(payload.slots ?? []);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Reklam alanları yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  async function saveSlot() {
    if (!adminKey.trim()) {
      setError("Admin anahtarını gir.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    const body = JSON.stringify({
      ...formState,
      frequencyCap: Number(formState.frequencyCap),
      sortOrder: Number(formState.sortOrder),
      sponsorName: formState.sponsorName.trim() || null,
      ctaLabel: formState.ctaLabel.trim() || null,
      ctaHref: formState.ctaHref.trim() || null,
    });

    try {
      const response = await fetch(
        editingId ? `/api/admin/ad-slots/${editingId}` : "/api/admin/ad-slots",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            ...authHeaders,
            "content-type": "application/json",
          },
          body,
        },
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Reklam alanı kaydedilemedi.");
      }

      setNotice(editingId ? "Reklam alanı güncellendi." : "Reklam alanı oluşturuldu.");
      setEditingId(null);
      setFormState(defaultFormState);
      await fetchSlots();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Reklam alanı kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  }

  function editSlot(slot: AdminAdSlot) {
    const placement = adPlacementOptions.find((option) => option.prismaValue === slot.placement);

    setEditingId(slot.id);
    setFormState({
      name: slot.name,
      placement: placement?.id ?? "homepage-banner",
      title: slot.title,
      body: slot.body,
      label: slot.label,
      sponsorName: slot.sponsorName ?? "",
      ctaLabel: slot.ctaLabel ?? "",
      ctaHref: slot.ctaHref ?? "",
      frequencyCap: String(slot.frequencyCap),
      isActive: slot.isActive,
      sortOrder: String(slot.sortOrder),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Admin erişimi
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Reklamlar yalnızca açık “Reklam” veya “Sponsorlu” etiketiyle yayınlanır. Checkout ve
          kapanış akışlarında gösterilmez.
        </p>
        <div className="mt-4 grid gap-2">
          <Label htmlFor="admin-key">Admin anahtarı</Label>
          <Input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="DOPAMIN_ADMIN_KEY"
          />
        </div>
        <Button type="button" className="mt-4 w-full" onClick={fetchSlots} disabled={loading}>
          Alanları yenile
        </Button>
      </section>

      <section className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Reklam alanını düzenle" : "Yeni reklam alanı"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slot adı" id="ad-name">
                <Input
                  id="ad-name"
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  placeholder="Hafta sonu rehber sponsoru"
                />
              </Field>
              <Field label="Yerleşim" id="ad-placement">
                <select
                  id="ad-placement"
                  value={formState.placement}
                  onChange={(event) =>
                    setFormState({ ...formState, placement: event.target.value as AdPlacementId })
                  }
                  className="focus-ring h-10 rounded-md border bg-background px-3 text-sm"
                >
                  {adPlacementOptions.map((placement) => (
                    <option key={placement.id} value={placement.id}>
                      {placement.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Etiket" id="ad-label">
                <select
                  id="ad-label"
                  value={formState.label}
                  onChange={(event) =>
                    setFormState({
                      ...formState,
                      label: event.target.value as "Reklam" | "Sponsorlu",
                    })
                  }
                  className="focus-ring h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="Sponsorlu">Sponsorlu</option>
                  <option value="Reklam">Reklam</option>
                </select>
              </Field>
              <Field label="Sponsor adı" id="ad-sponsor">
                <Input
                  id="ad-sponsor"
                  value={formState.sponsorName}
                  onChange={(event) =>
                    setFormState({ ...formState, sponsorName: event.target.value })
                  }
                  placeholder="Yetkili sponsor"
                />
              </Field>
            </div>

            <Field label="Başlık" id="ad-title">
              <Input
                id="ad-title"
                value={formState.title}
                onChange={(event) => setFormState({ ...formState, title: event.target.value })}
                placeholder="Sakin bütçe planlama aracı"
              />
            </Field>
            <Field label="Metin" id="ad-body">
              <Textarea
                id="ad-body"
                value={formState.body}
                onChange={(event) => setFormState({ ...formState, body: event.target.value })}
                placeholder="Manipülatif stok, sayaç veya satın alma baskısı içermeyen sponsor açıklaması."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="CTA metni" id="ad-cta-label">
                <Input
                  id="ad-cta-label"
                  value={formState.ctaLabel}
                  onChange={(event) =>
                    setFormState({ ...formState, ctaLabel: event.target.value })
                  }
                  placeholder="Sponsor sitesine git"
                />
              </Field>
              <Field label="CTA bağlantısı" id="ad-cta-href">
                <Input
                  id="ad-cta-href"
                  value={formState.ctaHref}
                  onChange={(event) => setFormState({ ...formState, ctaHref: event.target.value })}
                  placeholder="https://..."
                />
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Günlük frekans sınırı" id="ad-frequency">
                <Input
                  id="ad-frequency"
                  type="number"
                  min="0"
                  max="24"
                  value={formState.frequencyCap}
                  onChange={(event) =>
                    setFormState({ ...formState, frequencyCap: event.target.value })
                  }
                />
              </Field>
              <Field label="Sıra" id="ad-sort">
                <Input
                  id="ad-sort"
                  type="number"
                  min="0"
                  value={formState.sortOrder}
                  onChange={(event) => setFormState({ ...formState, sortOrder: event.target.value })}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-md border bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    setFormState({ ...formState, isActive: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                Yayında
              </label>
            </div>

            <div className="rounded-lg border border-dopamine/30 bg-dopamine/10 p-4 text-sm leading-6 text-muted-foreground">
              Kural: stok baskısı, geri sayım, yanıltıcı ürün kartı görünümü veya “hemen al”
              baskısı kullanma. Reklam, ürün keşif alanından görsel olarak ayrılmalıdır.
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={saveSlot} disabled={saving}>
                <Save className="h-4 w-4" aria-hidden="true" />
                {editingId ? "Güncelle" : "Oluştur"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setFormState(defaultFormState);
                  }}
                >
                  Vazgeç
                </Button>
              ) : null}
              {notice ? <p className="text-sm font-medium text-saved">{notice}</p> : null}
              {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-3" aria-label="Reklam alanları">
          {slots.map((slot) => (
            <Card key={slot.id}>
              <CardContent className="grid gap-4 pt-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={slot.isActive ? "success" : "outline"}>
                      {slot.isActive ? "Yayında" : "Kapalı"}
                    </Badge>
                    <Badge variant="simulation">{slot.label}</Badge>
                    <span className="text-xs text-muted-foreground">{slot.placement}</span>
                  </div>
                  <h3 className="mt-3 flex items-center gap-2 font-bold text-navy">
                    <Megaphone className="h-4 w-4 text-primary" aria-hidden="true" />
                    {slot.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium">{slot.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{slot.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Frekans: günde {slot.frequencyCap} gösterim · Güncellendi:{" "}
                    {formatOrderDate(slot.updatedAt)}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={() => editSlot(slot)}>
                  Düzenle
                </Button>
              </CardContent>
            </Card>
          ))}
          {slots.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
              <h3 className="text-lg font-bold text-navy">Henüz reklam alanı yok</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Yayına alınmış sponsor içeriği olmadığında public slotlar boş ve güvenli fallback
                gösterir.
              </p>
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
