# AI Exposure and Economic Outcomes in the U.S. Healthcare Workforce

ECON 3001 research project comparing occupational AI exposure with national wages and employment.

- [Project report](reports/FINAL_PROJECT.md)
- [Validation, limitations, and submission checklist](reports/VALIDATION.md)
- [Website-ready data (JSON)](data/processed/healthcare_workforce.json)
- [All occupations and match statuses (CSV)](data/processed/occupation_match_audit.csv)

## Validated findings
73 healthcare occupations match the AIOE source subset. 52 have exact BLS occupational-code matches; 21 remain unmatched. The matched-sample correlation between exposure and annual median wages is approximately 0.145. These are descriptive associations, not causal estimates or job-loss forecasts.

## Reproduce
Run `node scripts/validate_data.mjs` from a checkout. The script recomputes the source subset, joins and statistics and compares them against the committed JSON. The validation report documents execution scope and limitations.

Original files remain unchanged:
- `AIOE_DataAppendix.xlsx`
- `healthcare_ai_exposure.csv`
- `data/bls/national_M2025_dl.xlsx`

## Project status
The empirical report and data export cover AIOE, wages, and employment levels. Website work is paused pending a new build. No productivity effects or employment projections have been estimated. Confirm the final course rubric and exact API requirement before submission.

## Sources
Felten, Raj, and Seamans (2021), [AIOE dataset](https://github.com/AIOE-Data/AIOE).
BLS [OEWS national estimates](https://www.bls.gov/oes/tables.htm), May 2025 workbook.
