import { useCallback, useMemo } from "react";

export function useMutationObserver(
  element: Element | undefined | null,
  callback: MutationCallback,
  options?: MutationObserverInit,
) {
  const observer = useMemo(() => new MutationObserver(callback), [callback]);
  const observe = useCallback(() => {
    if (element) {
      observer.observe(element, options);
    }
  }, [observer, element, options]);
  const disconnect = useCallback(observer.disconnect, [observer]);
  return [observe, disconnect, observer] as const;
}
