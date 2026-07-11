/**
 * Validation utilities for common form validations
 */

export const validators = {
  /**
   * Email validation
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Phone number validation
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Password validation
   */
  password: (password: string): {
    isValid: boolean;
    requirements: {
      minLength: boolean;
      hasUpperCase: boolean;
      hasLowerCase: boolean;
      hasNumber: boolean;
      hasSpecialChar: boolean;
    };
  } => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
    };

    const isValid = Object.values(requirements).every((req) => req);

    return { isValid, requirements };
  },

  /**
   * URL validation
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Credit card validation (Luhn algorithm)
   */
  creditCard: (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },

  /**
   * Postal code validation (US)
   */
  postalCode: (postalCode: string): boolean => {
    const postalCodeRegex = /^\d{5}(-\d{4})?$/;
    return postalCodeRegex.test(postalCode);
  },

  /**
   * File size validation
   */
  fileSize: (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  /**
   * File type validation
   */
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type);
  },
};

/**
 * Custom error messages for validation
 */
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  url: 'Please enter a valid URL',
  creditCard: 'Please enter a valid credit card number',
  postalCode: 'Please enter a valid postal code',
  fileSize: 'File size exceeds maximum allowed size',
  fileType: 'File type is not allowed',
};
