import {clamp,safeRatio} from './core.js';
export function impliedProbability(odds){return odds>1?1/odds:0;}
export function removeOverround(odds){const raw=odds.map(impliedProbability);const s=raw.reduce((a,b)=>a+b,0)||1;return raw.map(x=>x/s);}
export function marketSignal(open={},current={}){const keys=['home','draw','away','over25','under25'];const move={};for(const k of keys){if(open[k]&&current[k])move[k]=(current[k]-open[k])/open[k];}return move;}
export function divergence(model,market){return {home:(model.home??0)-(market.home??0),draw:(model.draw??0)-(market.draw??0),away:(model.away??0)-(market.away??0)};}
export function sentiment({model,market,publicPct={}}){const d=divergence(model,market);const heat=Math.max(...Object.values(publicPct),0);return {divergence:d,heat,contrarian:Math.abs(d.home)>.08||Math.abs(d.away)>.08};}
export function upsetRisk({model,market,heat=0}){const fav=Math.max(model.home??0,model.away??0);const mismatch=Math.max(0,heat-fav);return clamp(.15+.45*mismatch+.25*(1-fav),.02,.85);}
