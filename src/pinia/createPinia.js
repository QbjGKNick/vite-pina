// 存放的是 createPinia API
import { ref, effectScope } from "vue";
import { piniaSymbol } from "./rootStore";

export let activePinia; // 全局变量
export const setActivePinia = (pinia) => (activePinia = pinia);

export function createPinia() {
  const scope = effectScope();
  const state = scope.run(() => ref({})); // 用来存储每个 store 的 state 的
  // scope.stop() 可以通过一个方法全部停止响应式

  // 状态里面 可能会存放 计算属性，computed
  const _p = [];
  const pinia = {
    use(plugin) {
      _p.push(plugin);
      return this;
    },
    _p,
    _s: new Map(), // 这里用这个 map 来存放所有的 store { counter1 -> store, counter2 -> store}
    _e: scope,
    install(app) {
      // 对于 pinia 而言，我们希望让它去管理所有的 store
      // pinia 要去收集所有 store 的信息，过一会想卸载 store
      // console.log(app);
      setActivePinia(pinia);
      // 如何让所有的 store 都能获取到这个 pinia 对象
      app.provide(piniaSymbol, pinia); // 所有组件都可以通过 app.inject(piniaSymbol)

      // this.$pinia
      app.config.globalProperties.$pinia = pinia; // 让 vue2 的组件实例也可以共享
    },
    state,
  };
  return pinia;
}

// 目前我们的 pinia 可以在组件中使用

// createPinia()，默认是一个插件具备一个 install 方法
// _s 用来存储 id-> store
// state 用来存储所有状态的
// _e 用来停止所有状态的
