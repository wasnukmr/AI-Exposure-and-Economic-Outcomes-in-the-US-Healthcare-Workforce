**Historical baseline: superseded by [the revised project report](FINAL_PROJECT.md). Two exact-code residual categories are not definitionally comparable; see the crosswalk review.**

# AI Exposure and Economic Outcomes in the U.S. Healthcare Workforce
ECON 3001 — Applied AI in Economics

## Abstract
This project examines how artificial intelligence occupational exposure relates to wages and employment across selected U.S. healthcare occupations. We combine the AI Occupational Exposure (AIOE) dataset associated with Felten, Raj, and Seamans (2021) with Bureau of Labor Statistics (BLS) May 2025 national Occupational Employment and Wage Statistics (OEWS). The sample contains 73 occupations; 52 have exact occupational-code matches in the BLS detailed estimates. Practitioner and technical occupations have a higher mean exposure score (0.203) than support occupations (−0.497). Within the matched sample, exposure has a weak positive correlation with annual median wages (r = 0.145) and almost no linear association with employment levels (r = 0.018). These descriptive findings establish differences in occupational exposure but do not identify AI-induced wage changes, productivity gains, or displacement.

## 1. Research question and economic framework
Our central question is: **How does measured AI exposure differ across healthcare occupations, and how is that exposure associated with occupational wages and employment size?**

The original project also raised questions about task transformation, productivity, employment projections, and the distribution of gains and losses. The empirical analysis answers the exposure, wage, and employment-level questions using the available data. Productivity and distributional mechanisms are discussed as hypotheses; employment projections and task-level estimates are extensions.

An occupation comprises multiple tasks. AI could substitute for some tasks, complement workers in others, and introduce additional verification or coordination work. A reduction in time per task could expand capacity, but the labor-market outcome would also depend on demand for services, implementation costs, organizational choices, and workers' ability to perform complementary tasks. Consequently, a high exposure score alone cannot determine whether an occupation benefits or loses.

Wages are also shaped by education, licensure, experience, specialization, and labor-market institutions. Comparing exposure with wages is informative as a descriptive exercise, but an observed relationship cannot isolate AI's contribution from these factors.

## 2. Data, population, and validation
The exposure source is **Appendix A of AIOE_DataAppendix.xlsx**, containing 774 occupation records. The retained sample uses SOC prefixes 29 and 31 and excludes veterinary codes 29-1131, 29-2056, and 31-9096. It includes occupational health and safety occupations under their original source codes. This is an occupational sample, not a complete census of workers in healthcare industries: hospital administrators and other occupations outside these prefixes are not included.

AIOE is a relative exposure index, not a percentage, a current adoption rate, or a probability that a job will disappear. Negative scores indicate lower values of this index, not negative productivity or protection from all forms of technological change.

The outcome source is **national_M2025_dl.xlsx**, identified within its field documentation as May 2025 OEWS estimates. It contains 1,401 data rows and 32 fields. Restricting to O_GROUP = detailed yields 830 records with unique occupational codes. National cross-industry estimates cover the applicable private and government employment categories; employment excludes self-employed workers. A_MEDIAN is the annual median wage within an occupation, and TOT_EMP is its estimated employment.

Validation reproduced the 73-record healthcare subset directly from the workbook. Every retained occupation code, title, and exposure score matches the CSV, with a numerical tolerance of 10⁻¹² for floating-point representation. We checked code uniqueness, numeric exposure values, outcome positivity, BLS population fields, and matching cardinality. Workbook ZIP-entry integrity checks also passed. These checks validate the repository inputs and their processing; they are not a fresh independent audit of the providers' survey methods.

We use a one-to-one exact SOC-code join. There are **52 matches (71.2%)** and **21 unmatched occupations (28.8%)**. The matched sample contains 40 practitioner/technical and 12 support occupations. Two matched titles change “Therapist” to “Therapy” for occupational therapy assistants and aides; both source titles remain in the audit. All matched records have numeric wage and employment values. Unmatched outcomes remain null. Suppressed or nonnumeric outcomes are never converted to zero.

## 3. Method
We calculate unweighted occupation-level means and medians for exposure and Pearson correlations between exposure and:
1. Annual median wages.
2. Employment levels.
3. The natural logarithm of employment, as a sensitivity comparison for differences in occupation size.

Each occupation receives equal weight. A small occupation and a large occupation each contribute one observation to the correlations. These statistics are not estimates for the average healthcare worker. We preserve source precision during calculation and round only the displayed results.

Exact-code matching avoids inventing scores for split or combined occupations. It does not fully resolve classification differences. Unmatched records are retained in the exposure analysis and audit but excluded from outcome comparisons. No missing outcomes or exposure scores are imputed.

## 4. Results

### Occupational exposure
| Group | Occupations | Mean AIOE | Median AIOE | BLS matches |
|---|---:|---:|---:|---:|
| Practitioners and technical | 57 | 0.203 | 0.106 | 40 |
| Healthcare support | 16 | −0.497 | −0.529 | 12 |
| All retained occupations | 73 | 0.050 | 0.007 | 52 |

The difference in group means is approximately 0.700 index units. The descriptive pattern is consistent with different task compositions across the two groups, but task-level data were not analyzed and the mechanism is not established.

Group averages conceal variation. Medical transcriptionists have an exposure score of 1.063 despite belonging to the support group, while some practitioner and technical occupations have negative scores. Broad occupational categories should therefore not replace occupation-specific comparisons.

### Exposure, wages, and employment
| Comparison | Occupations | Pearson r |
|---|---:|---:|
| AIOE and annual median wages | 52 | 0.145 |
| AIOE and employment levels | 52 | 0.018 |
| AIOE and log employment | 52 | −0.150 |

The positive wage correlation is weak. Its squared value is approximately 0.021, equivalent to about 2.1% of the variation in an unadjusted linear regression of wages on AIOE with an intercept. This is a descriptive fit statistic, not the share of wages caused by AI.

The employment-level correlation is close to zero. Its sign changes when employment is log-transformed, illustrating that interpretation depends on how occupation size is represented. Neither statistic measures employment growth or job losses.

The matched occupations account for 9,579,490 estimated jobs. This is the sum for the retained matched sample, not total U.S. healthcare employment.

| Selected occupation | AIOE | Annual median wage | Estimated employment |
|---|---:|---:|---:|
| Registered nurses | 0.229 | $97,550 | 3,379,720 |
| Genetic counselors | 1.528 | $100,040 | 3,740 |
| Medical assistants | 0.150 | $45,690 | 817,870 |
| Medical transcriptionists | 1.063 | $40,410 | 41,550 |

These examples show why exposure, pay, and workforce size should be displayed separately. Medical transcriptionists have higher exposure than registered nurses but much lower wages. Genetic counselors have high exposure but represent a much smaller workforce.

### Coverage sensitivity
Matched occupations have mean AIOE of 0.005, compared with 0.162 among unmatched occupations. Within practitioner/technical roles, the matched mean is 0.112 versus 0.419 for unmatched roles; within support roles, the corresponding values are −0.352 and −0.931. Missing matches therefore do not simply remove an exposure-neutral subset. The 52-occupation correlations should not be generalized automatically to all 73 occupations.

## 5. Economic interpretation and illustrative productivity scenario
The findings support an occupation-specific approach to studying AI. A high exposure score may identify work likely to interact with AI capabilities, but does not establish whether that interaction substitutes for labor or increases its value. The weak wage relationship also cautions against assuming that high exposure automatically identifies either the highest-paid workers or the workers most economically vulnerable.

A simple scenario illustrates the distinction between capacity and realized gains. Assume a 40-hour week, 30% of time spent on affected tasks, and a 20% reduction in time on those tasks. Potential time released equals:

**40 × 0.30 × 0.20 = 2.4 hours per week**, or 6% of scheduled hours.

These inputs are illustrative assumptions, not estimates derived from AIOE. At unchanged output, the scenario represents potential time savings. If every released hour could instead be used productively, output might rise; training, review, errors, and implementation costs could reduce the benefit. No wage increase or staffing reduction follows mechanically.

Potential gains could accrue to workers through reduced administrative burden, to patients through additional capacity, or to employers through lower costs. Their distribution depends on choices and institutions not observed in this dataset. These are economic mechanisms to investigate, not measured findings.

## 6. Limitations and conclusion
This cross-section cannot establish causal effects. Exposure predates the BLS reference period and is not a direct measure of contemporary generative-AI adoption. Occupational averages obscure differences among workers and workplaces. The sample is selective, occupation codes are only partially aligned, and the analysis does not control for qualifications, hours, industry composition, or other determinants of pay. No statistical significance claim is made.

A stronger extension would reconcile occupational classifications using a documented crosswalk, add task characteristics and relevant controls, and assemble repeated labor-market observations plus a defensible measure of adoption. Employment projections would provide a separate forward-looking comparison, but should not be presented as AI-specific forecasts.

The central conclusion is that AI exposure varies meaningfully across selected healthcare occupations, while its descriptive relationship with wages and employment size is weak in the exact-match sample. The data support a transparent comparison of exposure and labor-market characteristics. They do not support claims that AI has already raised wages, caused displacement, or generated a particular productivity gain.

## Reproducibility and sources
- [Project repository](https://github.com/wasnukmr/AI-Exposure-and-Economic-Outcomes-in-the-US-Healthcare-Workforce)
- [Validated JSON](../data/processed/healthcare_workforce.json) and [complete match audit](../data/processed/occupation_match_audit.csv).
- [Validation report and reproduction instructions](VALIDATION.md).
- Felten, E., Raj, M., & Seamans, R. (2021). Occupational, industry, and geographic exposure to artificial intelligence: A novel dataset and its potential uses. *Strategic Management Journal, 42*(12), 2195–2217. https://doi.org/10.1002/smj.3286. [Source repository](https://github.com/AIOE-Data/AIOE).
- U.S. Bureau of Labor Statistics. *May 2025 Occupational Employment and Wage Statistics, national estimates*. [Data tables](https://www.bls.gov/oes/tables.htm); field definitions in the repository workbook.
- U.S. Bureau of Labor Statistics. [OEWS frequently asked questions](https://www.bls.gov/oes/oes_ques.htm).

**AI assistance disclosure:** ChatGPT assisted with data validation, code generation, interpretation, and drafting. The group should review the analysis and adapt this disclosure to the course policy before submission.
