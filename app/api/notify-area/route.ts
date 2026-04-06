import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'GreenHaul <noreply@haul.green>'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      return NextResponse.json({ error: 'Admin email not configured' }, { status: 500 })
    }

    await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: `Out-of-Area Notification Request — ${email}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a18;">
          <p style="font-size:15px;">Someone outside your current service area wants to be notified when GreenHaul expands.</p>
          <p style="font-size:15px;"><strong>Email:</strong> ${email}</p>
          <p style="font-size:13px;color:#9a9a94;margin-top:24px;">Add this to your expansion notification list.</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
