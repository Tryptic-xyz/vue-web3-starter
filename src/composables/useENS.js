import { ref, watchEffect, watch } from "vue";
import { useContract } from "./useContract";
import { useWallet } from "./useWallet";
import { useProvider } from "./useProvider";

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

export const useENS = () => {
  const { account } = useWallet();
  const { hasProvider } = useProvider();

  const initContract = () => {
    const methods = useContract({ address: ENS_ADDRESS, abi: ENS_ABI });
    getNames = methods.getNames;
  };

  const getDisplayName = async (accounts) => {
    try {
      const res = await getNames(accounts).call();
      setDisplayName(res[0]);
    } catch (err) {
      console.log(err);
    }
    hasInit.value = true;
  };

  const setDisplayName = (name) => {
    displayName.value = name;
  };

  // TODO maybe return an async function that returns a promise that resolves when provider is ready
  watch(
    hasProvider,
    () => {
      if (hasProvider.value) {
        initContract();
      }
    },
    { immediate: true }
  );

  watchEffect(() => {
    if (account.value) {
      getDisplayName([account.value]);
    } else if (!account.value) {
      hasInit.value = false;
      setDisplayName(false);
    }
  });

  return { displayName, getDisplayName, hasInit };
};
