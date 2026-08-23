function normalize3(a){const s=a.home+a.draw+a.away||1;return {home:a.home/s,draw:a.draw/s,away:a.away/s}}
function marketBaseline(odds={}){const raw={home:Number(odds.home)>1?1/odds.home:0,draw:Number(odds.draw)>1?1/odds.draw:0,away:Number(odds.away)>1?1/odds.away:0};return normalize3(raw)}
function uniformBaseline(){return {home:1/3,draw:1/3,away:1/3}}
function empiricalBaseline(history=[]){if(!history.length)return uniformBaseline();let h=0,d=0,a=0;history.forEach(x=>{if(x.homeGoals>x.awayGoals)h++;else if(x.homeGoals===x.awayGoals)d++;else a++});return normalize3({home:h/history.length,draw:d/history.length,away:a/history.length})}
module.exports={marketBaseline,uniformBaseline,empiricalBaseline};
