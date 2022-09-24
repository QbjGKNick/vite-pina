<script setup>
import { useCounterStore1 } from "./stores/counter1";
import { useCounterStore2 } from "./stores/counter2";
import { storeToRefs } from "@/pinia/storeToRefs";
const store1 = useCounterStore1();
const { increment } = useCounterStore1();
const handleClick1 = () => {
  // store1.increment(3);
  increment(3);
  // store1.$patch((state) => {
  //   state.count = 2000;
  // });
  // store1.$state = { count: 2000 };
};

const handleReset1 = () => {
  store1.$reset();
};

const store2 = useCounterStore2();
const handleClick2 = () => {
  store2.increment();
};
store2.$subscribe(function (storeInfo, state) {
  // 状态
  console.log(storeInfo, state);
});
store2.$onAction(function ({ after, onError }) {
  // 方法
  console.log("action running", store2.count);
  after(() => {
    console.log("action after", store2.count);
  });

  onError((err) => {
    console.log("error", err);
  });
});

const handleDispose = () => {
  store1.$dispose(); // scope.run 收集 effect 的   scope.stop 是停止 effect
};

const handleDisposeAll = () => {
  // store1._p._e.stop() // 我们可以终止所有的 effect，但是很遗憾，pinia 没有提供这个方法
};

// 我们用 pinia 解构 store 不要用 toRefs 要使用 storeToRefs 可以跳过函数的处理
const { count, double } = storeToRefs(store1); // toRefs 的原理 为什么不用 toRefs
</script>

<template>
  --------------options---------------------- <br />
  {{ count }} /
  {{ double }}
  <button @click="handleClick1">修改状态</button>
  <button @click="handleReset1">重置状态</button>

  <button @click="handleDispose">取消响应式</button>
  <hr color="red" />

  --------------setup---------------------- <br />
  {{ store2.count }} /
  {{ store2.double }}
  <button @click="handleClick2">修改状态</button>
  <button @click="handleDisposeAll">取消全部响应式</button>
</template>

<style scoped></style>
