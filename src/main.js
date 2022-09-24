import { createApp, effect, reactive, effectScope } from "vue";
import App from "./App.vue";

// import { createPinia } from "pinia";
import { createPinia } from "@/pinia";

const app = createApp(App);

// 基本上 js 中的插件都是函数

// function createPinia() {
//   return {
//     install(app) {

//     }
//   }
// }

const state = reactive({ name: "zf" });
const scope = effectScope(true); // 独立的

let s = scope.run(() => {
  effect(() => {
    console.log(state.name);
  });
  effect(() => {
    console.log(state.name);
  });
});
scope.stop();
state.name = "nick";
state.name = "tom";
app.use(createPinia()); // 插件必须要有一个 install 方法

app.mount("#app");
