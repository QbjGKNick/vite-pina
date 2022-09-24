import { createApp } from "vue";
// import { createApp, effect, reactive, effectScope } from "vue";
import App from "./App.vue";

// import { createPinia } from "pinia";
import { createPinia } from "@/pinia";
import { useCounterStore1 } from "./stores/counter1";

const app = createApp(App);

// 基本上 js 中的插件都是函数

// function createPinia() {
//   return {
//     install(app) {

//     }
//   }
// }

// const state = reactive({ name: "zf" });
// const scope = effectScope(true); // 独立的

// let s = scope.run(() => {
//   effect(() => {
//     console.log(state.name);
//   });
//   effect(() => {
//     console.log(state.name);
//   });
// });
// scope.stop();
// state.name = "nick";
// state.name = "tom";
const pinia = createPinia();

pinia.use(function ({ store }) {
  // 插件就是一个函数，  use是用来注册插件的
  let local = localStorage.getItem(store.$id + "PINIA_STATE");
  if (local) {
    store.$state = JSON.parse(local);
  }
  store.$subscribe(({ storeId: id }, state) => {
    localStorage.setItem(id + "PINIA_STATE", JSON.stringify(state));
  });

  store.$onAction(() => {
    // 埋点
  });

  // 插件的核心就是利用 $onAction  $subscribe
});

app.use(pinia); // 插件必须要有一个 install 方法

app.mount("#app");

// 异步路由，在任何地方都可以使用 pinia
const store = useCounterStore1(); // inject 方法无法使用
console.log(store.count);
