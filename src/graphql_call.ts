import { combine_graphql_mutations, combine_graphql_queries, type CombinedQueryResult, type QueryObject } from "./batching";
import { graph_utils } from "./graph_utils";
import { auth_sdk } from "./auth_sdk";

type BatchQueueItem<T> = {
  resolve: (value: T | null) => void;
  reject: (reason?: any) => void;
  options: GraphQLCallOptions;
  promise: Promise<T | null>;
}
type GraphQLCallOptions = {
  query: string;
  variables?: any;
  is_mutation: boolean;
  alias: string
}

const query_queue: BatchQueueItem<any>[] = [];
const mutation_queue: BatchQueueItem<any>[] = [];
const BATCH_INTERVAL_MS = 200; // x milliseconds
const clean_object = graph_utils.clean_object

let query_timeout: Timer | undefined = undefined;
let mutation_timeout: Timer | undefined = undefined;
let GRAPH_ENDPOINT = ''


let active_fetch_function: <T>({ access_token, url, body, clean_object }: {
  access_token?: string;
  url: string;
  body?: any;
  clean_object: (obj: any) => any;
}) => Promise<T | null>


export function init_graph_call(graph_endpoint: string, fetch_function: typeof active_fetch_function) {
  GRAPH_ENDPOINT = graph_endpoint
  if (fetch_function) active_fetch_function = fetch_function
}


export async function graphql_call_internal<T = any>({ query, variables = null }: { query: string; variables?: any }): Promise<T | null> {
  try {
    if (!query || typeof query !== 'string') return null

    const call_object = Object.assign({}, variables !== null ? { query, variables } : { query });
    const access_token = await auth_sdk.get_access_token()
    const response = await active_fetch_function<{ data: any, errors: any[] }>({ url: GRAPH_ENDPOINT, access_token, clean_object, body: call_object });

    console.log({ call_object })
    const data = response?.data

    if (!data) {
      console.error(response?.data.errors?.[0])
      throw new Error('no_data_returned')
    }

    console.log(data)
    return data as T
  } catch (error) {
    console.error('error at graphql_call function ', { error, query })
    return null
  }
}

export async function unauthorized_graphql_call<T = any>({ query, variables = null }: { query: string; variables?: any }): Promise<T | null> {
  try {
    if (!query || typeof query !== 'string') return null

    const call_object = Object.assign({}, variables !== null ? { query, variables } : { query });

    const response = await active_fetch_function<{ data: any, errors: any[] }>({ url: GRAPH_ENDPOINT, clean_object, body: call_object });

    const data = response?.data

    if (!data) {
      console.error(response?.data.errors?.[0])
      throw new Error('no_data_returned')
    }

    console.log(data)
    return data as T
  } catch (error) {
    console.error('error at graphql_call function ', { error, query })
    return null
  }
}


export async function graphql_call<T = any>({ query, variables = null, is_mutation = false, alias }: GraphQLCallOptions): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    const queue = is_mutation ? mutation_queue : query_queue;
    const timeout_ref = is_mutation ? mutation_timeout : query_timeout;
    const combine_fn = is_mutation ? combine_graphql_mutations : combine_graphql_queries;

    // Check if the query with the same variables already exists in the queue
    for (const item of queue) {
      if (item.options.query === query && JSON.stringify(item.options.variables) === JSON.stringify(variables)) {
        return item.promise.then((result) => {
          resolve({ [alias]: result[item.options.alias] } as T)
        }).catch(reject);
      }
    }

    const { promise, resolve: innerResolve, reject: innerReject } = Promise.withResolvers<T>();

    queue.push({ resolve: innerResolve, reject: innerReject, options: { query, variables, is_mutation, alias }, promise });

    promise.then(resolve).catch(reject);

    if (queue.length === 1) {
      if (is_mutation) {
        mutation_timeout = schedule_queue_processing(queue, combine_fn, timeout_ref, 'mutation');
      } else {
        query_timeout = schedule_queue_processing(queue, combine_fn, timeout_ref, 'query');
      }
    }
  });
}

function process_queue<T>(queue: BatchQueueItem<T>[], combine_fn: (queries: QueryObject[]) => CombinedQueryResult) {
  const items = [...queue];
  queue.length = 0;

  const query_objects: QueryObject[] = items.map(item => ({
    query: item.options.query,
    variables: item.options.variables,
    type: item.options.is_mutation ? 'mutation' : 'query',
    alias: item.options.alias
  }));

  const combined = combine_fn(query_objects);
  graphql_call_internal<T[]>({ query: combined.query, variables: combined.variables })
    .then(result => {
      if (!result) return items.forEach((item) => item.reject())
      const final_results = Object.values(result)
      items.forEach((item, index) => {
        item.options.query
        const return_result = { [item.options.alias]: final_results[index] } as T
        item.resolve(return_result)
      })
    })
    .catch(error => {
      items.forEach(item => item.reject(error));
    });
}

function schedule_queue_processing(queue: BatchQueueItem<any>[], combine_fn: (queries: QueryObject[]) => CombinedQueryResult, timeout_ref: Timer | undefined, type: 'mutation' | 'query') {
  if (timeout_ref) return // Already scheduled
  return setTimeout(() => {
    console.log('executing timeout')
    process_queue(queue, combine_fn);
    if (type === 'mutation') {
      clearTimeout(mutation_timeout);
      mutation_timeout = undefined
    } else {
      clearTimeout(query_timeout);
      query_timeout = undefined
    }

  }, BATCH_INTERVAL_MS);
}