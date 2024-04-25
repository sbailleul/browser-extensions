import { assign, createActor, setup } from "xstate";
import { createBrowserInspector } from "@statelyai/inspect";

const { inspect } = createBrowserInspector();
export type Subject = {
  semester: number;
  name: string;
  grade: string;
  session: string;
  students: number;
};
export type StudentNotes = {
  firstname: string;
  lastname: string;
  continuousControls: number[];
  exam: number;
};
type Context = {
  selectedSubject?: Subject;
  studentNotes?: StudentNotes[];
};
export const studentEvaluationsMachine = setup({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAqBVAIgUQHKoH1sA1AQQBl1TUBJAeV2QDowBbABwBcBPAYmWzlsAYUIBxAEqkcAbQAMAXUSh2Ae1gBLThtUA7ZSAAeiAIwA2E0wBMckwGYAHAHYrZgJxnHTswBoQ3RAdLOQAWAFZ7MLCQtxCzOTk7AF8Uv11VCDgDNCw8QhIKKloGZAM1TW09A2MEAFpff0R6pgSEkycQuSsOsO83VJAcnHwiMkpqekYWDh4y9S0dfSQjRBCrPwCEIOs5MzCHNxNYx3CrAaG80cKJkqYoACcAQ0zkMAAbMABjTkg5isXqog7I5rGErA4Qu1OlC7GENoFLDY9gcjiETmEUikgA */
  types: {
    context: {} as Context,
    events: {} as
      | { type: "SELECT_SUBJECT"; subject: Subject }
      | { type: "SET_STUDENTS_NOTES"; studentsNotes: StudentNotes[] },
  },
  actions: {
    selectSubject: assign({
      selectedSubject: ({ event, context }) =>
        event.type === "SELECT_SUBJECT"
          ? event.subject
          : context.selectedSubject,
    }),
    setStudentsNotes: assign({
      studentNotes: ({ event, context }) =>
        event.type === "SET_STUDENTS_NOTES"
          ? event.studentsNotes
          : context.studentNotes,
    }),
  },
}).createMachine({
  id: "StudentEvaluationnsMachine",
  initial: "empty",
  context: { selectedSubject: undefined },
  states: {
    empty: {
      on: {
        SELECT_SUBJECT: {
          target: "subjectSelected",
          actions: ["selectSubject"],
        },
      },
    },
    subjectSelected: {
      entry: ["selectSubject"],
      on: {
        SET_STUDENTS_NOTES: {
            target: 'studentsNotesRecorded',
            actions: ['setStudentsNotes']
        }
      }
    },
    studentsNotesRecorded: {
      entry: ["setStudentsNotes"],
    },
  },
});

const actor = createActor(studentEvaluationsMachine, { inspect });
actor.start();
