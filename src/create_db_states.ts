

import type { query_rootRequest, query_root, mutation_rootRequest, mutation_root } from './generated/schema.js'
import type { MutationInput, QueryArguments, QueryOptions } from './graphdb_handlers';

import { create_state } from './create_state.svelte';
import { graph_operations } from './graphdb_handlers';
import { graph_utils } from './graph_utils';
import { auth_sdk } from './auth_sdk';

type SecondElement<Tuple> = Tuple extends [any, infer Second] ? Second : never;
// type FirstElement<Tuple> = Tuple extends [infer First, ...any[]] ? First : never;


type CreateDbObjectState<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest> = {
  many_q: T | K,
  single_q: S | SK,
  create_q: C | CK,
  update_q: U | UK,
  delete_q: D,
  return_fields: QueryArguments<T>,
  auto_populate?: boolean,
  persist?: boolean,
  options?: QueryOptions<T>,
  options_fn?: (value: query_root[SK]) => (QueryOptions<T> | null),
  state_name: string,
  mutate_value_fn?: (value: query_root[SK], old_value: query_root[SK]) => query_root[SK],
}

export function create_db_object_state<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest>(
  { state_name, many_q, single_q, create_q, update_q, delete_q, mutate_value_fn, return_fields, options, options_fn, auto_populate, persist = false }: CreateDbObjectState<T, K, S, SK, C, CK, U, UK, D>) {


  type StoreType = query_root[SK] & { id: string; }

  const initial_value: StoreType | undefined = undefined

  const current_state = create_state({
    persist, state_name, mutate_value_fn: mutate_value_fn as any, initial_value: initial_value as StoreType | undefined
  })

  async function read_one(id: string, new_return_fields?: QueryArguments<S>): Promise<query_root[SK] | null> {
    if (!id) return null

    const one = await graph_operations.operations.read_one(single_q, { id, return_fields: new_return_fields ?? return_fields as unknown as QueryArguments<S> }) as StoreType
    if (!one) return null

    if (!current_state.value || !new_return_fields) current_state.value = one
    else current_state.value = graph_utils.deep_merge(current_state.value, one)

    return one as query_root[SK]
  }

  async function read_many(fn_arguments?: { options: QueryOptions<T>, new_return_fields?: QueryArguments<T>; }): Promise<query_root[K] | null> {

    const read_options = fn_arguments?.options ? fn_arguments?.options : options_fn ? options_fn(current_state.value as StoreType) : options
    // console.log({ fn_arguments, read_options })

    if (fn_arguments && !read_options) return null

    const many = await graph_operations.operations.read_many(many_q, {
      return_fields: fn_arguments?.new_return_fields ?? return_fields,
      options: read_options ?? undefined,
    })
    // console.log({ many })

    if (!many) return null
    return many as query_root[K]
  }

  type WithoutPkColumns<T> = Omit<T, 'pk_columns'>;
  async function update_one(options: { input: WithoutPkColumns<MutationInput<U>>; new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[U]>>; }): Promise<mutation_root[UK] | null> {
    const id = current_state.value?.id ?? (await populate_fn())?.id
    if (!id) return null
    const input = {
      ...options.input,
      pk_columns: { id }
    } as any

    const response = await graph_operations.operations.mutate(update_q, { input, return_fields: options.new_return_fields ?? return_fields as unknown as SecondElement<NonNullable<mutation_rootRequest[U]>> })

    if (!response) return null
    if (!current_state.value || !options.new_return_fields) current_state.value = response as StoreType
    else current_state.value = graph_utils.deep_merge(current_state.value, response as StoreType)

    return response as mutation_root[UK]
  }

  async function create_one(options: { input: MutationInput<C | CK>; return_fields: SecondElement<NonNullable<mutation_rootRequest[C | CK]>>; }):
    Promise<mutation_root[CK] | null> {
    const response = await graph_operations.operations.mutate(create_q, options)
    if (!response) return null
    return response as mutation_root[CK]
  }

  async function delete_one(id: string): Promise<boolean> {
    const response = await graph_operations.operations.delete_one(delete_q, id)
    if (!response) return false
    return true
  }

  async function populate_fn() {
    const data = await read_many() as StoreType[] | undefined
    if (!data) return undefined
    if (!data[0]) return null

    current_state.value = data[0]
    return data[0]
  }

  if (auto_populate && !(typeof window === 'undefined')) auth_sdk.on_auth(populate_fn)

  return {
    ...current_state,
    populate: populate_fn, read_one, update_one, create_one, delete_one, read_many,
    get value() { return current_state.value },
    set value(value: StoreType | undefined) { current_state.value = value; },
  }
}




type CreateDbArrayState<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest> = {
  many_q: T | K,
  single_q: S | SK,
  create_q: C | CK,
  update_q: U | UK,
  delete_q: D,
  return_fields: QueryArguments<T>,
  options?: QueryOptions<T>,
  options_fn?: (value: query_root[K]) => (QueryOptions<T> | null),
  auto_populate?: boolean,
  persist?: boolean,
  state_name: string,
  mutate_value_fn?: (value: query_root[K], old_value: query_root[K]) => query_root[K],
}
export function create_db_array_state<T extends keyof query_rootRequest, K extends keyof query_root, S extends keyof query_rootRequest, SK extends keyof query_root, C extends keyof mutation_rootRequest, CK extends keyof mutation_root, U extends keyof mutation_rootRequest, UK extends keyof mutation_root, D extends keyof mutation_rootRequest>(
  { state_name, many_q, single_q, create_q, update_q, delete_q, mutate_value_fn, return_fields, options, options_fn, auto_populate, persist = false }: CreateDbArrayState<T, K, S, SK, C, CK, U, UK, D>) {

  type StoreType = query_root[K]
  const initial_value: StoreType = ([] as any)

  const current_state = create_state({ state_name, mutate_value_fn, initial_value, persist })

  async function read_one(id: string, new_return_fields?: QueryArguments<S>): Promise<query_root[SK] | null> {
    const one = await graph_operations.operations.read_one(single_q, { id, return_fields: new_return_fields ?? return_fields as unknown as QueryArguments<S> })
    if (!one) return null
    if (Array.isArray(current_state.value)) graph_utils.update_array_or_append_rune_using_id({ rune: current_state, object: one })

    return one as query_root[SK]
  }

  async function read_many(fn_arguments?: { options: QueryOptions<T>, new_return_fields?: QueryArguments<T>; }): Promise<query_root[K] | null> {
    const read_options = fn_arguments?.options ? fn_arguments?.options : options_fn ? options_fn(current_state.value) : options
    if (!read_options) return null

    const many = await graph_operations.operations.read_many(many_q, {
      return_fields: fn_arguments?.new_return_fields ?? return_fields,
      options: read_options
    })

    if (!many) return null
    return many as query_root[K]
  }

  async function update_one(options: { input: MutationInput<U>; new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[U]>>; }): Promise<mutation_root[UK] | null> {
    const response = await graph_operations.operations.mutate(update_q, { input: options.input, return_fields: options.new_return_fields ?? return_fields as unknown as SecondElement<NonNullable<mutation_rootRequest[U]>> })
    if (!response) return null

    if (Array.isArray(current_state.value)) graph_utils.update_array_or_append_rune_using_id({ rune: current_state, object: response })


    return response as mutation_root[UK]
  }

  async function create_one(options: { input: MutationInput<C | CK>; new_return_fields?: SecondElement<NonNullable<mutation_rootRequest[C | CK]>>; }): Promise<mutation_root[CK] | null> {
    const response = await graph_operations.operations.mutate(create_q, { input: options.input, return_fields: options.new_return_fields ?? return_fields as unknown as SecondElement<NonNullable<mutation_rootRequest[C | CK]>> })
    if (!response) return null

    if (Array.isArray(current_state.value)) graph_utils.update_array_or_append_rune_using_id({ rune: current_state, object: response })
    return response as mutation_root[CK]
  }

  async function delete_one(id: string): Promise<boolean> {
    const delete_id = await graph_operations.operations.delete_one(delete_q, id)
    if (!delete_id) return false

    current_state.update_state((value) => {
      if (!Array.isArray(value)) return value
      return value.filter((object) => (object as any).id !== delete_id) as StoreType
    })

    return true
  }

  async function soft_delete_one(id: string): Promise<boolean> {

    const input = {
      pk_columns: { id },
      _set: { is_deleted: true }
    }

    const soft_delete_op = await graph_operations.operations.mutate(update_q, {
      input: input as any,
      return_fields: { id: true } as any
    })

    if (!(soft_delete_op as any)?.id) return false

    current_state.update_state((value) => {
      if (!Array.isArray(value)) return value
      return value.filter((object) => (object as any).id !== (soft_delete_op as any).id) as StoreType
    })

    return true
  }

  async function populate_fn() {
    const data = await read_many() as StoreType | null
    if (!data) return null
    current_state.value = data
    return data
  }


  if (auto_populate && !(typeof window === 'undefined')) auth_sdk.on_auth(populate_fn)


  return {
    ...current_state,
    populate: populate_fn, read_one, update_one, create_one, delete_one, read_many, soft_delete_one,
    get value() { return current_state.value },
    set value(value: StoreType) { current_state.value = value },

  }
}