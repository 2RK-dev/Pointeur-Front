/**
 * This function allows you to switch between mock and real service implementations
 */
export async function withService<T>(mockFactory: () => Promise<T>, realFactory: () => Promise<T>): Promise<T> {
    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
        return mockFactory();
    } else if (process.env.NEXT_PUBLIC_USE_MOCKS === 'false') {
        return realFactory();
    } else {
        throw new Error("Environment variable NEXT_PUBLIC_USE_MOCKS is not set.");
    }
}