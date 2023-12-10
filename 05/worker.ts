import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { AlmanacMap, SeedNumberRange } from ".";

export function findLowestLocation(seedNumberRange: SeedNumberRange, mapsByType: AlmanacMap[][]): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { seedNumberRange, mapsByType },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

if (!isMainThread) {
  const { rangeStart, length }: SeedNumberRange = workerData.seedNumberRange;
  const mapsByType: AlmanacMap[][] = workerData.mapsByType;

  let lowestLocation = Number.MAX_SAFE_INTEGER;
  for (let seedNumber = rangeStart; seedNumber < rangeStart + length; seedNumber++) {
    const location = mapSeedToLocation(seedNumber, mapsByType);
    if (location < lowestLocation) {
      lowestLocation = location;
    }
  }

  parentPort?.postMessage(lowestLocation);
}

function mapSeedToLocation(seedNumber: number, mapsByType: AlmanacMap[][]) {
  let currentNumber = seedNumber;

  mapsByType.forEach((mapsForOneType) => {
    currentNumber = mapToNextType(currentNumber, mapsForOneType);
  });

  return currentNumber;
}

function mapToNextType(currentNumber: number, mapsForOneType: AlmanacMap[]) {
  for (const { sourceNumber, destinationNumber, length } of mapsForOneType) {
    if (sourceNumber <= currentNumber && currentNumber < sourceNumber + length) {
      const delta = currentNumber - sourceNumber;
      return destinationNumber + delta;
    }
  }

  return currentNumber;
}
