import detectEthereumProvider from "@metamask/detect-provider";
import { ref, watch } from "vue";

import { useConnectedNetwork } from "./useConnectedNetwork";

const providers = {
  mainnet:
    "https://eth-mainnet.g.alchemy.com/v2/_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi",
  goerli:
    "https://eth-goerli.g.alchemy.com/v2/D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4",
};

const error = ref(false);
const provider = ref(null);
const hasProvider = ref(false);
const hasInit = ref(false);
const { network, getNetwork, onNetworkChanged } = useConnectedNetwork();

export const useProvider = () => {
  (async () => {
    if (!hasProvider.value && !hasInit.value) {
      hasProvider.value = await detectEthereumProvider();

      if (hasProvider.value) {
        await getNetwork();
        provider.value = window.AlchemyWeb3.createAlchemyWeb3(
          providers[network.name]
        );
        hasInit.value = true;
      } else {
        error.value = "Please visit this website from a web3 enabled browser.";
      }
    }
  })();

  onNetworkChanged((networkName) => {
    provider.value = window.AlchemyWeb3.createAlchemyWeb3(
      providers[networkName]
    );
  });

  const onProviderInit = (onInit) => {
    watch(
      () => provider.value,
      async () => {
        if (provider.value) {
          onInit(provider.value);
        }
      },
      { immediate: true }
    );
  };

  return {
    hasProvider,
    onProviderInit,
    provider,
    error,
    hasInit,
    network,
  };
};
