import { ethers } from "ethers";
import { ref, watch } from "vue";
import detectEthereumProvider from "@metamask/detect-provider";
import { useConnectedNetwork } from "./useConnectedNetwork";

let browserProvider;
let alchemyProvider;

const hasInit = ref(false);
const error = ref(false);
const initListeners = [];

const networkMap = {
  "0x1": { name: "homestead", apiKey: "D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4" },
  "0x5": { name: "goerli", apiKey: "_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi" },
};

export function useEthersProvider() {
  const { onNetworkChanged } = useConnectedNetwork();

  const init = async () => {
    const hasProvider = await detectEthereumProvider();
    const network = networkMap[hasProvider.chainId];

    if (hasProvider && !hasInit.value) {
      browserProvider = new ethers.BrowserProvider(window.ethereum);
      alchemyProvider = new ethers.AlchemyProvider(
        network.name,
        network.apiKey
      );
      hasInit.value = true;
    } else {
      error.value = "Please visit this website from a web3 enabled browser.";
    }
  };

  onNetworkChanged(async (network) => {
    const id = `0x${network.id}`;

    alchemyProvider = new ethers.AlchemyProvider(
      network.name,
      networkMap[id].apiKey
    );
  });

  watch(
    () => hasInit.value,
    async () => {
      while (initListeners.length) {
        const cb = initListeners.shift();
        cb({ browserProvider, alchemyProvider });
      }
    }
  );

  // ensure fn's get called if already initialized
  const onProviderInit = (cb) => {
    if (!hasInit.value) {
      initListeners.push(cb);
    } else {
      cb({ browserProvider, alchemyProvider });
    }
  };

  init();

  return {
    getProviders() {
      return { browserProvider, alchemyProvider };
    },
    error,
    hasInit,
    onProviderInit,
  };
}
