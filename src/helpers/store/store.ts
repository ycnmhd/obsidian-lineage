import { Invalidator, Unsubscriber, Updater, Writable } from 'svelte/store';

export type Subscriber<T, U> = (
    value: T,
    action?: U,
    firstRun?: boolean,
) => void;

export type Reducer<T, U> = (store: T, action: U) => T;

export type OnError<U> = (
    error: Error,
    location: 'reducer' | 'subscriber',
    action?: U,
) => void;

export class Store<T, U> implements Writable<T> {
    private value: T;
    private subscribers: Set<Subscriber<T, U>> = new Set();
    private isProcessing: boolean = false;
    private actionQueue: U[] = [];

    constructor(
        initialValue: T,
        reducer?: Reducer<T, U>,
        onError?: OnError<U>,
    ) {
        this.value = initialValue;
        if (reducer) this.reducer = reducer;
        if (onError) this.onError = onError;
    }

    getValue(): T {
        return this.value;
    }

    dispatch(action: U) {
        this.actionQueue.push(action);
        if (!this.isProcessing) {
            this.processActionQueue();
        }
    }

    set(value: T): void {
        this.value = value;
        this.notifySubscribers();
    }

    subscribe(
        run: Subscriber<T, U>,
        invalidate?: Invalidator<T>,
    ): Unsubscriber {
        this.subscribers.add(run);
        try {
            run(this.value, undefined, true);
        } catch (error) {
            this.onError(error, 'subscriber');
        }

        return () => {
            this.subscribers.delete(run);
        };
    }

    update(updater: Updater<T>): void {
        this.value = updater(this.value);
        this.notifySubscribers();
    }

    private processActionQueue() {
        this.isProcessing = true;
        while (this.actionQueue.length > 0) {
            const action = this.actionQueue.shift();
            try {
                this.value = this.reducer(this.value, action!);
                this.notifySubscribers(action);
            } catch (error) {
                this.onError(error, 'reducer', action);
            }
        }
        this.isProcessing = false;
    }

    private readonly reducer: Reducer<T, U> = () => this.value;
    // eslint-disable-next-line no-console
    private readonly onError: OnError<U> = (error) => console.error(error);

    private notifySubscribers(action?: U): void {
        for (const subscriber of this.subscribers) {
            try {
                subscriber(this.value, action);
            } catch (error) {
                this.onError(error, 'subscriber', action);
            }
        }
    }
}
