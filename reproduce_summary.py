from pathlib import Path
import pandas as pd
root=Path(__file__).resolve().parent
data=pd.read_excel(root/'AIOE_DataAppendix.xlsx',sheet_name='Appendix A')
sample=data[data['SOC Code'].str.startswith(('29-','31-')) & ~data['SOC Code'].isin(['29-1131','29-2056','31-9096'])].copy()
assert len(data)==774 and len(sample)==73
assert not sample.isna().any().any() and not sample['SOC Code'].duplicated().any()
sample.to_csv(root/'healthcare_ai_exposure.csv',index=False)
for label, subset in [('Practitioners and technical',sample[sample['SOC Code'].str.startswith('29-')]),('Healthcare support',sample[sample['SOC Code'].str.startswith('31-')]),('All retained occupations',sample)]:
 print(label, len(subset), 'mean',round(subset.AIOE.mean(),3),'median',round(subset.AIOE.median(),3),'missing',subset.AIOE.isna().sum())
