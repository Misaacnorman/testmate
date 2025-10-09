"use client";

import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Show reconnection message
        setTimeout(() => setWasOffline(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Check initial status
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className={isOnline ? 'border-green-500 bg-green-50' : 'border-destructive'}>
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-destructive" />
        )}
        <AlertDescription className="mt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {isOnline ? 'Connection Restored' : 'You\'re Offline'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOnline 
                  ? 'Your internet connection has been restored.' 
                  : 'Please check your internet connection and try again.'
                }
              </p>
            </div>
            {!isOnline && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
