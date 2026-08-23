import {resultProbabilities,goalsProbabilities,scoreMatrix} from './models.js';
import {clamp} from './core.js';
export function deriveMarkets(matrix){const r=resultProbabilities(matrix),g=goalsProbabilities(matrix);return {result:r,goals:g,mostLikelyScores:matrix.slice(0,3),halftimeProxy:{home:clamp(r.home*.55+r.draw*.45),draw:clamp(r.draw*.7),away:clamp(r.away*.55+r.draw*.45)}};}
export function selectTwoScores(matrix,{differentScripts=true}={}){const first=matrix[0];if(!differentScripts)return matrix.slice(0,2);const firstHome=first.home>first.away,firstDraw=first.home===first.away;const second=matrix.slice(1).find(x=>{const isHome=x.home>x.away,isDraw=x.home===x.away;return isHome!==firstHome||isDraw!==firstDraw;})??matrix[1];return [first,second];}
export function handicapMatrix(matrix,handicap=0){const out={home:0,draw:0,away:0};for(const x of matrix){const d=x.home+handicap-x.away;if(d>0)out.home+=x.p;else if(d===0)out.draw+=x.p;else out.away+=x.p;}return out;}
export function finalPrediction({matrix,handicap=0}){const markets=deriveMarkets(matrix);return {...markets,handicap:handicapMatrix(matrix,handicap),scores:selectTwoScores(matrix)};}
