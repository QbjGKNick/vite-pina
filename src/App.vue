<script setup>
import { useCounterStore1 } from "./stores/counter1";
import { useCounterStore2 } from "./stores/counter2";
const store1 = useCounterStore1();
const { increment } = useCounterStore1();
const handleClick1 = () => {
  // store1.increment(3);
  // increment(3);
  store1.$patch((state) => {
    state.count = 2000;
  });
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
</script>

<template>
  --------------options---------------------- <br />
  {{ store1.count }} /
  {{ store1.double }}
  <button @click="handleClick1">修改状态</button>
  <button @click="handleReset1">重置状态</button>
  <hr color="red" />

  --------------setup---------------------- <br />
  {{ store2.count }} /
  {{ store2.double }}
  <button @click="handleClick2">修改状态</button>
</template>

<style scoped></style>
