import {clamp,entropy,round} from './core.js';
import {divergence,upsetRisk} from './market.js';
export function antiBias({result,market={}}){const fav=Math.max(result.home,result.away);const hot=Math.max(market.home??0,market.away??0);return {favoriteBias:clamp(fav-.5,0,.5),marketHeat:hot,biasPenalty:clamp(Math.max(0,hot-.75)*.5,0,.15)};}
export function rankScenarios(scores){return scores.map((x,i)=>({...x,rank:i+1}));}
export function consistencyCheck(prediction){const {result,goals,scores}=prediction;const top=scores?.[0];const scoreResult=top?top.home>top.away?'home':top.home===top.away?'draw':'away':null;const resultPick=Object.entries(result).sort((a,b)=>b[1]-a[1])[0]?.[0];return {scoreResult,resultPick,consistent:scoreResult===resultPick};}
export function decide({prediction,market={}}){const bias=antiBias(prediction);const consistency=consistencyCheck(prediction);const risk=upsetRisk({model:prediction.result,market,heat:Math.max(market.home??0,market.away??0)});return {prediction,bias,consistency,upsetRisk:risk,confidence:round(clamp(1-risk-bias.biasPenalty,0,1),4)};}
