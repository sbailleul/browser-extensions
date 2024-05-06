import { createBrowserInspector } from "@statelyai/inspect";
import { useMachine } from "@xstate/react";
import { useCallback, useEffect } from "react";
import { isDefined } from "../../../common/typeGuards";
import { StudentNotes } from "./studentNotesMachine";
import { Subject, evaluationsMachine } from "./evaluationsMachine";
const { inspect } = createBrowserInspector();

const parseSubject = (
  subject: HTMLTableRowElement
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
  studentRow: HTMLTableRowElement
): [string, StudentNotes] | undefined {
  const lastname = studentRow.querySelector<HTMLSpanElement>(
    "[id$='studentName']"
  )?.innerText;
  const firstname = studentRow.querySelector<HTMLSpanElement>(
    "[id$='studentFirstname']"
  )?.innerText;
  const continuousControls =
    studentRow.querySelectorAll<HTMLDivElement>("[id*='ccweb']");
  const id = studentRow.getAttribute("data-ri");
  if (!lastname || !firstname || !id) {
    return;
  }
  return [
    id,
    {
      lastname: lastname,
      firstname: firstname,
      continuousControls: Array.from(continuousControls).map((cc) =>
        parseFloat(cc.innerText)
      ),
      exam: undefined,
    },
  ];
}
export function StudentEvaluationPage() {
  const [state, send] = useMachine(evaluationsMachine, { inspect });
  const evalContainer = document.getElementById("studentEvalWidget");
  const mutationCallback = useCallback(() => {
    const subjectsRows = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereTable_data']>tr"
    );
    const studentsNotesRows = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereEvalTable_data']>tr"
    );
    const subjects = Object.fromEntries(
      Array.from(subjectsRows)
        .map((subjectRow) => {
          const subject = parseSubject(subjectRow);
          if (!!subject) {
            subjectRow.addEventListener("click", () => {
              send({
                type: "SELECT_SUBJECT",
                subjectId: subject[0],
              });
            });
          }
          return subject;
        })
        .filter(isDefined)
    );
    send({ type: "INIT_SUBJECTS", subjects });
    const notes = Object.fromEntries(
      Array.from(studentsNotesRows).map(parseStudent).filter(isDefined)
    );
    send({ type: "INIT_NOTES", notes });
  }, [send]);
  useEffect(mutationCallback);
  const studentsObserver = new MutationObserver(mutationCallback);
  if (evalContainer) {
    console.log(evalContainer);
    studentsObserver.observe(evalContainer, {
      childList: true,
      subtree: true,
    });
  }
  return <></>;
}
