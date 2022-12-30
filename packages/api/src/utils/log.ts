export const log = (
  filePath: string,
  message: string = "",
  error?: any
): void => {
  console.log(
    `[${filePath}]: ${message}${error ? "\n" + error.toString() : ""}`
  );
};
