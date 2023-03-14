//TODO maybe move this into useethersprovider?

import { reactive, watch } from "vue";

const networkMap = {
  1: "homestead",
  5: "goerli",
};

const etherscanMap = {
  mainnet: "https://etherscan.io/tx/",
  goerli: "https://goerli.etherscan.io/tx/",
};
const network = reactive({
  id: null,
  name: "",
  etherscanTxUrl: "",
});

export function useConnectedNetwork() {
  const getNetwork = async () => {
    const id = await window.ethereum.request({ method: "eth_chainId" });
    network.id = parseInt(id);
    network.name = networkMap[network.id];
    network.etherscanTxUrl = etherscanMap[network.name];
    return network;
  };

  const onNetworkChanged = (onChange) => {
    watch(
      () => network.name,
      (curr, prev) => {
        // prevent infinite reload cycle
        if (prev) {
          onChange(network);
        }
      }
    );
  };

  // prevent errors on non web3 browsers
  if (window.ethereum) {
    getNetwork();
    window.ethereum.on("chainChanged", getNetwork);
  }

  onNetworkChanged(() => {
    window.location.reload();
  });

  return {
    network,
    getNetwork,
    onNetworkChanged,
  };
}
