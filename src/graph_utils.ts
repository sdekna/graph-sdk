const characters = 'abcdefghijklmnopqrstuvwxyz';
function random_string(length = 10) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function is_array_valid<T>(input: any[] | null | undefined | T): input is any[] {
  if (!input || !Array.isArray(input) || !input.length || !input?.[0]) return false;
  return true;
}

type AnyObject = { [key: string]: any };
function deep_merge<T extends AnyObject = AnyObject, U extends AnyObject = AnyObject>(source: T, target: U): T & U {
  return void Object.keys(target).forEach(key => {
    source[key] instanceof Object && target[key] instanceof Object
      ? source[key] instanceof Array && target[key] instanceof Array
        ? void (source[key] = Array.from(new Set(source[key].concat(target[key]))))
        : !(source[key] instanceof Array) && !(target[key] instanceof Array)
          ? void deep_merge(source[key], target[key])
          : void (source[key] = target[key])
      : void (source[key] = target[key]);
  }) || source;
}
type UpdateOrAppendRuneUsingID<T> = { rune: { value: any }, object: T }

function update_array_or_append_rune_using_id<T>({ rune, object }: UpdateOrAppendRuneUsingID<T>): void {

  const rune_length = rune.value.length
  type TID = T & { id: string }

  for (let i = 0; i < rune_length; i++) {
    if ((rune.value[i] as TID)?.id === (object as TID)?.id) {
      rune.value[i] = object;
      return;
    }
  }
  console.log('NOT FOUND... PUSHING')
  rune.value.push(object);
}

function clean_object<T>(obj: T): Partial<T> {
  const cleaned_obj: Partial<T> = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned_obj[key] = obj[key];
    }
  }
  return cleaned_obj as any
}

export const graph_utils = {
  random_string, is_array_valid, deep_merge, update_array_or_append_rune_using_id, clean_object
}

