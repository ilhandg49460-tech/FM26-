// FM26+ V7 — server-side data proxy.
// Source: dcaribou/transfermarkt-datasets (CC0).
// The browser receives only the filtered player results.
const zlib = require('zlib');

const PLAYERS_URL = 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/players.csv.gz';
const VALS_URL = 'https://raw.githubusercontent.com/dcaribou/transfermarkt-datasets/master/data/prep/player_valuations.csv.gz';

let playersCache = null;
let valsCache = null;

function parseCSV(text) {
  const out=[]; let row=[], cell='', q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i], n=text[i+1];
    if(c==='"' && q && n==='"'){cell+='"'; i++; continue}
    if(c==='"'){q=!q; continue}
    if(c===',' && !q){row.push(cell);cell='';continue}
    if((c==='\n'||c==='\r')&&!q){
      if(c==='\r'&&n==='\n')i++;
      row.push(cell);cell='';
      if(row.some(x=>x!==''))out.push(row);
      row=[];continue;
    }
    cell+=c;
  }
  if(cell||row.length){row.push(cell);out.push(row)}
  if(!out.length)return[];
  const h=out[0];
  return out.slice(1).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]??'');return o});
}
async function getCSV(url){
  const r=await fetch(url);
  if(!r.ok) throw new Error('Source unavailable: '+r.status);
  const ab=await r.arrayBuffer();
  const buf=Buffer.from(ab);
  const text=zlib.gunzipSync(buf).toString('utf8');
  return parseCSV(text);
}
function ageAt(dob){
  if(!dob)return 99;
  const d=new Date(dob), t=new Date('2025-07-01');
  let a=t.getFullYear()-d.getFullYear();
  if(t.getMonth()<d.getMonth()||(t.getMonth()===d.getMonth()&&t.getDate()<d.getDate()))a--;
  return a;
}
function rating(p,v){
  const age=ageAt(p.date_of_birth), base=Math.log10((+v||0)+1)*10;
  return Math.min(99,Math.round(40+base+(age<21?8:age<24?5:age<28?2:0)));
}
function valFor(id){
  let best=null;
  for(const v of valsCache){
    if(String(v.player_id)!==String(id))continue;
    const d=new Date(v.date);
    if(isNaN(d)||d>new Date('2025-07-01'))continue;
    if(!best||d>new Date(best.date))best=v;
  }
  return best ? +best.market_value_in_eur||0 : 0;
}
function money(v){
  if(v>=1e9)return (v/1e9).toFixed(1)+' Md€';
  if(v>=1e6)return (v/1e6).toFixed(1)+' M€';
  return Math.round(v/1e3)+' k€';
}

module.exports = async (req,res)=>{
  try{
    if(!playersCache) playersCache=await getCSV(PLAYERS_URL);
    const league=(req.query.league||'all').toUpperCase();
    const allowed=new Set(['GB1','ES1','IT1','L1','FR1']);
    const q=String(req.query.q||'').toLowerCase();
    const pos=String(req.query.pos||'all');
    const maxAge=+(req.query.age||35);
    const maxValue=(+(req.query.value||250))*1e6;
    let base=playersCache.filter(p=>allowed.has(String(p.current_club_domestic_competition_id)) &&
      (league==='ALL'||String(p.current_club_domestic_competition_id)===league) &&
      (!q||String(p.name||'').toLowerCase().includes(q)) &&
      (pos==='all'||String(p.position||'')===pos) && ageAt(p.date_of_birth)<=maxAge);
    if(!valsCache) valsCache=await getCSV(VALS_URL);
    const results=base.map(p=>{
      const value=valFor(p.player_id);
      return {id:p.player_id,name:p.name,position:p.position,age:ageAt(p.date_of_birth),
        nationality:p.country_of_citizenship||'',foot:p.foot||'',value,rating:rating(p,value),
        clubId:p.current_club_id||''};
    }).filter(p=>p.value<=maxValue).sort((a,b)=>b.value-a.value).slice(0,100);
    res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({source:'transfermarkt-datasets',asOf:'2025-07-01',count:results.length,players:results});
  }catch(e){
    res.status(502).json({error:'Impossible de charger la base publique',detail:String(e.message)});
  }
};
