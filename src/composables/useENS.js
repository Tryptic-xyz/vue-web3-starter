import { useEthersProvider } from "./useEthersProvider";
import { useConnectedNetwork } from "./useConnectedNetwork";
import { useWallet } from "./useWallet";
import { ref } from "vue";

const { getProviders } = useEthersProvider();
const { onNetworkChanged } = useConnectedNetwork();

const displayName = ref("");

export function useENS() {
  const { onAccountConnected, onAccountDisconnected, account } = useWallet();

  const lookupAddress = async () => {
    const { alchemyProvider } = getProviders();
    displayName.value = await alchemyProvider.lookupAddress(account.value);
  };

  onAccountConnected(() => {
    lookupAddress();
  });

  onAccountDisconnected(() => {
    displayName.value = "";
  });

  onNetworkChanged(() => {
    lookupAddress();
  });

  return { displayName };
}
