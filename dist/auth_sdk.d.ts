type AuthData = {
    user_id: string;
    access_token: string;
    refresh_token: string;
};
export declare const auth_sdk: {
    tokens_store: {
        value: AuthData;
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
export {};
