import { useProvider } from "../composables/useProvider";

const { provider } = useProvider();

console.log(provider.value);

export const toWei = (num, unit = "ether") =>
  console.log(num) || provider.value.utils.toWei(num, unit);
