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
  additionalInfo?: string
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

// ── Shared styles ──────────────────────────────────────────────
const colors = {
  green: '#1a3d24',
  greenLight: '#f4faf6',
  greenBorder: '#c2e8cc',
  greenAccent: '#3a8a52',
  ink: '#1a1a18',
  inkMuted: '#4a4a46',
  inkFaint: '#9a9a94',
  border: '#e8f5ec',
}

const wrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4faf6;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4faf6;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Header -->
        <tr>
          <td style="background:${colors.green};padding:24px 32px;border-radius:12px 12px 0 0;">
            <span style="font-size:20px;font-weight:400;color:#ffffff;letter-spacing:-0.01em;">haul</span><span style="font-size:20px;font-weight:400;color:#5aab70;">.green</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid ${colors.border};border-right:1px solid ${colors.border};">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${colors.greenLight};padding:20px 32px;border:1px solid ${colors.border};border-top:none;border-radius:0 0 12px 12px;text-align:center;">
            <p style="margin:0;font-size:13px;color:${colors.inkFaint};font-style:italic;">Whiteware gone, the green way.</p>
            <p style="margin:6px 0 0;font-size:12px;color:${colors.inkFaint};">
              <a href="https://haul.green" style="color:${colors.greenAccent};text-decoration:none;">haul.green</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

function sectionLabel(text: string) {
  return `<p style="margin:24px 0 8px;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:${colors.greenAccent};">${text}</p>`
}

function row(label: string, value: string, bold = false) {
  return `
  <tr>
    <td style="padding:6px 0;font-size:14px;color:${colors.inkMuted};vertical-align:top;">${label}</td>
    <td style="padding:6px 0 6px 16px;font-size:14px;color:${bold ? colors.ink : colors.inkMuted};font-weight:${bold ? '500' : '400'};text-align:right;vertical-align:top;white-space:nowrap;">${value}</td>
  </tr>`
}

function dividerRow() {
  return `<tr><td colspan="2" style="padding:4px 0;border-bottom:1px solid ${colors.border};"></td></tr>`
}

function priceTable(data: BookingData): string {
  const itemRows = data.bin.map((item) =>
    row(
      `${item.name} ×${item.qty}${item.isBase ? ' <span style="font-size:9px;background:' + colors.green + ';color:#fff;padding:1px 5px;border-radius:2px;text-transform:uppercase;letter-spacing:0.05em;margin-left:4px;">base</span>' : ''}`,
      '',
    )
  ).join('')

  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tbody>
      ${itemRows}
      ${dividerRow()}
      ${row('Items subtotal', `$${data.baseItemPrice + data.additionalItemsCost}`)}
      ${data.floorSurcharge > 0 ? row('Floor surcharge', `+$${data.floorSurcharge}`) : ''}
      ${data.distanceLevy > 0 ? row(`Distance levy (${data.distanceKm} km)`, `+$${data.distanceLevy}`) : ''}
      ${dividerRow()}
      <tr>
        <td style="padding:10px 0 4px;font-size:15px;font-weight:600;color:${colors.ink};">Total NZD</td>
        <td style="padding:10px 0 4px 16px;font-size:22px;font-weight:600;color:${colors.green};text-align:right;font-style:italic;">$${data.total}</td>
      </tr>
    </tbody>
  </table>`
}

function detailRows(data: BookingData): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tbody>
      ${row('Address', data.address)}
      ${row('Floor access', data.pickupType)}
      ${row('Distance from Us', `${data.distanceKm} km`)}
      ${data.additionalInfo ? row('Additional info', data.additionalInfo) : ''}
    </tbody>
  </table>`
}

function customerDetailRows(data: BookingData): string {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
    <tbody>
      ${row('Name', data.name)}
      ${row('Phone', data.phone)}
      ${row('Email', data.email)}
    </tbody>
  </table>`
}

// ── Customer: Booking Confirmation ───────────────────────────
export function customerBookingEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: 'Your GreenHaul Booking is Confirmed 🟢',
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:${colors.ink};letter-spacing:-0.01em;">Hi ${firstName(data.name)}, you&rsquo;re booked!</h1>
      <p style="margin:0 0 24px;font-size:15px;color:${colors.inkMuted};line-height:1.6;">Thanks for choosing GreenHaul. Here&rsquo;s a summary of your booking.</p>

      ${sectionLabel('Your items')}
      ${priceTable(data)}

      ${sectionLabel('Pickup details')}
      ${detailRows(data)}

      <div style="margin:28px 0;background:${colors.greenLight};border-left:3px solid ${colors.greenAccent};padding:14px 18px;border-radius:0 6px 6px 0;">
        <p style="margin:0;font-size:14px;color:${colors.ink};line-height:1.6;">Our team will contact you within <strong>24 hours</strong> to confirm your pickup window.</p>
      </div>
    `),
  }
}

// ── Admin: Booking Notification ───────────────────────────────
export function adminBookingEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: `New Booking — ${data.name} — $${data.total}`,
    html: wrapper(`
      <h2 style="margin:0 0 4px;font-size:20px;font-weight:600;color:${colors.ink};">New Booking</h2>
      <p style="margin:0 0 24px;font-size:13px;color:${colors.inkFaint};">Received ${formatNZT()} NZT</p>

      ${sectionLabel('Customer')}
      ${customerDetailRows(data)}

      ${sectionLabel('Items & pricing')}
      ${priceTable(data)}

      ${sectionLabel('Pickup')}
      ${detailRows(data)}
    `),
  }
}

// ── Customer: Quote ───────────────────────────────────────────
export function customerQuoteEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: 'Your GreenHaul Quote 🟢',
    html: wrapper(`
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:400;color:${colors.ink};letter-spacing:-0.01em;">Hi ${firstName(data.name)}, here&rsquo;s your quote.</h1>
      <p style="margin:0 0 24px;font-size:15px;color:${colors.inkMuted};line-height:1.6;">Here&rsquo;s the instant quote you requested.</p>

      ${sectionLabel('Your items')}
      ${priceTable(data)}

      ${sectionLabel('Pickup details')}
      ${detailRows(data)}

      <p style="margin:20px 0 4px;font-size:13px;color:${colors.inkFaint};">Quote valid for 7 days.</p>

      <div style="margin:16px 0 0;background:${colors.greenLight};border-left:3px solid ${colors.greenAccent};padding:14px 18px;border-radius:0 6px 6px 0;">
        <p style="margin:0;font-size:14px;color:${colors.ink};line-height:1.6;">Ready to book? Reply to this email or visit <a href="https://haul.green" style="color:${colors.greenAccent};text-decoration:none;font-weight:500;">haul.green</a></p>
      </div>
    `),
  }
}

// ── Admin: Quote Notification ─────────────────────────────────
export function adminQuoteEmail(data: BookingData): { subject: string; html: string } {
  return {
    subject: `New Quote Request — ${data.name} — $${data.total}`,
    html: wrapper(`
      <h2 style="margin:0 0 4px;font-size:20px;font-weight:600;color:${colors.ink};">New Quote Request</h2>
      <p style="margin:0 0 24px;font-size:13px;color:${colors.inkFaint};">Received ${formatNZT()} NZT</p>

      ${sectionLabel('Customer')}
      ${customerDetailRows(data)}

      ${sectionLabel('Items & pricing')}
      ${priceTable(data)}

      ${sectionLabel('Pickup')}
      ${detailRows(data)}
    `),
  }
}
