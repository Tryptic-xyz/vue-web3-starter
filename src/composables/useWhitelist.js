import { watchEffect, ref } from "vue";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "@ethersproject/keccak256";
import { useWallet } from "./useWallet";

export const useWhitelist = (whitelist) => {
  let root = null;
  let proof = ref();
  const isWhitelisted = ref(false);
  const hasInit = ref(false);
  const { account } = useWallet();
  const leafNodes = whitelist.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  watchEffect(() => {
    if (account.value) {
      root = merkleTree.getRoot().toString("hex");
      proof.value = merkleTree.getHexProof(keccak256(account.value));
      isWhitelisted.value = !!proof.value.length;
      hasInit.value = true;
    } else {
      isWhitelisted.value = false;
      hasInit.value = false;
    }
  });

  return {
    root,
    proof,
    hasInit,
    isWhitelisted,
  };
};
