import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import {
  BookingData,
  customerBookingEmail,
  adminBookingEmail,
  customerQuoteEmail,
  adminQuoteEmail,
} from '@/lib/emails'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'GreenHaul <noreply@haul.green>'

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as BookingData

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) {
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 })
    }

    const isBooking = data.action === 'booking'

    const customerTpl = isBooking ? customerBookingEmail(data) : customerQuoteEmail(data)
    const adminTpl = isBooking ? adminBookingEmail(data) : adminQuoteEmail(data)

    const [customerRes, adminRes] = await Promise.all([
      resend.emails.send({
        from: FROM,
        to: data.email,
        subject: customerTpl.subject,
        html: customerTpl.html,
      }),
      resend.emails.send({
        from: FROM,
        to: adminEmail,
        subject: adminTpl.subject,
        html: adminTpl.html,
      }),
    ])

    if (customerRes.error || adminRes.error) {
      console.error('Resend error:', customerRes.error ?? adminRes.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
