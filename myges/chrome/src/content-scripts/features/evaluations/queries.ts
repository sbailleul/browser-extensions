export const queryNotesRows = () =>
  Array.from(
    document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereEvalTable_data']>tr",
    ),
  );

export const querySubjectsRows = () =>
  Array.from(
    document.querySelectorAll<HTMLTableRowElement>(
      "[id='contactsForm:studentEvalWidget:matiereTable_data']>tr",
    ),
  );

export const queryLastnameSpan = (row: HTMLTableRowElement) =>
  row.querySelector<HTMLSpanElement>("[id$='studentName']");
export const queryFirstnameSpan = (row: HTMLTableRowElement) =>
  row.querySelector<HTMLSpanElement>("[id$='studentFirstname']");
