function transition(state,event){const s={...state};if(event==='homeGoal')s.homeGoals=(s.homeGoals||0)+1;if(event==='awayGoal')s.awayGoals=(s.awayGoals||0)+1;if(event==='redHome')s.homeRed=true;if(event==='redAway')s.awayRed=true;return s}
function pressure(state,minute){const diff=(state.awayGoals||0)-(state.homeGoals||0);const late=minute>=70?1.25:1;return {home:diff<0?1.1*late:diff>0?0.85:1,away:diff>0?1.1*late:diff<0?0.85:1}}
module.exports={transition,pressure};
