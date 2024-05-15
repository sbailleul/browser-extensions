import { useLocalStorage } from "@/common/hooks/useLocalStorage";

interface Preferences {
  evaluationsHelperConfirmed: boolean;
}
export function usePreferences() {
  return useLocalStorage<Preferences>("mygesExtensionPreferences", {
    evaluationsHelperConfirmed: false,
  });
}
