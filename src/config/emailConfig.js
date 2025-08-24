// Email configuration for birthday message notifications
// Update these values after setting up EmailJS (see EMAIL_SETUP.md)

export const emailConfig = {
  // EmailJS Service ID (from your EmailJS dashboard)
  serviceId: 'service_6q393hg', // Your actual service ID
  
  // EmailJS Template ID (from your EmailJS dashboard)  
  templateId: 'template_9tikwwc', // Your actual template ID
  
  // EmailJS Public Key (from your EmailJS dashboard)
  publicKey: 'RN8GBBzAeXuTZI_yw', // Your actual public key
  
  // Your email address where notifications will be sent
  toEmail: 'jombenitez96@gmail.com',
  
  // Email settings
  settings: {
    // Enable/disable email notifications
    enabled: true,
    
    // Enable fallback email method if EmailJS fails
    enableFallback: true,
    
    // Show console logs for debugging
    debugMode: true,
    
    // Retry attempts if email fails
    retryAttempts: 2
  }
};

// Email templates for different types of notifications
export const emailTemplates = {
  birthdayMessage: {
    subject: '💝 New Birthday Message from {{from_name}}!',
    
    // Plain text version
    textTemplate: `
New Birthday Message Received!

From: {{from_name}}
Time: {{timestamp}}
Message: "{{message}}"

Device Information:
- User Agent: {{user_agent}}
- Screen Resolution: {{screen_resolution}}
- Timezone: {{timezone}}
- Page URL: {{page_url}}

---
Sent from Birthday App 🎂
    `.trim(),
    
    // HTML version  
    htmlTemplate: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Birthday Message</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0;
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content { 
            padding: 30px; 
        }
        .message-box { 
            background: #f8f9ff; 
            padding: 25px; 
            border-radius: 12px; 
            border-left: 5px solid #667eea; 
            margin: 20px 0; 
            position: relative;
        }
        .message-box::before {
            content: '💬';
            position: absolute;
            top: -10px;
            left: 20px;
            background: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 20px;
        }
        .message-text {
            font-size: 18px;
            font-weight: 500;
            color: #2d3748;
            margin-top: 10px;
            line-height: 1.6;
        }
        .details { 
            background: #f7fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 30px; 
        }
        .details h3 {
            color: #4a5568;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #4a5568;
        }
        .detail-value {
            color: #718096;
            text-align: right;
            max-width: 60%;
            word-break: break-word;
        }
        .footer {
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
        }
        .emoji { font-size: 28px; margin-right: 10px; }
        
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 8px; }
            .content { padding: 20px; }
            .header { padding: 20px; }
            .header h1 { font-size: 24px; }
            .message-text { font-size: 16px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">💝</span>New Birthday Message!</h1>
            <p>Someone special sent you a heartfelt message</p>
        </div>
        
        <div class="content">
            <h2 style="color: #2d3748; margin-top: 0;">Message from {{from_name}}:</h2>
            
            <div class="message-box">
                <div class="message-text">{{message}}</div>
            </div>
            
            <div class="details">
                <h3>Message Details</h3>
                <div class="detail-item">
                    <span class="detail-label">Sender:</span>
                    <span class="detail-value">{{from_name}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sent:</span>
                    <span class="detail-value">{{timestamp}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Device:</span>
                    <span class="detail-value">{{screen_resolution}}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">{{timezone}}</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>🎂 Sent from Birthday App</strong></p>
                <p>Your special day deserves special messages ✨</p>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim()
  }
};

export default emailConfig;
