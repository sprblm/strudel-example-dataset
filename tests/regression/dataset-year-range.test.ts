import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PENGUIN_YEARS } from '@/types/penguin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.resolve(
  __dirname,
  '../../public/data/penguins.json'
);

const qaNotePath = path.resolve(
  __dirname,
  '../../.agents/qa/assessments/6.1.extended-dataset-transformations-20251018.md'
);

const sortedCanonicalYears = [...PENGUIN_YEARS].sort((a, b) => a - b);

describe('extended dataset ingestion regression guardrails', () => {
  it('keeps dataset year range aligned with penguin type constants', async () => {
    const raw = await fs.readFile(datasetPath, 'utf-8');
    const data = JSON.parse(raw) as Array<{ year: number }>;
    const years = Array.from(
      new Set(
        data
          .map((item) => Math.trunc(item.year))
          .filter((year) => Number.isFinite(year))
      )
    ).sort((a, b) => a - b);

    expect(years).toEqual(sortedCanonicalYears);
  });

  it('documents current dataset span for QA awareness', async () => {
    const note = await fs.readFile(qaNotePath, 'utf-8');
    const minYear = sortedCanonicalYears[0];
    const maxYear = sortedCanonicalYears[sortedCanonicalYears.length - 1];
    const expectedPhrase = `Dataset currently spans ${minYear}\u2013${maxYear}.`;

    expect(note).toContain(expectedPhrase);
  });
});
