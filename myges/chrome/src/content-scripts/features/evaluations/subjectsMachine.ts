import { assign, setup } from "xstate";

export type Subject = {
  id: number;
  semester: number;
  name: string;
  grade: string;
  session: string;
  students: number;
};
type Context = {
  selectedSubject?: number;
  subjects: Subject[];
};
export const subjectsMachine = setup({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAqBVAIgUQHKoH1sA1AQQBl1TUBJAeV2QDowBbABwBcBPAYmWzlsAYUIBxAEqkcAbQAMAXUSh2Ae1gBLThtUA7ZSAAeiAIwA2E0wBMckwGYAHAHYrZgJxnHTswBoQ3RAdLOQAWAFZ7MLCQtxCzOTk7AF8Uv11VCDgDNCw8QhIKKloGZAM1TW09A2MEAFpff0R6pgSEkycQuSsOsO83VJAcnHwiMkpqekYWDh4y9S0dfSQjRBCrPwCEIOs5MzCHNxNYx3CrAaG80cKJkqYoACcAQ0zkMAAbMABjTkg5isXqog7I5rGErA4Qu1OlC7GENoFLDY9gcjiETmEUikgA */
  types: {
    context: {} as Context,
    events: {} as
      | { type: "SET_SUBJECTS"; subjects: Subject[] }
      | { type: "SELECT_SUBJECT"; subjectId: number },
  },
  actions: {
    selectSubject: assign({
      selectedSubject: ({ event, context }) =>
        event.type === "SELECT_SUBJECT"
          ? event.subjectId
          : context.selectedSubject,
    }),
    setSubjects: assign({
      subjects: ({ event, context }) =>
        event.type === "SET_SUBJECTS"
          ? event.subjects
          : context.subjects,
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGUCuAjAVmAxgF1gFkBDHACwEsA7MAOlg231mTDwGJkBRAGS4GEAKgH1kAVQBCAKQGCA2gAYAuolAAHAPawKeChqqqQAD0QAWABy1TARgBst83YDsAVicBma6acAaEAE9EAFprD1oFc3colwAmU3cna3cATnMAXwy-Kg0IOEM0LFwCEnJqMENNbV19QxMEENNTP0D6mNtrWhcFbqTkmKcnPqdMkAKmYtJKGnpGIpY2Cq0dPQMkY2Dk22bg0NNaKKjTNutzWPNTWxGxuZKpugZC-FYAGyLIRaqV2sQYl3dw7oKawKWwKTy2FwXbb1Xb7A5HdqnGLnS4ZNJAA */
  id: "SubjectsMachine",

  context: { subjects: [], selectedSubject: undefined },

  states: {
    subjectsSet: {
      on: {
        SELECT_SUBJECT: "subjectSelected"
      }
    },
    subjectSelected: {}
  },

  initial: "subjectsSet"
});
