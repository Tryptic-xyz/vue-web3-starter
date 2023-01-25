import detectEthereumProvider from "@metamask/detect-provider";
import { ref, watch } from "vue";

const goerliProviderURL =
  "https://eth-goerli.g.alchemy.com/v2/D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4";

const mainNetProviderURL =
  "https://eth-mainnet.g.alchemy.com/v2/_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi";

const error = ref(false);
const provider = ref(null);
const goerliProvider = ref(null);
const hasProvider = ref(false);
const hasInit = ref(false);

export const useProvider = () => {
  (async () => {
    if (!hasProvider.value && !hasInit.value) {
      hasProvider.value = await detectEthereumProvider();
      hasInit.value = true;

      if (hasProvider.value) {
        provider.value =
          window.AlchemyWeb3.createAlchemyWeb3(mainNetProviderURL);
        goerliProvider.value =
          window.AlchemyWeb3.createAlchemyWeb3(goerliProviderURL);
      } else {
        error.value = "Please visit this website from a web3 enabled browser.";
      }
    }
  })();

  const onProviderInit = (onInit) => {
    watch(
      () => provider.value,
      () => {
        if (provider.value) {
          onInit();
        }
      },
      { immediate: true }
    );
  };

  return {
    hasProvider,
    goerliProvider,
    onProviderInit,
    provider,
    error,
    hasInit,
  };
};
