import { defineStore } from "@/pinia";

// defineSotre 中的 id 是独一无二的
// { counter => state, counter => state }

// options API
export const useCounterStore1 = defineStore({
  id: "counter1",
  // vuex 在前端用是对象 在 ssr 中是函数
  // vue data: {} data: () => {}
  state: () => {
    return {
      count: 0,
    };
  },
  getters: {
    double() {
      return this.count * 2;
    },
  },
  actions: {
    increment(payload) {
      this.count += payload;
    },
  },
});
