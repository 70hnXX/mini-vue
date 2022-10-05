export let activeEffect = undefined  

export function effect (fn) {
  const _effect = new ReactiveEffect(fn); // 创建一个响应式effect
  _effect.run(); // 默认执行一次
}

class ReactiveEffect {
  public parent = null
  public active = true; // 这个effect默认是激活状态
  public deps = []; // 被哪些属性被依赖
  constructor(public fn) {}; // 用户传递的参数也会到this上,即this.fn = fn

  run() { // 执行effect
    if(!this.active) {this.fn()} // 如果不是激活状态,就只执行一次函数,不进行依赖收集
    // 进行依赖收集
    try {
      // 记录parent
      this.parent = activeEffect
      activeEffect = this
      return this.fn(); // 当稍后调用取值操作时,就能获取到这个全局的activeEffect
    } finally {
      activeEffect = this.parent
    }
  }
}

const targetMap = new WeakMap();

// 依赖收集:
// 一个对象 -> 某个属性 -> 多个effect
// WeakMap = {对象:Map{name:Set}} 用set来存储effect
export function track(target,type,key) {
  if(!activeEffect) return; // 不在effect中就什么也不做
  let depsMap = targetMap.get(target); // 寻找当前target是否已经记录
  if(!depsMap) { // 未记录就去记录
    targetMap.set(target,(depsMap = new Map()))
  }
  let dep = depsMap.get(key); // 寻找当前记录的target中是否记录过这个key
  if(!dep) { // 没有记录这个属性就去记录这个属性
    depsMap.set(key,(dep = new Set()))
  }
  let shouldTrack = !dep.has(activeEffect) // 判断当前set里面有没有当前的effect
  if(shouldTrack) {
    dep.add(activeEffect) // 代理对象记录effect
    activeEffect.deps.push(dep) // effect记录当前set,弱引用,等会清理的时候直接修改这个set,这样target上面就不会找到了
  }
}

// 派发更新
export function trigger(target,type,key,value,oldVal) {
  // 1.找target
  const depsMap = targetMap.get(target)
  if(!depsMap) return; // 触发的值没有在模板中使用
  // 2.找key的set
  const effects = depsMap.get(key);
  effects && effects.forEach(effect => {
    if(effect !== activeEffect) effect.run(); // 避免循环调用爆栈
  })
}