/**
 * User-friendly error messages for authentication and other operations
 */

export interface ErrorMessage {
  title: string;
  description: string;
  action?: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
export function getAuthErrorMessage(errorCode: string): ErrorMessage {
  const errorMap: Record<string, ErrorMessage> = {
    // Authentication errors
    'auth/user-not-found': {
      title: 'Account Not Found',
      description: 'No account exists with this email address. Please check your email or create a new account.',
      action: 'Try signing up instead',
      severity: 'error'
    },
    'auth/wrong-password': {
      title: 'Incorrect Password',
      description: 'The password you entered is incorrect. Please try again or reset your password.',
      action: 'Reset password',
      severity: 'error'
    },
    'auth/invalid-credential': {
      title: 'Invalid Login Credentials',
      description: 'The email or password you entered is incorrect. Please check your credentials and try again.',
      action: 'Try again',
      severity: 'error'
    },
    'auth/invalid-email': {
      title: 'Invalid Email Address',
      description: 'Please enter a valid email address.',
      action: 'Check your email format',
      severity: 'error'
    },
    'auth/user-disabled': {
      title: 'Account Disabled',
      description: 'This account has been disabled. Please contact support for assistance.',
      action: 'Contact support',
      severity: 'error'
    },
    'auth/too-many-requests': {
      title: 'Too Many Attempts',
      description: 'You have made too many failed login attempts. Please wait a few minutes before trying again.',
      action: 'Wait and try again',
      severity: 'warning'
    },
    'auth/network-request-failed': {
      title: 'Connection Error',
      description: 'Unable to connect to our servers. Please check your internet connection and try again.',
      action: 'Check your connection',
      severity: 'error'
    },
    'auth/email-already-in-use': {
      title: 'Email Already Registered',
      description: 'An account with this email address already exists. Please try logging in instead.',
      action: 'Go to login',
      severity: 'error'
    },
    'auth/weak-password': {
      title: 'Password Too Weak',
      description: 'Please choose a stronger password with at least 6 characters.',
      action: 'Choose a stronger password',
      severity: 'error'
    },
    'auth/operation-not-allowed': {
      title: 'Operation Not Allowed',
      description: 'This sign-in method is not enabled. Please contact support.',
      action: 'Contact support',
      severity: 'error'
    },
    'auth/requires-recent-login': {
      title: 'Recent Login Required',
      description: 'For security reasons, please log in again to continue.',
      action: 'Log in again',
      severity: 'warning'
    },
    'auth/invalid-verification-code': {
      title: 'Invalid Verification Code',
      description: 'The verification code you entered is incorrect or has expired.',
      action: 'Request a new code',
      severity: 'error'
    },
    'auth/invalid-verification-id': {
      title: 'Invalid Verification',
      description: 'The verification process has expired. Please try again.',
      action: 'Start over',
      severity: 'error'
    },
    'auth/expired-action-code': {
      title: 'Link Expired',
      description: 'This link has expired. Please request a new one.',
      action: 'Request new link',
      severity: 'error'
    },
    'auth/invalid-action-code': {
      title: 'Invalid Link',
      description: 'This link is invalid or has already been used.',
      action: 'Request new link',
      severity: 'error'
    }
  };

  return errorMap[errorCode] || {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
    action: 'Try again',
    severity: 'error'
  };
}

/**
 * Maps general application errors to user-friendly messages
 */
export function getApplicationErrorMessage(error: any): ErrorMessage {
  // Network errors
  if (error.code === 'unavailable' || error.message?.includes('network')) {
    return {
      title: 'Connection Problem',
      description: 'Unable to connect to our servers. Please check your internet connection and try again.',
      action: 'Check your connection',
      severity: 'error'
    };
  }

  // Permission errors
  if (error.code === 'permission-denied' || error.message?.includes('permission')) {
    return {
      title: 'Access Denied',
      description: 'You do not have permission to perform this action. Please contact your administrator.',
      action: 'Contact administrator',
      severity: 'error'
    };
  }

  // Firestore errors
  if (error.code === 'failed-precondition') {
    return {
      title: 'Data Not Ready',
      description: 'The requested data is not available yet. Please try again in a moment.',
      action: 'Try again',
      severity: 'warning'
    };
  }

  // Validation errors
  if (error.code === 'invalid-argument' || error.message?.includes('validation')) {
    return {
      title: 'Invalid Information',
      description: 'Please check the information you entered and try again.',
      action: 'Check your input',
      severity: 'error'
    };
  }

  // Laboratory context errors
  if (error.message?.includes('laboratory') || error.message?.includes('No laboratory context')) {
    return {
      title: 'Laboratory Access Required',
      description: 'You need to be assigned to a laboratory to access this feature. Please contact your administrator.',
      action: 'Contact administrator',
      severity: 'error'
    };
  }

  // Default error
  return {
    title: 'Unexpected Error',
    description: error.message || 'Something went wrong. Please try again.',
    action: 'Try again',
    severity: 'error'
  };
}

/**
 * Gets a user-friendly error message for any error
 */
export function getUserFriendlyError(error: any): ErrorMessage {
  // Firebase Auth errors
  if (error.code && error.code.startsWith('auth/')) {
    return getAuthErrorMessage(error.code);
  }

  // Application errors
  return getApplicationErrorMessage(error);
}

/**
 * Common error messages for specific scenarios
 */
export const CommonErrors = {
  NETWORK_ERROR: {
    title: 'Connection Problem',
    description: 'Please check your internet connection and try again.',
    action: 'Retry',
    severity: 'error' as const
  },
  PERMISSION_DENIED: {
    title: 'Access Denied',
    description: 'You do not have permission to perform this action.',
    action: 'Contact administrator',
    severity: 'error' as const
  },
  LABORATORY_REQUIRED: {
    title: 'Laboratory Required',
    description: 'You must be assigned to a laboratory to access this feature.',
    action: 'Contact administrator',
    severity: 'error' as const
  },
  DATA_NOT_FOUND: {
    title: 'Data Not Found',
    description: 'The requested information could not be found.',
    action: 'Refresh page',
    severity: 'warning' as const
  },
  VALIDATION_ERROR: {
    title: 'Invalid Information',
    description: 'Please check your input and try again.',
    action: 'Check your input',
    severity: 'error' as const
  }
};
