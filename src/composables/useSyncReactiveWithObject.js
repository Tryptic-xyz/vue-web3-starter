export function useSyncReactiveWithObject(reactiveObj, obj) {
  Object.keys(obj).forEach((key) => {
    reactiveObj[key] = obj[key];
  });
}
