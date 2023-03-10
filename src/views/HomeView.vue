<script setup>
import NumberCounter from "../components/NumberCounter.vue";
import LoadingButton from "../components/LoadingButton.vue";
import { useTestContract } from "../composables/useTestContract";
import { showTxToast } from "../utils/ToastComponents";

const { mintObservers, txPending } = useTestContract();

const m = async (q) => {
  const tx = await mintObservers(q);
  console.log(tx);
  showTxToast(tx);
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
