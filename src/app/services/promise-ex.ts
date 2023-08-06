export class PromiseEx {
    public static delay(delayInMs: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, delayInMs));
    }
}