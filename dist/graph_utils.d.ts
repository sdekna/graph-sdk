declare function random_string(length?: number): string;
declare function is_array_valid<T>(input: any[] | null | undefined | T): input is any[];
type AnyObject = {
    [key: string]: any;
};
declare function deep_merge<T extends AnyObject = AnyObject, U extends AnyObject = AnyObject>(source: T, target: U): T & U;
type UpdateOrAppendRuneUsingID<T> = {
    rune: {
        value: any;
    };
    object: T;
};
declare function update_array_or_append_rune_using_id<T>({ rune, object }: UpdateOrAppendRuneUsingID<T>): void;
declare function clean_object<T>(obj: T): Partial<T>;
export declare const graph_utils: {
    random_string: typeof random_string;
    is_array_valid: typeof is_array_valid;
    deep_merge: typeof deep_merge;
    update_array_or_append_rune_using_id: typeof update_array_or_append_rune_using_id;
    clean_object: typeof clean_object;
};
export {};
