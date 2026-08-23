const A=require('./advanced-models');
function poisson(k,l){let p=Math.exp(-l);for(let i=1;i<=k;i++)p*=l/i;return p}
function poissonMatrix(h,a,max=8){const m=[];for(let i=0;i<=max;i++){const r=[];for(let j=0;j<=max;j++)r.push(poisson(i,h)*poisson(j,a));m.push(r)}return A.ensembleMatrices([m],[1])}
function blend(input={}){const h=Math.max(0.05,Number(input.lambdaHome)||1.2),a=Math.max(0.05,Number(input.lambdaAway)||1);const dc=A.bivariatePoissonMatrix(h,a,Number(input.correlation)||0.04,8);const nb=A.negativeBinomialMatrix(h,a,8);const pois=poissonMatrix(h,a,8);const bay=A.bayesianStrength(input.homeStrength,input.awayStrength);
 const weights=[0.45,0.2,0.25];const matrix=A.ensembleMatrices([dc,nb,pois],weights);return {matrix,models:{bivariatePoisson:dc,negativeBinomial:nb,poisson:pois,bayesian:bay},weights,uncertainty:{home:A.uncertainty(h),away:A.uncertainty(a)}}}
module.exports={blend};
