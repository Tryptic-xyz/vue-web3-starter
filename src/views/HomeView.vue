<script setup>
import NumberCounter from "../components/NumberCounter.vue";
import LoadingButton from "../components/LoadingButton.vue";
// import { useTestContract } from "../composables/useTestContract";
import { useWallet } from "../composables/useWallet";
// import { showTxToast } from "../utils/ToastComponents";
import { useTest } from "../composables/useTest";
const { testTx } = useTest();

const m = async (q) => {
  testTx();
  // const tx = await mintObservers(q);
  // console.log(tx);
  // showTxToast(tx);
  // const s = await getSigner();
  // console.log(s);
};
</script>

<template>
  <main>
    <div class="flex items-center justify-center">
      <NumberCounter />
    </div>

    <LoadingButton
      :loading="txPending"
      @click="() => m('1')"
      btnText="click me"
    />
  </main>
</template>
