import { useMachine } from "@xstate/react";
import {
  StudentNotes,
  Subject,
  studentEvaluationsMachine,
} from "./evaluationMachine";

const parseSubject = (subject: HTMLTableRowElement): Subject | undefined => {
  const cells = subject.querySelectorAll("td");
  const textSemester = cells[0].textContent?.replace("Semestre", "");
  const name = cells[1].innerText;
  const grade = cells[2].innerText;
  const session = cells[3].innerText;
  const students = cells[4].innerText;
  if (!textSemester || !name || !grade || !session || !students) {
    return;
  }
  return {
    grade,
    name,
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
  const continuousControls = studentRow.querySelectorAll<HTMLSpanElement>(
    "[id*='ccweb']"
  );
  console.log({lastname, firstname, continuousControls});
  return
}
export function StudentEvaluationPage() {
  const [, send] = useMachine(studentEvaluationsMachine);
  const evalContainer = document.getElementById("studentEvalWidget");
  const studentsObserver = new MutationObserver(() => {
    const subjects = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereTable_data']>tr"
    );
    const studentsNotes = document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereEvalTable_data']>tr"
    );
    subjects.forEach((subjectRow) => {
      const subject = parseSubject(subjectRow);
      if (!subject) {
        return;
      }
      subjectRow.addEventListener("click", () => {
        send({
          type: "SELECT_SUBJECT",
          subject,
        });
      });
    });
    console.log('tata')
    studentsNotes.forEach((studentRow) => {
      parseStudent(studentRow)
    });
  });
  if (evalContainer) {
    studentsObserver.observe(evalContainer, {
      childList: true,
      subtree: true,
    });
  }
  return <></>;
}
