import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandlers = {
  get(target, key, reciver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // effect依赖收集
    track(target,'get',key)
    return Reflect.get(target, key, reciver);
  },
  set(target, key, value, reciver) {
    // 修改值,去派发effect的更新
    let oldVal = target[key];
    let result = Reflect.set(target, key, value, reciver) // 会返回是否成功
    if(oldVal !== value) {
      // 当前值变化了
      trigger(target,'set',key,value,oldVal);
    }
    return result;
  },
};
