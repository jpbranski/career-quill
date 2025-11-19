'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if code is running on the client side
 * Useful for avoiding hydration mismatches with localStorage and other browser APIs
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
