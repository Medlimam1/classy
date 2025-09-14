import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

interface OrderEmailData {
  id: string
  status: string
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export async function sendContactEmail(data: ContactEmailData) {
  const { name, email, subject, message } = data

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@classystore.mr',
    to: process.env.CONTACT_EMAIL || 'info@classystore.mr',
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">New Contact Form Submission</h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h3 style="color: #374151; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #6b7280;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            This email was sent from the Classy Store contact form.
          </p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendOrderConfirmation(email: string, order: OrderEmailData) {
  const { id, status, total, items } = order

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@classystore.mr',
    to: email,
    subject: `Order Confirmation - #${id.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d97706; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Order Confirmation</h1>
          <p style="margin: 10px 0 0 0;">Thank you for your order!</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #374151;">Order Details</h2>
          <p><strong>Order Number:</strong> #${id.slice(-8).toUpperCase()}</p>
          <p><strong>Status:</strong> ${status}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background-color: #f9fafb; font-weight: bold;">
                <td colspan="2" style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb;">Total:</td>
                <td style="padding: 15px; text-align: right; border-top: 2px solid #e5e7eb;">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              We'll send you another email when your order ships. You can track your order status in your account.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/orders/${id}" 
               style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Order Details
            </a>
          </div>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Thank you for shopping with Classy Store!</p>
          <p>If you have any questions, please contact us at support@classystore.mr</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@classystore.mr',
    to: email,
    subject: 'Password Reset Request - Classy Store',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d97706; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Password Reset</h1>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #374151;">Reset Your Password</h2>
          <p>You requested a password reset for your Classy Store account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this password reset, please ignore this email.
            This link will expire in 1 hour.
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${resetUrl}" style="color: #d97706;">${resetUrl}</a>
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>This email was sent from Classy Store</p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}