import emailjs from '@emailjs/browser';
import { emailConfig, emailTemplates } from '../config/emailConfig';

// Email service for sending notifications
class EmailService {
  
  constructor() {
    // Load configuration
    this.config = emailConfig;
    this.templates = emailTemplates;
    
    // Initialize EmailJS
    this.initializeEmailJS();
  }

  /**
   * Initialize EmailJS with your public key
   */
  initializeEmailJS() {
    try {
      if (this.config.settings.enabled && this.config.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(this.config.publicKey);
        if (this.config.settings.debugMode) {
          console.log('EmailJS initialized successfully');
        }
      } else {
        if (this.config.settings.debugMode) {
          console.log('EmailJS not initialized - update configuration in src/config/emailConfig.js');
        }
      }
    } catch (error) {
      console.error('Error initializing EmailJS:', error);
    }
  }

  /**
   * Send birthday message notification email
   */
  async sendBirthdayMessageNotification(messageData) {
    try {
      // Check if email is enabled
      if (!this.config.settings.enabled) {
        if (this.config.settings.debugMode) {
          console.log('Email notifications disabled in configuration');
        }
        return { success: false, error: 'Email notifications disabled' };
      }

      // Check if properly configured
      if (this.config.publicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
        if (this.config.settings.debugMode) {
          console.log('EmailJS not configured - please update src/config/emailConfig.js');
        }
        return { success: false, error: 'EmailJS not configured' };
      }

      // Prepare email template parameters
      const templateParams = {
        from_name: messageData.username || 'Eana',
        message: messageData.text,
        timestamp: new Date().toLocaleString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        to_email: this.config.toEmail,
        subject: this.templates.birthdayMessage.subject.replace('{{from_name}}', messageData.username || 'Eana')
      };

      if (this.config.settings.debugMode) {
        console.log('Sending email with params:', templateParams);
        console.log('Using service ID:', this.config.serviceId);
        console.log('Using template ID:', this.config.templateId);
        console.log('Using public key:', this.config.publicKey);
      }

      // Send email using EmailJS
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

      if (this.config.settings.debugMode) {
        console.log('Email sent successfully:', response);
      }
      return { success: true, response, details: 'Email sent via EmailJS' };

    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send test email to verify configuration
   */
  async sendTestEmail() {
    try {
      const testParams = {
        from_name: 'Birthday App Test',
        message: 'This is a test email to verify EmailJS configuration is working correctly. If you receive this, your email notifications are set up properly! 🎉',
        timestamp: new Date().toLocaleString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        to_email: this.config.toEmail,
        subject: '🧪 Birthday App - Test Email'
      };

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        testParams
      );

      console.log('Test email sent successfully:', response);
      return { success: true, response };

    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Alternative email method using a simple email service (fallback)
   */
  async sendEmailFallback(messageData) {
    try {
      // Check if fallback is enabled
      if (!this.config.settings.enableFallback) {
        return { success: false, error: 'Fallback email disabled' };
      }

      // Use the text template from configuration
      let emailBody = this.templates.birthdayMessage.textTemplate;
      
      // Replace template variables
      emailBody = emailBody
        .replace(/\{\{from_name\}\}/g, messageData.username || 'Eana')
        .replace(/\{\{message\}\}/g, messageData.text)
        .replace(/\{\{timestamp\}\}/g, new Date().toLocaleString())
        .replace(/\{\{user_agent\}\}/g, navigator.userAgent)
        .replace(/\{\{screen_resolution\}\}/g, `${screen.width}x${screen.height}`)
        .replace(/\{\{timezone\}\}/g, Intl.DateTimeFormat().resolvedOptions().timeZone)
        .replace(/\{\{page_url\}\}/g, window.location.href);

      const emailSubject = this.templates.birthdayMessage.subject.replace('{{from_name}}', messageData.username || 'Eana');

      // Use mailto as fallback (will open user's email client)
      const mailtoLink = `mailto:${this.config.toEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // For testing purposes, also log the email content
      if (this.config.settings.debugMode) {
        console.log('Fallback email content:');
        console.log('Subject:', emailSubject);
        console.log('Body:', emailBody);
        console.log('Mailto link:', mailtoLink);
      }

      return { success: true, mailtoLink, subject: emailSubject, body: emailBody };

    } catch (error) {
      console.error('Error creating fallback email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update configuration (for when you set up EmailJS)
   */
  updateConfig(serviceId, templateId, publicKey) {
    this.serviceId = serviceId;
    this.templateId = templateId;
    this.publicKey = publicKey;
    this.initializeEmailJS();
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
