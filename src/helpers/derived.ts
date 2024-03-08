import { Subscriber } from 'src/helpers/store';
import { Invalidator, Unsubscriber } from 'svelte/store';

export type Derivable<DerivedValue, Action extends { type: string }> = {
    subscribe(
        run: Subscriber<DerivedValue, Action>,
        invalidate?: Invalidator<DerivedValue>,
    ): Unsubscriber;
};

export const derived = <Value, Action extends { type: string }, DerivedValue>(
    source: Derivable<Value, Action>,
    mapper: (value: Value, action?: Action) => DerivedValue,
    actions: Array<Action['type']>,
): Derivable<DerivedValue, Action> => {
    const set = new Set(actions);
    const subscribers: Set<Subscriber<DerivedValue, Action>> = new Set();
    let derivedValue: DerivedValue;
    let unsub: Unsubscriber | null = null;
    return {
        subscribe: (run) => {
            subscribers.add(run);
            if (!unsub) {
                unsub = source.subscribe((value, action, initialRun) => {
                    if ((action && set.has(action?.type)) || initialRun) {
                        derivedValue = mapper(value, action);
                        for (const sub of subscribers) {
                            sub(derivedValue, action, initialRun);
                        }
                    }
                });
            }
            run(derivedValue, undefined, true);
            return () => {
                subscribers.delete(run);
                if (unsub && subscribers.size === 0) {
                    unsub();
                    unsub = null;
                }
            };
        },
    };
};
