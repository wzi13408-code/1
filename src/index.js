import {aggregateStrength,scoreMatrix} from './models.js';
import {buildFeatures} from './features.js';
import {simulateMatch,scenarioSimulation,blendScenarioMatrices} from './simulation.js';
import {finalPrediction} from './prediction.js';
import {decide} from './decision.js';

export function analyzeMatch(match,{history=[],lineups={},market={},context={},iterations=100000,seed=42}={}){
  const features=buildFeatures(match,{history,lineups,market,context});
  const strength=aggregateStrength({eloHome:features.eloHome,eloAway:features.eloAway,xgHome:features.xgHome,xgAway:features.xgAway,formHome:features.formHome,formAway:features.formAway});
  const lineupHome=1+Math.max(-.12,Math.min(.12,features.lineupImpactHome*.025));
  const lineupAway=1+Math.max(-.12,Math.min(.12,features.lineupImpactAway*.025));
  const base={lambdaHome:strength.lambdaHome*lineupHome,lambdaAway:strength.lambdaAway*lineupAway};
  const scenarios=scenarioSimulation(base);
  const sims=scenarios.map((s,i)=>({...s,sim:simulateMatch({lambdaHome:s.lambdaHome,lambdaAway:s.lambdaAway,iterations:Math.max(5000,Math.floor(iterations*s.weight)),seed:seed+i})}));
  const blended=blendScenarioMatrices(sims);
  const matrix=blended.map(x=>{const [h,a]=x.score.split('-').map(Number);return {home:h,away:a,p:x.prob};});
  const prediction=finalPrediction({matrix,handicap:context.handicap??0});
  const decision=decide({prediction,market});
  return {engine:'XT Engine 4.0',version:'4.0.0',match,features,strength,base,scenarios:scenarios.map(x=>({name:x.name,weight:x.weight,lambdaHome:x.lambdaHome,lambdaAway:x.lambdaAway})),simulation:{iterations,scores:blended.slice(0,20)},prediction,decision};
}

if(import.meta.url===`file://${process.argv[1]}`){const [home='Home',away='Away']=process.argv.slice(2);console.log(JSON.stringify(analyzeMatch({home,away}),null,2));}
