import {clamp} from './core.js';
export function correlation(a,b){return clamp((a.sharedOutcome?0.08:0)+(a.market===b.market?.04:0),-.25,.25);}
export function jointProbability(picks){let p=1;for(let i=0;i<picks.length;i++)for(let j=i+1;j<picks.length;j++){p*=1+correlation(picks[i],picks[j]);}return picks.reduce((s,x)=>s*x.prob,1)*p;}
export function optimizeParlay(picks,{size=3,maxCorrelation=.18}={}){const sorted=[...picks].sort((a,b)=>b.prob-a.prob);const chosen=[];for(const p of sorted){if(chosen.length>=size)break;const ok=chosen.every(x=>Math.abs(correlation(x,p))<=maxCorrelation);if(ok)chosen.push(p);}return {picks:chosen,probability:jointProbability(chosen),risk:1-jointProbability(chosen)};}
export function buildParlays(picks,sizes=[3,4,6,8]){return Object.fromEntries(sizes.map(size=>[size,optimizeParlay(picks,{size})]));}
