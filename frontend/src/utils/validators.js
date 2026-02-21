/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  // At least 6 characters
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone) {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Validate form data object
 */
export function validateForm(formData, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    if (rule.type === 'email' && value) {
      if (!validateEmail(value)) {
        errors[field] = `${rule.label || field} must be a valid email`;
      }
    }

    if (rule.type === 'phone' && value) {
      if (!validatePhoneNumber(value)) {
        errors[field] = `${rule.label || field} must be a valid 10-digit phone number`;
      }
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must not exceed ${rule.maxLength} characters`;
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Check if file is valid (for uploads)
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  } = options;

  if (!file) {
    return { valid: false, message: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, message: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'File type not allowed' };
  }

  return { valid: true, message: '' };
}

const validatorsExports = {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateForm,
  validateFile
};

export default validatorsExports;
