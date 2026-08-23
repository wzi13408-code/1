const {sortAndValidate}=require('./historical-data');
const {marketBaseline,uniformBaseline,empiricalBaseline}=require('./baselines');
const {optimize}=require('./weight-optimizer');
const {evaluate}=require('./backtest-advanced');
function outcome(x){return x.homeGoals>x.awayGoals?'home':x.homeGoals===x.awayGoals?'draw':'away'}
function expanding(rows,predictor,{minTrain=100,retrainEvery=1}={}){const data=sortAndValidate(rows),predictions=[],folds=[];let weights=null;for(let i=minTrain;i<data.length;i++){const test=data[i],train=data.slice(0,i);if(!weights||((i-minTrain)%retrainEvery===0)){const hist=predictions.filter(x=>x.foldIndex<i);if(hist.length>=20){weights=optimize(hist).weights}}const p=predictor({match:test,history:train,weights});const market=marketBaseline(test.oddsAtCutoff||{});const uniform=uniformBaseline();const xt=p.xt||p;predictions.push({foldIndex:i,date:test.date,id:test.id,actual:outcome(test),xt,market,uniform,weights});folds.push({i,date:test.date,trainSize:train.length,weights});}return {predictions,folds,metrics:{xt:evaluate(predictions.map(x=>({pred:x.xt,actual:x.actual==='home'?'H':x.actual==='draw'?'D':'A'})))},leakageSafe:true};}
module.exports={expanding};
