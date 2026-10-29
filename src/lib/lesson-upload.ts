export function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    "size" in value &&
    Number((value as File).size) > 0 &&
    typeof (value as File).name === "string"
  );
}
