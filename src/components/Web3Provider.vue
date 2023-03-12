<script setup>
import { useEthersProvider } from "../composables/useEthersProvider";
const { hasInit, error } = useEthersProvider();
</script>

<template>
  <slot v-if="hasInit" name="hasWeb3" />
  <slot v-if="error" name="noWeb3">
    {{ error }}
  </slot>
</template>

<style scoped></style>
