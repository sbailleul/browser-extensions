export interface StudentNote {
  firstname: string;
  lastname: string;
  note: number;
}
export type CSV = StudentNote[];
export function notesFormatter(txt: string): CSV {
  try {
    return txt
      .split("\n")
      .map((row) => {
        const colValues = row.split("\t");
        const note = colValues[0].split("/")[0].trim();
        return {
          note: parseFloat(note),
          lastname: colValues[1].trim(),
          firstname: colValues[2].trim(),
        };
      })
      .filter(
        ({ note, firstname, lastname }) =>
          !isNaN(note) && !!firstname && !!lastname,
      );
  } catch (e) {
    console.warn("Clipboard content is not a valid CSV");
  }
  return [];
}
export function compareCsv(csv1: CSV | undefined, csv2: CSV) {
  if (csv1?.length !== csv2.length) {
    return false;
  }
  if (csv1 === csv2) {
    return true;
  }
  const allItemsSame = csv1?.every((row1) =>
    csv2.some(
      (row2) =>
        row2.firstname === row1.firstname &&
        row1.lastname === row2.lastname &&
        row1.note === row2.note,
    ),
  );
  return allItemsSame ?? false;
}
