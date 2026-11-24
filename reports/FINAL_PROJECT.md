# AI Exposure and Economic Outcomes in the U.S. Healthcare Workforce
ECON 3001 — Applied AI in Economics

## Abstract
This study examines the relationship between occupational AI exposure and wages in a selected U.S. healthcare workforce sample. We combine Felten, Raj, and Seamans' AIOE scores with BLS May 2025 Occupational Employment and Wage Statistics (OEWS), review historical occupation-code changes, and add BLS education and employment-projection characteristics. The original 73-occupation sample yields 62 comparable occupations after classification review. In this sample, AI exposure and annual median wages have a Pearson correlation of 0.353. However, the exposure coefficient in a log-wage regression falls from 0.453 to 0.078 after including education categories and to 0.048 after also including occupational group. Adding exposure does not improve leave-one-occupation-out prediction relative to the corresponding models without exposure. The results suggest that the unadjusted association is sensitive to occupational composition and education, and do not establish a causal effect of AI on wages.

## 1. Research question
How is AI exposure associated with healthcare occupational wages after accounting for typical entry education, and how sensitive is that association to occupation-code matching?

The economic motivation is that AI may substitute for particular tasks, complement workers, or change the allocation of work. These mechanisms have different implications for productivity and labor demand. Exposure alone cannot identify which mechanism occurs. Wage differences may also reflect education, licensing, specialization, and other factors correlated with exposure.

We use a cross-sectional observational design. The analysis estimates associations between occupational characteristics, not the effect of adopting AI within an organization.

## 2. Data and scope
**AIOE:** Appendix A contains 774 occupations. The original project sample retains 73 occupations with 2010 SOC prefixes 29 or 31, excluding veterinary occupations 29-1131, 29-2056, and 31-9096. Occupational health and safety roles remain in the original scope even though their updated codes begin with 19. AIOE is a relative exposure index associated with a 2021 publication; it is not a percentage, a measure of current adoption, or a job-loss probability.

**OEWS:** The repository's May 2025 national workbook contains 1,401 rows and 32 fields. Filtering to detailed occupational records yields 830 unique codes. Annual median wage is the wage outcome, and employment represents estimated national cross-industry jobs excluding self-employed workers. This occupational sample is not all workers employed in healthcare industries.

**Added BLS characteristics:** Table 1.2 provides typical entry education, related work experience, on-the-job training, 2025 and projected 2035 employment, projected percentage change, and annual openings. These fields were retrieved from the official BLS table and joined using reviewed current codes. Education is the typical entry requirement for an occupation, not workers' actual educational attainment.

The education and projection extract covers all 62 model occupations. Its median wages agree exactly with the repository OEWS workbook for all 62 records. Projection employment is stored separately in thousands and has different coverage from OEWS employment. Projections are not observed future outcomes or AI-specific forecasts.

## 3. Classification review and validation
The initial exact-code join produced 52 matches and 21 unmatched records. The official 2010-to-2018 SOC crosswalk identifies 12 additional one-to-one code changes, including six physician categories, dental hygienists, two occupational health and safety roles, and three support occupations.

A code match is not sufficient on its own. Two categories previously included, 29-2099 and 29-9099, retained their codes while their scope changed. We exclude these from the stricter model rather than treating the old exposure score as directly comparable to the newer outcome.

| Classification outcome | Occupations |
|---|---:|
| Reviewed unchanged one-to-one codes | 50 |
| Official one-to-one recodes recovered | 12 |
| Strict model sample | 62 |
| Complex or aggregated categories excluded | 11 |
| Original exposure sample | 73 |

The 62 observations have unique source and target codes. We do not duplicate a combined outcome across multiple old occupations or copy a parent exposure score across newly separated specialties as if the resulting observations were independent.

The remaining 11 require additional assumptions or aggregation. They include split physician categories, laboratory technologists and technicians combined in OEWS, EMTs and paramedics, changed residual categories, medical records occupations with overlapping transfers, and home health aides published together with personal care aides. Complete reasons and candidate codes are preserved in the crosswalk audit.

Validation checks the original CSV against AIOE Appendix A, workbook integrity, unique codes, source population fields, positive numeric outcomes, the 62 BLS wage cross-checks, and reproducibility of the model calculations. Excluded observations retain their original exposure values but have null matched outcomes in the revised export.

## 4. Empirical method
The dependent variable is the natural logarithm of the annual median wage for each occupation. We estimate five ordinary least squares specifications:
1. Exposure only.
2. Education categories only.
3. Exposure plus education categories.
4. Education categories plus an indicator for healthcare support occupations.
5. Exposure, education categories, and the support indicator.

Education enters as five indicators, with high school diploma or equivalent as the reference category. This avoids imposing equal wage increments between credentials. The six education groups contain 11 high-school, 10 postsecondary-nondegree, 11 associate's, 5 bachelor's, 9 master's, and 16 doctoral/professional occupations.

The main adjusted specification is:

**ln(annual median wage) = intercept + β × AIOE + education-category indicators + error.**

We report HC3 heteroskedasticity-robust standard errors, R², adjusted R², and leave-one-occupation-out cross-validation error in log-wage units. Lower cross-validation RMSE is better. All models use the same 62 occupations and equal occupation weights.

Cross-validation was calculated using the OLS leverage identity. For the exposure-plus-education model, its result was checked against 62 explicit refits, each omitting one occupation. Normal-equation residual checks also passed. These checks validate the calculations, but do not establish generalization to different years or healthcare settings.

## 5. Results
Across the original 73 occupations, mean exposure remains 0.203 for practitioner/technical occupations and −0.497 for support occupations. The overall mean is 0.050. These are occupation-weighted, not worker-weighted, statistics.

In the reviewed 62-occupation sample, the correlation of exposure with wage levels is **0.353**, compared with **0.145** in the historical exact-code baseline. The samples differ, so this is evidence of sensitivity to composition rather than a time trend.

All regressions below use log wages and the same 62 observations.

| Model | AIOE coefficient | HC3 SE for AIOE | R² | Adjusted R² | LOOCV RMSE |
|---|---:|---:|---:|---:|---:|
| exposure + only | 0.453 | 0.109 | 0.196 | 0.183 | 0.596 |
| education + only | — | — | 0.749 | 0.727 | 0.353 |
| exposure + education | 0.078 | 0.083 | 0.753 | 0.726 | 0.356 |
| education + group | — | — | 0.759 | 0.733 | 0.347 |
| exposure + education + group | 0.048 | 0.084 | 0.761 | 0.730 | 0.351 |

The unadjusted coefficient is 0.453 log points per one-unit difference in the exposure index. Once education is included, the coefficient falls to 0.078, with robust standard error 0.083. Its exact exponential interpretation is approximately an 8.1% conditional wage difference per index unit, but the estimate is uncertain and is not a causal effect. Adding the support-group indicator reduces the coefficient further to 0.048.

Education-only prediction has a lower cross-validation RMSE than exposure plus education (0.353 versus 0.356). Similarly, education plus group has lower error than the same model with exposure added (0.347 versus 0.351). The small increases in in-sample R² from adding exposure therefore do not translate into better prediction in these checks.

This distinction matters: the strongest project conclusion is not that AI exposure explains healthcare wages. It is that the apparent unadjusted relationship becomes much smaller after accounting for education and occupational composition. The data do not establish that the remaining coefficient is zero, either.

## 6. Economic interpretation
The results are consistent with education and the composition of occupations accounting for much of the observed exposure-wage association. They do not prove a mechanism. An occupation's educational requirements may correlate with task complexity, professional restrictions, and specialized skills that are themselves related to wages.

The original sample also contains substantial variation within broad occupational groups. Exposure should therefore be analyzed at the occupation level rather than used to label all support workers or all practitioners as uniformly vulnerable.

Employment projections add a useful separate comparison for workforce planning, but are not included as controls in the wage models. Using future projected growth as a contemporaneous wage control would complicate interpretation. The projections should be displayed as BLS forecasts, with their period and units clearly identified.

An illustrative productivity scenario remains separate from the empirical model: a 40-hour week × 30% affected-task share × 20% time reduction equals 2.4 potential hours released per week. These are assumed inputs, not estimates derived from AIOE. Time savings do not automatically produce higher wages, lower staffing, or realized output gains.

## 7. Limitations and next extensions
The sample is small and selected. Excluding complex categories can change its composition, while education categories remain coarse. Occupational group and education do not capture all determinants of pay. The analysis uses historical exposure scores and a later wage cross-section, not measured organizational adoption. Robust standard errors cannot resolve omitted-variable bias or nonrandom sample selection.

The next useful extension is O*NET task and work-context data, using a small prespecified set of variables and a documented code mapping. A separate language-model exposure measure could test sensitivity to the type of AI measured; it should not be silently substituted for the original AIOE index.

For complex mappings, aggregate employment and employment-weighted **mean** wages can sometimes reconstruct old categories. Occupational medians cannot be averaged to obtain a valid combined median. Many-to-one exposure aggregation requires defensible weights or a clearly labeled sensitivity assumption. Historical wage comparisons would additionally require stable classification, inflation adjustment, and review of survey-method changes.

## 8. Conclusion
Official classification reconciliation improves coverage to 62 comparable occupations and corrects two misleading exact-code matches. Adding education and training characteristics makes the analysis more informative, but does not make the evidence causal. The unadjusted exposure-wage relationship weakens substantially with education controls, and exposure does not improve cross-validated prediction over the corresponding education-based models. A credible interpretation of AI's economic implications must distinguish exposure from adoption and account for occupational characteristics.

## Sources and reproducibility
- Felten, E., Raj, M., & Seamans, R. (2021). Occupational, industry, and geographic exposure to artificial intelligence: A novel dataset and its potential uses. *Strategic Management Journal, 42*(12), 2195–2217. https://doi.org/10.1002/smj.3286. [AIOE repository](https://github.com/AIOE-Data/AIOE).
- U.S. Bureau of Labor Statistics. [May 2025 OEWS national estimates](https://www.bls.gov/oes/tables.htm), using the existing project workbook.
- U.S. Office of Management and Budget. [2018 SOC Manual](https://www.bls.gov/soc/2018/soc_2018_manual.pdf), Appendix A, PDF pages 235–237. [BLS crosswalk download page](https://www.bls.gov/soc/2018/crosswalks.htm).
- U.S. Bureau of Labor Statistics. [Table 1.2: Occupational projections, 2025–35, and worker characteristics, 2025](https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm).
- [Revised data and complete regression coefficients](../data/processed/healthcare_workforce_v2.json).
- [Validation and model documentation](MODEL_UPGRADE.md).
- [Project repository](https://github.com/wasnukmr/AI-Exposure-and-Economic-Outcomes-in-the-US-Healthcare-Workforce).

Run `node scripts/reproduce_model.mjs` from a checkout to validate the historical baseline, reconstruct the revised sample, and compare the models with the saved results. Calculations were executed in JavaScript; the Node filesystem entry point was not run because the local execution environment was unavailable.

**AI assistance disclosure:** ChatGPT assisted with source retrieval, classification review, code generation, statistical analysis, and drafting. The group should review the work and conform this disclosure to course requirements.
