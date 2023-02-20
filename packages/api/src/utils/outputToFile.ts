import fs from "fs";

export const outputToFile = (
  filePath: string,
  output: string,
  append = false
) => {
  if (process.env["NODE_ENV"] === "production") return;
  const outputFunction = append ? fs.appendFile : fs.writeFile;
  outputFunction(filePath, output, function (err) {
    if (err) return console.log(err);
    console.log(`output > ${filePath}`);
  });
};
