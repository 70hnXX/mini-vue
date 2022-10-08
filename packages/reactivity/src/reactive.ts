import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

const reactiveMap = new WeakMap();

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

export const reactive = (target) => {
  // 判断是否为对象，不是对象就不做代理
  if (!isObject(target)) return;
  // 判断是否代理过,未被代理过的对象,会取'__v_isReactive'属性，没有这个属性，返回false
  // 代理过的对象，是一个proxy，就会去调用get，然后key === '__v_isReactive', 返回true
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  // 查找缓存,代理过的对象，直接返回proxy
  let existingProxy = reactiveMap.get(target);
  if (existingProxy) return existingProxy;
  // 设置代理
  const proxy = new Proxy(target, mutableHandlers);

  // 缓存代理,再次代理时返回上一次的代理
  reactiveMap.set(target, proxy);

  return proxy;
};
