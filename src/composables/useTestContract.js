import { useContract } from "./useContract";
import { useWallet } from "./useWallet";
import { reactive, toRefs } from "vue";
import { toWei } from "../utils/web3";
import { useConnectedNetwork } from "./useConnectedNetwork";

const abi = [
  {
    inputs: [
      { internalType: "string", name: "_uri", type: "string" },
      { internalType: "bytes32", name: "_root", type: "bytes32" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AlreadyClaimed", type: "error" },
  { inputs: [], name: "BurnExceedsMinted", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "caller", type: "address" },
      { internalType: "address", name: "guardian", type: "address" },
    ],
    name: "CallerGuardianMismatch",
    type: "error",
  },
  { inputs: [], name: "CannotTransferCommittedToken", type: "error" },
  { inputs: [], name: "InvalidGuardian", type: "error" },
  {
    inputs: [{ internalType: "bytes32[]", name: "proof", type: "bytes32[]" }],
    name: "InvalidProof",
    type: "error",
  },
  { inputs: [], name: "NotEnoughTokens", type: "error" },
  { inputs: [], name: "SaleIsPaused", type: "error" },
  { inputs: [], name: "TokenIsLocked", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "numberOfObservers", type: "uint256" },
      { internalType: "uint256", name: "numberAllowed", type: "uint256" },
    ],
    name: "TooManyOutstandingObservers",
    type: "error",
  },
  { inputs: [], name: "WrongValueSent", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addressGuarded",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "guardian",
        type: "address",
      },
    ],
    name: "GuardianAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "addressGuarded",
        type: "address",
      },
    ],
    name: "GuardianRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "value", type: "string" },
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [],
    name: "MAX_OBSERVERS_PER_COMMITTED",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_SNIPERS_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "alreadyClaimed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "alreadyMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
    ],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "accounts", type: "address[]" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
    ],
    name: "balanceOfBatch",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "burnForPurveyor",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32[]", name: "_proof", type: "bytes32[]" }],
    name: "claimSniper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "exists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "flipSaleState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "tokenOwner", type: "address" }],
    name: "guardianOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "address", name: "operator", type: "address" },
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "merkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "mintObservers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "mintSnipers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "to", type: "address" }],
    name: "mintTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numSnipersMinted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "redeemObservers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "tokenOwner", type: "address" }],
    name: "removeGuardianOf",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "saleIsActive",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "guardian", type: "address" }],
    name: "setGuardian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "_root", type: "bytes32" }],
    name: "setMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newuri", type: "string" }],
    name: "setURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "uri",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const CONTRACT_CONSTANTS = {
  sniperPriceETH: "0.5",
  observerPriceETH: "0.03",
  purveyorPriceETH: "3",
  sniperID: 0,
  purveyorID: 1,
  observerID: 2,
  committedSniperID: 10,
  committedPurveyorID: 11,
  maxSnipersSupply: 488,
  maxObserversPerCommitted: 10,
};

const account = reactive({
  network: false,
  fetching: false,
  hasMinted: null,
  hasInit: false,
  hasPurveyorPass: false,
  hasSniperPass: false,
  hasCommittedPurveyorPass: false,
  hasCommittedSniperPass: false,
  observerBalance: 0,
});

export const useTestContract = () => {
  const { batchReadContract, readContract, writeContract, txPending } =
    useContract({
      address: "0xAA8E256202067ec9c9c3C9eBA1E5ce6dd273c15C",
      abi,
      expanded: true,
    });

  const wallet = useWallet();

  const init = async (address) => {
    // prevent multiple init fn's on load
    if (account.fetching) return;

    account.fetching = true;
    account.network = useConnectedNetwork();

    account.alreadyMinted = !!parseInt(
      await batchReadContract([["alreadyMinted", [address]]])
    );

    account.hasPurveyorPass = !!parseInt(
      await readContract("balanceOf", [address, CONTRACT_CONSTANTS.purveyorID])
    );

    account.hasSniperPass = !!parseInt(
      await readContract("balanceOf", [address, CONTRACT_CONSTANTS.sniperID])
    );

    account.hasCommittedSniperPass = !!parseInt(
      await readContract("balanceOf", [
        address,
        CONTRACT_CONSTANTS.committedSniperID,
      ])
    );

    account.hasCommittedPurveyorPass = !!parseInt(
      await readContract("balanceOf", [
        address,
        CONTRACT_CONSTANTS.committedPurveyorID,
      ])
    );

    account.observerBalance = parseInt(
      await readContract("balanceOf", [address, CONTRACT_CONSTANTS.observerID])
    );

    account.fetching = false;
    account.hasInit = true;
  };

  const mintSnipers = async () => {
    const wei = toWei(CONTRACT_CONSTANTS.sniperPriceETH);
    const tx = await writeContract("mintSnipers", wallet.account.value, 1, []);

    init(wallet.account.value);

    return tx;
  };

  const mintPurveyors = async () => {
    const wei = toWei(CONTRACT_CONSTANTS.purveyorPriceETH);

    const tx = await writeContract("burnForPurveyor", wallet.account.value, 1, [
      1,
    ]);

    init(wallet.account.value);

    return tx;
  };

  const mintObservers = async (quantity = "1", onSuccess, onError) => {
    const wei = toWei(CONTRACT_CONSTANTS.observerPriceETH);

    txPending.value = true;

    const tx = await writeContract(
      "mintObservers",
      wallet.account.value,
      1 * quantity,
      [quantity],
      () => {
        init(wallet.account.value);
        onSuccess();
      },
      onError
    );

    init(wallet.account.value);

    return tx;
  };

  const redeemObservers = async (quantity, onSuccess = () => {}) => {
    const wei = toWei(CONTRACT_CONSTANTS.observerPriceETH);

    txPending.value = true;
    try {
      await writeContract(
        "redeemObservers",
        wallet.account.value,
        0,
        [quantity],
        () => {
          init(wallet.account.value);
          onSuccess();
        }
      );
    } catch (err) {
      console.log(err);
    }
    txPending.value = false;
  };

  wallet.onAccountConnected((address) => {
    init(address);
  });

  return {
    ...toRefs(account),
    txPending,
    mintSnipers,
    mintPurveyors,
    mintObservers,
    redeemObservers,
  };
};
