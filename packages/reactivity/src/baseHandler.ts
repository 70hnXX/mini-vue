import { track } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, reciver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // effect的依赖收集
    track(target, "get", key);
    return Reflect.get(target, key, reciver);
  },
  set(target, key, value, reciver) {
    return Reflect.set(target, key, value, reciver);
  },
};
