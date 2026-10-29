export const GESTURES = [
  {id:'serve',name:'Battuta',short:'B',codes:['+','=']},
  {id:'receive',name:'Ricezione',short:'R',codes:['+','=','#']},
  {id:'attack',name:'Attacco',short:'A',codes:['+','=','#']},
  {id:'block',name:'Muro',short:'M',codes:['+','=']}
];
export const uid = () => crypto.randomUUID();
export const fresh = () => ({schema:1,team:{name:'La mia squadra',players:[]},matches:[],activeId:null});
export const newSet = () => ({id:uid(),starters:[],rallies:[],pending:[],closed:false});
export function score(set){return set.rallies.reduce((a,r)=>(a[r.winner]++,a),{home:0,away:0});}
export function events(set){return [...set.rallies.flatMap(r=>r.events),...set.pending];}
export function tally(list,playerId,gesture,code){return list.filter(e=>(!playerId||e.playerId===playerId)&&(!gesture||e.gesture===gesture)&&(!code||e.code===code)).length;}
export function wins(match){return match.sets.filter(s=>s.closed).reduce((a,s)=>{const p=score(s);if(p.home!==p.away)a[p.home>p.away?'home':'away']++;return a;},{home:0,away:0});}
export function closeRally(set,winner){if(set.closed||!['home','away'].includes(winner))throw Error('Set non disponibile');set.rallies.push({id:uid(),winner,events:set.pending,at:new Date().toISOString()});set.pending=[];}
export function undo(set){if(set.closed)return false;if(set.pending.length){set.pending.pop();return true;}if(set.rallies.length){set.pending=set.rallies.pop().events;return true;}return false;}
export function validSetScore(set,index){const s=score(set);return Math.max(s.home,s.away)>=(index===4?15:25)&&Math.abs(s.home-s.away)>=2;}
function requireValue(ok){if(!ok)throw Error('Backup non valido o incompatibile. Nessun dato è stato modificato.');}
export function validate(data){
 requireValue(data&&data.schema===1&&data.team&&typeof data.team.name==='string'&&Array.isArray(data.team.players)&&Array.isArray(data.matches));
 const id=v=>typeof v==='string'&&/^[A-Za-z0-9_-]{1,80}$/.test(v);
 const player=p=>p&&id(p.id)&&typeof p.first==='string'&&typeof p.last==='string'&&typeof p.number==='string'&&typeof p.role==='string'&&(p.nickname===undefined||(typeof p.nickname==='string'&&p.nickname.length<=40));
 const unique=xs=>new Set(xs).size===xs.length;
 requireValue(data.team.players.every(player)&&unique(data.team.players.map(p=>p.id))&&unique(data.matches.map(m=>m.id)));
 for(const m of data.matches){
  requireValue(m&&id(m.id)&&typeof m.home==='string'&&typeof m.away==='string'&&typeof m.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)&&Number.isFinite(new Date(m.date).getTime())&&['home','away'].includes(m.ourSide)&&typeof m.completed==='boolean'&&Array.isArray(m.players)&&m.players.length>0&&m.players.length<=14&&m.players.every(player)&&unique(m.players.map(p=>p.id))&&Array.isArray(m.sets)&&m.sets.length>0&&m.sets.length<=5);
  for(const s of m.sets){requireValue(s&&id(s.id)&&Array.isArray(s.starters)&&s.starters.every(id=>m.players.some(p=>p.id===id))&&unique(s.starters)&&Array.isArray(s.rallies)&&Array.isArray(s.pending)&&typeof s.closed==='boolean');for(const r of s.rallies)requireValue(r&&id(r.id)&&['home','away'].includes(r.winner)&&Array.isArray(r.events));for(const e of events(s))requireValue(e&&id(e.id)&&m.players.some(p=>p.id===e.playerId)&&GESTURES.some(g=>g.id===e.gesture&&g.codes.includes(e.code)));}
 }
 requireValue(data.activeId===null||data.matches.some(m=>m.id===data.activeId));return data;
}
