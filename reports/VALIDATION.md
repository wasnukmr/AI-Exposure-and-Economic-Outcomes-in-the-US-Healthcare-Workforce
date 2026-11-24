# Data validation — November 24, 2026

Source commit: `d32cb9bea551bae1649b106a849c759287444fcb`.

## Passed
- Both Excel ZIP archives decompressed with entry size and CRC32 checks.
- AIOE Appendix A: 774 records.
- Healthcare subset: 73 unique SOC codes; all source titles and scores match the workbook (score tolerance 1e-12).
- BLS: 1,401 rows, 32 fields; 830 detailed records with unique codes.
- Exact-code join: 52 matched and 21 unmatched; matched rows confirmed as U.S., cross-industry, ownership 1235.
- All 52 matched wage and employment outcomes are positive and numeric.
- Two title wording differences retained: Occupational Therapist Assistants/Aides → Occupational Therapy Assistants/Aides.
- Recalculated wage correlation: 0.14477302760060554.
- Negative tests reject duplicate SOCs and modified exposure scores.
- Suppression test confirms # wages and ** employment produce null, not zero.
- Unmatched outcomes remain null; JSON round-trip retains all 73 occupations.

## Scope of validation
The workbooks were read from GitHub through the connected API, decoded, and analyzed using JavaScript. The same parser and analysis functions are included in the reproduction script. This validates the repository inputs, not a fresh source-provider download. The Node filesystem wrapper could not be executed because the local execution environment was unavailable; its analysis functions were executed in the available JavaScript runtime.

Exact-code matching does not establish full historical equivalence of every occupational definition. No inferred crosswalks are applied. Data and source precision are retained; null means unavailable, never zero.

## Reproduce
From the repository root with Node.js available:

```sh
node scripts/validate_data.mjs
```

The script reads the three existing source files, recomputes the join and statistics, checks them against the committed JSON, and exits with an error on mismatch. It does not modify source files.

## Website data contract
Use `data/processed/healthcare_workforce.json`.
- `occupations`: all 73 records. Filter `match_status === "exact_code"` for wage/employment comparisons.
- `annual_median_wage_usd`: numeric dollars or null.
- `employment`: estimated jobs or null.
- `aioe`: relative index; not a probability or percentage.
- `summary`: unrounded descriptive statistics.
- `metadata`: source commit, source blob IDs, reference periods and limitations.
- Never replace null with zero. Do not label employment as projected growth.
- Keep productivity scenarios separate and explicitly identify their assumptions.
- Do not embed GitHub access tokens in browser code. Bundle the approved JSON with the future website or retrieve it through an authorized backend.

## Submission items still to confirm
The final ECON 3001 rubric was not available for review. The separately located ECON Capstone instructions concern another project and were not applied. Confirm group names, required submission format, any presentation requirements, and the exact API requirement.

The successful GitHub API retrieval is an API connection to hosted files; it is not a tested BLS provider API or proof that the course's API requirement is satisfied. No website deployment, O*NET task analysis, or employment-projection analysis is claimed.

Website work is paused at the user's request.
