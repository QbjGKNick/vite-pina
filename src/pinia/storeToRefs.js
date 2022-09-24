import { toRaw, isRef, isReactive, toRef } from "vue";

export function storeToRefs(store) {
  // store是proxy
  // 先将 store 转成原始对象，否则会触发依赖收集

  store = toRaw(store);

  const refs = {};
  for (let key in store) {
    const value = store[key];
    if (isRef(value) || isReactive(value)) {
      refs[key] = toRef(store, key);
    }
  }

  return refs;
}
