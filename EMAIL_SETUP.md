# Email Notification Setup Guide

To receive email notifications when Eana sends a birthday message, you need to set up EmailJS. Here's how:

## Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service

1. In your EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended) or your preferred email provider
4. Follow the setup instructions to connect your email account
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template

1. In your EmailJS dashboard, click "Email Templates"
2. Click "Create New Template"
3. Use this template content:

### Template Subject:
```
💝 New Birthday Message from {{from_name}}!
```

### Template Body:
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .message { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
        .details { background: #e8f4f8; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .emoji { font-size: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="emoji">💝</span> New Birthday Message!</h1>
            <p>Someone special sent you a message</p>
        </div>
        
        <div class="content">
            <h2>Message from {{from_name}}:</h2>
            
            <div class="message">
                <p><strong>{{message}}</strong></p>
            </div>
            
            <div class="details">
                <h3>Message Details:</h3>
                <p><strong>Sent by:</strong> {{from_name}}</p>
                <p><strong>Time:</strong> {{timestamp}}</p>
                <p><strong>Device:</strong> {{user_agent}}</p>
                <p><strong>Screen:</strong> {{screen_resolution}}</p>
                <p><strong>Timezone:</strong> {{timezone}}</p>
                <p><strong>Page:</strong> {{page_url}}</p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #666;">
                <em>Sent from Birthday App 🎂</em>
            </p>
        </div>
    </div>
</body>
</html>
```

4. Set the "To Email" field to: `{{to_email}}`
5. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key

1. In your EmailJS dashboard, go to "Account" > "General"
2. Find your **Public Key** (e.g., `user_abc123xyz`)

## Step 5: Update Your App Configuration

Update the `src/services/emailService.js` file with your credentials:

```javascript
// Replace these values in emailService.js
this.serviceId = 'your_service_id_here';      // From Step 2
this.templateId = 'your_template_id_here';    // From Step 3
this.publicKey = 'your_public_key_here';      // From Step 4
```

## Step 6: Test the Setup

You can test the email system by:

1. Running the app: `npm start`
2. Logging in as any user
3. Going to the interactive post (3rd post)
4. Sending a test message
5. Check your email inbox (and spam folder)

## Alternative: Quick Setup Script

I've created a configuration file you can use. Update `src/config/emailConfig.js`:

```javascript
export const emailConfig = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID', 
  publicKey: 'YOUR_PUBLIC_KEY',
  toEmail: 'sheldoncooper11306@gmail.com'
};
```

## Troubleshooting

### Common Issues:

1. **Emails not sending**: Check browser console for errors
2. **Emails in spam**: Add your EmailJS sender email to contacts
3. **Template not found**: Verify template ID is correct
4. **Service error**: Check if email service is properly connected

### Testing Commands:

Add this to your browser console to test:
```javascript
// Test email service
emailService.sendTestEmail().then(result => console.log(result));
```

## Security Notes

- EmailJS runs on the client-side, so credentials are visible in the code
- Use EmailJS's domain restrictions to limit where emails can be sent from
- Consider upgrading to EmailJS Pro for better security and higher limits

## Free Tier Limits

- 200 emails/month
- EmailJS branding in emails
- Rate limiting applies

Perfect for personal birthday app usage! 🎉
