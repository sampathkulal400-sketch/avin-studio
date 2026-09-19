/**
 * AVIN Studio - Interactive Neuromarketing Session Cost Estimator & Lead Generator
 * Direct Integration with Studio WhatsApp (+91 78995 30503)
 */

document.addEventListener('DOMContentLoaded', () => {
  const eventTypeSelect = document.getElementById('calc-event-type');
  const coverageHoursSelect = document.getElementById('calc-coverage');
  const addonCheckboxes = document.querySelectorAll('.calc-addon');
  const estimatedTotalEl = document.getElementById('calc-total');
  const originalTotalEl = document.getElementById('calc-original-total');
  const savingsEl = document.getElementById('calc-savings');
  const clientNameInput = document.getElementById('calc-name');
  const clientDateInput = document.getElementById('calc-date');
  const clientLocationInput = document.getElementById('calc-location');
  const whatsappCtaBtn = document.getElementById('calc-whatsapp-btn');

  // Base pricing dictionary (INR)
  const baseRates = {
    'wedding-full': { base: 45000, label: 'Grand Wedding & Reception (2-Days Full Coverage)' },
    'wedding-day': { base: 28000, label: 'Single Day Wedding & Muhurtham' },
    'pre-wedding': { base: 15000, label: 'Pre-Wedding / Post-Wedding Outdoor Session' },
    'maternity-baby': { base: 10000, label: 'Maternity / Baby Shower / Seemantha' },
    'traditional-event': { base: 12000, label: 'Gruhapravesha / Thread Ceremony / Naming' },
    'studio-portrait': { base: 5000, label: 'Indoor Studio Portrait & Fashion Portfolio' },
    'passport-classic': { base: 1200, label: 'Express Studio Headshot & Visa Portraits' }
  };

  const hourMultipliers = {
    'standard': 1.0,
    'extended': 1.25,
    'unlimited': 1.45
  };

  const addonPrices = {
    'drone': 6000,
    'cinematic-teaser': 9000,
    'luxury-album': 7500,
    'live-streaming': 8000,
    'second-candid': 8500,
    'express-delivery': 3500
  };

  function calculateEstimate() {
    if (!eventTypeSelect || !estimatedTotalEl) return;

    const eventType = eventTypeSelect.value;
    const coverage = coverageHoursSelect ? coverageHoursSelect.value : 'standard';
    
    const baseInfo = baseRates[eventType] || { base: 25000, label: 'Custom Photography Session' };
    let subtotal = baseInfo.base * (hourMultipliers[coverage] || 1.0);

    let selectedAddonsList = [];
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const price = addonPrices[cb.dataset.addon] || 0;
        subtotal += price;
        selectedAddonsList.push(cb.dataset.name || cb.dataset.addon);
      }
    });

    // Neuromarketing Price Anchoring (Display original price with 15% VIP Early-Bird Privilege Discount)
    const anchorOriginal = Math.round(subtotal * 1.18);
    const savingsAmount = anchorOriginal - Math.round(subtotal);

    // Format Currency in INR
    const formattedSubtotal = '₹' + Math.round(subtotal).toLocaleString('en-IN');
    const formattedOriginal = '₹' + anchorOriginal.toLocaleString('en-IN');
    const formattedSavings = 'Save ₹' + savingsAmount.toLocaleString('en-IN') + ' (Early-Bird Privilege)';

    // Update UI elements
    if (estimatedTotalEl) estimatedTotalEl.textContent = formattedSubtotal;
    if (originalTotalEl) originalTotalEl.textContent = formattedOriginal;
    if (savingsEl) savingsEl.textContent = formattedSavings;

    // Build Dynamic WhatsApp URL
    const clientName = clientNameInput && clientNameInput.value.trim() ? clientNameInput.value.trim() : 'Guest';
    const eventDate = clientDateInput && clientDateInput.value ? clientDateInput.value : 'Upcoming Season';
    const location = clientLocationInput && clientLocationInput.value.trim() ? clientLocationInput.value.trim() : 'Sullia / Coastal Karnataka';

    let message = `Namaskara AVIN Studio! 🙏\n\nI just customized my photography package on your website.\n\n`;
    message += `👤 *Name*: ${clientName}\n`;
    message += `📅 *Date of Event*: ${eventDate}\n`;
    message += `📍 *Location*: ${location}\n`;
    message += `📷 *Shoot Type*: ${baseInfo.label}\n`;
    
    if (selectedAddonsList.length > 0) {
      message += `✨ *Selected Add-ons*: ${selectedAddonsList.join(', ')}\n`;
    }
    
    message += `💰 *Estimated Investment*: ${formattedSubtotal} (with Season Privilege Offer)\n\n`;
    message += `Please confirm your availability for my date and share detailed brochure. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/917899530503?text=${encodedMessage}`;

    if (whatsappCtaBtn) {
      whatsappCtaBtn.href = waLink;
    }
  }

  // Bind event listeners
  if (eventTypeSelect) eventTypeSelect.addEventListener('change', calculateEstimate);
  if (coverageHoursSelect) coverageHoursSelect.addEventListener('change', calculateEstimate);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));
  if (clientNameInput) clientNameInput.addEventListener('input', calculateEstimate);
  if (clientDateInput) clientDateInput.addEventListener('change', calculateEstimate);
  if (clientLocationInput) clientLocationInput.addEventListener('input', calculateEstimate);

  // Initial calculation
  calculateEstimate();
});
