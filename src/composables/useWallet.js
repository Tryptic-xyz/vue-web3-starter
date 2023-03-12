import { ref, computed, watch } from "vue";
import { useEthersProvider } from "./useEthersProvider";
import { useValueWatcher } from "./useValueWatcher";

const account = ref(null);
const listeningToEvents = ref(false);
const hasInit = ref(false);
const error = ref(false);

export function useWallet() {
  const { onProviderInit, getProviders } = useEthersProvider();
  const [onAccountConnected, onAccountDisconnected] = useValueWatcher(account);

  const setAccount = (address) => {
    account.value = address ? address.toLocaleLowerCase() : address;
  };

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

  const listenToEvents = () => {
    if (listeningToEvents.value) {
      return;
    }

    window.ethereum.on("accountsChanged", async (accts) => {
      if (accts.length) {
        setAccount(accts[0].address);
      } else {
        setAccount(false);
      }
    });

    window.ethereum.on("disconnected", () => {
      console.log("disconnected");
      setAccount(null);
    });

    listeningToEvents.value = true;
  };

  const initWallet = async () => {
    const { browserProvider } = getProviders();
    const accts = await browserProvider.listAccounts();

    if (accts.length) {
      setAccount(accts[0].address);
    }

    listenToEvents();
    hasInit.value = true;
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

  const getSigner = async () => {
    if (account.value) {
      const { browserProvider } = getProviders();
      return await browserProvider.getSigner();
    }
  };

  onProviderInit(initWallet);

  return {
    error,
    account,
    connect,
    hasInit,
    getSigner,
    accountTruncated,
    onAccountConnected,
    onAccountDisconnected,
  };
}
