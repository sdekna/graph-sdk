type Function<T> = () => T | null | Promise<T | null>;
type StateInput<T> = {
    initial_value: T;
    mutate_value_fn?: (value: T, old_value: T) => T;
    on_change?: (value: T) => any;
    populate_fn?: Function<T>;
    populate_callback?: (callback: Function<any>) => void;
    state_name?: string;
    persist?: boolean;
};
export type StateReturn<T> = {
    value: T;
    get_stored_value: () => Promise<T | null>;
    populate_fn: () => Promise<T | null>;
    reset: () => void;
    init: () => void;
    on_change: (call_back: (state: T, unsub: () => void) => any) => () => void;
    update_state: (callback: (value: T) => T | null) => void;
};
type StorageType = 'localStorage' | 'indexedDB' | 'capacitor';
export declare function init_states_storage(storage: StorageType): Promise<void>;
export declare function create_state<T>({ state_name, initial_value, persist, mutate_value_fn, populate_fn, populate_callback, on_change }: StateInput<T>): StateReturn<T>;
export {};
