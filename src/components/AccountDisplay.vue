<template>
  <div
    class="inline-flex items-center p-1 pr-3 leading-none bg-black border-2 account border-gold-dark rounded-xl drop-shadow-sm"
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

defineProps({
  avatar: String,
  accountTruncated: String,
});

const { displayName } = useENS();
</script>

<style lang="scss" scoped></style>
