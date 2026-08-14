const zlib=require('zlib');

const SOURCE='https://pub-e682421888d945d684bcae8890b0ec20.r2.dev/data/players.csv.gz';
const LEAGUES=new Set(['GB1','ES1','IT1','L1','FR1']);
let cache=null;

function csv(text){
 const out=[];let row=[],cell='',q=false;
 for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
  if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}
  if(c==='"'){q=!q;continue}
  if(c===','&&!q){row.push(cell);cell='';continue}
  if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(Boolean))out.push(row);row=[];cell='';continue}
  cell+=c;
 }
 if(cell||row.length){row.push(cell);out.push(row)}
 const h=out.shift()||[];
 return out.map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]??'');return o})
}
function age(d){if(!d)return 99;const a=new Date(d),b=new Date('2025-07-01');let x=b.getFullYear()-a.getFullYear();if(b.getMonth()<a.getMonth()||(b.getMonth()===a.getMonth()&&b.getDate()<a.getDate()))x--;return x}
function rating(p){const v=+p.market_value_in_eur||0,a=age(p.date_of_birth);return Math.min(99,Math.round(40+Math.log10(v+1)*10+(a<21?8:a<24?5:a<28?2:0)))}
async function load(){
 if(cache)return cache;
 const r=await fetch(SOURCE,{headers:{'Accept-Encoding':'gzip'}});
 if(!r.ok)throw Error('Source R2 HTTP '+r.status);
 const b=Buffer.from(await r.arrayBuffer());
 const t=zlib.gunzipSync(b).toString('utf8');
 cache=csv(t).filter(p=>LEAGUES.has(String(p.current_club_domestic_competition_id))).map(p=>({...p,_age:age(p.date_of_birth),_rating:rating(p)}));
 return cache;
}
module.exports=async(req,res)=>{
 try{
  const data=await load();
  const q=String(req.query.q||'').toLowerCase(),lg=String(req.query.league||'all'),po=String(req.query.pos||'all');
  const maxAge=+(req.query.age||35),maxValue=(+(req.query.value||250))*1e6;
  let list=data.filter(p=>(lg==='all'||p.current_club_domestic_competition_id===lg)&&(po==='all'||p.position===po)&&p._age<=maxAge&&(+p.market_value_in_eur||0)<=maxValue&&(!q||p.name.toLowerCase().includes(q)));
  list.sort((a,b)=>(+b.market_value_in_eur||0)-(+a.market_value_in_eur||0));
  const players=list.slice(0,100).map(p=>({id:p.player_id,name:p.name,position:p.position,age:p._age,nationality:p.country_of_citizenship||'',foot:p.foot||'',value:+p.market_value_in_eur||0,rating:p._rating,clubId:p.current_club_id||'',club:p.current_club_name||''}));
  res.setHeader('Cache-Control','s-maxage=86400, stale-while-revalidate=604800');
  res.status(200).json({ok:true,source:'transfermarkt-datasets R2',referenceDate:'2025-07-01',count:players.length,players});
 }catch(e){res.status(502).json({ok:false,error:e.message})}
}
