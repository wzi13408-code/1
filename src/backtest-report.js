const {evaluate}=require('./backtest-advanced');
function toEval(rows,key){return rows.map(x=>({pred:x[key],actual:x.actual==='home'?'H':x.actual==='draw'?'D':'A'}))}
function compare(rows=[]){const keys=['xt','market','uniform'];const out={};for(const k of keys)out[k]=evaluate(toEval(rows,k));return out}
function segment(rows=[],field){const groups={};for(const r of rows){const key=r[field]??'unknown';(groups[key]??=[]).push(r)}return Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,compare(v)]))}
module.exports={compare,segment};
