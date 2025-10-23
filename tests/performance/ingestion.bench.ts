import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bench, describe } from 'vitest';
import { transformPenguinData } from '@/hooks/usePenguinData';
import type { RawPenguinData } from '@/types/penguin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.resolve(__dirname, '../../public/data/penguins.json');

let rawDataCache: RawPenguinData[] | null = null;

const loadDataset = async (): Promise<RawPenguinData[]> => {
  if (rawDataCache) {
    return rawDataCache;
  }
  const fileContents = await fs.readFile(datasetPath, 'utf-8');
  rawDataCache = JSON.parse(fileContents) as RawPenguinData[];
  return rawDataCache;
};

const datasetPromise = loadDataset();

describe('ingestion transform performance', () => {
  bench('transformPenguinData', async () => {
    const source = await datasetPromise;
    transformPenguinData(source);
  });
});
