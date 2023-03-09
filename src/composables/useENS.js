import { ref, watchEffect, watch } from "vue";
import { useContract } from "./useContract";
import { useWallet } from "./useWallet";
import { useProvider } from "./useProvider";
import { useConnectedNetwork } from "./useConnectedNetwork";

const displayName = ref("");
const hasInit = ref(false);

const ENS_ABI = [
  {
    inputs: [{ internalType: "contract ENS", name: "_ens", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address[]", name: "addresses", type: "address[]" },
    ],
    name: "getNames",
    outputs: [{ internalType: "string[]", name: "r", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
];

const ENS_ADDRESS = "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C";
let getNames = null;

const { onNetworkChanged } = useConnectedNetwork();

export const useENS = () => {
  const { onAccountConnected, account } = useWallet();
  const { network, onProviderInit } = useProvider();

  const initContract = () => {
    const methods = useContract({ address: ENS_ADDRESS, abi: ENS_ABI });
    getNames = methods.getNames;
  };

  const getDisplayName = async (accounts) => {
    if (network.name === "mainnet") {
      try {
        const res = await getNames(accounts).call();
        setDisplayName(res[0]);
      } catch (err) {
        console.log(err);
      }
    }
    hasInit.value = true;
  };

  const setDisplayName = (name) => {
    displayName.value = name;
  };

  onProviderInit(() => {
    if (network.name === "mainnet") {
      initContract();
    }
    hasInit.value = true;
  });

  onNetworkChanged((networkName) => {
    if (networkName !== "mainnet") {
      setDisplayName(false);
    } else {
      getDisplayName([account.value]);
    }
  });

  onAccountConnected(
    () => {
      getDisplayName([account.value]);
    },
    () => {
      setDisplayName(false);
    }
  );

  return { displayName, getDisplayName, hasInit };
};
