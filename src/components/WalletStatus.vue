<!--ex usage
<WalletStatus>
  <template #connected="{ accountTruncated }">
    <AccountDisplay :accountTruncated="accountTruncated" />
  </template>
  <template #disconnected>
    <ConnectWalletButton />
  </template>
</WalletStatus> -->
<script setup>
import { useWallet } from "../composables/useWallet";
const { account, hasInit, accountTruncated, onAccountConnected } = useWallet();
</script>

<template>
  <div v-if="account && hasInit">
    <slot
      :account="account"
      :accountTruncated="accountTruncated"
      :onAccountConnected="onAccountConnected"
      :signMessage="signMessage"
      name="connected"
    />
  </div>
  <div v-if="hasInit && !account">
    <slot name="disconnected" />
  </div>
</template>

<style scoped></style>
