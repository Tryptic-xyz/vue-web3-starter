// TODO maybe we can add some sort of alert if user is on wrong network?
import { ethers } from "ethers";
import { ref } from "vue";
import detectEthereumProvider from "@metamask/detect-provider";
import { useValueWatcher } from "./useValueWatcher";

let browserProvider;
let alchemyProvider;

const error = ref(false);

const networkMap = {
  "0x1": { name: "homestead", apiKey: "D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4" },
  "0x5": { name: "goerli", apiKey: "_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi" },
};

// toggle provider detection
// can use this to show a pending state in UI?
const [
  ,
  onProviderDetectionComplete,
  toggleProviderDetectionComplete,
  hasInit,
] = useValueWatcher();

// let application know we have a provider
const [onProviderInit, , toggleProviderInit] = useValueWatcher(false);

// let application know we have do not have a provider
const [onNoProvider, , toggleNoProvider] = useValueWatcher(false);

export function useEthersProvider() {
  const init = async () => {
    const hasProvider = await detectEthereumProvider();
    toggleProviderDetectionComplete(hasProvider);

    // We have a provider so let's setup our ethers providers
    if (hasProvider && !hasInit.value) {
      const chainId = await hasProvider.request({
        method: "eth_chainId",
      });
      const network = networkMap[chainId];

      browserProvider = new ethers.BrowserProvider(window.ethereum);
      alchemyProvider = new ethers.AlchemyProvider(
        network.name,
        network.apiKey
      );
      toggleProviderInit();
    } else if (!hasInit.value && !hasProvider) {
      // No provider - browser w/o wallet or a mobile device!!
      error.value = "Please visit this website from a web3 enabled browser.";
      toggleNoProvider();
    }
  };

  const getProviders = () => ({ browserProvider, alchemyProvider });

  init();

  return {
    error,
    hasInit,
    getProviders,
    onNoProvider,
    onProviderInit,
    onProviderDetectionComplete,
  };
}
