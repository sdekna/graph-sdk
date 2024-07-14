type GraphQLCallOptions = {
    query: string;
    variables?: any;
    is_mutation: boolean;
    alias: string;
};
declare let active_fetch_function: <T>({ access_token, url, body, clean_object }: {
    access_token?: string;
    url: string;
    body?: any;
    clean_object: (obj: any) => any;
}) => Promise<T | null>;
export declare function init_graph_call(graph_endpoint: string, fetch_function: typeof active_fetch_function): void;
export declare function graphql_call_internal<T = any>({ query, variables }: {
    query: string;
    variables?: any;
}): Promise<T | null>;
export declare function unauthorized_graphql_call<T = any>({ query, variables }: {
    query: string;
    variables?: any;
}): Promise<T | null>;
export declare function graphql_call<T = any>({ query, variables, is_mutation, alias }: GraphQLCallOptions): Promise<T | null>;
export {};
