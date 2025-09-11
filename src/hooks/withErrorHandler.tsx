export function withErrorHandler<T extends (...args: any[]) => any>(
	fn: T
): (...args: Parameters<T>) => Promise<void> {
	return async (...args: Parameters<T>): Promise<void> => {
		try {
			await fn(...args);
		} catch (error) {
			console.error("An error occurred:", error);
		}
	};
}
