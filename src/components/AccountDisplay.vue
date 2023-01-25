<template>
  <div
    class="inline-flex items-center p-1 pr-3 leading-none bg-black border-2 border-gold-dark rounded-xl drop-shadow-sm"
    v-show="ensInit"
  >
    <img
      v-if="avatar"
      class="w-8 h-8 mr-2 rounded-full"
      :src="avatar"
      alt=""
      srcset=""
    />
    <span class="text-sm font-bold text-yellow">
      {{ displayName || accountTruncated }}
    </span>
  </div>
</template>

<script setup>
import { useENS } from "../composables/useENS";

const { displayName, hasInit: ensInit } = useENS();

defineProps({
  avatar: String,
  accountTruncated: String,
});
</script>

<style lang="scss" scoped></style>
