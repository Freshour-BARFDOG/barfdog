import { Ref, MutableRefObject } from "react";

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (instance: T | null) => void {
  return (instance: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && "current" in ref) {
        (ref as MutableRefObject<T | null>).current = instance;
      }
    });
  };
}
