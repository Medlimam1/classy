import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = contactSchema.parse(body)

    // Send email notification
    try {
      await sendContactEmail({
        name,
        email,
        subject,
        message,
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      // Continue even if email fails
    }

    // Here you could also save the contact form submission to database
    // await prisma.contactSubmission.create({
    //   data: { name, email, subject, message }
    // })

    return NextResponse.json({
      message: 'Contact form submitted successfully',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}