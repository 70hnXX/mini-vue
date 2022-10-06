import { isFunction } from "@vue/shared";
import { ReactiveEffect, track, trackEffect, triggerEffects } from "./effect";

export function computed(getterOrOption) {
  let onlyGetter = isFunction(getterOrOption); // 是否只传入了getter
  let getter;
  let setter;

  // 获取参数
  if(onlyGetter) {
    getter = onlyGetter
    setter = ()=> {console.error('no setter')}
  } else {
    getter = getterOrOption.get;
    setter = getterOrOption.set;
  }

  return new ComputedRefImpl(getter,setter);
}

class ComputedRefImpl {
  public effect;
  public _dirty = true;
  public __v_isReadonly = true;
  public __v_isRef = true
  public _value
  public dep = new Set()
  constructor(public getter,public setter) {
    // 将用户的getter放到effect中,里面使用的依赖就会被收集起来
    this.effect = new ReactiveEffect(getter,()=>{
      // 依赖的属性变化时,执行此调度函数
      if(!this._dirty) {
        this._dirty = true
        // 实现一个触发更新
        triggerEffects(this.dep)
      }
    })
  }

  get value() {
    // 做依赖收集
    trackEffect(this.dep )
    if(this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }

  set value(newValue) {
    this.setter(newValue)
  }
}