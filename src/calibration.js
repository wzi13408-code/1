import {clamp,mean} from './core.js';
export function brier(predictions){return mean(predictions.map(x=>{const p=clamp(x.probability),y=x.actual?1:0;return (p-y)**2;}));}
export function logLoss(predictions){return -mean(predictions.map(x=>{const p=clamp(x.probability,1e-12,1-1e-12),y=x.actual?1:0;return y*Math.log(p)+(1-y)*Math.log(1-p);}));}
export function reliability(predictions,bins=10){const out=[];for(let i=0;i<bins;i++){const lo=i/bins,hi=(i+1)/bins,group=predictions.filter(x=>x.probability>=lo&&x.probability<(i===bins-1?1.01:hi));out.push({bin:[lo,hi],n:group.length,predicted:mean(group.map(x=>x.probability)),actual:mean(group.map(x=>x.actual?1:0))});}return out;}
export function evaluate(predictions){return {brier:brier(predictions),logLoss:logLoss(predictions),reliability:reliability(predictions)};}
