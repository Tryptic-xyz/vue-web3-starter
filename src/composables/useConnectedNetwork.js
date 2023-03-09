import { reactive, toRefs } from "vue";

const networkMap = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
};

const network = reactive({
  id: null,
  name: "",
});

export function useConnectedNetwork() {
  const getNetwork = async () => {
    const id = await window.ethereum.request({ method: "eth_chainId" });
    network.id = parseInt(id);
    network.name = networkMap[network.id];
  };

  window.ethereum.on("chainChanged", getNetwork);

  if (!network.id) {
    getNetwork();
  }

  return {
    ...toRefs(network),
  };
}
