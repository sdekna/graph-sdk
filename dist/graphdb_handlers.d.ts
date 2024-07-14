import type { query_rootRequest, query_root, mutation_rootRequest, mutation_root } from '../dist/generated/schema';
import { batch_mutations, batch_queries } from './batching';
type SecondElement<Tuple> = Tuple extends [any, infer Second] ? Second : never;
type FirstElement<Tuple> = Tuple extends [infer First, ...any[]] ? First : never;
export type QueryArguments<T extends keyof query_rootRequest> = SecondElement<NonNullable<query_rootRequest[T]>>;
export type QueryOptions<T extends keyof query_rootRequest> = FirstElement<NonNullable<query_rootRequest[T]>>;
export type MutationArguments<T extends keyof mutation_rootRequest> = SecondElement<NonNullable<mutation_rootRequest[T]>>;
export type MutationInput<T extends keyof mutation_rootRequest> = FirstElement<NonNullable<mutation_rootRequest[T]>>;
declare function mutate<T extends keyof mutation_rootRequest, K extends keyof mutation_root>(collection: T | K, options: {
    input: MutationInput<T>;
    return_fields: MutationArguments<T>;
}): Promise<mutation_root[K] | null>;
declare function delete_one<T extends keyof mutation_rootRequest>(collection: T, id: string): Promise<string | null>;
declare function read_one<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, options: {
    id: string;
    return_fields: QueryArguments<T>;
}): Promise<query_root[K] | null>;
declare function read_many<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, { return_fields, options }: {
    return_fields: QueryArguments<T>;
    options?: QueryOptions<T>;
}): Promise<query_root[K] | null>;
export declare const graph_operations: {
    operations: {
        mutate: typeof mutate;
        read_one: typeof read_one;
        read_many: typeof read_many;
        delete_one: typeof delete_one;
    };
    build: {
        read: <T extends keyof query_rootRequest, K extends keyof query_rootRequest>(collection: T | K, input: query_rootRequest[T]) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_rootRequest[K];
        } | null;
        mutate: <T extends keyof query_rootRequest, K extends keyof query_rootRequest>(collection: T | K, options: {
            input: import("./build_query").MutationInput<T>;
            return_fields: import("./build_query").MutationArguments<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_rootRequest[K];
        } | null;
        read_one: <T extends keyof query_rootRequest, K extends keyof query_rootRequest>(collection: T | K, options: {
            id: string;
            return_fields: import("./build_query").QueryArguments<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_rootRequest[K];
        } | null;
        read_many: <T extends keyof query_rootRequest, K extends keyof query_rootRequest>(collection: T | K, { return_fields, options }: {
            return_fields: import("./build_query").QueryArguments<T>;
            options?: import("./build_query").QueryOptions<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_rootRequest[K];
        } | null;
        delete_one: <T extends keyof query_rootRequest>(collection: T, id: string) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: {
                id: string;
            };
        } | null;
    };
    batch: {
        queries: typeof batch_queries;
        mutations: typeof batch_mutations;
    };
};
export {};
