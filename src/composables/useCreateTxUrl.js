import { ref, watchEffect } from "vue";
import { useConnectedNetwork } from "./useConnectedNetwork";

export function useCreateTxUrl(txHash) {
  const { name } = useConnectedNetwork();
  const txURL = ref("");

  watchEffect(() => {
    if (name.value === "goerli" && txHash.value) {
      txURL.value = `https://goerli.etherscan.io/tx/${txHash.value}`;
    } else if (name.value === "mainnet" && txHash.value) {
      txURL.value = `https://etherscan.io/tx/${txHash.value}`;
    } else {
      txURL.value = "";
    }
  });

  return txURL;
}
