function counterfactual(input={},changes={}){const base={...input};const alt={...input,...changes};const fields=['lambdaHome','lambdaAway','homeStrength','awayStrength'];const delta={};for(const k of fields){if(k in base||k in alt)delta[k]=(Number(alt[k])||0)-(Number(base[k])||0)}return {baseline:base,counterfactual:alt,delta}}
module.exports={counterfactual};
