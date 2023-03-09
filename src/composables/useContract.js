import { ref } from "vue";
import { useProvider } from "./useProvider";
import camelCase from "camelcase";
import { useCreateTxUrl } from "./useCreateTxUrl";

// TODO accept goerli and mainnet addresses and use correct one depending on network?
export const useContract = ({ address, abi, expanded }) => {
  const hasInit = ref(false);
  const txPending = ref(false);

  const { provider, onProviderInit } = useProvider();
  let contract;

  onProviderInit(() => {
    contract = new provider.value.eth.Contract(abi, address);
    hasInit.value = true;
  });

  const readContract = async (method, args = []) => {
    // TODO only read if method exists?
    const res = await contract.methods[method](...args).call();
    return res;
  };

  const batchReadContract = async (methods) => {
    const results = {};
    //TODO return a different variable name in case same method is used multiple times
    // ex: check balance of multiple coin ids - balanceOf

    const promises = methods.map(([methodName, methodArgs = []]) =>
      readContract(methodName, methodArgs)
    );

    const completedPromises = await Promise.all(promises);

    completedPromises.forEach((result, i) => {
      results[camelCase(methods[i][0])] = result;
    });

    return results;
  };

  const writeContract = async (method, from, value, args = []) => {
    txPending.value = true;

    try {
      return await contract.methods[method](...args)
        .send({
          from,
          value,
        })
        .on("sent", console.log)
        .then((receipt) => {
          txPending.value = false;
          return { ...receipt, txURL: useCreateTxUrl(receipt.transactionHash) };
        });
    } catch (error) {
      txPending.value = false;
      if (error.code) return { error };

      return {
        ...error.receipt,
        txURL: useCreateTxUrl(error.receipt.transactionHash),
        error: {
          message: "Transaction Failed",
        },
      };
    }
  };

  if (!expanded) {
    return { ...contract?.methods };
  }

  return {
    methods: contract?.methods,
    readContract,
    writeContract,
    batchReadContract,
    hasInit,
    txPending,
  };
};
