import { assign, setup } from "xstate";

export interface Subject {
  semester: number;
  name: string;
  grade: string;
  session: string;
  students: number;
}
export type Subjects = Record<string, Subject>;
export interface StudentNotes {
  firstname: string;
  lastname: string;
  continuousControls: (number | undefined)[];
  exam?: number;
}
export type StudentsNotes = Record<string, StudentNotes[]>;

interface Context {
  subjects: Subjects;
  notes: StudentsNotes;
  selectedSubject?: string;
}
export const evaluationsMachine = setup({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAqBVAIgUQHKoH1sA1AQQBl1TUBJAeV2QDowBbABwBcBPAYmWzlsAYUIBxAEqkcAbQAMAXUSh2Ae1gBLThtUA7ZSAAeiAIwA2E0wBMckwGYAHAHYrZgJxnHTswBoQ3RAdLOQAWAFZ7MLCQtxCzOTk7AF8Uv11VCDgDNCw8QhIKKloGZAM1TW09A2MEAFpff0R6pgSEkycQuSsOsO83VJAcnHwiMkpqekYWDh4y9S0dfSQjRBCrPwCEIOs5MzCHNxNYx3CrAaG80cKJkqYoACcAQ0zkMAAbMABjTkg5isXqog7I5rGErA4Qu1OlC7GENoFLDY9gcjiETmEUikgA */
  types: {
    context: {} as Context,
    events: {} as
      | { type: "INIT_SUBJECTS"; subjects: Subjects }
      | { type: "SELECT_SUBJECT"; subjectId: string }
      | { type: "INIT_NOTES"; notes: StudentNotes[] },
  },
  guards: {
    areDifferentSubjects: ({ context, event }) => {
      return (
        event.type === "INIT_SUBJECTS" &&
        Object.keys(event.subjects).some(
          (id) => context.subjects[id] === undefined,
        )
      );
    },
    subjectExists: ({ context, event }) =>
      event.type === "SELECT_SUBJECT"
        ? !!context.subjects[event.subjectId]
        : true,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFEBuBDANgV3QFwEsB7AO1gFl0BjACwJLAGIBlZAGWQGEAVAfWYCqAIQBSXbgG0ADAF1EoAA5FYBQqXkgAHogCMegJwA6ABzGALPqkBmHcZ0A2K2fsAaEAE9E9owHYArP7Wfn5WNjY+AL4RbmhYuGpklLT0TACSAHKpfOkA8tzIzNJySCBKKgka2ggOeiZ6VgBMVlJm5jpmOm6eCN6G-oFWwaE64VExGDj4xInUdAyMGVn8wmI8hbIaZarTlYh++jqGDlK2jXbGUn5de35HUhdOxn41zmZR0SAkRBBwGrGTCQosxSm2U23UJSqfjMViO9hOxjOtku1wQAFobIZ9FYfDopPpgqZHj5Ih9-vFpkDkgxDLBsAAjABWYCoeFgqRI2ywBAAXpBQeUdpDEJZDsZHA0-A0Gk8HKFUb1+lL9OL-FZsX4xiByVNSFS5mBaQzmazmGBMCy8PySlsKsLqmYGkYTj59PC7DibA0Fb4AsrVSFsfYtTrAUkDYYvlb2ZzCNy+RABeCSLtqgcpH0QlZ7OY7D4zD4fZn-E6A+rs+8IkA */
  id: "EvaluationsMachine",

  context: {
    selectedSubject: undefined,
    subjects: {},
    notes: {},
  },

  states: {
    subjectsInitialized: {},
    subjectSelected: {},
    notesInitialized: {},
  },
  initial: "subjectsInitialized",
  on: {
    SELECT_SUBJECT: {
      actions: assign({ selectedSubject: ({ event }) => event.subjectId }),
      target: ".subjectSelected",
    },

    INIT_NOTES: {
      actions: assign({
        notes: ({ event, context }) => ({
          ...context.notes,
          [context.selectedSubject!]: event.notes,
        }),
      }),
      target: ".notesInitialized",
    },

    INIT_SUBJECTS: {
      actions: assign({
        subjects: ({ event, context }) => ({
          ...context.subjects,
          ...event.subjects,
        }),
      }),
      target: ".subjectsInitialized",
    },
  },
});
