import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";

export function watch(source,cb) {
  let getter;
  // source有两种情况:1) 响应式的对象;2)函数,返回值是一个响应式对象
  if(isReactive(source)) {
    // 对我们用户传入的数据进行循环(递归循环,只要循环就会访问对象上的每一个属性,访问属性的时候就会去收集依赖)
    getter = () => traversal(source)
  } else if(isFunction(source)) {
    getter = source
  } else {
    return
  }
  let oldValue;
  const job = () => {
    const newValue = effect.run();
    cb(newValue,oldValue)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter,job)
  oldValue = effect.run() // 保存旧值
  console.log(oldValue)
}

// 需要考虑对象中属性的循环引用的问题
function traversal(val,set = new Set()) {
  // 第一步递归要有终结条件,不是对象就不再递归了
  if(!isObject(val)) return val
  if(set.has(val)) {
    return val
  }
  set.add(val)
  for(let key in val) {
    traversal(val[key],set)
  } 
  return val
}