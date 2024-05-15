import { stringEquals } from "@/common/strings";
import { isDefined } from "@/common/typeGuards";
import { CSV, StudentNote } from "@/content-scripts/features/evaluations/csv";
import { usePreferences } from "@/content-scripts/preferences/usePreferences";
import { useCallback, useState } from "react";
import {
  queryFirstnameSpan,
  queryLastnameSpan,
} from "@/content-scripts/features/evaluations/queries";

export function useEvaluationPreferences() {
  const [pref, setPref] = usePreferences();
  return [
    pref.evaluationsHelperConfirmed,
    (evaluationsHelperConfirmed: boolean) =>
      setPref({ ...pref, evaluationsHelperConfirmed }),
  ] as const;
}
interface CSVDomMerge {
  lastnameSpan: HTMLSpanElement;
  firstnameSpan: HTMLSpanElement;
  csvRow: StudentNote;
}

export function useMergeStudentCsvDOM() {
  const [csvDomMerge, setCSVDomMerge] = useState<CSVDomMerge[]>([]);
  const updateCsvDomMerge = useCallback(
    (studentRows: HTMLTableRowElement[], csv?: CSV) => {
      setCSVDomMerge(
        studentRows
          .map((row) => {
            const lastnameSpan = queryLastnameSpan(row);
            const firstnameSpan = queryFirstnameSpan(row);
            const lastname = lastnameSpan?.firstChild?.textContent;
            const csvRow = csv?.find(
              (csvRow) =>
                stringEquals(lastname, csvRow.lastname) &&
                stringEquals(
                  firstnameSpan?.firstChild?.textContent,
                  csvRow.firstname,
                ),
            );
            if (lastnameSpan?.firstChild?.nodeName === "#text") {
              const textSpan = document.createElement("span");
              textSpan.className = "text-truncate";
              textSpan.textContent = lastname ?? null;
              lastnameSpan.replaceChild(textSpan, lastnameSpan?.firstChild);
            }
            if (!lastnameSpan || !firstnameSpan || !csvRow) {
              return;
            }
            lastnameSpan.classList.add(
              "d-flex",
              "justify-content-between",
              "align-items-center",
            );
            return { lastnameSpan, firstnameSpan, csvRow };
          })
          .filter(isDefined),
      );
    },
    [],
  );
  return { csvDomMerge, updateCsvDomMerge };
}
