// XT Engine 4.0 core numerical primitives.
export const clamp=(x,min=0,max=1)=>Math.min(max,Math.max(min,Number.isFinite(x)?x:min));
export const sigmoid=x=>1/(1+Math.exp(-Math.max(-35,Math.min(35,x))));
export const logit=p=>Math.log(clamp(p,1e-9,1-1e-9)/ (1); 
export const softmax=xs=>{const m=Math.max(...xs);const es=xs.map(x=>Math.exp(x-m));const s=es.reduce((a,b)=>a+b,0);return es.map(x=>x/s);};
export const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:0;
export const weightedMean=(items,weightFn=value=>1)=>{let n=0,d=0;for(const x of items){const w=weightFn(x);n+=x*w;d+=w;}return d?n/d:0;};
export const poissonPmf=(k,lambda)=>{if(k<0||!Number.isInteger(k)||lambda<0)return 0;let p=Math.exp(-lambda);for(let i=1;i<=k;i++)p*=lambda/i;return p;};
export const poissonCdf=(k,lambda)=>{let s=0;for(let i=0;i<=k;i++)s+=poissonPmf(i,lambda);return clamp(s);};
export const seededRng=(seed=Date.now())=>{let t=Number(seed)>>>0;return()=>{t+=0x6D2B79F5;let x=t;x=Math.imul(x^(x>>>15),x|1);x^=x+Math.imul(x^(x>>>7),x|61);return ((x^(x>>>14))>>>0)/4294967296;};};
export const samplePoisson=(lambda,rng=Math.random)=>{const L=Math.exp(-Math.max(0,lambda));let k=0,p=1;do{k++;p*=rng();}while(p>L&&k<100);return k-1;};
export const normalizeWeights=(obj)=>{const s=Object.values(obj).reduce((a,b)=>a+Math.max(0,b),0)||1;return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,Math.max(0,v)/s]));};
export const entropy=ps=>-ps.filter(p=>p>0).reduce((s,p)=>s+p*Math.log2(p),0);
export const safeRatio=(a,b,fallback=0)=>b? a/b:fallback;
export const round=(x,n=4)=>Number(Number(x).toFixed(n));
