const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const sigmoid=x=>1/(1+Math.exp(-x));

function bivariatePoissonMatrix(lambdaH,lambdaA,lambdaC=0.05,maxGoals=8){
  const m=[]; const p0=Math.exp(-(lambdaH+lambdaA+lambdaC));
  const fact=[1]; for(let i=1;i<=maxGoals+8;i++) fact[i]=fact[i-1]*i;
  for(let h=0;h<=maxGoals;h++){const row=[];for(let a=0;a<=maxGoals;a++){let s=0;const kMax=Math.min(h,a);for(let k=0;k<=kMax;k++)s+=Math.pow(lambdaH,k?0:0); // keep explicit recurrence below
    let q=0;for(let k=0;k<=kMax;k++)q+=Math.pow(lambdaH,h-k)*Math.pow(lambdaA,a-k)*Math.pow(lambdaC,k)/(fact[h-k]*fact[a-k]*fact[k]);
    row.push(p0*q);}m.push(row)}return normalizeMatrix(m);
}
function normalizeMatrix(m){const s=m.flat().reduce((a,b)=>a+b,0)||1;return m.map(r=>r.map(x=>x/s));}
function negativeBinomialPmf(k,mu,size=6){const r=size;let p=r/(r+mu),coef=1;for(let i=1;i<=k;i++)coef*=((r+i-1)/i);return coef*Math.pow(1-p,k)*Math.pow(p,r)}
function negativeBinomialMatrix(lh,la,maxGoals=8){const m=[];for(let h=0;h<=maxGoals;h++){const r=[];for(let a=0;a<=maxGoals;a++)r.push(negativeBinomialPmf(h,lh)*negativeBinomialPmf(a,la));m.push(r)}return normalizeMatrix(m)}
function bayesianStrength(home,away,prior=0){const h=Number(home)||0,a=Number(away)||0;const diff=h-a;const posterior=prior+diff;return {difference:posterior,confidence:clamp(0.5+Math.abs(posterior)/200)} }
function playerValue(players=[]){return players.reduce((s,p)=>s+(Number(p.value)||0)*(Number(p.availability ?? 1)),0)}
function tacticalEdge(home={},away={}){const keys=['pressing','transition','possession','setPiece','width','counterAttack'];const vals=keys.map(k=>(Number(home[k])||0)-(Number(away[k])||0));return {score:mean(vals),features:Object.fromEntries(keys.map((k,i)=>[k,vals[i]]))}}
function uncertainty(lambda){return Math.max(0.08,Math.sqrt(Math.max(lambda,0.05))*0.12)}
function ensembleMatrices(matrices,weights){const out=[];for(let i=0;i<matrices[0].length;i++){const row=[];for(let j=0;j<matrices[0][0].length;j++){let x=0,w=0;matrices.forEach((m,k)=>{const wt=weights[k]??1;x+=m[i][j]*wt;w+=wt});row.push(x/(w||1))}out.push(row)}return normalizeMatrix(out)}
function marketSignal(odds={}){const implied=['home','draw','away'].map(k=>Number(odds[k])>1?1/Number(odds[k]):0);const s=implied.reduce((a,b)=>a+b,0)||1;return {home:implied[0]/s,draw:implied[1]/s,away:implied[2]/s}}
module.exports={bivariatePoissonMatrix,negativeBinomialMatrix,bayesianStrength,playerValue,tacticalEdge,uncertainty,ensembleMatrices,marketSignal};
