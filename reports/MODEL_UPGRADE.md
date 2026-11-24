# Model upgrade and validation

## What changed
- Added 12 official one-to-one recodes.
- Removed old codes 29-2099 and 29-9099 from the model because identical codes do not imply unchanged scope.
- Reviewed sample: 62 occupations, with 11 complex cases excluded.
- Added typical entry education, work experience, on-the-job training, and 2025–2035 projection fields.
- Fit five log-wage specifications with HC3 standard errors and leave-one-out predictive checks.

Use **healthcare_workforce_v2.json** for new work. The old JSON and exact-code validation remain available only to reproduce the historical baseline. Its 52 exact matches must not be treated as 52 fully comparable occupations.

## Data checks passed
1. 73 original source records are preserved.
2. 62 eligible source codes map to 62 unique target codes.
3. All eligible wages and employment are positive numeric values.
4. All 62 OEWS median wages match the separately retrieved BLS Table 1.2 median wages.
5. No missing education or projected-growth values among eligible records.
6. Excluded outcomes are null; no split or aggregate category is counted more than once.
7. Regression normal-equation checks pass.
8. Leave-one-out error for exposure plus education agrees with 62 direct refits to within 1e-10.
9. The final reconstruction functions reproduce the saved occupations and all model results.

## Reproduce
```sh
node scripts/reproduce_model.mjs
```

The imported baseline validator reads the original workbooks. The enhanced script uses the saved official-table extract and crosswalk review, reconstructs the 62-observation model, and checks all results against v2. It does not overwrite inputs. Analysis functions were executed in the available JavaScript runtime; the Node filesystem wrapper was not run.

## Sources
The crosswalk review derives from the official [2018 SOC Manual, Appendix A](https://www.bls.gov/soc/2018/soc_2018_manual.pdf), PDF pages 235–237. Publication aggregation is checked against the existing OEWS workbook. [BLS Table 1.2](https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm) supplies additional fields; the saved extract records the original source line for each row.

## Interpretation
Education is coded categorically, with high school as the reference. The five models use the same observations and log-wage outcome. HC3 standard errors describe model uncertainty under the usual observational regression assumptions; they do not establish causality. Cross-validation compares occupations within this selected sample, not future prediction accuracy.

Adding AIOE worsens LOOCV error relative to education alone and relative to education plus group. Do not select a specification solely because it gives a larger exposure coefficient or higher in-sample R².

Employment projections have different coverage from OEWS. Keep EP employment in thousands distinct from OEWS jobs; projected change is over 2025–2035, not annual or AI-caused.

## Remaining data opportunities
- O*NET task/work-context measures, using a few theoretically motivated predictors.
- Separate language-model exposure as a robustness check.
- Aggregated mean-wage sensitivity analysis for clean one-to-many splits; do not average medians.
- Historical wages/employment only after occupational harmonization and methodology review.
- Full current-SOC coverage would require a defensible exposure mapping or a separately documented current-code exposure dataset.

Course rubric, group names, and original-provider API requirements still need confirmation. Website work remains paused.
