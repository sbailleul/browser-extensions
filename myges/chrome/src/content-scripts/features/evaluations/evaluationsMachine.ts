import { assign, setup } from "xstate";

export interface Subject {
  semester: number;
  name: string;
  grade: string;
  session: string;
  students: number;
  notes?: StudentNotes;
}
export type Subjects = Record<string, Subject>;
export type StudentNotes = {
  firstname: string;
  lastname: string;
  continuousControls: number[];
  exam?: number;
};
export type StudentsNotes = Record<string, StudentNotes>;

interface Context {
  subjects: Subjects;
  selectedSubject?: string;
}
export const evaluationsMachine = setup({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAqBVAIgUQHKoH1sA1AQQBl1TUBJAeV2QDowBbABwBcBPAYmWzlsAYUIBxAEqkcAbQAMAXUSh2Ae1gBLThtUA7ZSAAeiAIwA2E0wBMckwGYAHAHYrZgJxnHTswBoQ3RAdLOQAWAFZ7MLCQtxCzOTk7AF8Uv11VCDgDNCw8QhIKKloGZAM1TW09A2MEAFpff0R6pgSEkycQuSsOsO83VJAcnHwiMkpqekYWDh4y9S0dfSQjRBCrPwCEIOs5MzCHNxNYx3CrAaG80cKJkqYoACcAQ0zkMAAbMABjTkg5isXqog7I5rGErA4Qu1OlC7GENoFLDY9gcjiETmEUikgA */
  types: {
    context: {} as Context,
    events: {} as
      | { type: "INIT_SUBJECTS"; subjects: Subjects }
      | { type: "SELECT_SUBJECT"; subjectId: string }
      | { type: "INIT_NOTES"; notes: StudentsNotes },
  },
  guards: {
    subjectExists: ({ context, event }) =>
      event.type === "SELECT_SUBJECT"
        ? !!context.subjects[event.subjectId]
        : true,
  },
  actions: {
    setSubjects: assign({
      subjects: ({ event, context }) =>
        event.type === "INIT_SUBJECTS"
          ? { ...context.subjects, ...event.subjects }
          : context.subjects,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFEBuBDANgV3QFwEsB7AO1gFl0BjACwJLADpZsAjAKzCr1gEkSChLAQBekAMS8AcrwAqAfQDKAVQBCAKWQBhWYoDaABgC6iUAAcisQcRKmQAD0QAOAJwvGAdhcA2AKxOPABYAJiDvA0CAGhAAT0QAWgBGAGZPZMDvZJdggw9EzMDEpwBfYui0LFxCUgpqOgZmNk5uPgEhTFEJRWQAGW0FFQ1+wxMkEAsratsxxwREgxdExmTfEINw5O9XUOi4hBdfRkSgnPCnXwNExOzS8owcfBta2nomFg4uPEUwTE+JaTk8ikAHlZMh9MY7BNrKQ7LN8olgoxgqEfCE8uknE5dogXKlsoUnCjEqtEiFkqUyiASEQIHA7BUHlNnvUwFDLDDpqBZucll4-AF0RkIjiEEkDAZGC5LskDL4LilLrlbiBGVUnpQXg13s0ePxrMIxBB2ZMbHDcZdGBcJXkUr5sh5RXipcE1udgmiIsEVWrHjVNazGh9uN9ftxICbOea5iF3IF0uEcptvH4XE78a6cu7PSEffd1f66q9GDS8HB9e1OsaxtCptHjh5DslNgcUninN4gumXWsPGcDM3O5TikA */
  id: "EvaluationsMachine",

  context: { notes: {}, subjects: {} },

  states: {
    subjectsInitialized: {
      on: {
        INIT_SUBJECTS: {
          actions: "setSubjects",
          target: "subjectsInitialized",
        },
        SELECT_SUBJECT: {
          target: "subjectSelected",
          guard: "subjectExists",
        },
      },
    },

    subjectSelected: {
      on: {
        INIT_NOTES: "notesInitialized",
      },
    },

    notesInitialized: {},
  },

  initial: "subjectsInitialized",
});
