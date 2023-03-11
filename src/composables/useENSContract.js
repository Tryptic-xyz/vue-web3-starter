import { useEthersProvider } from "../composables/useEthersProvider";
import { useConnectedNetwork } from "../composables/useConnectedNetwork";
import { useWallet } from "./useWallet";
import { ref } from "vue";

const { getProviders } = useEthersProvider();
const { onNetworkChanged } = useConnectedNetwork();

const displayName = ref("");

export function useENSContract() {
  const { alchemyProvider } = getProviders();

  const { onAccountConnected, onAccountDisconnected } = useWallet();

  const lookupAddress = async (address) => {
    displayName.value = await alchemyProvider.lookupAddress(address);
  };

  onAccountConnected((account) => {
    lookupAddress(account);
  });

  onAccountDisconnected(() => {
    displayName.value = "";
  });

  onNetworkChanged(() => {
    lookupAddress();
  });

  return { displayName };
}
