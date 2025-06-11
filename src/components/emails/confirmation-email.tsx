import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from '@react-email/components';
  import * as React from 'react';
  
  export const ConfirmationEmail = ({
    name = 'Visitor',
    subject = 'No subject',
    message = 'No message provided',
  }) => {
    const mainColor = '#3fca9a';
    const socialLinks = [
      {
        name: 'GitHub',
        href: 'https://github.com/ayushgurung',
        icon: 'https://i.imgur.com/NhAfTxV.png',
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/ayushgurung',
        icon: 'https://i.imgur.com/OQUXwNp.png',
      },
      {
        name: 'Website',
        href: 'https://ayushgurung.com',
        icon: 'https://i.imgur.com/CZJELhz.png',
      },
      {
        name: 'Email',
        href: 'mailto:ayushgurung18sep@gmail.com',
        icon: 'https://i.imgur.com/vA2mRR2.png',
      },
    ];
  
    return (
      <Html>
        <Head />
        <Preview>Thank you for your message, {name}!</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoContainer}>
              <Heading style={{ color: mainColor, textAlign: 'center' as const, margin: '0' }}>
                Thank You!
              </Heading>
            </Section>
            <Section style={header}>
              <Heading style={heading}>Message Received</Heading>
              <Text style={subheading}>
                Hi {name}, thank you for reaching out! I&apos;ve received your message and will get back to you soon.
              </Text>
            </Section>
            <Hr style={hr} />
            <Section style={messageCard}>
              <Text style={messageLabel}>Your message:</Text>
              <Text style={subjectText}>Subject: {subject}</Text>
              <Text style={messageContent}>{message}</Text>
            </Section>
            <Hr style={hr} />
            <Section style={footer}>
              <Text style={footerHeading}>Connect with me</Text>
              <Row style={socialLinksContainer}>
                {socialLinks.map((link) => (
                  <Column key={link.name} style={socialLinkColumn}>
                    <Link href={link.href} style={socialLink}>
                      <Img
                        src={link.icon}
                        width="24"
                        height="24"
                        alt={link.name}
                        style={socialIcon}
                      />
                      <Text style={socialText}>{link.name}</Text>
                    </Link>
                  </Column>
                ))}
              </Row>
              <Hr style={hr} />
              <Text style={footerText}>
                &copy; {new Date().getFullYear()} Ayush Gurung. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default ConfirmationEmail;
  
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '0 0 24px',
    maxWidth: '600px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  };
  
  const logoContainer = {
    backgroundColor: '#000000',
    padding: '24px 0',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  };
  
  const header = {
    padding: '20px 24px',
    textAlign: 'center' as const,
  };
  
  const heading = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#000000',
    margin: '0',
  };
  
  const subheading = {
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#444',
    margin: '10px 0 0',
  };
  
  const hr = {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  };
  
  const messageCard = {
    padding: '20px 24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    margin: '0 24px 20px',
  };
  
  const messageLabel = {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 12px',
    fontWeight: '500',
  };
  
  const subjectText = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    margin: '0 0 8px',
  };
  
  const messageContent = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    margin: '8px 0',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderLeft: `3px solid #3fca9a`,
    borderRadius: '3px',
  };
  
  const footer = {
    textAlign: 'center' as const,
    padding: '0 24px 24px',
  };
  
  const footerHeading = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 16px',
  };
  
  const socialLinksContainer = {
    margin: '0 auto',
    textAlign: 'center' as const,
  };
  
  const socialLinkColumn = {
    textAlign: 'center' as const,
  };
  
  const socialLink = {
    display: 'inline-block',
    textDecoration: 'none',
  };
  
  const socialIcon = {
    margin: '0 auto 4px',
  };
  
  const socialText = {
    fontSize: '12px',
    color: '#666',
    margin: '0',
  };
  
  const footerText = {
    fontSize: '12px',
    color: '#666',
    margin: '20px 0 0',
  };