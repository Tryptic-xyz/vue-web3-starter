import { useConnectedNetwork } from "./useConnectedNetwork";

export function useCreateTxUrl(txHash) {
  const { network } = useConnectedNetwork();

  return `${network.etherscanTxUrl}${txHash}`;
}
