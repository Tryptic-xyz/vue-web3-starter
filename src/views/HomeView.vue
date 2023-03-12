<script setup>
import NumberCounter from "../components/NumberCounter.vue";
import LoadingButton from "../components/LoadingButton.vue";
import Web3Provider from "../components/Web3Provider.vue";
import { showTxToast } from "../utils/ToastComponents";
import { useTest } from "../composables/useTest";

const { testTX, txPending, observerBalance } = useTest();

const m = async (q) => {
  const tx = await testTX();
  // const tx = await mintObservers(q);
  // console.log(tx);
  showTxToast(tx);
  // const s = await getSigner();
  // console.log(s);
};
</script>

<template>
  <main class="flex flex-col items-center justify-center">
    <div class="flex items-center justify-center">
      {{ observerBalance }}
      <NumberCounter />
    </div>

    <LoadingButton
      :loading="txPending"
      @click="() => m('1')"
      btnText="click me"
    />
  </main>
</template>
