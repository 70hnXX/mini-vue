export let activeEffect = undefined; // 导出此变量,使得外部可以访问到ReactiveEffect实例

class ReactiveEffect {
  public parent = null;
  public active = true; // 默认effect是激活状态,pulic修饰符把变量或者参数放到this实例上
  constructor(public fn) {}

  // 执行
  run() {
    if (!this.active) {
      return this.fn();
    } // 非激活情况,只执行函数,不进行依赖收集

    // 依赖收集
    try {
      this.parent = activeEffect;
      activeEffect = this;
      return this.fn(); // 此处的activeEffect,在执行fn的时候,使得fn的函数内部,能够访问到这个ReactiveEffect
    } finally {
      activeEffect = this.parent;
    }
  }
}

export function effect(fn) {
  // fn会根据状态,重新执行,effect可以嵌套写effect
  const _effect = new ReactiveEffect(fn); // 创建响应式的effect
  _effect.run(); // 默认执行一次
}

const targetMap = new WeakMap();
export function track(target, type, key) {
  // debugger;
  if (!activeEffect) return;
  // 对象的某个属性可以对应多个effect
  // weakMap = {对象:Map{name:Set}}
  let depsMap = targetMap.get(target); // 第一次取肯定没有
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    dep.add(activeEffect);
  }
}
