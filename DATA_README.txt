ECON 3001 Milestone 3 data evidence
Downloaded October 14, 2026, America/New_York.
Original source: https://raw.githubusercontent.com/AIOE-Data/AIOE/main/AIOE_DataAppendix.xlsx
Repository: https://github.com/AIOE-Data/AIOE
Citation: Felten E, Raj M, Seamans R (2021). Occupational, industry, and geographic exposure to artificial intelligence: A novel dataset and its potential uses. Strategic Management Journal 42(12):2195–2217. https://doi.org/10.1002/smj.3286

AIOE_DataAppendix.xlsx is the unchanged source download. Appendix A has 774 records, with SOC Code, Occupation Title, and AIOE.
healthcare_ai_exposure.csv contains the 73 retained records: SOC prefixes 29 and 31, excluding veterinary codes 29-1131, 29-2056, and 31-9096. Occupational health and safety roles are retained. This operational definition does not cover every healthcare-industry worker (e.g., hospital administrators).
Run python reproduce_summary.py with pandas and openpyxl installed to reproduce the subset and statistics. Statistics are unweighted across occupation categories, not workers. The source is a cross-section associated with a 2021 publication, not an annual time series or a measure of current generative-AI adoption. No BLS outcomes have been merged. Original SOC labels are retained and must be crosswalked before joining newer occupational data.
