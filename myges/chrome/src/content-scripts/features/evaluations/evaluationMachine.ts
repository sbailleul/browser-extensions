import { assign, setup } from "xstate";

export type Subject = {
  id: number;
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
  exam?: number;
};
type Context = {
  selectedSubject?: number;
  subjects: Subject[];
  studentNotes?: StudentNotes[];
};
export const studentEvaluationsMachine = setup({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAqBVAIgUQHKoH1sA1AQQBl1TUBJAeV2QDowBbABwBcBPAYmWzlsAYUIBxAEqkcAbQAMAXUSh2Ae1gBLThtUA7ZSAAeiAIwA2E0wBMckwGYAHAHYrZgJxnHTswBoQ3RAdLOQAWAFZ7MLCQtxCzOTk7AF8Uv11VCDgDNCw8QhIKKloGZAM1TW09A2MEAFpff0R6pgSEkycQuSsOsO83VJAcnHwiMkpqekYWDh4y9S0dfSQjRBCrPwCEIOs5MzCHNxNYx3CrAaG80cKJkqYoACcAQ0zkMAAbMABjTkg5isXqog7I5rGErA4Qu1OlC7GENoFLDY9gcjiETmEUikgA */
  types: {
    context: {} as Context,
    events: {} as
      | { type: "SET_SUBJECTS"; subjects: Subject[] }
      | { type: "SELECT_SUBJECT"; subjectId: number }
      | { type: "SET_STUDENTS_NOTES"; studentsNotes: StudentNotes[] },
  },
  actions: {
    selectSubject: assign({
      selectedSubject: ({ event, context }) =>
        event.type === "SELECT_SUBJECT"
          ? event.subjectId
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
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAuBXCYB2qCiAbgIYA26RqAlgPbawCyRAxgBaXZgB0YAtgA6oAngGJkeACoB9ZAFUAQgCk8AYXHIA2gAYAuolB9qsSlVp6QAD0QBGG5ysAOKwBYATJoCsmlwGZ7LlwDsADQggogAtDbunN4AbN5O7rGaTvYBsU4eAL5ZIWiYOPjEZBQ0dIys7Fyw6ABGAFZgTKiwyGConNjUyHWNzW0kTaiQongAMipSsoqTWrpIIAZGJthmlgjuTgCcnC6uNlaxW0ke3iFhCOEu9ruaW3HeVu72iZr2sTl5GFi4hKTkKwYzDYHE4NQaQ1a7TBvSGAyGkE63W+hShqFGU3EMgAIngAHJqSR4gDy4jwGh0ZiWxjKa0Qm1inE2W00AW8mg5mieVnO1kCnC2T3s7kCW1iDj27hyuRAXSw8AW+R+RX+pVoQMqHCphhppgW63CASsdgCIpcsWeLi2TgCmlivMubhcAvs9hZyS813sXk+ICVhT+JUBFRBXF4Agu+h1Kzpju8JrNFr81ttFodkSenFtVi2x2eni2jg+Mv9v2KALKGtDMIhzTR2uWtP1iGuTjsd29AWObqOPNCESiAqc3lN7jHdwCiW8vtLKqDlZDVRrfRabQ6XR6tdQ8OakAbutWzYQ3nc8ZtVmu93c6W83i26atnESTiFsVTiStLhnKLLquDwKXcEVzRZc4TAQZdwgfcYyPW9nSsDtWW7MVBQdTI7EcbYENceInDfYsvgKX953VRdQSAyE11A-pwIRCAkVnesFmpGDQHWXxNHbQskOeFC+wuC9GTfBDr2uO9XR9EsfznCtSIA8jYTrKiKJoiDhno2BpKYqNGz1NjEC7Z1b3eVkLySO9gn7BBBM4YSPFdWJPwQrZpSyIA */
  id: "StudentEvaluationsMachine",

  context: { selectedSubject: undefined },

  states: {
    subjectSelected: {
      entry: ["selectSubject"]
    },

    subjectsSet: {
      states: {
        noSubjectSelected: {
          on: {
            SELECT_SUBJECT: "subjectSelected"
          }
        },

        subjectSelected: {
          states: {
            noStudentsSet: {
              on: {
                SET_STUDENTS_NOTES: "studentsSet"
              }
            },

            studentsSet: {}
          },

          initial: "noStudentsSet"
        }
      },

      initial: "noSubjectSelected"
    }
  }
});
