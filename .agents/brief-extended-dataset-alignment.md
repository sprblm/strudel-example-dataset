# Extended Dataset Alignment Brief – Penguins Explorer

## 1. Purpose & Context

- Align Penguins Explorer with the Kaggle **Palmer Penguins Dataset – Extended** release (3,430 observations, 2021–2025) while maintaining accessibility leadership.
- Transition narrative from “demo” to “insight delivery” so educators and researchers can surface new categorical findings (diet, life stage, health metrics).

## 2. Dataset Baseline & Integrity

- **Source file**: `public/data/penguins.json` (3,430 records; includes `diet`, `life_stage`, `health_metrics`).
- **Current ingestion**: `transformPenguinData` drops new fields and enforces 2007–2009 year range (`src/hooks/usePenguinData.ts`, `src/types/penguin.ts`).
- **Identified issues**:
  - Island name mismatch (`Torgensen` vs `Torgersen`) causing empty results when filtering (`src/components/filters/IslandFilter.tsx`).
  - Copy in UI/help modal still references the legacy 344-row dataset and 2007–2009 timeframe.

### Required Data Actions

1. Extend `Penguin` type to retain new fields and update year union to 2021–2025.
2. Preserve `diet`, `life_stage`, `health_metrics` during transformation and expose null-safe handling.
3. Normalize categorical values on ingest (e.g., map `Torgensen` → `Torgersen`, lower-case comparisons) and document assumptions.

## 3. Experience Audit

- **Strengths**: Accessible chart suite (scatter/histogram/box), data table with species/island/sex filters, share/export and live-region support.
- **Gaps vs. extended dataset**:
  - New categorical dimensions are invisible (no filters, columns, or visuals).
  - Year values collapsed to legacy range; no longitudinal controls.
  - Narrative framing (homepage, help modal) misrepresents dataset scope.

## 4. Expanded Requirements

### 4.1 Data Model & State

- Update global context to track new filters (diet, life stage, health metrics, year range).
- Cache derived groupings (diet by species, health by year) via memoization to keep interactions responsive on 3k+ rows.

### 4.2 Filtering & Controls

- Add **Diet** and **Life Stage** selectors (chip group or multi-select) with summary tags.
- Introduce **Year** range slider or discrete toggle (e.g., 2021–2025 buttons) with quick “All years” reset.
- Consider optional **Health Status** highlight toggle for charts.

### 4.3 Visualization Enhancements

- Allow numeric axis grouping by categorical fields (e.g., stacked histogram by diet, grouped box plot by life stage).
- Add longitudinal view (line/area chart showing body mass or health metrics by year and species).
- Integrate color encodings consistent with high-contrast mode and update legend accordingly.

### 4.4 Data Table Updates

- Expose new columns with toggleable visibility; include quick stats footer (count, mean, median) for selected subset.
- Ensure keyboard navigation and responsive layout remain compliant with WCAG.

### 4.5 Narrative & Insight Delivery

- Refresh homepage hero, section copy, and help modal descriptions to cite extended dataset scope and provenance.
- Add “Key Findings” panel linking to preset views (leveraging share URLs) that spotlight extended insights (e.g., diet vs. body mass, health metrics trend).
- Update README/Onboarding docs to outline new features and dataset differences.

### 4.6 Quality & Testing

- Extend unit tests to cover new filters, URL sync states, and chart configurations (update `VisualizationPanel.test.tsx` and filter specs).
- Add schema validation script to warn on unexpected categorical values during build.
- Run performance checks to ensure filter interactions remain <150 ms and charts <300 ms render targets.

## 5. Milestones & Deliverables

| Milestone                     | Target Outputs                                                   | Notes                                                  |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| M1 – Data Foundation          | Updated types, ingestion normalization, schema doc               | Require regression on existing filters                 |
| M2 – Interaction Enhancements | Diet/life-stage/year controls, chart updates, DataGrid columns   | Conduct accessibility review for new components        |
| M3 – Narrative Refresh        | Revised homepage/help copy, key findings presets, README updates | Coordinate with content stakeholders                   |
| M4 – Validation & Launch      | Extended tests, performance profiling, release notes             | Re-run `npm run style:all`, share internal walkthrough |

## 6. Risks & Mitigations

- **Category overload**: Too many filters can overwhelm users → group advanced filters under collapsible panel and highlight recommended presets.
- **Performance regressions**: Larger dataset + new calculations → memoize derived datasets, profile interactions, and offload heavy summaries to web workers if needed.
- **Insight accuracy**: Extended fields originate from Kaggle augmentation → cite dataset documentation in help modal and note any cleaning assumptions for transparency.

## 7. Immediate Next Steps

1. Align stakeholders on schema updates and copy rewrite requirements.
2. Implement ingestion changes and normalize categories; verify with QA.
3. Prototype new filters/visuals, run internal usability pass, and adjust accessibility affordances.
4. Ship documentation updates (help modal, README, findings panel) alongside release notes summarizing extended dataset alignment.
