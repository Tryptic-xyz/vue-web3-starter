// import { Alchemy, Network } from "alchemy-sdk";
// import { ref, reactive, watch, unref } from "vue";
// import { useConnectedNetwork } from "./useConnectedNetwork";
// // Optional config object, but defaults to the API key 'demo' and Network 'eth-mainnet'.
// import { ethers } from "ethers";

// const settings = {
//   apiKey: "D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4", // Replace with your Alchemy API key.
//   network: Network.ETH_GOERLI, // Replace with your network.
// };

// const PROVIDER_SETTINGS = {
//   [Network.ETH_MAINNET]: {
//     apiKey: "_kk3D76yzBoH7SoPR-iKvpDd9cIDAqFi",
//     network: Network.ETH_MAINNET,
//   },
//   [Network.ETH_GOERLI]: {
//     apiKey: "D_wvYxbSIbPs3n7F44pv-zahs5Du-ti4",
//     network: Network.ETH_GOERLI,
//   },
// };

// const { onNetworkChanged } = useConnectedNetwork();
// const alchemy = ref(null);

// export const useAlchemy = () => {
//   const provider = ref(null);
//   const hasInit = ref(false);

//   const getProvider = async () => {
//     provider.value = await alchemy.value.config.getProvider();
//     hasInit.value = true;
//   };

//   onNetworkChanged(async (networkName) => {
//     alchemy.value = new Alchemy(PROVIDER_SETTINGS[networkName]);
//     await getProvider();
//     console.log(provider.value);
//   });

//   return {
//     alchemy,
//     provider,
//     hasInit,
//     getProvider,
//   };
// };
