import { graph_utils } from "./graph_utils";

type AuthSigninSignupResponse = { data: { user_id: string, access_token: string, refresh_token: string }, error: null } | { error: string, data: null }
type AuthData = { user_id: string; access_token: string; refresh_token: string; }
type RefreshTokenResponse = { data: { access_token: string }, error: null } | { data: null, error: string }

const on_authenticated_fns_set = new Set<() => any>()
const on_change_fns_set = new Set<(state: boolean) => any>()
const browser = !(typeof window === 'undefined')
const clean_object = graph_utils.clean_object

const jwt_handlers = {
  get_jwt_expiration_timestamp: (token: string) => {
    const decoded_token = atob(token.split('.')[1]); // Decode the payload part of the token
    const parsed_payload = JSON.parse(decoded_token);

    if (typeof parsed_payload.exp === 'number') return parsed_payload.exp * 1000; // Return the expiration timestamp in milliseconds
    else return 0; // No expiration date found in the token

  },

  validate_token: (token: string) => {
    if (!token) return false
    if (Date.now() < jwt_handlers.get_jwt_expiration_timestamp(token)) return true
    return false
  }
}


function auth_sdk_fn() {
  let token_refresh_timeout: NodeJS.Timeout | null = null
  let post_sign_in_flow_fn: (() => (boolean | Promise<boolean>)) | null = null
  let auth_state_value = false
  let app_auth_state_variable: { value: boolean; } | undefined = undefined
  let AUTH_ENDPOINT = ''

  let fetch_function: <T>({ access_token, url, body, clean_object }: {
    access_token?: string;
    url: string;
    body?: any;
    clean_object: (obj: any) => any;
  }) => Promise<T | null>


  const tokens_store = create_persistent_storage<AuthData>({
    initial_value: { user_id: '', access_token: '', refresh_token: '' },
    store_name: 'postsdk_tokens'
  })


  function create_refresh_timeout() {
    const tokens = tokens_store.value
    if (!tokens || !tokens.user_id) return tokens_store.reset()

    const { access_token, refresh_token } = tokens

    if (!access_token || !refresh_token) return null
    const now = Date.now()
    const token_expiry = jwt_handlers.get_jwt_expiration_timestamp(access_token)

    if (token_refresh_timeout) clearTimeout(token_refresh_timeout)

    if (now > token_expiry) {
      console.log('token expired refreshing now')
      token_refresh_timeout = setTimeout(() => perform_refresh_token(), 1);
      return
    }

    token_refresh_timeout = setTimeout(() => perform_refresh_token(), (token_expiry - now - 60000));
    change_auth_state(true)
    console.log(`token is ok, trying refresh in: ${((token_expiry - now - 60000) / 1000 / 60).toFixed(2)} minutes`)
  }
  type InitOptions = { auth_endpoint: string, fetch_function: typeof fetch_function }
  const handlers = {
    init: (options?: InitOptions) => {
      if (options?.fetch_function) fetch_function = options.fetch_function
      if (options?.auth_endpoint) AUTH_ENDPOINT = options.auth_endpoint

      if (!AUTH_ENDPOINT) return
      create_refresh_timeout()
    },

    sign_in: async (username: string, password: string): Promise<{ success: boolean, error: string | null }> => {
      try {
        if (!username || !password) throw new Error('insufficient function arguments')
        console.log({ AUTH_ENDPOINT })
        const url = `${AUTH_ENDPOINT}/login`
        const body = { username, password }

        const fetch_data = await fetch_function<AuthSigninSignupResponse>({ body, url, clean_object })
        if (!fetch_data) throw new Error('fetch_failed')

        console.log({ fetch_data })
        const { data, error } = fetch_data
        if (error || !data) throw new Error('login_credintials_wrong')

        console.log({ sign_in_auth_data: data })

        tokens_store.value = data

        if (post_sign_in_flow_fn) {
          const post_flow_success = await post_sign_in_flow_fn()
          if (!post_flow_success) throw new Error('post_flow_failed')
        }

        change_auth_state(true)

        return { success: true, error: null }

      } catch (error: any) {
        console.error({ error })
        change_auth_state(false)
        return { success: false, error }
      }
    },

    sign_up: async (username: string, password: string, name?: string): Promise<{ success: boolean, error: string | null }> => {
      try {
        if (!username || !password) throw new Error('insufficient function arguments')

        const url = `${AUTH_ENDPOINT}/register`
        const body = { username, password, name: name ?? null }

        const fetch_data = await fetch_function<AuthSigninSignupResponse>({ body, url, clean_object })
        if (!fetch_data) throw new Error('fetch_failed')

        const { data, error } = fetch_data

        if (error || !data) throw new Error(error)

        tokens_store.value = data

        if (post_sign_in_flow_fn) {
          const post_flow_success = await post_sign_in_flow_fn()
          if (!post_flow_success) throw new Error('post_flow_failed')
        }

        change_auth_state(true)

        return { success: true, error: null }

      } catch (error: any) {
        console.error('error at sign_up: ', { error })
        change_auth_state(false)
        return { success: false, error }
      }
    },

    sign_out: async (): Promise<{ success: true; error: null; } | { success: false; error: any; }> => {
      try {

        const access_token = await handlers.get_access_token()
        if (!access_token) throw new Error('no access token')

        const url = `${AUTH_ENDPOINT}/logout`
        const fetch_data = await fetch_function<{ success: boolean }>({ access_token, url, clean_object })
        if (!fetch_data) throw new Error('fetch_failed')

        const { success } = fetch_data
        if (!success) throw new Error('logout_fail')

        return { success: true, error: null };
      } catch (error) {
        console.error(`error in sign_out_handler: ${error}`);
        return { success: false, error };
      }
      finally {
        tokens_store.reset()
        change_auth_state(false)
      }
    },

    get_user_id: (): string => {
      return tokens_store.value.user_id
    },

    get_access_token: async (): Promise<string> => {
      const current_token = tokens_store.value.access_token
      if (jwt_handlers.validate_token(current_token)) return current_token
      const { access_token } = await perform_refresh_token()

      return access_token ?? ''
    },

    on_auth: (call_back: () => any) => {
      if (auth_state_value) return call_back()
      on_authenticated_fns_set.add(call_back)
    },

    on_change: (call_back: (state: boolean) => any) => {
      on_change_fns_set.add(call_back)
    },
  }


  async function perform_refresh_token() {
    let no_tokens = false
    try {
      const tokens = tokens_store.value
      if (!tokens || !tokens.user_id) {
        no_tokens = true
        throw new Error('no_stored_tokens')
      }
      const { access_token: initial_access_token, refresh_token } = tokens
      if (!initial_access_token || !refresh_token) {
        no_tokens = true
        throw new Error('no_stored_tokens')
      }

      const url = `${AUTH_ENDPOINT}/refresh`

      const fetch_data = await fetch_function<RefreshTokenResponse>({
        url,
        access_token: initial_access_token,
        body: { refresh_token },
        clean_object
      })

      if (!fetch_data?.data) throw new Error('fetch_failed')

      const { data, error } = fetch_data

      if (error || !data?.access_token) throw new Error(error as any)
      const access_token = data.access_token

      console.log({ perform_refresh_token: data })

      tokens_store.value.access_token = access_token
      change_auth_state(true)

      const now = Date.now()
      const token_expiry = jwt_handlers.get_jwt_expiration_timestamp(access_token)

      if (token_refresh_timeout) clearTimeout(token_refresh_timeout)
      token_refresh_timeout = setTimeout(() => perform_refresh_token(), (token_expiry - now - 60000));

      return { success: true, error: null, access_token }
    } catch (error) {
      // console.error('error at perform_refresh_token: ', { error })
      change_auth_state(false)

      if (token_refresh_timeout) clearTimeout(token_refresh_timeout)
      // console.log({ no_tokens })
      if (!no_tokens) token_refresh_timeout = setTimeout(() => perform_refresh_token(), 5000);

      return { success: false, error, access_token: null }
    }
  }

  async function change_auth_state(change_value: boolean) {
    const previous_state = JSON.parse(JSON.stringify(auth_state_value))
    auth_state_value = change_value
    if (app_auth_state_variable) app_auth_state_variable.value = change_value
    on_change_handler(change_value)
    if (previous_state === false && change_value === true) on_authenticated_handler()
  }

  // if (browser) handlers.init()
  return {
    ...handlers,
    tokens_store,
    change_auth_state,
    auth_state_value,
    set post_sign_in_flow(value) { post_sign_in_flow_fn = value },
    get post_sign_in_flow() { return post_sign_in_flow_fn },

    set auth_state_variable(value) { app_auth_state_variable = value },
    get auth_state_variable() { return app_auth_state_variable },
  }
}


function on_authenticated_handler() {
  on_authenticated_fns_set.forEach((callback) => callback())
}

function on_change_handler(state: boolean) {
  on_change_fns_set.forEach((callback) => callback(state))
}

function create_persistent_storage<T>({ initial_value, store_name }: { initial_value: T, store_name: string }) {
  const storage_string = browser ? localStorage.getItem(store_name) : ''
  let storage_value = storage_string ? JSON.parse(storage_string) : initial_value

  return {
    get value() { return storage_value },
    set value(value: T) {
      storage_value = value
      if (browser) localStorage.setItem(store_name, JSON.stringify(storage_value))
    },
    reset: () => {
      storage_value = initial_value
      if (browser) localStorage.setItem(store_name, JSON.stringify(storage_value))
    }
  }
}

export const auth_sdk = auth_sdk_fn()
