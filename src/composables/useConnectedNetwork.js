import { reactive, toRefs, watch } from "vue";

const networkMap = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
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
      async () => {
        onChange(network.name);
      }
    );
  };

  window.ethereum.on("chainChanged", getNetwork);

  return {
    network,
    getNetwork,
    onNetworkChanged,
  };
}
