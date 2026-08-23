function bins(preds,binsCount=10){const out=Array.from({length:binsCount},()=>({n:0,p:0,y:0}));for(const x of preds){const b=Math.min(binsCount-1,Math.floor(x.p*binsCount));out[b].n++;out[b].p+=x.p;out[b].y+=x.y}return out.map((x,i)=>({...x,bin:i,meanPred:x.n?x.p/x.n:0,empirical:x.n?x.y/x.n:0}))}
function reliability(preds,binsCount=10){const b=bins(preds,binsCount);const n=preds.length||1;const ece=b.reduce((s,x)=>s+(x.n/n)*Math.abs(x.meanPred-x.empirical),0);return {bins:b,ece}}
function selectModel(results=[]){return [...results].sort((a,b)=>(a.logLoss??Infinity)-(b.logLoss??Infinity)).map((x,i)=>({...x,rank:i+1}));}
module.exports={reliability,selectModel};
