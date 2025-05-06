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
  
  export const NotificationEmail = ({
    name = 'Visitor',
    email = 'visitor@example.com',
    subject = 'No subject',
    message = 'No message provided',
    sentAt = new Date().toLocaleString(),
  }) => {
    const mainColor = '#3fca9a';
    
    return (
      <Html>
        <Head />
        <Preview>New website contact from {name}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoContainer}>
              <Img
                src="https://i.imgur.com/vA2mRR2.png"
                width="48"
                height="48"
                alt="Email Icon"
                style={{ margin: '0 auto' }}
              />
            </Section>
            <Section style={header}>
              <Heading style={heading}>New Contact Message</Heading>
              <Text style={subheading}>
                You've received a new message from your website contact form
              </Text>
            </Section>
            <Hr style={hr} />
            <Section style={messageCard}>
              <Row>
                <Column>
                  <Text style={senderInfoLabel}>From:</Text>
                </Column>
                <Column>
                  <Text style={senderInfoValue}>{name}</Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={senderInfoLabel}>Email:</Text>
                </Column>
                <Column>
                  <Text style={senderInfoValue}>
                    <Link href={`mailto:${email}`} style={{ color: mainColor, textDecoration: 'none' }}>
                      {email}
                    </Link>
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text style={senderInfoLabel}>Subject:</Text>
                </Column>
                <Column>
                  <Text style={senderInfoValue}>{subject}</Text>
                </Column>
              </Row>
              <Hr style={{ ...hr, margin: '16px 0' }} />
              <Text style={messageLabel}>Message:</Text>
              <Text style={messageContent}>{message}</Text>
              <Text style={timestamp}>Received on: {sentAt}</Text>
            </Section>
            <Hr style={hr} />
            <Section style={footer}>
              <Text style={footerText}>
                &copy; {new Date().getFullYear()} Ayush Gurung. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  };
  
  export default NotificationEmail;
  
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '24px 0',
    maxWidth: '600px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  };
  
  const logoContainer = {
    backgroundColor: '#000000',
    padding: '20px 0',
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
    marginBottom: '20px',
  };
  
  const senderInfoLabel = {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0',
    fontWeight: '500',
    width: '60px',
  };
  
  const senderInfoValue = {
    fontSize: '14px',
    color: '#000',
    margin: '8px 0',
  };
  
  const messageLabel = {
    fontSize: '14px',
    color: '#666',
    margin: '8px 0',
    fontWeight: '500',
  };
  
  const messageContent = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    margin: '8px 0 16px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderLeft: `3px solid #3fca9a`,
    borderRadius: '3px',
  };
  
  const timestamp = {
    fontSize: '12px',
    color: '#999',
    marginTop: '20px',
    fontStyle: 'italic',
  };
  
  const footer = {
    textAlign: 'center' as const,
    padding: '0 24px 24px',
  };
  
  const footerText = {
    fontSize: '12px',
    color: '#666',
    margin: '8px 0',
  };