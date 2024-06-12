// var fs = require("fs");
import fs from "fs";
import { parse } from "csv-parse";

// const __dirname = new URL(".", import.meta.url).pathname;

const processFile = async (fileName) => {
  const records = [];
  const parser = fs.createReadStream(fileName).pipe(
    parse({
      // CSV options if any
    })
  );
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

async function handleRecords(fileName, columnName, MathOperation) {
  const records = await processFile(fileName, columnName, MathOperation);
  let answer;
  const header = records.splice(0, 1);
  let columnIndex = header[0].indexOf(columnName);
  let values = [];
  records.forEach((val, idx) => {
    val.forEach((record, index) => {
      if (index === columnIndex) {
        values.push(record);
      }
    });
  });

  if (MathOperation === "sum") {
    answer = sumValues(values);
  } else if (MathOperation === "median") {
    answer = medianValues(values);
  } else if (MathOperation === "mean") {
    answer = meanValues(values);
  }
  return answer;
}
function sumValues(values) {
  return values.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue),
    0
  );
}
function medianValues(values) {
  values.sort((a, b) => a - b);
  if (values.length % 2 === 0) {
    const half = Math.floor(values.length / 2);
    return (parseInt(values[half]) + parseInt(values[half - 1])) / 2;
  } else {
    const half = Math.floor(values.length / 2);
    return values[half];
  }
}
function meanValues(values) {
  let sum = values.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue),
    0
  );
  let mean = sum / values.length;
  return mean;
}

console.log(
  "median",
  await handleRecords(
    "Lab Data This Week - Sheet1.csv",
    "Number of Labs",
    "median"
  )
);
console.log(
  "mean",
  await handleRecords(
    "Lab Data This Week - Sheet1.csv",
    "Number of Labs",
    "mean"
  )
);
console.log(
  "sum",
  await handleRecords(
    "Lab Data This Week - Sheet1.csv",
    "Number of Labs",
    "sum"
  )
);
