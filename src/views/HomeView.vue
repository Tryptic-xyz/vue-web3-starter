<script setup>
import AccountDisplay from "../components/AccountDisplay.vue";
import ConnectWalletButton from "../components/ConnectWalletButton.vue";
import WalletStatus from "../components/WalletStatus.vue";
</script>

<template>
  <main>
    <WalletStatus>
      <template #connected="{ accountTruncated }">
        <AccountDisplay :accountTruncated="accountTruncated" />
      </template>
      <template #disconnected>
        <ConnectWalletButton />
      </template>
    </WalletStatus>
  </main>
</template>
