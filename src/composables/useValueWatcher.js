import { watch, ref, isRef } from "vue";

// pass either a ref to watch, or a boolean value to toggle, or nothing
// is there a way i can pass a value to this function, that is eventually
// passed as a param to the watchers that isn't the value being watched?
export function useValueWatcher(value = false) {
  const initWatchers = [];
  const unInitWatchers = [];
  const initOnceWatchers = [];
  const unInitOnceWatchers = [];
  const refToWatch = isRef(value) ? value : ref(value);

  const addValueSetWatcher = (watcher, { once = false } = {}) => {
    if (refToWatch.value) {
      watcher(refToWatch.value);
    } else {
      if (once) {
        initOnceWatchers.push(watcher);
      } else {
        initWatchers.push(watcher);
      }
    }
  };

  const addValueUnsetWatcher = (watcher, { once = false } = {}) => {
    if (once) {
      unInitOnceWatchers.push(watcher);
    } else {
      unInitWatchers.push(watcher);
    }
  };

  const toggle = () => (refToWatch.value = !refToWatch.value);

  watch(
    () => refToWatch.value,
    (curr, prev) => {
      if (curr && !prev) {
        while (initOnceWatchers.length) {
          const cb = initOnceWatchers.shift();
          cb(refToWatch.value);
        }
        initWatchers.forEach((watcher) => watcher());
      } else if (!curr && prev) {
        while (unInitOnceWatchers.length) {
          const cb = unInitOnceWatchers.shift();
          cb(refToWatch.value);
        }
        unInitWatchers.forEach((watcher) => watcher());
      }
    }
  );

  return [addValueSetWatcher, addValueUnsetWatcher, toggle];
}
