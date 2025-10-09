import { useToast } from '@/hooks/use-toast';
import { getUserFriendlyError, CommonErrors, ErrorMessage } from '@/lib/error-messages';
import { useCallback } from 'react';

/**
 * Custom hook for handling errors with user-friendly messages
 */
export function useErrorHandler() {
  const { toast } = useToast();

  /**
   * Shows a user-friendly error message
   */
  const showError = useCallback((error: any, customMessage?: Partial<ErrorMessage>) => {
    const errorMessage = getUserFriendlyError(error);
    const finalMessage = { ...errorMessage, ...customMessage };

    toast({
      variant: finalMessage.severity === 'error' ? 'destructive' : 'default',
      title: finalMessage.title,
      description: finalMessage.description,
    });
  }, [toast]);

  /**
   * Shows a success message
   */
  const showSuccess = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });
  }, [toast]);

  /**
   * Shows a warning message
   */
  const showWarning = useCallback((title: string, description: string) => {
    toast({
      variant: 'default',
      title,
      description,
    });
  }, [toast]);

  /**
   * Handles authentication errors specifically
   */
  const handleAuthError = useCallback((error: any) => {
    showError(error);
  }, [showError]);

  /**
   * Handles network errors
   */
  const handleNetworkError = useCallback((error: any) => {
    showError(CommonErrors.NETWORK_ERROR);
  }, [showError]);

  /**
   * Handles permission errors
   */
  const handlePermissionError = useCallback((error: any) => {
    showError(CommonErrors.PERMISSION_DENIED);
  }, [showError]);

  /**
   * Handles laboratory context errors
   */
  const handleLaboratoryError = useCallback((error: any) => {
    showError(CommonErrors.LABORATORY_REQUIRED);
  }, [showError]);

  /**
   * Handles validation errors
   */
  const handleValidationError = useCallback((error: any) => {
    showError(CommonErrors.VALIDATION_ERROR);
  }, [showError]);

  /**
   * Handles data not found errors
   */
  const handleNotFoundError = useCallback((error: any) => {
    showError(CommonErrors.DATA_NOT_FOUND);
  }, [showError]);

  /**
   * Generic error handler that tries to determine the error type
   */
  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // Check for specific error types
    if (error.code === 'unavailable' || error.message?.includes('network')) {
      handleNetworkError(error);
    } else if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      handlePermissionError(error);
    } else if (error.message?.includes('laboratory') || error.message?.includes('No laboratory context')) {
      handleLaboratoryError(error);
    } else if (error.code === 'invalid-argument' || error.message?.includes('validation')) {
      handleValidationError(error);
    } else if (error.code === 'not-found' || error.message?.includes('not found')) {
      handleNotFoundError(error);
    } else {
      // Use the general error handler
      showError(error);
    }
  }, [
    handleNetworkError,
    handlePermissionError,
    handleLaboratoryError,
    handleValidationError,
    handleNotFoundError,
    showError
  ]);

  return {
    showError,
    showSuccess,
    showWarning,
    handleAuthError,
    handleNetworkError,
    handlePermissionError,
    handleLaboratoryError,
    handleValidationError,
    handleNotFoundError,
    handleError
  };
}
