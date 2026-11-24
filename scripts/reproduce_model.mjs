// Run from the repository root: node scripts/reproduce_model.mjs
// Import first validates the original exact-code baseline.
import {readFileSync} from "node:fs";
import {unzip,sheet} from "./validate_data.mjs";
const root=new URL("../",import.meta.url);
const read=p=>readFileSync(new URL(p,root),"utf8");

function enhance(base,br,audit,ep){
const h=br[0],bls=br.slice(1).map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]??null]))).filter(r=>r.O_GROUP==="detailed");
const records=base.occupations.map(r=>{
const c=audit.find(c=>c.soc_2010===r.soc_code);
if(!c)throw Error("Missing crosswalk audit");
if(!c.eligible)return {soc_code:r.soc_code,occupation_title:r.occupation_title,aioe:r.aioe,group:r.group,model_eligible:false,match_status:"complex_excluded",exclusion_reason:c.note,bls_soc_code:null,bls_title:null,annual_median_wage_usd:null,annual_mean_wage_usd:null,employment:null,education:null};
const code=c.soc_2018_targets[0],b=bls.find(b=>b.OCC_CODE===code),e=ep.find(e=>e.soc_code===code);
if(!b||!e||b.AREA!=="99"||b.NAICS!=="000000"||b.OWN_CODE!=="1235")throw Error("Missing/invalid source "+code);
for(let key of ["A_MEDIAN","A_MEAN","TOT_EMP"])if(!/^\d+(\.\d+)?$/.test(b[key])||Number(b[key])<=0)throw Error("Invalid outcome "+code);
if(Number(b.A_MEDIAN)!==e.ep_annual_median_wage_usd)throw Error("Wage cross-check "+code);
return {soc_code:r.soc_code,occupation_title:r.occupation_title,aioe:r.aioe,group:r.group,model_eligible:true,match_status:c.match_type,exclusion_reason:null,bls_soc_code:code,bls_title:b.OCC_TITLE,annual_median_wage_usd:Number(b.A_MEDIAN),annual_mean_wage_usd:Number(b.A_MEAN),employment:Number(b.TOT_EMP),...Object.fromEntries(Object.entries(e).filter(([k])=>!["soc_code","title"].includes(k)))};
});
const used=records.filter(r=>r.model_eligible);
if(records.length!==73||used.length!==62||new Set(used.map(r=>r.bls_soc_code)).size!==62)throw Error("Coverage or duplicate target");
return records;
}


function fit(X,y,names){
const n=X.length,k=X[0].length;
function inverse(a){let m=a.map((r,i)=>[...r,...r.map((_,j)=>+(i===j))]);for(let j=0;j<k;j++){let p=j;for(let i=j+1;i<k;i++)if(Math.abs(m[i][j])>Math.abs(m[p][j]))p=i;[m[p],m[j]]=[m[j],m[p]];if(Math.abs(m[j][j])<1e-10)throw Error("singular");let v=m[j][j];m[j]=m[j].map(x=>x/v);for(let i=0;i<k;i++)if(i!==j){let z=m[i][j];m[i]=m[i].map((x,t)=>x-z*m[j][t]);}}return m.map(r=>r.slice(k));}
const xtx=Array.from({length:k},(_,i)=>Array.from({length:k},(_,j)=>X.reduce((s,r)=>s+r[i]*r[j],0))),inv=inverse(xtx),xty=Array.from({length:k},(_,j)=>X.reduce((s,r,i)=>s+r[j]*y[i],0)),beta=inv.map(r=>r.reduce((s,v,j)=>s+v*xty[j],0));
const residuals=X.map((r,i)=>y[i]-r.reduce((s,v,j)=>s+v*beta[j],0)),hat=X.map(r=>r.reduce((s,v,i)=>s+v*inv[i].reduce((z,w,j)=>z+w*r[j],0),0));
if(hat.some(h=>h>=1-1e-9))throw Error("unit leverage");
const meat=Array.from({length:k},(_,i)=>Array.from({length:k},(_,j)=>X.reduce((s,r,t)=>s+r[i]*r[j]*(residuals[t]/(1-hat[t]))**2,0))),cov=inv.map((r,i)=>inv.map((_,j)=>r.reduce((s,v,a)=>s+v*meat[a].reduce((t,w,b)=>t+w*inv[b][j],0),0)));
let ybar=y.reduce((s,v)=>s+v,0)/n,sse=residuals.reduce((s,v)=>s+v*v,0),sst=y.reduce((s,v)=>s+(v-ybar)**2,0);
const orthogonality=Math.max(...names.map((_,j)=>Math.abs(X.reduce((s,r,i)=>s+r[j]*residuals[i],0))));
if(orthogonality>1e-7)throw Error("normal equations residual");
return {n,k,coefficients:names.map((name,i)=>({term:name,estimate:beta[i],hc3_standard_error:Math.sqrt(cov[i][i])})),r_squared:1-sse/sst,adjusted_r_squared:1-(sse/(n-k))/(sst/(n-1)),loocv_rmse_log_wage:Math.sqrt(residuals.reduce((s,v,i)=>s+(v/(1-hat[i]))**2,0)/n),max_leverage:Math.max(...hat),normal_equations_max_error:orthogonality};
}
function models(rows){
let categories=["Postsecondary nondegree award","Associate's degree","Bachelor's degree","Master's degree","Doctoral or professional degree"];
const education=r=>categories.map(c=>+(r.education===c)),ednames=categories.map(c=>"education: "+c);
let y=rows.map(r=>Math.log(r.annual_median_wage_usd));
let specs=[["exposure_only",["Intercept","AIOE"],r=>[1,r.aioe]],["education_only",["Intercept",...ednames],r=>[1,...education(r)]],["exposure_education",["Intercept","AIOE",...ednames],r=>[1,r.aioe,...education(r)]],["education_group",["Intercept",...ednames,"Healthcare support"],r=>[1,...education(r),+(r.group==="Healthcare support")]],["exposure_education_group",["Intercept","AIOE",...ednames,"Healthcare support"],r=>[1,r.aioe,...education(r),+(r.group==="Healthcare support")]]];
return Object.fromEntries(specs.map(([key,names,fn])=>[key,fit(rows.map(fn),y,names)]));
}

const base=JSON.parse(read("data/processed/healthcare_workforce.json"));
const crosswalk=JSON.parse(read("data/reference/healthcare_soc_crosswalk_review.json"));
const ep=JSON.parse(read("data/reference/bls_education_projections_2025.json"));
const workbook=unzip(readFileSync(new URL("data/bls/national_M2025_dl.xlsx",root)).toString("base64"));
const records=enhance(base,sheet(workbook,"xl/worksheets/sheet1.xml"),crosswalk.rows,ep.rows);
const results=models(records.filter(r=>r.model_eligible));
const saved=JSON.parse(read("data/processed/healthcare_workforce_v2.json"));
if(JSON.stringify(records)!==JSON.stringify(saved.occupations)||JSON.stringify(results)!==JSON.stringify(saved.models))throw Error("Model export differs from recomputation");
console.log(JSON.stringify(results,null,2));
console.log("PASS: 62 unique comparable occupations, source wage cross-checks, and all models reproduce.");
