<script setup>
import { RouterView } from "vue-router";
import AccountDisplay from "./components/AccountDisplay.vue";
</script>

<template>
  <header>
    <AccountDisplay />
  </header>

  <RouterView />
</template>

<style scoped></style>
