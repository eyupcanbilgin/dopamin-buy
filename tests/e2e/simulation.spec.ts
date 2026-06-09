import { test, expect } from "@playwright/test";

test.describe("Dopamin Buying Simulation Suite", () => {
  test("should complete the full emotional buying simulation flow and enforce safety rules", async ({ page }) => {
    // 1. User can browse products
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Dopamin");

    // Click "Deneyimi başlat" to go to shop page
    await page.click('a:has-text("Deneyimi başlat")');
    await page.waitForURL("**/shop", { timeout: 20000 });

    // Ad slots are clearly labeled
    const adSlot = page.locator('aside[aria-label="Etik duyuru alanı"]');
    await expect(adSlot).toBeVisible();
    await expect(adSlot).toContainText("Sakin mola alanı");
    await expect(adSlot).toContainText("Gerçek ödeme yok");

    // Verify products are listed on shop page
    const productCard = page.locator("a:has-text('Sakin Ritim Kulaklık')").first();
    await expect(productCard).toBeVisible();

    // 2. User can open product detail
    await productCard.click();
    await page.waitForURL("**/urun/sakin-ritim-kulaklik", { timeout: 20000 });
    await expect(page.locator("h1")).toContainText("Sakin Ritim Kulaklık");

    // 3. User can add product to cart
    await page.click('button:has-text("Sanal sepete ekle")');

    // Go to cart page
    await page.click('a:has-text("Sanal sepeti gör")');
    await page.waitForURL("**/sepet", { timeout: 20000 });

    // Verify product is in cart and total price is visible
    await expect(page.locator("text=Sakin Ritim Kulaklık")).toBeVisible();
    
    // Total price check (should be TRY 5,490 formatted)
    const subtotalText = await page.locator("aside >> text=5.490").first().textContent();
    expect(subtotalText).toBeDefined();

    // 8. Saved money amount equals cart total
    const savedAmount = page.locator("aside >> text=Simülasyon tamamlanırsa korunacak tutar");
    await expect(savedAmount).toBeVisible();
    await expect(page.locator("aside >> p.text-saved").first()).toContainText("5.490");

    // Click "Sanal Sipariş akışına geç" to start checkout
    await page.click('a:has-text("Sanal Sipariş akışına geç")');
    await page.waitForURL("**/checkout", { timeout: 20000 });

    // 9. Urge check-in before works
    // The proceed button should be disabled initially when urge level is not selected
    const proceedBtn = page.locator('button:has-text("Önce dürtü puanı seç")');
    await expect(proceedBtn).toBeDisabled();

    // Select urge level 8
    await page.click('button[aria-label="8 üzerinden 10 dürtü seviyesi"]');
    
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
    await page.click("label:has-text('Family')");

    // Proceed to shipping
    await page.click('button:has-text("Kargo Simülasyonuna Geç")');
    await page.waitForURL("**/checkout/kargo", { timeout: 20000 });

    // Choose standard shipping and proceed to payment
    await page.click('button:has-text("Ödeme Simülasyonuna Geç")');
    await page.waitForURL("**/checkout/odeme", { timeout: 20000 });

    // 5. User cannot enter real card number, CVV, or expiration date
    // Verify that card inputs do not exist at all on the payment simulation page
    const cardInputs = page.locator('input[placeholder*="Card"], input[placeholder*="Kart"], input[placeholder*="CVV"], input[placeholder*="MM/YY"]');
    await expect(cardInputs).toHaveCount(0);

    // 4. User can complete simulation checkout without entering real card data
    // Select payment simulation type, check simulation consent, and complete checkout
    await page.click('label:has-text("Simulated Dopamin Card")');
    await page.locator('input[type="checkbox"]').check();

    await page.click('button:has-text("Sanal Siparişi Tamamla")');
    await page.waitForURL("**/checkout/basarili", { timeout: 20000 });

    // 7. Simulated order number is generated
    const orderNumberEl = page.locator("text=Sanal Sipariş no >> xpath=../p");
    await expect(orderNumberEl).toBeVisible();
    const orderNumber = await orderNumberEl.textContent();
    expect(orderNumber).toMatch(/^SNL-\d{4}-[A-Z0-9]{6}$/);

    // Verify saved money matches
    await expect(page.locator("p.text-saved").first()).toContainText("5.490");

    // 9. Urge check-in after works
    await page.click('button[aria-label="3 üzerinden 10 dürtü seviyesi"]');
    await expect(page.locator("text=Seçili seviye: 3/10")).toBeVisible();
    await expect(page.locator("text=Dürtü seviyen 8/10 seviyesinden 3/10 seviyesine indi.")).toBeVisible();

    // Verify closing action (Yeni Simülasyon Başlat) resets cart
    await page.click('a:has-text("Yeni Simülasyon Başlat")');
    await page.waitForURL("**/shop", { timeout: 20000 });
    
    // Cart should be empty
    await page.goto("/sepet");
    await expect(page.locator("text=Sanal sepetin boş")).toBeVisible();
  });

  test("should check mobile bottom navigation visibility and actions", async ({ page }) => {
    // Set viewport to mobile sizes
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/");
    const mobileNav = page.locator('nav[aria-label="Mobil hızlı navigasyon"]');
    await expect(mobileNav).toBeVisible();

    // Verify links route correctly by clicking within the mobile navigation landmark specifically
    await mobileNav.locator('a:has-text("Keşfet")').click();
    await page.waitForURL("**/shop", { timeout: 20000 });

    await mobileNav.locator('a:has-text("Sepet")').click();
    await page.waitForURL("**/sepet", { timeout: 20000 });
  });

  test("accessibility and semantic structure smoke test", async ({ page }) => {
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
