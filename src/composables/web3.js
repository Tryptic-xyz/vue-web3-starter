import { useProvider } from "../composables/useProvider";
const { provider } = useProvider();

export const toWei = (num, unit = "ether") =>
  provider.value.utils.toWei(num, unit);
