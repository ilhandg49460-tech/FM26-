const clubs={"France": ["Paris Saint-Germain", "Olympique de Marseille", "Olympique Lyonnais", "AS Monaco", "Lille OSC", "Stade Rennais", "OGC Nice", "RC Lens", "RC Strasbourg", "FC Nantes", "Toulouse FC", "Montpellier HSC", "Stade Brestois 29", "AJ Auxerre", "FC Lorient", "Angers SCO", "Le Havre AC", "FC Metz", "AS Saint-Étienne", "Girondins de Bordeaux"], "Angleterre": ["Manchester City", "Liverpool", "Arsenal", "Manchester United", "Chelsea", "Tottenham", "Newcastle United", "Aston Villa", "West Ham", "Brighton", "Crystal Palace", "Everton", "Wolverhampton", "Fulham", "Brentford", "Nottingham Forest", "Leicester City", "Leeds United", "Southampton", "Sunderland"], "Espagne": ["Real Madrid", "FC Barcelona", "Atlético de Madrid", "Athletic Club", "Real Sociedad", "Villarreal", "Real Betis", "Sevilla FC", "Valencia CF", "Girona FC", "Celta Vigo", "Getafe", "Osasuna", "Rayo Vallecano", "Mallorca", "Las Palmas", "Alavés", "Espanyol"], "Italie": ["Inter Milan", "AC Milan", "Juventus", "Napoli", "AS Roma", "Lazio", "Atalanta", "Fiorentina", "Bologna", "Torino", "Genoa", "Sampdoria", "Udinese", "Sassuolo", "Parma", "Cagliari", "Lecce", "Monza"], "Allemagne": ["Bayern Munich", "Borussia Dortmund", "Bayer Leverkusen", "RB Leipzig", "Eintracht Frankfurt", "VfB Stuttgart", "Borussia Mönchengladbach", "Wolfsburg", "Werder Bremen", "SC Freiburg", "Mainz 05", "Union Berlin", "Hoffenheim", "FC Augsburg", "Hamburger SV", "Schalke 04", "Hertha Berlin", "FC Köln"], "Pays-Bas": ["Ajax", "PSV Eindhoven", "Feyenoord", "AZ Alkmaar", "FC Utrecht", "Twente", "Vitesse", "Groningen", "Heerenveen", "Sparta Rotterdam"], "Portugal": ["Benfica", "FC Porto", "Sporting CP", "Braga", "Vitória Guimarães", "Boavista", "Rio Ave", "Famalicão", "Gil Vicente"], "Belgique": ["Club Brugge", "RSC Anderlecht", "Racing Genk", "Standard Liège", "Royal Antwerp", "Gent", "Union Saint-Gilloise", "Charleroi"], "Turquie": ["Galatasaray", "Fenerbahçe", "Beşiktaş", "Trabzonspor", "Başakşehir", "Adana Demirspor", "Konyaspor", "Antalyaspor"], "Arabie saoudite": ["Al Hilal", "Al Nassr", "Al Ittihad", "Al Ahli", "Al Ettifaq", "Al Shabab"], "Écosse": ["Celtic", "Rangers", "Aberdeen", "Hearts", "Hibernian"], "Brésil": ["Flamengo", "Palmeiras", "Corinthians", "São Paulo", "Santos", "Grêmio", "Internacional", "Fluminense", "Botafogo", "Atlético Mineiro"], "Argentine": ["River Plate", "Boca Juniors", "Racing Club", "Independiente", "San Lorenzo", "Estudiantes", "Lanús", "Rosario Central"]};
const players=[
{name:'Elyas R.',pos:'ATT',age:19,value:8.5,pot:86,pace:91,tech:84,foot:'Droit',club:'Lorient'},
{name:'Mathis K.',pos:'MIL',age:20,value:11,pot:84,pace:78,tech:88,foot:'Droit',club:'Nantes'},
{name:'Ibrahim S.',pos:'ATT',age:18,value:5.5,pot:88,pace:94,tech:80,foot:'Gauche',club:'Metz'},
{name:'Lucas M.',pos:'DEF',age:21,value:7,pot:82,pace:76,tech:79,foot:'Droit',club:'Troyes'},
{name:'Noah B.',pos:'MIL',age:19,value:9,pot:87,pace:85,tech:91,foot:'Gauche',club:'Reims'},
{name:'Yanis D.',pos:'DEF',age:20,value:4.5,pot:83,pace:88,tech:77,foot:'Droit',club:'Caen'},
{name:'Sacha T.',pos:'ATT',age:21,value:13,pot:85,pace:89,tech:87,foot:'Droit',club:'Rennes'},
{name:'Milan A.',pos:'MIL',age:18,value:3.8,pot:90,pace:82,tech:89,foot:'Gauche',club:'Auxerre'},
{name:'Adam N.',pos:'GK',age:20,value:6,pot:89,pace:72,tech:81,foot:'Droit',club:'Le Havre'},
{name:'Kylian P.',pos:'DEF',age:22,value:10.5,pot:86,pace:84,tech:82,foot:'Gauche',club:'Brest'}];

function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0)}
function updateClub(){let [name,badge,budget,rep]=clubSelect.value.split('|');clubName.textContent=name;clubBadge.textContent=badge;clubBudget.textContent=budget.replace('.',',')+' M€';clubRep.textContent='Réputation '+rep+'/5';saveClub()}
function saveClub(){let [name,badge,budget,rep]=clubSelect.value.split('|');localStorage.setItem('fm26club',JSON.stringify({name,badge,budget,rep,objective:objective.value,wage:wage.value}));clubResult.innerHTML=`<b>✅ Profil enregistré</b><br>${name} · objectif <strong>${objective.value}</strong> · masse salariale ${wage.value} k€/mois.`}
function loadClub(){let c=JSON.parse(localStorage.getItem('fm26club')||'null');if(!c)return;for(let o of clubSelect.options)if(o.value.startsWith(c.name+'|')){clubSelect.value=o.value;break}objective.value=c.objective||objective.value;wage.value=c.wage||85;updateClub()}
function renderPlayers(){let q=(search.value||'').toLowerCase(),p=pos.value,f=foot.value,pm=+pot.value||0,am=+age.value||99,vm=+price.value||999,s=sort.value;let list=players.filter(x=>(!q||(x.name+' '+x.club).toLowerCase().includes(q))&&(p==='all'||x.pos===p)&&(f==='all'||x.foot===f)&&x.pot>=pm&&x.age<=am&&x.value<=vm).sort((a,b)=>s==='pot'?b.pot-a.pot:s==='value'?b.value-a.value:a.age-b.age);playersDiv.innerHTML=list.map(x=>`<div class="player"><div><b>${x.name}</b><br><small>${x.pos} · ${x.age} ans · ${x.club} · ${x.foot}</small><br><small>VIT ${x.pace} · TEC ${x.tech} · ${x.value} M€</small></div><div class="rating">POT<br>${x.pot}</div></div>`).join('')||'<div class="result">Aucun profil ne correspond.</div>'}
function negotiate(){let v=+mv.value,s=+seller.value,a=+playerAge.value,c=+competition.value,adj=v*s*a*c,initial=adj*.84,max=adj*1.1;deal.innerHTML=`<b>💰 Plan de négociation</b><br>Valeur ajustée : <strong>${adj.toFixed(1)} M€</strong><br>Offre de départ : <strong>${initial.toFixed(1)} M€</strong><br>Zone confortable : <strong>${adj.toFixed(1)}–${(adj*1.05).toFixed(1)} M€</strong><br>Plafond : <strong>${max.toFixed(1)} M€</strong><br><br>🎯 Commence bas, ajoute des bonus plutôt que de gonfler immédiatement le fixe.`}
function analyze(){let out=[];if(gk.value==='Faible')out.push('🔴 Gardien : priorité haute');if(cb.value==='Faible')out.push('🔴 Défense centrale : priorité très haute');if(mid.value==='Faible')out.push('🟠 Milieu : priorité haute');if(att.value==='Faible')out.push('🟠 Attaque : priorité haute');if(!out.length)out.push('🟢 Effectif équilibré : cherche surtout de la profondeur et du potentiel.');analysis.innerHTML='<b>📊 Diagnostic FM26+</b><br><br>'+out.join('<br>')+'<br><br><b>Plan :</b> cible d’abord le poste le plus faible, puis une pépite à potentiel élevé.'}
function coach(){let o=opp.value,p=problem.value.toLowerCase(),text=o.includes('4-3-3')?'Ferme les demi-espaces et cible la zone derrière leurs latéraux.':o.includes('5-3-2')?'Écarte le bloc, utilise les ailes et évite les centres trop précoces.':o.includes('4-2-3-1')?'Gêne leur numéro 10 et attaque rapidement après récupération.':'Protège l’axe et prépare des transitions rapides.';if(p.includes('bless'))text+=' Avec les blessures, réduis le pressing et garde un banc polyvalent.';coachResult.innerHTML=`<b>🧠 Plan de match</b><br>${text}<br><br>🎯 <b>Consigne clé :</b> ne change pas plus de 2–3 paramètres au coup d’envoi.`}
function updatePitch(){formationLabel.textContent=formation.value}
const playersDiv=document.getElementById('players');loadClub();renderPlayers();
function initClubs(){
 const leagues=Object.keys(clubs);
 leagueSelect.innerHTML=leagues.map(l=>`<option>${l}</option>`).join('');
 populateClubs();
}
function populateClubs(){
 const league=leagueSelect.value||Object.keys(clubs)[0], q=(clubSearch.value||'').toLowerCase();
 const list=(clubs[league]||[]).filter(c=>c.toLowerCase().includes(q));
 clubSelect.innerHTML=list.map(c=>`<option value="${c}">${c}</option>`).join('');
 if(list.length){updateClub();}
}
function slugBadge(name){
 return name.split(/\s+/).filter(Boolean).slice(0,3).map(x=>x[0]).join('').toUpperCase().slice(0,3);
}
function estimateBudget(name){
 const top=['Paris Saint-Germain','Real Madrid','FC Barcelona','Manchester City','Liverpool','Bayern Munich','Inter Milan','AC Milan','Juventus','Arsenal','Chelsea','Al Hilal','Al Nassr','Flamengo','River Plate'];
 if(top.includes(name)) return 80;
 const medium=['Olympique de Marseille','AS Monaco','Lille OSC','Stade Rennais','OGC Nice','RC Lens','Newcastle United','Aston Villa','Atlético de Madrid','Napoli','AS Roma','Borussia Dortmund','RB Leipzig','Benfica','FC Porto','Sporting CP','Galatasaray','Fenerbahçe'];
 if(medium.includes(name)) return 40;
 return 18.5;
}
function updateClub(){
 const name=clubSelect.value;if(!name)return;
 const budget=estimateBudget(name);
 clubName.textContent=name;clubBadge.textContent=slugBadge(name);clubBudget.textContent=budget.toString().replace('.',',')+' M€';
 clubRep.textContent=budget>=80?'Réputation 5/5':budget>=40?'Réputation 4/5':'Réputation 3/5';
 saveClub();
}
function saveClub(){
 const name=clubSelect.value;
 if(!name)return;
 const data={name,league:leagueSelect.value,budget:estimateBudget(name),objective:objective.value,wage:wage.value};
 localStorage.setItem('fm26club',JSON.stringify(data));
 clubResult.innerHTML=`<b>✅ Club enregistré</b><br>${name} · ${data.league}<br>Budget de référence : <strong>${data.budget} M€</strong> · Objectif : <strong>${data.objective}</strong>.`;
}
function loadClub(){
 initClubs();
 const c=JSON.parse(localStorage.getItem('fm26club')||'null');
 if(!c)return;
 if(clubs[c.league]) leagueSelect.value=c.league;
 populateClubs();
 for(const o of clubSelect.options) if(o.value===c.name){clubSelect.value=c.name;break}
 objective.value=c.objective||objective.value;
 wage.value=c.wage||85;
 updateClub();
}

loadClub();
renderPlayers();

async function searchRealDB(){
 const status=document.getElementById('dbStatus'),box=document.getElementById('realPlayers');
 status.innerHTML='<b>⏳ Première recherche...</b><br>Le serveur charge la base publique. Les recherches suivantes seront beaucoup plus rapides.';
 const p=new URLSearchParams({q:document.getElementById('realSearch').value||'',league:document.getElementById('realLeague').value,pos:document.getElementById('realPos').value,age:document.getElementById('realAge').value||35,value:document.getElementById('realValue').value||250});
 try{
  const r=await fetch('/api/players?'+p.toString()),d=await r.json();
  if(!r.ok||!d.ok)throw Error(d.error||'Erreur API');
  status.innerHTML=`<b>✅ Base disponible</b><br>${d.count} résultat(s) · référence ${new Date(d.referenceDate).toLocaleDateString('fr-FR')} · source ${d.source}.`;
  box.innerHTML=d.players.map(x=>`<div class="player"><div><b>${x.name}</b><br><small>${x.position} · ${x.age} ans · ${x.nationality||'—'} · ${x.foot||'—'}</small><br><small>${formatMoney(x.value)}</small></div><div class="rating">${x.rating}</div></div>`).join('')||'<div class="result">Aucun joueur.</div>';
 }catch(e){status.innerHTML='<b>❌ API indisponible</b><br>'+e.message+'<br><small>Teste ensuite /api/health si nécessaire.</small>'}
}
function formatMoney(v){if(v>=1e9)return(v/1e9).toFixed(1)+' Md€';if(v>=1e6)return(v/1e6).toFixed(1)+' M€';return Math.round(v/1e3)+' k€'}

let lastScoutingResults=[];
function clubBudget(){
 try{return JSON.parse(localStorage.getItem('fm26club')||'null')?.budget||18.5}catch(e){return 18.5}
}
function compatibility(p){
 const budget=clubBudget();
 const value=p.value/1e6;
 const budgetScore=value<=budget?35:Math.max(0,35-(value-budget)/budget*35);
 const ageScore=p.age<=23?20:p.age<=26?16:p.age<=29?12:p.age<=32?7:3;
 const ratingScore=Math.min(30,Math.max(0,(p.rating-50)*0.6));
 const posScore=p.position?15:0;
 return Math.max(0,Math.min(100,Math.round(budgetScore+ageScore+ratingScore+posScore)));
}
function renderScoutPlayers(list){
  lastScoutingResults=list||[];
  const box=document.getElementById('realPlayers');
  box.innerHTML=lastScoutingResults.map((p,i)=>`<div class="player scout-player" data-player-index="${i}">
    <div><b>${escapeHtml(p.name)}</b><br>
    <small>${escapeHtml(p.position||'—')} · ${p.age} ans · ${escapeHtml(p.nationality||'—')}</small><br>
    <small>${formatMoney(p.value)} · ${compatibility(p)}% compatible</small></div>
    <div class="rating">${p.rating}</div>
  </div>`).join('')||'<div class="result">Aucun joueur.</div>';
  box.querySelectorAll('.scout-player').forEach(el=>{
    el.addEventListener('click',()=>openPlayerModal(Number(el.dataset.playerIndex)));
  });
}
function escapeHtml(s){
  return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
async function findGems(){
 const status=document.getElementById('dbStatus');
 status.innerHTML='<b>⏳ Recherche des pépites...</b>';
 try{
  const r=await fetch('/api/players?league=all&pos=all&age=23&value=50');
  const d=await r.json(); if(!r.ok)throw Error(d.error||'Erreur API');
  const gems=(d.players||[]).filter(p=>p.age<=23&&p.value>0).sort((a,b)=>(compatibility(b)-compatibility(a))||(b.rating-a.rating)).slice(0,30);
  status.innerHTML=`<b>💎 ${gems.length} pépites trouvées</b><br>Moins de 24 ans · valeur ≤ 50 M€`;
  renderScoutPlayers(gems);
 }catch(e){status.innerHTML='<b>❌ Impossible de charger les pépites</b><br>'+e.message}
}
const oldSearchRealDB=searchRealDB;
searchRealDB=async function(){
 await oldSearchRealDB();
 // Parse rendered API response is not exposed by old function, so query again for structured data.
 try{
  const q=encodeURIComponent(document.getElementById('realSearch').value||''),league=document.getElementById('realLeague').value,pos=document.getElementById('realPos').value,age=document.getElementById('realAge').value||35,value=document.getElementById('realValue').value||250;
  const r=await fetch(`/api/players?q=${q}&league=${league}&pos=${pos}&age=${age}&value=${value}`);const d=await r.json();if(r.ok)renderScoutPlayers(d.players||[]);
 }catch(e){}
}

document.addEventListener('DOMContentLoaded',()=>{
 const c=document.getElementById('modalClose'),m=document.getElementById('playerModal');
 if(c)c.addEventListener('click',closePlayerModal);
 if(m)m.addEventListener('click',e=>{if(e.target.dataset.closePlayer)closePlayerModal()});
});

// V13 robust player-card click fallback
document.addEventListener('click', function(e){
  const card=e.target.closest && e.target.closest('.scout-player');
  if(card){
    const i=parseInt(card.getAttribute('data-player-index'),10);
    if(Number.isFinite(i) && typeof openPlayerModal==='function') openPlayerModal(i);
  }
});
