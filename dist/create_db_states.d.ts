import type { query_rootRequest, query_root, mutation_rootRequest, mutation_root } from './generated/schema.js';
import type { MutationInput, QueryArguments, QueryOptions } from './graphdb_handlers';
type SecondElement<Tuple> = Tuple extends [any, infer Second] ? Second : never;
type CreateDbObjectState<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest> = {
    many_q: T | K;
    single_q: S | SK;
    create_q: C | CK;
    update_q: U | UK;
    delete_q: D;
    return_fields: QueryArguments<T>;
    auto_populate?: boolean;
    persist?: boolean;
    options?: QueryOptions<T>;
    options_fn?: (value: query_root[SK]) => (QueryOptions<T> | null);
    state_name: string;
    mutate_value_fn?: (value: query_root[SK], old_value: query_root[SK]) => query_root[SK];
};
export declare function create_db_object_state<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest>({ state_name, many_q, single_q, create_q, update_q, delete_q, mutate_value_fn, return_fields, options, options_fn, auto_populate, persist }: CreateDbObjectState<T, K, S, SK, C, CK, U, UK, D>): {
    populate: () => Promise<any>;
    read_one: (id: string, new_return_fields?: QueryArguments<S>) => Promise<query_root[SK] | null>;
    update_one: (options: {
        input: Omit<any, "pk_columns">;
        new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[U]>>;
    }) => Promise<mutation_root[UK] | null>;
    create_one: (options: {
        input: MutationInput<C | CK>;
        return_fields: SecondElement<NonNullable<mutation_rootRequest[C | CK]>>;
    }) => Promise<mutation_root[CK] | null>;
    delete_one: (id: string) => Promise<boolean>;
    read_many: (fn_arguments?: {
        options: QueryOptions<T>;
        new_return_fields?: QueryArguments<T>;
    }) => Promise<query_root[K] | null>;
    value: any;
    get_stored_value: () => Promise<any | null>;
    populate_fn: () => Promise<any | null>;
    reset: () => void;
    init: () => void;
    on_change: (call_back: (state: any, unsub: () => void) => any) => () => void;
    update_state: (callback: (value: any) => any | null) => void;
};
type CreateDbArrayState<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest> = {
    many_q: T | K;
    single_q: S | SK;
    create_q: C | CK;
    update_q: U | UK;
    delete_q: D;
    return_fields: QueryArguments<T>;
    options?: QueryOptions<T>;
    options_fn?: (value: query_root[K]) => (QueryOptions<T> | null);
    auto_populate?: boolean;
    persist?: boolean;
    state_name: string;
    mutate_value_fn?: (value: query_root[K], old_value: query_root[K]) => query_root[K];
};
export declare function create_db_array_state<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest>({ state_name, many_q, single_q, create_q, update_q, delete_q, mutate_value_fn, return_fields, options, options_fn, auto_populate, persist }: CreateDbArrayState<T, K, S, SK, C, CK, U, UK, D>): {
    populate: () => Promise<any>;
    read_one: (id: string, new_return_fields?: QueryArguments<S>) => Promise<query_root[SK] | null>;
    update_one: (options: {
        input: MutationInput<U>;
        new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[U]>>;
    }) => Promise<mutation_root[UK] | null>;
    create_one: (options: {
        input: MutationInput<C | CK>;
        new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[C | CK]>>;
    }) => Promise<mutation_root[CK] | null>;
    delete_one: (id: string) => Promise<boolean>;
    read_many: (fn_arguments?: {
        options: QueryOptions<T>;
        new_return_fields?: QueryArguments<T>;
    }) => Promise<query_root[K] | null>;
    soft_delete_one: (id: string) => Promise<boolean>;
    value: query_root;
    get_stored_value: () => Promise<query_root | null>;
    populate_fn: () => Promise<query_root | null>;
    reset: () => void;
    init: () => void;
    on_change: (call_back: (state: query_root, unsub: () => void) => any) => () => void;
    update_state: (callback: (value: query_root) => query_root | null) => void;
};
export {};
