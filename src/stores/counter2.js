// import { defineStore } from "pinia";
import { defineStore } from "@/pinia";
import { ref, computed } from "vue";

// defineSotre 中的 id 是独一无二的
// { counter => state, counter => state }

// composition API
export const useCounterStore2 = defineStore("counter2", () => {
  const count = ref(10);

  const increment = () => {
    count.value *= 2;
    // count.value++;
  };

  const double = computed(() => {
    return count.value * 2;
  });

  return {
    count,
    increment,
    double,
  };
});
