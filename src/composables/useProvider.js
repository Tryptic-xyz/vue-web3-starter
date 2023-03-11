import detectEthereumProvider from "@metamask/detect-provider";
import { ref, watch } from "vue";

import { useConnectedNetwork } from "./useConnectedNetwork";

const providers = {
  "eth-mainnet":
    "https://eth-mainnet.g.alchemy.com/v2/_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi",
  "eth-goerli":
    "https://eth-goerli.g.alchemy.com/v2/D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4",
};

const error = ref(false);
// const provider = ref(null);
const hasProvider = ref(false);
const hasInit = ref(false);
const { network, getNetwork, onNetworkChanged } = useConnectedNetwork();

const isInitializing = ref(false);

export const useProvider = () => {
  (async () => {
    if (!hasProvider.value && !hasInit.value && !isInitializing.value) {
      isInitializing.value = true;
      hasProvider.value = await detectEthereumProvider();

      if (hasProvider.value) {
        const { name } = await getNetwork();
        await getProvider(name);
        // window.pp = providerr.value;
        // provider.value = window.AlchemyWeb3.createAlchemyWeb3(
        //   providers[network.name]
        // );
        hasInit.value = true;
      } else {
        error.value = "Please visit this website from a web3 enabled browser.";
      }
      isInitializing.value = false;
    }
  })();

  onNetworkChanged((prevNetworkName, networkName) => {
    if (prevNetworkName && networkName) {
      provider.value = window.AlchemyWeb3.createAlchemyWeb3(
        providers[networkName]
      );
      // if (prevNetworkName !== networkName) {
      // }
    }
  });

  // watch(
  //   () => p.value,
  //   () => {
  //     console.log(p.value, "in use provider");
  //   }
  // );

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
