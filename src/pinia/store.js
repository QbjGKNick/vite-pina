// 存的是 defineStore API

// createPinia()，默认是一个插件具备一个 install 方法
// _s 用来存储 id-> store
// state 用来存储所有状态的
// _e 用来停止所有状态的

// id + options
// options
// id + setup
import {
  getCurrentInstance,
  inject,
  reactive,
  effectScope,
  computed,
  isRef,
  isReactive,
} from "vue";
import { piniaSymbol } from "./rootStore";

function isComputed(v) { // 计算属性是 ref 同时也是一个 effect
  return !!(isRef(v) && v.effect)
}

// 核心方法
function createSetupStore(id, setup, pinia, isOption) {
  let scope;
  // 后续一些不是用户定义的属性和方法，内置的 api 会增加到这个 store 上
  const store = reactive({}); // store就是一个响应式对象而已

  const initialState = pinia.state.value[id] // 对于 setup api 没有初始化过状态

  if (!initialState && !isOption) { // setup api
    pinia.state.value[id] = {}
  }

  // 父亲可以停止所有
  const setupStore = pinia._e.run(() => {
    scope = effectScope(); // 自己可以停止自己
    return scope.run(() => setup());
  });

  function wrapAction(name, action) {
    return function () {
      let ret = action.apply(store, arguments);

      // action 执行后可能是 promise
      // todo ...

      return ret;
    };
  }

  for (let key in setupStore) {
    const prop = setupStore[key];
    if (typeof prop === "function") {
      // 这时是一个 action
      // 对 actions 中 this 和 后续的逻辑进行处理，函数劫持
      setupStore[key] = wrapAction(key, prop);
    }

    // 如果看这个值是不是状态
    // computed 也是 ref
    if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
      if (!isOption) {
        pinia.state.value[id][key] = prop
      }
    }
  }

  // pinia._e.stop(); // 停止全部
  // scope.stop() 只停止自己
  console.log(pinia.state.value)
  pinia._s.set(id, store); // 将 store 和 id 映射起来
  Object.assign(store, setupStore);
  return store;
}

function createOptionsStore(id, options, pinia) {
  const { state, actions, getters } = options;

  function setup() {
    // 这里面会对用户传递的 state，actIons getters 做处理
    const localState = (pinia.state.value[id] = state ? state() : {});

    return Object.assign(
      localState, // 用户的状态
      actions, // 用户的动作
      Object.keys(getters || {}).reduce((memo, name) => {
        memo[name] = computed(() => {
          let store = pinia._s.get(id);
          return getters[name].call(store);
        });
        return memo;
      }, {})
    );
  }

  return createSetupStore(id, setup, pinia, true);
}

export function defineStore(idOrOptions, setup) {
  let id;
  let options;

  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  // 可能 setup 是一个函数，这个稍后处理
  const isSetupStore = typeof setup === "function";

  function useStore() {
    // 在这里我们拿到的 store 应该是同一个
    let instance = getCurrentInstance();
    const pinia = instance && inject(piniaSymbol);
    // console.log(pinia);

    if (!pinia._s.has(id)) {
      // 第一次 useStore
      if (isSetupStore) {
        createSetupStore(id, setup, pinia);
      } else {
        // 如果是第一次 则创建映射关系
        createOptionsStore(id, options, pinia);
      }
    }
    // 后续通过 id 获取对应的 store 返回
    const store = pinia._s.get(id);
    return store;
  }

  return useStore; // 用户最终拿到是这个 store
}
