import { useProvider } from "./useProvider";
import camelCase from "camelcase";

export const useContract = ({ address, abi, network, expanded }) => {
  const { provider, goerliProvider } = useProvider();
  let contract;

  if (network === "mainnet" || !network) {
    contract = new provider.value.eth.Contract(abi, address);
  } else if (network === "goerli") {
    contract = new goerliProvider.value.eth.Contract(abi, address);
  }

  const readContract = async (method, args = []) => {
    const res = await contract.methods[method](...args).call();
    return res;
  };

  const batchReadContract = async (methods) => {
    const results = {};

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
    return contract.methods[method](...args).send({
      from,
      value,
    });
  };

  if (!expanded) {
    return { ...contract.methods };
  }

  return {
    methods: contract.methods,
    readContract,
    writeContract,
    batchReadContract,
  };
};
