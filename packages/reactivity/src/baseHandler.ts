export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, reciver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    return Reflect.get(target, key, reciver);
  },
  set(target, key, value, reciver) {
    return Reflect.set(target, key, value, reciver);
  },
};
