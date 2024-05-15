import { useEffect, useState } from "react";
interface Options<T> {
  predicate?: (txt: string) => boolean;
  formatter: (txt: string) => T;
  comparator?: (previousValue: T | undefined, newValue: T) => boolean;
}
export function useClipboardListener<T>({
  predicate = (txt) => !!txt,
  formatter,
  comparator,
}: Options<T>) {
  const [content, setContent] = useState<T>();
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const txt = await navigator.clipboard.readText();
        if (!!txt && predicate(txt)) {
          const formattedValue = formatter(txt);
          if (!comparator || !comparator(content, formattedValue)) {
            setContent(formattedValue);
          }
        }
      } catch (e) {
        // Don't care about this error
      }
    }, 1000);
    return () => clearInterval(id);
  }, [setContent, content, comparator, formatter, predicate]);
  return content;
}
