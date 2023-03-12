import { ethers } from "ethers";
import { ref } from "vue";
import camelCase from "camelcase";

import { useEthersProvider } from "./useEthersProvider";
import { useWallet } from "./useWallet";
import { useCreateTxUrl } from "./useCreateTxUrl";
import { useValueWatcher } from "./useValueWatcher";

const txPending = ref(false);

export function useContract({ address, abi }) {
  const { getSigner } = useWallet();
  const { getProviders, onProviderInit } = useEthersProvider();
  const [onContractInit, , toggleInit] = useValueWatcher();
  let readEthersContract, writeEthersContract;

  onProviderInit(async () => {
    const { alchemyProvider } = getProviders();
    readEthersContract = new ethers.Contract(address, abi, alchemyProvider);
    toggleInit();
  });

  const readContract = async (method, args = []) => {
    const { alchemyProvider } = getProviders();
    // prevent issues on hot-reload
    if (!readEthersContract) {
      readEthersContract = new ethers.Contract(address, abi, alchemyProvider);
    }
    return readEthersContract[method](...args, {
      from: "0x252477061094e2457Af6e5BfCBeD9aeF7F3e1386",
    });
  };

  const batchReadContract = async (methods) => {
    const results = {};

    const promises = methods.map(([methodName, methodArgs = []]) =>
      readContract(methodName?.name || methodName, methodArgs)
    );

    // use allSettled?
    // TODO handle errors here
    const completedPromises = await Promise.all(promises);

    completedPromises.forEach((result, i) => {
      // determine if we need to rename property of returned value
      const methodName =
        typeof methods[i][0] == "object"
          ? methods[i][0]?.returnAs
          : methods[i][0];

      // allow type conversion
      const castAs = typeof methods[i][0] === "object" && methods[i][0].castAs;

      if (castAs == "number") {
        results[camelCase(methodName)] = parseInt(result);
      } else if (castAs == "boolean") {
        results[camelCase(methodName)] = Boolean(parseInt(result));
      } else if (castAs == "string") {
        results[camelCase(methodName)] = result["toString"]();
      } else {
        results[camelCase(methodName)] = result;
      }
    });

    return results;
  };

  const writeContract = async (method, args = [], overrides = {}) => {
    txPending.value = true;

    // prevent issues on hot-reload
    if (!writeEthersContract) {
      const signer = await getSigner();
      writeEthersContract = new ethers.Contract(address, abi, signer);
    }

    try {
      const tx = await writeEthersContract[method](...args, overrides);
      const receipt = await tx.wait();
      txPending.value = false;
      return {
        ...receipt,
        txURL: useCreateTxUrl(receipt.hash),
      };
    } catch (error) {
      txPending.value = false;
      if (error.code === "ACTION_REJECTED") {
        const start = error.message.indexOf("info") + 5;
        const end = error.message.indexOf("code=") - 2;
        const e = JSON.parse(error.message.substring(start, end));
        throw { error: { ...e.error } };
      } else {
        throw { error: { ...error, message: "Transaction Failed!" } };
      }
    }
  };

  return {
    readContract,
    batchReadContract,
    onContractInit,
    writeContract,
    txPending,
  };
}
