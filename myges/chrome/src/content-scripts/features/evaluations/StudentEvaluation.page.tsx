import mygesIcon from "@/assets/myges-icon.png";
import { useClipboardListener } from "@/common/hooks/useClipboardListener";
import { useMutationObserver } from "@/common/hooks/useMutationObserver";
import { isDefined } from "@/common/typeGuards";
import { HelperModal } from "@/content-scripts/features/evaluations/HelperModal";
import {
  compareCsv,
  notesFormatter,
} from "@/content-scripts/features/evaluations/csv";
import { useMergeStudentCsvDOM } from "@/content-scripts/features/evaluations/hooks";
import {
  queryFirstnameSpan,
  queryLastnameSpan,
  queryNotesRows,
  querySubjectsRows,
} from "@/content-scripts/features/evaluations/queries";
import { createBrowserInspector } from "@statelyai/inspect";
import { useMachine } from "@xstate/react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  StudentNotes,
  Subject,
  evaluationsMachine,
} from "@/content-scripts/features/evaluations/evaluationsMachine";
const { inspect } = createBrowserInspector();
const parseSubject = (
  subject: HTMLTableRowElement,
): [string, Subject] | undefined => {
  const cells = subject.querySelectorAll("td");
  const textSemester = cells[0].textContent?.replace("Semestre", "");
  const name = cells[1].innerText;
  const grade = cells[2].innerText;
  const session = cells[3].innerText;
  const students = cells[4].innerText;
  const id = subject.getAttribute("data-rk");
  if (!textSemester || !name || !grade || !session || !students || !id) {
    return;
  }
  return [
    id,
    {
      grade,
      name,
      semester: parseInt(textSemester),
      session,
      students: parseInt(students),
    },
  ];
};

function parseStudent(
  studentRow: HTMLTableRowElement,
): StudentNotes | undefined {
  const lastname = queryLastnameSpan(studentRow)?.innerText;
  const firstname = queryFirstnameSpan(studentRow)?.innerText;
  const continuousControls =
    studentRow.querySelectorAll<HTMLDivElement>("[id*='ccweb']");
  if (!lastname || !firstname) {
    return;
  }
  return {
    lastname: lastname,
    firstname: firstname,
    continuousControls: Array.from(continuousControls).map((cc) =>
      cc.innerText !== "" ? parseFloat(cc.innerText) : undefined,
    ),
    exam: undefined,
  };
}
function NoteOverlay() {
  return <img src={mygesIcon} />;
}
export function StudentEvaluationPage() {
  const [state, send] = useMachine(evaluationsMachine, { inspect });
  const { csvDomMerge, updateCsvDomMerge } = useMergeStudentCsvDOM();
  const csv = useClipboardListener({
    formatter: notesFormatter,
    comparator: compareCsv,
  });
  const subjectsCallback = useCallback(() => {
    const subjects = Object.fromEntries(
      querySubjectsRows()
        .map((subjectRow) => {
          const subject = parseSubject(subjectRow);
          if (subject) {
            subjectRow.addEventListener("click", () => {
              send({
                type: "SELECT_SUBJECT",
                subjectId: subject[0],
              });
            });
          }
          return subject;
        })
        .filter(isDefined),
    );
    send({ type: "INIT_SUBJECTS", subjects });
  }, [send]);
  useEffect(subjectsCallback, [subjectsCallback]);
  const [observeSubjects] = useMutationObserver(
    document.getElementById("contactsForm:studentEvalWidget:matiereTable_data"),
    subjectsCallback,
    { childList: true, subtree: true },
  );
  const studentsCallback = useCallback(
    (mutations: MutationRecord[]) => {
      if (
        mutations.length === 1 &&
        mutations[0].addedNodes.length === 1 &&
        (mutations[0].addedNodes[0] as HTMLElement).id ===
          "contactsForm:studentEvalWidget:matiereEvalPanel"
      ) {
        const studentsNotesRows = queryNotesRows();
        const notes = studentsNotesRows.map(parseStudent).filter(isDefined);
        send({ type: "INIT_NOTES", notes });
      }
    },
    [send],
  );

  const [observeNotes] = useMutationObserver(
    document.querySelector(".mg_content"),
    studentsCallback,
    { childList: true },
  );
  observeSubjects();
  observeNotes();

  const notesInitialized = state.matches("notesInitialized");
  useEffect(() => {
    updateCsvDomMerge(queryNotesRows(), csv);
  }, [notesInitialized, csv, updateCsvDomMerge]);

  return (
    <>
      <HelperModal />
      {csvDomMerge.map(({ lastnameSpan }) =>
        createPortal(<NoteOverlay />, lastnameSpan),
      )}
    </>
  );
}
