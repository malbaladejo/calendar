export class PromiseCompletionSource {

    private _isCancellationRequested = false;

    public get isCancellationRequested(): boolean {
        return this._isCancellationRequested;
    }

    public cancel(): void {
        this._isCancellationRequested = true;
    }
}