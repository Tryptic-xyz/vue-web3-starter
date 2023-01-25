// TODO add sign message logic
import { computed, ref, watch } from "vue";
import { useProvider } from "./useProvider";

const account = ref(null);
const error = ref(false);
const hasInit = ref(false);
const listeningToEvents = ref(false);

export const useWallet = () => {
  const {
    error: providerError,
    hasInit: providerInit,
    provider,
    onProviderInit,
  } = useProvider();

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
    const accts = await provider.value.eth.getAccounts();

    if (accts.length) {
      setAccount(accts[0]);
    }

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
