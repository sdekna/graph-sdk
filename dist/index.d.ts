import { create_db_array_state, create_db_object_state } from './create_db_states';
import { unauthorized_graphql_call } from './graphql_call';
import { create_state } from './create_state.svelte';
declare let active_fetch_function: <T>({ access_token, url, body, clean_object }: {
    access_token?: string;
    url: string;
    body?: any;
    clean_object: (obj: any) => any;
}) => Promise<T | null>;
export declare function create_graphdb_client({ fetch_function, graph_endpoint, auth_endpoint, storage }: {
    fetch_function?: typeof active_fetch_function;
    graph_endpoint: string;
    auth_endpoint: string;
    storage: 'localStorage' | 'indexedDB' | 'capacitor';
}): {
    unauthorized_call: typeof unauthorized_graphql_call;
    operations: {
        mutate: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, options: {
            input: import("./graphdb_handlers").MutationInput<T>;
            return_fields: import("./graphdb_handlers").MutationArguments<T>;
        }) => Promise<mutation_root | null>;
        read_one: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, options: {
            id: string;
            return_fields: import("./graphdb_handlers").QueryArguments<T>;
        }) => Promise<query_root | null>;
        read_many: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, { return_fields, options }: {
            return_fields: import("./graphdb_handlers").QueryArguments<T>;
            options?: import("./graphdb_handlers").QueryOptions<T>;
        }) => Promise<query_root | null>;
        delete_one: <T extends string | number | symbol>(collection: T, id: string) => Promise<string | null>;
    };
    build: {
        read: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, input: query_rootRequest) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_root;
        } | null;
        mutate: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, options: {
            input: import("./build_query").MutationInput<T>;
            return_fields: import("./build_query").MutationArguments<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: mutation_root;
        } | null;
        read_one: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, options: {
            id: string;
            return_fields: import("./build_query").QueryArguments<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_root;
        } | null;
        read_many: <T extends string | number | symbol, K extends string | number | symbol>(collection: T | K, { return_fields, options }: {
            return_fields: import("./build_query").QueryArguments<T>;
            options?: import("./build_query").QueryOptions<T>;
        }) => {
            query: string;
            variables: {
                [name: string]: any;
            };
            type: query_root;
        } | null;
        delete_one: <T extends string | number | symbol>(collection: T, id: string) => {
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
        queries: typeof import("./batching").batch_queries;
        mutations: typeof import("./batching").batch_mutations;
    };
    auth: {
        tokens_store: {
            value: {
                user_id: string;
                access_token: string;
                refresh_token: string;
            };
            reset: () => void;
        };
        change_auth_state: (change_value: boolean) => Promise<void>;
        auth_state_value: boolean;
        post_sign_in_flow: (() => (boolean | Promise<boolean>)) | null;
        auth_state_variable: {
            value: boolean;
        } | undefined;
        init: (options?: {
            auth_endpoint: string;
            fetch_function: <T>({ access_token, url, body, clean_object }: {
                access_token?: string;
                url: string;
                body?: any;
                clean_object: (obj: any) => any;
            }) => Promise<T | null>;
        }) => void;
        sign_in: (username: string, password: string) => Promise<{
            success: boolean;
            error: string | null;
        }>;
        sign_up: (username: string, password: string, name?: string) => Promise<{
            success: boolean;
            error: string | null;
        }>;
        sign_out: () => Promise<{
            success: true;
            error: null;
        } | {
            success: false;
            error: any;
        }>;
        get_user_id: () => string;
        get_access_token: () => Promise<string>;
        on_auth: (call_back: () => any) => any;
        on_change: (call_back: (state: boolean) => any) => void;
    };
    states: {
        create_state: typeof create_state;
        create_db_array_state: typeof create_db_array_state;
        create_db_object_state: typeof create_db_object_state;
    };
};
export {};
