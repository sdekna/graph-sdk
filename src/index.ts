import { create_db_array_state, create_db_object_state } from './create_db_states';
import { init_graph_call, unauthorized_graphql_call } from './graphql_call';
import { create_state, init_states_storage } from './create_state.svelte';
import { graph_operations } from './graphdb_handlers';
import { auth_sdk } from './auth_sdk';

let active_fetch_function: <T>({ access_token, url, body, clean_object }: {
  access_token?: string;
  url: string;
  body?: any;
  clean_object: (obj: any) => any;
}) => Promise<T | null> = async<T>({ access_token, url, body, clean_object }: { access_token?: string; url: string; body?: any, clean_object: (obj: any) => any }) => {
  let fetch_options = clean_object({
    headers: {
      'Content-Type': 'application/json',
      Authorization: access_token ? `Bearer ${access_token}` : undefined
    },
    body: body ? JSON.stringify(body) : undefined,
    method: body ? 'POST' : 'GET',
  }) as any

  const request = await fetch(url, fetch_options)
  if (!request.ok) return null
  return request.json() as T
}


// import.meta.env.VITE_AUTH_ENDPOINT
export function create_graphdb_client({ fetch_function, graph_endpoint, auth_endpoint, storage = 'indexedDB' }: { fetch_function?: typeof active_fetch_function, graph_endpoint: string, auth_endpoint: string, storage: 'localStorage' | 'indexedDB' | 'capacitor' }) {
  if (fetch_function) active_fetch_function = fetch_function

  init_states_storage(storage)
  auth_sdk.init({ auth_endpoint, fetch_function: active_fetch_function })
  init_graph_call(graph_endpoint, active_fetch_function)

  return {
    unauthorized_call: unauthorized_graphql_call,
    operations: graph_operations.operations,
    build: graph_operations.build,
    batch: graph_operations.batch,
    auth: auth_sdk,
    states: {
      create_state,
      create_db_array_state,
      create_db_object_state
    },
  }
}
