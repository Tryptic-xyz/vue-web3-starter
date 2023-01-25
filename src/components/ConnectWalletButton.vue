<script setup>
import { useWallet } from "../composables/useWallet";

const { connect, hasInit, account, error } = useWallet();

defineProps({
  text: {
    type: String,
    default: "Login with MetaMask",
  },
});
</script>

<template>
  <div>
    <button
      v-if="!account && hasInit"
      @click="connect"
      type="button"
      class="inline-flex items-center rounded-lg border border-transparent bg-yellow-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {{ text }}
    </button>
    <div class="text-red-600" v-if="error">
      {{ error.message }}
    </div>
    <div v-if="account && hasInit">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
