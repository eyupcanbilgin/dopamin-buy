import { test, expect } from "@playwright/test";

const disclosureStorageKey = "doply-simulation-disclosure-accepted-v1";

async function skipDisclosure(page: import("@playwright/test").Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, "true");
  }, disclosureStorageKey);
}

test.describe("Doply Buying Simulation Suite", () => {
  test.describe.configure({ timeout: 90000 });

  test("should complete the full emotional buying simulation flow and enforce safety rules", async ({ page }) => {
    // 1. User can browse products
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Doply");
    await expect(
      page.getByRole("dialog", { name: /Doply bir alışveriş simülasyonudur/i }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Anladım, Simülasyona Başla" }).click();
    await expect(
      page.getByRole("dialog", { name: /Doply bir alışveriş simülasyonudur/i }),
    ).toBeHidden();

    // Click "Deneyimi başlat" to go to shop page
    await page.getByRole("link", { name: /Deneyimi başlat/i }).click();
    await page.waitForURL("**/shop", { timeout: 20000 });

    // Ad slots are clearly labeled
    const adSlot = page.locator('aside[data-ad-placement="homepage-banner"]').first();
    await expect(adSlot).toBeVisible();
    await expect(adSlot).toContainText(/Reklam|Sponsorlu/);

    // Verify products are listed on shop page
    const productCard = page.getByRole("link", { name: /Sakin Ritim Kulaklık/i }).first();
    await expect(productCard).toBeVisible();

    // 2. User can open product detail
    await productCard.click();
    await page.waitForURL("**/urun/sakin-ritim-kulaklik", { timeout: 20000 });
    await expect(page.locator("h1")).toContainText("Sakin Ritim Kulaklık");

    // 3. User can add product to cart
    await page.getByRole("button", { name: /Sakin Ritim Kulaklık sepete ekle/i }).click();

    // Go to cart page
    await page.getByRole("link", { name: "Sepeti gör", exact: true }).click();
    await page.waitForURL("**/sepet", { timeout: 20000 });

    // Verify product is in cart and total price is visible
    await expect(page.getByText("Sakin Ritim Kulaklık", { exact: true })).toBeVisible();
    
    // Total price check (should be TRY 5,490 formatted)
    const subtotalText = await page.locator("aside >> text=5.490").first().textContent();
    expect(subtotalText).toBeDefined();

    // 8. Saved money amount equals cart total
    const savedAmount = page.locator("aside >> text=Simülasyon tamamlanırsa korunacak tutar");
    await expect(savedAmount).toBeVisible();
    await expect(page.locator("aside >> p.text-saved").first()).toContainText("5.490");

    // Click "Sanal Siparişi Tamamla" to start checkout
    await page.getByRole("link", { name: "Sanal Siparişi Tamamla" }).click();
    await page.waitForURL("**/checkout", { timeout: 20000 });

    // 9. Urge check-in before works
    // The proceed button should be disabled initially when urge level is not selected
    const proceedBtn = page.locator('button:has-text("Önce dürtü puanı seç")');
    await expect(proceedBtn).toBeDisabled();

    // Select urge level 8
    await page.getByRole("button", { name: "8 üzerinden 10 dürtü seviyesi" }).click();
    
    // Now proceed button should change and be enabled
    const activeProceedBtn = page.locator('a:has-text("Teslimat Simülasyonuna Geç")');
    await expect(activeProceedBtn).toBeVisible();
    await activeProceedBtn.click();

    await page.waitForURL("**/checkout/teslimat", { timeout: 20000 });

    // 6. User cannot enter full open address (verify address fields are limited and no text inputs exist for address)
    // Check that there are no open text input fields or textareas for typing custom street addresses
    const textarea = page.locator("textarea");
    await expect(textarea).toHaveCount(0);
    
    const textInput = page.locator('input[type="text"]');
    await expect(textInput).toHaveCount(0);

    // Select City, District, Address Type (using defaults or custom dropdown selection)
    await page.selectOption("#city", "Ankara");
    await page.selectOption("#district", "Çankaya");
    
    // Verify address type choice (family)
    await page.locator("label").filter({ hasText: "Aile" }).click();

    // Proceed to shipping
    await page.click('button:has-text("Kargo Simülasyonuna Geç")');
    await page.waitForURL("**/checkout/kargo", { timeout: 20000 });

    // Choose standard shipping and proceed to payment
    await page.click('button:has-text("Ödeme Simülasyonuna Geç")');
    await page.waitForURL("**/checkout/odeme", { timeout: 20000 });

    // 5. User cannot enter real card number, CVV, or expiration date
    // Verify that card inputs do not exist at all on the payment simulation page
    const cardInputs = page.locator(
      'input[placeholder*="Card"], input[placeholder*="Kart"], input[placeholder*="CVV"], input[placeholder*="MM/YY"], input[name*="card" i], input[name*="cvv" i], input[name*="expiry" i]',
    );
    await expect(cardInputs).toHaveCount(0);

    // 4. User can complete simulation checkout without entering real card data
    // Select payment simulation type, check simulation consent, and complete checkout
    await page.locator("label").filter({ hasText: "Doply Sanal Kart" }).click();
    await page.locator('input[type="checkbox"]').check();

    await page.click('button:has-text("Sanal Siparişi Tamamla")');
    await page.waitForURL("**/siparis-takip", { timeout: 20000 });
    await expect(page.getByRole("heading", { name: "Sanal Sipariş takibi" })).toBeVisible();
    await expect(page.locator("[data-ad-placement]")).toHaveCount(0);

    // 7. Simulated order number is generated
    const orderNumberEl = page.getByText(/^SNL-\d{4}-[A-Z0-9]{6}$/).first();
    await expect(orderNumberEl).toBeVisible();
    const orderNumber = await orderNumberEl.textContent();
    expect(orderNumber).toMatch(/^SNL-\d{4}-[A-Z0-9]{6}$/);

    // Verify saved money matches
    await expect(page.locator("p.text-saved").first()).toContainText("5.490");
    await expect(page.getByRole("heading", { name: "Takip tamamlandı" })).toBeVisible({
      timeout: 12000,
    });

    // 9. Urge check-in after works
    await page.getByRole("button", { name: "3 üzerinden 10 dürtü seviyesi" }).last().click();
    await expect(page.locator("text=Seçili seviye: 3/10")).toBeVisible();

    // Verify closing action resets cart
    await page.getByRole("link", { name: /Bugünlük yeterli/i }).click();
    await page.waitForURL("**/shop", { timeout: 20000 });
    
    // Cart should be empty
    await page.goto("/sepet");
    await expect(page.locator("text=Sepetin boş")).toBeVisible();
  });

  test("should check mobile bottom navigation visibility and actions", async ({ page }) => {
    await skipDisclosure(page);

    // Set viewport to mobile sizes
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/");
    await expect(
      page.getByRole("dialog", { name: /Doply bir alışveriş simülasyonudur/i }),
    ).toHaveCount(0);
    const mobileNav = page.locator('nav[aria-label="Mobil hızlı navigasyon"]');
    await expect(mobileNav).toBeVisible();

    // Verify links route correctly through user activation within the mobile navigation landmark.
    const homeLink = mobileNav.getByRole("link", { name: "Ana", exact: true });
    await expect(homeLink).toHaveAttribute("href", "/shop");
    await Promise.all([
      page.waitForURL("**/shop", { timeout: 20000 }),
      homeLink.click(),
    ]);

    const cartLink = page
      .locator('nav[aria-label="Mobil hızlı navigasyon"]')
      .getByRole("link", { name: "Sepet", exact: true });
    await expect(cartLink).toHaveAttribute("href", "/sepet");
    await Promise.all([
      page.waitForURL("**/sepet", { timeout: 20000 }),
      cartLink.click(),
    ]);
  });

  test("accessibility and semantic structure smoke test", async ({ page }) => {
    await skipDisclosure(page);
    await page.goto("/");
    // 12. Accessibility smoke test: single h1, image alt text, landmarks
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    // Verify images have alt tags
    const images = page.locator("img");
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
      expect(alt?.length).toBeGreaterThan(0);
    }

    // Verify basic landmarks exist
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });
});
