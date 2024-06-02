import { Subscriber } from 'src/lib/store/store';
import { Unsubscriber } from 'svelte/store';
import { Derivable } from './derived-on-action';

export const derived = <Value, Action extends { type: string }, DerivedValue>(
    source: Derivable<Value, Action>,
    mapper: (value: Value, action?: Action) => DerivedValue,
): Derivable<DerivedValue, Action> => {
    const subscribers: Set<Subscriber<DerivedValue, Action>> = new Set();
    let derivedValue: DerivedValue;
    let unsubFromSource: Unsubscriber | null = null;
    return {
        subscribe: (run) => {
            subscribers.add(run);
            if (!unsubFromSource) {
                unsubFromSource = source.subscribe(
                    (value, action, initialRun) => {
                        if (action || initialRun) {
                            const newValue = mapper(value, action);
                            if (newValue !== derivedValue) {
                                derivedValue = newValue;
                                for (const sub of subscribers) {
                                    sub(derivedValue, action, initialRun);
                                }
                            }
                        }
                    },
                );
            }

            return () => {
                subscribers.delete(run);
                if (unsubFromSource && subscribers.size === 0) {
                    unsubFromSource();
                    unsubFromSource = null;
                }
            };
        },
    };
};
