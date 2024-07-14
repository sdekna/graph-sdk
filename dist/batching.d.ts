export type CombinedQueryResult = {
    query: string;
    variables: {
        [key: string]: any;
    };
};
export type QueryObject = {
    query: string;
    variables: {
        [key: string]: any;
    };
    alias?: string;
    type: any;
} | null;
export declare function combine_graphql_queries(queries: QueryObject[]): CombinedQueryResult;
export declare function combine_graphql_mutations(mutations: QueryObject[]): CombinedQueryResult;
type ExtractType<T> = T extends {
    type: infer U;
} ? U : never;
export declare function batch_queries<T extends QueryObject[]>(operations: T): Promise<{
    [K in keyof T]: ExtractType<T[K]>;
} | null>;
export declare function batch_mutations<T extends QueryObject[]>(operations: T): Promise<{
    [K in keyof T]: ExtractType<T[K]>;
} | null>;
export {};
