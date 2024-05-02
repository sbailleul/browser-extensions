import { useMachine } from "@xstate/react";
import {
  StudentNotes,
  Subject,
  studentEvaluationsMachine,
} from "./evaluationMachine";
import { createBrowserInspector } from "@statelyai/inspect";
import { useCallback, useEffect } from "react";
import { isDefined } from "../../../common/typeGuards";
const { inspect } = createBrowserInspector();

const parseSubject = (subject: HTMLTableRowElement): Subject | undefined => {
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
  return {
    grade,
    name,
    id: parseInt(id),
    semester: parseInt(textSemester),
    session,
    students: parseInt(students),
  };
};

function parseStudent(
  studentRow: HTMLTableRowElement
): StudentNotes | undefined {
  const lastname = studentRow.querySelector<HTMLSpanElement>(
    "[id$='studentName']"
  )?.innerText;
  const firstname = studentRow.querySelector<HTMLSpanElement>(
    "[id$='studentFirstname']"
  )?.innerText;
  const continuousControls =
    studentRow.querySelectorAll<HTMLDivElement>("[id*='ccweb']");
  if (!lastname || !firstname) {
    return;
  }
  return {
    lastname: lastname,
    firstname: firstname,
    continuousControls: Array.from(continuousControls).map((cc) =>
      parseFloat(cc.innerText)
    ),
    exam: undefined,
  };
}
export function StudentEvaluationPage() {
  const [, send] = useMachine(studentEvaluationsMachine, { inspect });
  const evalContainer = document.getElementById("studentEvalWidget");
  const mutationCallback = useCallback(() => {
    const subjects = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereTable_data']>tr"
    );
    const studentsNotesRows = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereEvalTable_data']>tr"
    );
    Array.from(subjects).map((subjectRow) => {
      const subject = parseSubject(subjectRow)
      if(!!subject){
        subjectRow.addEventListener("click", () => {
          send({
            type: "SELECT_SUBJECT",
            subjectId: subject.id,
          });
        });
      }
      return subject
    }).filter(isDefined)
    send({ type: "SET_SUBJECTS", subjects: });
    const studentsNotes = Array.from(studentsNotesRows)
      .map(parseStudent)
      .filter(isDefined);
    send({ type: "SET_STUDENTS_NOTES", studentsNotes });
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
