export interface BookingData {
  action: 'booking' | 'quote'
  name: string
  email: string
  phone: string
  bin: { key: string; name: string; qty: number; isBase: boolean }[]
  address: string
  pickupType: string
  distanceKm: number
  baseItemPrice: number
  additionalItemsCost: number
  floorSurcharge: number
  distanceLevy: number
  total: number
}

function firstName(name: string) {
  return name.split(' ')[0]
}

function formatNZT(): string {
  return new Date().toLocaleString('en-NZ', {
    timeZone: 'Pacific/Auckland',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function binTable(bin: BookingData['bin']): string {
  return bin
    .map(
      (item) =>
        `<tr>
          <td style="padding:4px 8px;">${item.name}${item.isBase ? ' <span style="color:#166534;font-weight:600;">(base)</span>' : ''}</td>
          <td style="padding:4px 8px;">×${item.qty}</td>
        </tr>`,
    )
    .join('')
}

function priceBreakdown(data: BookingData): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <tbody>
        ${binTable(data.bin)}
        <tr><td colspan="2" style="border-top:1px solid #e5e7eb;padding:4px 0;"></td></tr>
        <tr>
          <td style="padding:4px 8px;">Items subtotal</td>
          <td style="padding:4px 8px;">$${data.baseItemPrice + data.additionalItemsCost}</td>
        </tr>
        ${data.floorSurcharge > 0 ? `<tr><td style="padding:4px 8px;">Floor surcharge</td><td style="padding:4px 8px;">$${data.floorSurcharge}</td></tr>` : ''}
        ${data.distanceLevy > 0 ? `<tr><td style="padding:4px 8px;">Distance levy (${data.distanceKm} km)</td><td style="padding:4px 8px;">$${data.distanceLevy}</td></tr>` : ''}
        <tr>
          <td style="padding:6px 8px;font-weight:700;font-size:18px;color:#166534;">Total NZD</td>
          <td style="padding:6px 8px;font-weight:700;font-size:18px;color:#166534;">$${data.total}</td>
        </tr>
      </tbody>
    </table>
  `
}

const footer = `
  <p style="margin-top:32px;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;padding-top:16px;">
    <em>Whiteware gone, the green way.</em> — <a href="https://greenhaul.kiwi" style="color:#166534;">greenhaul.kiwi</a>
  </p>
`

export function customerBookingEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: 'Your GreenHaul Booking is Confirmed 🟢',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <h1 style="color:#166534;">Hi ${firstName(data.name)}, you're booked! 🟢</h1>
        <p>Thanks for choosing GreenHaul. Here's a summary of your booking:</p>
        <h3>Items</h3>
        ${priceBreakdown(data)}
        <h3>Pickup Details</h3>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Floor access:</strong> ${data.pickupType}</p>
        <p><strong>Distance from Onehunga:</strong> ${data.distanceKm} km</p>
        <p style="background:#f0fdf4;border-left:4px solid #166534;padding:12px 16px;border-radius:4px;">
          Our team will contact you within 24 hours to confirm your pickup window.
        </p>
        ${footer}
      </div>
    `,
  }
}

export function adminBookingEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: `New Booking — ${data.name} — $${data.total}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <h2>New Booking</h2>
        <h3>Customer</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <h3>Items</h3>
        ${priceBreakdown(data)}
        <h3>Pickup</h3>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Floor access:</strong> ${data.pickupType}</p>
        <p><strong>Distance:</strong> ${data.distanceKm} km</p>
        <p style="color:#6b7280;font-size:13px;">Received: ${formatNZT()} NZT</p>
      </div>
    `,
  }
}

export function customerQuoteEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: 'Your GreenHaul Quote 🟢',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <h1 style="color:#166534;">Hi ${firstName(data.name)}, here's your instant quote 🟢</h1>
        <p>Thanks for using GreenHaul. Here's the quote you requested:</p>
        <h3>Items</h3>
        ${priceBreakdown(data)}
        <h3>Pickup Details</h3>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Floor access:</strong> ${data.pickupType}</p>
        <p style="color:#6b7280;font-size:13px;">Quote valid for 7 days.</p>
        <p style="background:#f0fdf4;border-left:4px solid #166534;padding:12px 16px;border-radius:4px;">
          Ready to book? Reply to this email or visit <a href="https://greenhaul.kiwi" style="color:#166534;">greenhaul.kiwi</a>
        </p>
        ${footer}
      </div>
    `,
  }
}

export function adminQuoteEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: `New Quote Request — ${data.name} — $${data.total}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111827;">
        <h2>New Quote Request</h2>
        <h3>Customer</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <h3>Items</h3>
        ${priceBreakdown(data)}
        <h3>Pickup</h3>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Floor access:</strong> ${data.pickupType}</p>
        <p><strong>Distance:</strong> ${data.distanceKm} km</p>
        <p style="color:#6b7280;font-size:13px;">Received: ${formatNZT()} NZT</p>
      </div>
    `,
  }
}
