# AI Exposure and Economic Outcomes in the U.S. Healthcare Workforce

ECON 3001 research project.

## Current analysis
- [Revised project report](reports/FINAL_PROJECT.md)
- [Validated v2 data and models](data/processed/healthcare_workforce_v2.json)
- [Classification audit](data/reference/healthcare_soc_crosswalk_review.json)
- [BLS education, training, and projection extract](data/reference/bls_education_projections_2025.json)
- [Model validation and limitations](reports/MODEL_UPGRADE.md)

The stricter sample has **62 comparable occupations**: 50 unchanged-code matches and 12 official recodes. Two prior exact matches are excluded because their definitions changed. Eleven original occupations require additional mapping or aggregation assumptions.

Education controls substantially reduce the exposure-wage coefficient. Adding AIOE does not improve leave-one-occupation-out prediction over the corresponding education-based models. Findings are descriptive, not causal.

## Reproduction
`node scripts/reproduce_model.mjs`

Original workbooks and the historical exact-code export are retained. [Historical report](reports/BASELINE_EXACT_CODE_REPORT.md) and [original validation](reports/VALIDATION.md) document the prior 52-match baseline; use v2 for new analysis and the future website.

Website work is paused. Confirm the course rubric, group details, and exact API requirement before submission.
