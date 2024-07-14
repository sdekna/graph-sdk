import IndexedDBWrapper from './indexeddb_wrapper'

let indexedb_initialized = false
const indexed_db_wrapper: IndexedDBWrapper = new IndexedDBWrapper('persistance-database', 'main-store')
const browser = !(typeof window === 'undefined')

type Function<T> = () => T | null | Promise<T | null>

type StateInput<T> = {
  initial_value: T,
  mutate_value_fn?: (value: T, old_value: T) => T,
  on_change?: (value: T) => any,
  populate_fn?: Function<T>
  populate_callback?: (callback: Function<any>) => void
  state_name?: string,
  persist?: boolean,
}

export type StateReturn<T> = {
  value: T;
  get_stored_value: () => Promise<T | null>
  populate_fn: () => Promise<T | null>,
  reset: () => void,
  init: () => void,
  on_change: (call_back: (state: T, unsub: () => void) => any) => () => void,
  update_state: (callback: (value: T) => T | null) => void,
}

type StorageType = 'localStorage' | 'indexedDB' | 'capacitor'

let is_device_native = false
let browser_storage: StorageType = typeof window === 'undefined' || !window?.indexedDB ? 'localStorage' : 'indexedDB'
let Preferences = { get: async (args: any) => ({ value: null }), set: async (args: any) => { } }

export async function init_states_storage(storage: StorageType) {
  try {
    switch (storage) {
      case 'capacitor': {
        const [{ Capacitor }, { Preferences: PreferencesLib }] = await Promise.all[import('@capacitor/core'), import('@capacitor/preferences')];
        Preferences = PreferencesLib
        is_device_native = Capacitor.isNativePlatform();
        browser_storage = 'capacitor'
        break;
      }
      default: {
        browser_storage = storage
      }
    }
  } catch (error) {
    console.error('init_states_storage error: ', error)
  }

}

export function create_state<T>({ state_name = '', initial_value, persist = false, mutate_value_fn, populate_fn, populate_callback, on_change }: StateInput<T>): StateReturn<T> {

  let current_state = $state(initial_value)
  if (typeof window === 'undefined') return { value: current_state as T, get_stored_value: async () => null as T | null, populate_fn: async () => { return }, } as unknown as StateReturn<T>

  async function get_stored_value(): Promise<T | null> {
    try {
      // console.log({ browser_storage, state_name, initial_value, persist, is_device_native, indexedb_initialized })
      if (!state_name || !persist) return null

      let stored_value: T | null = null
      if (is_device_native) stored_value = await get_capacitor_store<T>(state_name)
      else if (browser_storage === 'indexedDB') {
        if (!indexedb_initialized) await indexed_db_wrapper.init()
        stored_value = await get_indexed_db_store<T>(state_name)
      }
      else stored_value = get_local_storage_store<T>(state_name)

      if (!stored_value) return null

      return stored_value

    } catch (error) {
      console.error(`Error at get_value function, state: ${state_name}.`, { error });
      return null
    }
  }

  if (persist) get_stored_value().then((value) => {
    // console.log('stored value', value)
    if (!value) return
    current_state = value
  }).catch((error) => console.error('error at get_stored_value .catch', { error }))

  async function populate_fn_handler() {
    if (!populate_fn) return null
    const value = await populate_fn()
    if (!value) return null
    set_value(value)
    return value
  }

  function update_state(callback: (value: T) => T | null) {
    const updated_value = callback(current_state)
    if (!updated_value) return
    set_value(updated_value)
  }

  function set_value(value: T) {
    const new_value = mutate_value_fn ? mutate_value_fn(value, current_state) : value
    current_state = new_value
    if (on_change) on_change(new_value)
    if (persist) persistStore(state_name as string, new_value, browser_storage)
  }

  if (populate_fn && browser) {
    if (populate_callback) populate_callback(populate_fn_handler)
    else populate_fn_handler()
  }

  const { on_change: _on_change, on_change_handler } = create_on_change_handler<T>()


  return {
    get value() { return current_state },
    set value(value: T) {
      set_value(value)
      on_change_handler(value)
    },
    reset: () => set_value(initial_value),
    get_stored_value: get_stored_value,
    init: () => { },
    on_change: _on_change,
    populate_fn: populate_fn_handler,
    update_state
  }
}



async function persistStore<T>(key: string, value: T, browser_storage: StorageType) {
  if (typeof window === 'undefined' || value === undefined) return
  if (browser_storage === 'indexedDB' && !indexedb_initialized) {
    await indexed_db_wrapper.init()
    indexedb_initialized = true
  }

  if (is_device_native) await set_capacitor_store<T>({ key, value })
  else if (browser_storage === 'indexedDB') await setIndexedDBStore<T>({ key, value })
  else setLocalStorageStore<T>({ key, value })
}

async function get_indexed_db_store<T>(key: string): Promise<T | null> {
  const document = await indexed_db_wrapper.get<T>(key)
  // console.log({ document })
  if (!document) return null
  const { value } = document
  return value
}

async function setIndexedDBStore<T>({ key, value }: { key: string, value: T }) {
  const insert_document = { id: key, value: JSON.parse(JSON.stringify(value ?? null)) };
  console.log({ type: 'set', store: key, insert_document })
  return indexed_db_wrapper.set<T>(insert_document)
}

function get_local_storage_store<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null
    const string_value = localStorage.getItem(key)
    if (!string_value) return null

    const value = JSON.parse(string_value) as T | null

    return value
  } catch (error) {
    // console.error(`Error at get_local_storage_store function, key: ${key}.`, { error });
    return null
  }
}

function setLocalStorageStore<T>({ key, value }: { key: string, value: T }) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    // console.error(`Error at setLocalStorageStore function, key: ${key}.`, { error });
  }
}


async function get_capacitor_store<T>(key: string): Promise<T | null> {
  try {
    if (typeof window === 'undefined' || !is_device_native) return null

    const result = await Preferences.get({ key });
    const string_value = result.value;
    if (!string_value) return null

    const value = JSON.parse(string_value) as T | null
    return value
  } catch (error) {
    // console.error(`Error at get_capacitor_store function, key: ${key}.`, { error });
    return null
  }
}

async function set_capacitor_store<T>({ key, value }: { key: string, value: T }) {
  try {
    if (typeof window === 'undefined' || !is_device_native) return
    await Preferences.set({ key, value: JSON.stringify(value) });
  } catch (error) {
    // console.error(`Error at set_capacitor_store function, key: ${key}.`, { error });
  }
}

function create_on_change_handler<T>() {
  const on_change_fns_map = new Map<string, (value: T, unsub: () => void) => any>()

  return {
    on_change: (call_back: (value: T, unsub: () => void) => any, destroy_delay?: number) => {
      const id = random_string()

      on_change_fns_map.set(id, call_back)

      const unsub = () => on_change_fns_map.delete(id)

      if (destroy_delay) setTimeout(unsub, destroy_delay);
      return () => { unsub() }
    },
    on_change_handler: (value: T) => {
      on_change_fns_map.forEach((callback, id) => callback?.(value, () => on_change_fns_map.delete(id)))
    },
  }
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