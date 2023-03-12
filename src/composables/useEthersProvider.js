import { ethers } from "ethers";
import { ref } from "vue";
import detectEthereumProvider from "@metamask/detect-provider";
import { useConnectedNetwork } from "./useConnectedNetwork";
import { useValueWatcher } from "./useValueWatcher";

let browserProvider;
let alchemyProvider;

const hasInit = ref(false);
const error = ref(false);

const networkMap = {
  "0x1": { name: "homestead", apiKey: "D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4" },
  "0x5": { name: "goerli", apiKey: "_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi" },
};

export function useEthersProvider() {
  const { onNetworkChanged, network } = useConnectedNetwork();
  const [onProviderInit, , toggleProviderInit] = useValueWatcher(hasInit);
  const [onNoProvider, , toggleNoProvider] = useValueWatcher(false);

  // maybe have a no provider detected event here?
  // listen to it in directive?

  const init = async () => {
    const hasProvider = await detectEthereumProvider();
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
      error.value = "Please visit this website from a web3 enabled browser.";
      toggleNoProvider();
    }
  };

  onNetworkChanged(() => {
    if (network.name) {
      const id = `0x${network.id}`;

      alchemyProvider = new ethers.AlchemyProvider(
        network.name,
        networkMap[id].apiKey
      );
    }
  });

  init();

  return {
    getProviders() {
      return { browserProvider, alchemyProvider };
    },
    error,
    hasInit,
    onProviderInit,
    onNoProvider,
  };
}