// Basic error handler hook for async operations
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T): T {
  return ((...args: any[]) => {
    return fn(...args).catch((error) => {
      console.error('Error in async operation:', error);
      // You can extend this to show toast notifications or other error handling
      throw error;
    });
  }) as T;
}