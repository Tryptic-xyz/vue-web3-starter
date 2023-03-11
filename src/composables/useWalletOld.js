import { computed, ref, watch } from "vue";
import { useProvider } from "./useProvider";
import { ethers } from "ethers";

const account = ref(null);
const error = ref(false);
const hasInit = ref(false);
const listeningToEvents = ref(false);
let provider;

export const useWallet = () => {
  const { onProviderInit } = useProvider();

  const accountTruncated = computed(() => {
    if (account.value) {
      const t = account.value.split("");
      const prefix = t.slice(0, 6).join("");
      const suffix = t.slice(t.length - 4, t.length).join("");
      return prefix + "..." + suffix;
    } else {
      return "";
    }
  });

  const setAccount = (accountToAdd) => {
    account.value = accountToAdd
      ? accountToAdd.toLocaleLowerCase()
      : accountToAdd;
  };

  const connect = async () => {
    if (!account.value) {
      try {
        await provider.getSigner();
        const accts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accts[0]);
        error.value = false;
      } catch (err) {
        error.value = err;
        console.log(err);
      }
    }
  };

  const listenToEvents = () => {
    if (listeningToEvents.value) {
      return;
    }

    window.ethereum.on("accountsChanged", async (accts) => {
      if (accts.length) {
        setAccount(accts[0]);
      } else {
        setAccount(null);
      }
    });

    window.ethereum.on("disconnected", (chainId) => {
      console.log("disconnected");
      setAccount(null);
    });

    listeningToEvents.value = true;
  };

  const getSigner = async () => {
    return await provider.getSigner();
  };

  const onAccountConnected = (
    onConnected = () => null,
    onDisconnected = () => null
  ) => {
    watch(
      () => account.value,
      () => {
        if (account.value) {
          onConnected(account.value);
        } else {
          onDisconnected(account.value);
        }
      },
      { immediate: true }
    );
  };

  onProviderInit(async () => {
    provider = new ethers.BrowserProvider(window.ethereum);
    const acctss = await provider.listAccounts();
    console.log(acctss);

    // if (accts.length) {
    //   setAccount(accts[0]);
    // }

    listenToEvents();
    hasInit.value = true;
  });

  return {
    error,
    account,
    connect,
    hasInit,
    accountTruncated,
    onAccountConnected,
  };
};

// const transaction = {
//   to: "0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd",
//   value: Utils.parseEther("0.001"),
//   gasLimit: "21000",
//   maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
//   maxFeePerGas: Utils.parseUnits("20", "gwei"),
//   nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
//   type: 2,
//   chainId: 5, // Corresponds to ETH_GOERLI
// };

// const rawTransaction = await wallet.signTransaction(transaction);
// await alchemy.transact.sendTransaction(rawTransaction);
