import type { query_rootRequest, query_root, mutation_rootRequest, mutation_root } from './generated/schema.js'
import { generateQueryOp, generateMutationOp } from './generated/index'
import { batch_mutations, batch_queries } from './batching';
import { graphql_call } from './graphql_call';
import { query_build } from './build_query';

type SecondElement<Tuple> = Tuple extends [any, infer Second] ? Second : never;
type FirstElement<Tuple> = Tuple extends [infer First, ...any[]] ? First : never;

export type QueryArguments<T extends keyof query_rootRequest> = SecondElement<NonNullable<query_rootRequest[T]>>
export type QueryOptions<T extends keyof query_rootRequest> = FirstElement<NonNullable<query_rootRequest[T]>>

export type MutationArguments<T extends keyof mutation_rootRequest> = SecondElement<NonNullable<mutation_rootRequest[T]>>

export type MutationInput<T extends keyof mutation_rootRequest> = FirstElement<NonNullable<mutation_rootRequest[T]>>

async function mutate<T extends keyof mutation_rootRequest, K extends keyof mutation_root>(collection: T | K, options: { input: MutationInput<T>, return_fields: MutationArguments<T> }): Promise<mutation_root[K] | null> {
  const { input, return_fields } = options

  const { query, variables } = generateMutationOp({
    [collection]: [input, return_fields]
  })
  const alias = random_string()

  const data = await graphql_call({ query, variables, alias, is_mutation: true })

  if (!data) return null
  const result = data?.[alias] as mutation_root[K] | null
  if (!result) return null
  return result
}

async function delete_one<T extends keyof mutation_rootRequest>(collection: T, id: string): Promise<string | null> {
  const { query, variables } = generateMutationOp({
    [collection]: [{ id }, { id: true }]
  })
  const alias = random_string()
  const data = await graphql_call({ query, variables, alias, is_mutation: true })

  if (!data) return null
  const delete_id = data?.[alias]?.id as string | null
  if (!delete_id) return null
  return delete_id
}

async function read_one<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, options: { id: string, return_fields: QueryArguments<T> }): Promise<query_root[K] | null> {
  const { id, return_fields } = options

  const { query, variables } = generateQueryOp({
    [collection]: [
      { id },
      return_fields
    ]
  })
  const alias = random_string()

  const data = await graphql_call({ query, variables, alias, is_mutation: false })
  if (!data) return null

  const result = data?.[alias] as query_root[K] | null
  if (!result) return null
  return result
}

async function read_many<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, { return_fields, options }: { return_fields: QueryArguments<T>, options?: QueryOptions<T> }): Promise<query_root[K] | null> {

  const { query, variables } = generateQueryOp({
    [collection]: options ? [{ ...options }, { ...return_fields }] : return_fields
  })

  const alias = random_string()
  const data = await graphql_call({ query, variables, alias, is_mutation: false })

  if (!data) return null

  const result = data?.[alias] as query_root[K] | null
  if (!result) return null
  return result
}

const characters = 'abcdefghijklmnopqrstuvwxyz';
function random_string(length = 10) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export const graph_operations = {
  operations: {
    mutate,
    read_one,
    read_many,
    delete_one,
  },
  build: query_build,
  batch: {
    queries: batch_queries,
    mutations: batch_mutations,
  }
}
