<script setup>
import { useProvider } from "../composables/useProvider";
const { hasProvider, hasInit, error } = useProvider();
</script>

<template>
  <slot v-if="hasProvider && hasInit" name="hasWeb3" />
  <slot v-if="hasInit && !hasProvider" name="noWeb3">
    {{ error }}
  </slot>
</template>

<style scoped></style>
