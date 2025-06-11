import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NotificationEmail } from '@/components/emails/notification-email';
import { ConfirmationEmail } from '@/components/emails/confirmation-email';

// Initialize Resend client with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify we have a valid API key
if (!process.env.RESEND_API_KEY) {
  console.warn('Warning: RESEND_API_KEY is not set');
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, token } = await req.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' }, 
        { status: 400 }
      );
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check reCAPTCHA if enabled
    if (process.env.RECAPTCHA_SECRET_KEY) {
      if (!token) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }
      
      const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      });
      
      const verifyRes = await verify.json();
      
      if (!verifyRes.success) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
      }
    }

    const sentAt = new Date().toLocaleString();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    // Send notification email to yourself (Ayush Gurung)
    const { error: notificationError } = await resend.emails.send({
      from: `Ayush Gurung <${fromEmail}>`,
      to: process.env.CONTACT_EMAIL || 'ayushgurung18sep@gmail.com',
      replyTo: email,
      subject: `Website Contact: ${subject || 'New message'}`,
      react: NotificationEmail({ name, email, subject, message, sentAt }),
    });

    if (notificationError) {
      console.error('Resend API error (notification):', notificationError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' }, 
        { status: 500 }
      );
    }

    // Optional: Send confirmation email to the user
    if (process.env.SEND_CONFIRMATION === 'true') {
      const { error: confirmationError } = await resend.emails.send({
        from: `Ayush Gurung <${fromEmail}>`, 
        to: email,
        subject: 'Thank you for your message',
        react: ConfirmationEmail({ name, subject, message }),
      });
      
      if (confirmationError) {
        console.error('Resend API error (confirmation):', confirmationError);
        // We don't fail the whole request if confirmation email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' }, 
      { status: 500 }
    );
  }
}