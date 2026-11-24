// Reproduces the validated snapshot. No external packages required.
// Workbook reader is deliberately scoped to these source workbooks, not a general XLSX library.
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);

function b64(s){let chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",acc=0,bits=0,out=[];for(let c of s){let v=chars.indexOf(c);if(v<0)continue;acc=(acc<<6)|v;bits+=6;if(bits>=8){bits-=8;out.push((acc>>bits)&255);}}return Uint8Array.from(out);}
function inflate(a){let bit=0,out=[];function read(n){let v=0;for(let j=0;j<n;j++,bit++)v|=((a[bit>>3]>>(bit&7))&1)<<j;return v;}
function tree(lens){let counts=Array(16).fill(0),next=[],code=0,map=new Map();for(let n of lens)if(n)counts[n]++;for(let n=1;n<=15;n++){code=(code+(counts[n-1]||0))<<1;next[n]=code;}lens.forEach((n,s)=>{if(n){let c=next[n]++,r=0;for(let i=0;i<n;i++)r=(r<<1)|((c>>i)&1);map.set(n+":"+r,s);}});return map;}
function dec(t){let c=0;for(let n=1;n<=15;n++){c|=read(1)<<(n-1);if(t.has(n+":"+c))return t.get(n+":"+c);}throw Error("bad huffman");}
let final;do{final=read(1);let type=read(2);if(type===0){bit=(bit+7)&~7;let len=read(16),inv=read(16);if((len^inv)!==65535)throw Error("stored block");for(let i=0;i<len;i++)out.push(read(8));continue;}let l,d;if(type===1){l=tree(Array.from({length:288},(_,i)=>i<144?8:i<256?9:i<280?7:8));d=tree(Array(32).fill(5));}
else if(type===2){let nl=read(5)+257,nd=read(5)+1,nc=read(4)+4,cl=Array(19).fill(0),order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];for(let i=0;i<nc;i++)cl[order[i]]=read(3);let ct=tree(cl),lens=[];while(lens.length<nl+nd){let s=dec(ct);if(s<16)lens.push(s);else{let n=s===16?read(2)+3:s===17?read(3)+3:read(7)+11;let v=s===16?lens[lens.length-1]:0;while(n--)lens.push(v);}}l=tree(lens.slice(0,nl));d=tree(lens.slice(nl));}else throw Error("reserved block");
const lb=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258],le=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],db=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],de=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];while(true){let s=dec(l);if(s===256)break;if(s<256)out.push(s);else{let k=s-257,n=lb[k]+read(le[k]),ds=dec(d),dist=db[ds]+read(de[ds]);if(dist>out.length)throw Error("distance");while(n--)out.push(out[out.length-dist]);}}}while(!final);return Uint8Array.from(out);}
function str(a){let s="";for(let i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return decodeURIComponent(escape(s));}
function unzip(s){let a=b64(s),u16=i=>a[i]|a[i+1]<<8,u32=i=>(a[i]|a[i+1]<<8|a[i+2]<<16|a[i+3]<<24)>>>0,files={};let end=a.length-22;while(end>=0&&u32(end)!==0x06054b50)end--;if(end<0)throw Error("zip end");let pos=u32(end+16),num=u16(end+10);for(let j=0;j<num;j++){if(u32(pos)!==0x02014b50)throw Error("central");let method=u16(pos+10),cs=u32(pos+20),us=u32(pos+24),nl=u16(pos+28),el=u16(pos+30),co=u16(pos+32),off=u32(pos+42),name=str(a.slice(pos+46,pos+46+nl)),start=off+30+u16(off+26)+u16(off+28),bytes=a.slice(start,start+cs);let decoded=method===8?inflate(bytes):bytes;if(decoded.length!==us)throw Error("size "+name);let crc=0xffffffff;for(let b of decoded){crc^=b;for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}if(((crc^0xffffffff)>>>0)!==u32(pos+16))throw Error("crc "+name);if(/\.(xml|rels)$/.test(name))files[name]=str(decoded);pos+=46+nl+el+co;}return files;}
function unesc(s){return s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,"&");}
function texts(x){return [...x.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map(m=>unesc(m[1])).join("");}
function sheet(f,path){let ss=[...(f["xl/sharedStrings.xml"]||"").matchAll(/<si(?:\s[^>]*)?>([\s\S]*?)<\/si>/g)].map(m=>texts(m[1]));return [...f[path].matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)].map(r=>{let row=[];for(let c of r[1].matchAll(/<c\b([^>]*?)(?<!\/)>([\s\S]*?)<\/c>/g)){let ref=/\br="([A-Z]+)\d+"/.exec(c[1]),idx=0;for(let ch of ref[1])idx=idx*26+ch.charCodeAt(0)-64;let v=/<v>([\s\S]*?)<\/v>/.exec(c[2]);row[idx-1]=/\bt="s"/.test(c[1])?ss[+v[1]]:/\bt="inlineStr"/.test(c[1])?texts(c[2]):v?v[1]:"";}return row;});}


function analyze(csv,ar,br){
function assert(ok,msg){if(!ok)throw Error(msg);}
const rows=csv.trim().split(/\r?\n/).slice(1).map(line=>{let m=/^([^,]+),("(?:[^"]|"")*"|[^,]*),([^,]+)$/.exec(line);assert(m,"CSV parse");return {soc_code:m[1],occupation_title:m[2].replace(/^"|"$/g,"").replace(/""/g,'"'),aioe:Number(m[3])};});
const subset=ar.slice(1).filter(r=>/^(29|31)-/.test(r[0])&&!["29-1131","29-2056","31-9096"].includes(r[0]));
assert(ar.length-1===774,"AIOE source count");assert(rows.length===73&&subset.length===73,"subset count");assert(new Set(rows.map(r=>r.soc_code)).size===rows.length,"duplicate SOC");
for(let r of rows){const s=subset.find(s=>s[0]===r.soc_code);assert(s&&s[1]===r.occupation_title&&Math.abs(Number(s[2])-r.aioe)<1e-12,"source mismatch "+r.soc_code);assert(Number.isFinite(r.aioe)&&/^(29|31)-\d{4}$/.test(r.soc_code),"invalid value");}
const header=br[0],all=br.slice(1).map(r=>Object.fromEntries(header.map((h,i)=>[h,r[i]??null]))),b=all.filter(r=>r.O_GROUP==="detailed");
assert(new Set(b.map(r=>r.OCC_CODE)).size===b.length,"duplicate BLS detailed code");
function num(v){return v!==null&&v!==""&&/^-?\d+(\.\d+)?$/.test(String(v))?Number(v):null;}
const merged=rows.map(r=>{let s=b.find(s=>s.OCC_CODE===r.soc_code);if(s)assert(s.AREA==="99"&&s.NAICS==="000000"&&s.OWN_CODE==="1235","wrong population");return {...r,group:r.soc_code.startsWith("29-")?"Practitioners and technical":"Healthcare support",bls_title:s?.OCC_TITLE??null,annual_median_wage_usd:s?num(s.A_MEDIAN):null,employment:s?num(s.TOT_EMP):null,match_status:s?"exact_code":"unmatched",wage_source_value:s?.A_MEDIAN??null,employment_source_value:s?.TOT_EMP??null};});
for(let r of merged){assert(r.employment===null||r.employment>0,"invalid employment");assert(r.annual_median_wage_usd===null||r.annual_median_wage_usd>0,"invalid wage");}
const mean=v=>v.reduce((s,x)=>s+x,0)/v.length,median=v=>{let s=[...v].sort((a,b)=>a-b),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
function corr(data,key,log=false){let p=data.filter(r=>r[key]!==null),x=p.map(r=>r.aioe),y=p.map(r=>log?Math.log(r[key]):r[key]),mx=mean(x),my=mean(y);return {n:p.length,r:x.reduce((s,v,i)=>s+(v-mx)*(y[i]-my),0)/Math.sqrt(x.reduce((s,v)=>s+(v-mx)**2,0)*y.reduce((s,v)=>s+(v-my)**2,0))};}
let matched=merged.filter(r=>r.match_status==="exact_code");
const summary={source_aioe_rows:ar.length-1,bls_rows:all.length,bls_fields:header.length,bls_detailed_rows:b.length,subset_rows:rows.length,matched_rows:matched.length,unmatched_rows:merged.length-matched.length,groups:["Practitioners and technical","Healthcare support","All retained occupations"].map(group=>{let p=group==="All retained occupations"?merged:merged.filter(r=>r.group===group),m=p.filter(r=>r.match_status==="exact_code");return {group,n:p.length,mean_aioe:mean(p.map(r=>r.aioe)),median_aioe:median(p.map(r=>r.aioe)),matched_n:m.length,matched_mean_aioe:mean(m.map(r=>r.aioe)),unmatched_mean_aioe:mean(p.filter(r=>r.match_status==="unmatched").map(r=>r.aioe)),matched_mean_occupation_median_wage:mean(m.filter(r=>r.annual_median_wage_usd!==null).map(r=>r.annual_median_wage_usd)),matched_employment:m.reduce((s,r)=>s+(r.employment??0),0)};}),wage_correlation:corr(matched,"annual_median_wage_usd"),employment_correlation:corr(matched,"employment"),log_employment_correlation:corr(matched,"employment",true),missing_matched_wages:matched.filter(r=>r.annual_median_wage_usd===null).length,missing_matched_employment:matched.filter(r=>r.employment===null).length};
return {merged,summary};
}
const source = path => readFileSync(new URL(path, root));
const a = unzip(source("AIOE_DataAppendix.xlsx").toString("base64"));
const b = unzip(source("data/bls/national_M2025_dl.xlsx").toString("base64"));
const result = analyze(source("healthcare_ai_exposure.csv").toString("utf8"), sheet(a,"xl/worksheets/sheet2.xml"), sheet(b,"xl/worksheets/sheet1.xml"));
const committed = JSON.parse(source("data/processed/healthcare_workforce.json").toString("utf8"));
if (JSON.stringify(result.merged)!==JSON.stringify(committed.occupations) || JSON.stringify(result.summary)!==JSON.stringify(committed.summary)) {
  throw new Error("Recomputed data differs from the committed export; review before publishing.");
}
console.log(JSON.stringify(result.summary,null,2));
console.log("PASS: source subset, join and statistics reproduce the committed data.");
