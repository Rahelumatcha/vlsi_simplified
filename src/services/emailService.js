import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config';

/**
 * Service to handle frontend email delivery via EmailJS.
 * Automatically maps HTML form elements by their `name` attribute to EmailJS template variables:
 * - name: Full Name
 * - email: Email Address (used for visitor reply-to)
 * - phone: Phone Number (Optional)
 * - subject: Subject of inquiry
 * - message: Inquiry message content
 */
export const emailService = {
  /**
   * Send contact form using HTML Form element via sendForm().
   *
   * @param {HTMLFormElement} formElement
   * @returns {Promise<import('@emailjs/browser').EmailJSResponseStatus>}
   */
  async sendContactForm(formElement) {
    if (!formElement) {
      throw new Error('Form element reference is missing.');
    }

    const { serviceId, templateId, publicKey } = EMAILJS_CONFIG;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        'EmailJS credentials are missing. Please verify serviceId, templateId, and publicKey in configuration.'
      );
    }

    return emailjs.sendForm(serviceId, templateId, formElement, {
      publicKey
    });
  }
};
