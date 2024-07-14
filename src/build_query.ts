import type { query_rootRequest, query_root, mutation_rootRequest, mutation_root } from './generated/schema'
import { generateQueryOp, generateMutationOp } from './generated/index'

type SecondElement<Tuple> = Tuple extends [any, infer Second] ? Second : never;
type FirstElement<Tuple> = Tuple extends [infer First, ...any[]] ? First : never;

export type QueryArguments<T extends keyof query_rootRequest> = SecondElement<NonNullable<query_rootRequest[T]>>
export type QueryOptions<T extends keyof query_rootRequest> = FirstElement<NonNullable<query_rootRequest[T]>>

export type MutationArguments<T extends keyof mutation_rootRequest> = SecondElement<NonNullable<mutation_rootRequest[T]>>
export type MutationInput<T extends keyof mutation_rootRequest> = FirstElement<NonNullable<mutation_rootRequest[T]>>

function mutate<T extends keyof mutation_rootRequest, K extends keyof mutation_root>(collection: T | K, options: { input: MutationInput<T>, return_fields: MutationArguments<T> }): { query: string, variables: { [name: string]: any; }, type: mutation_root[K] } | null {
  const { input, return_fields } = options

  const { query, variables } = generateMutationOp({
    [collection]: [input, return_fields]
  })

  return { query, variables, type: {} as mutation_root[K] }
}

function delete_one<T extends keyof mutation_rootRequest>(collection: T, id: string): { query: string, variables: { [name: string]: any; }, type: { id: string } } | null {
  const { query, variables } = generateMutationOp({
    [collection]: [{ id }, { id: true }]
  })

  return { query, variables, type: {} as { id: string } }
}

function read_one<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, options: { id: string, return_fields: QueryArguments<T> }): { query: string, variables: { [name: string]: any; }, type: query_root[K] } | null {
  const { id, return_fields } = options

  const { query, variables } = generateQueryOp({
    [collection]: [
      { id },
      return_fields
    ]
  })
  return { query, variables, type: {} as query_root[K] }
}

function read_many<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, { return_fields, options }: { return_fields: QueryArguments<T>, options?: QueryOptions<T> }): { query: string, variables: { [name: string]: any; }, type: query_root[K] } | null {

  const { query, variables } = generateQueryOp({
    [collection]: options ? [{ ...options }, { ...return_fields }] : return_fields
  })

  return { query, variables, type: {} as query_root[K] }

}

export type QueryFullArguments<T extends keyof query_rootRequest> = SecondElement<NonNullable<query_rootRequest[T]>>

function read<T extends keyof query_rootRequest, K extends keyof query_root>(collection: T | K, input: query_rootRequest[T]): { query: string, variables: { [name: string]: any; }, type: query_root[K] } | null {

  const { query, variables } = generateQueryOp({
    [collection]: input
  })
  return { query, variables, type: {} as query_root[K] }

}


export const query_build = {
  read,
  mutate,
  read_one,
  read_many,
  delete_one,
}
