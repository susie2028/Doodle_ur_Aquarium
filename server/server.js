/* Doodle your Aquarium 멀티 서버
   - 웹페이지(상위 폴더의 index.html 등)를 그대로 제공하고
   - /ws 웹소켓으로 미니게임 멀티 방 하나를 돌림 (판정은 전부 서버에서)
   실행: node server.js  → http://localhost:3000 */
const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const PORT=process.env.PORT||3000,ROOT=path.resolve(__dirname,'..');
const W=2600,H=1700,FISH=18,PELLETS=170,DASH=.35,COOL=3,EAT=1.18,TICK=1/30,SEND=1/15,MAXP=12;
const rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const NAMES=['몽실','뽀삐','보리','콩이','나비','하늘','모모','단비','별이','솜이','바다','두부','구름','초코','토리','우주','쿠키','만두','하루','동글','말랑','뭉치','방울','반짝'];

/* ---------- 정적 파일 ---------- */
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav','.svg':'image/svg+xml'};
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(new URL(req.url,'http://x').pathname);if(p==='/')p='/index.html';
 const f=path.join(ROOT,p);if(!f.startsWith(ROOT+path.sep)||f.includes(`${path.sep}server${path.sep}`)||f.includes(`${path.sep}.`)){res.writeHead(403);res.end();return}
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('not found');return}res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream'});res.end(d)})});

/* ---------- 게임 상태 ---------- */
let nid=1;const fish=new Map(),pel=[];let events=[],pelEv=[];
const len=f=>76*Math.sqrt(f.m);
const mouth=f=>[f.x+f.dir*len(f)*.42,f.y];
function mk(o){return{id:nid++,x:o.x,y:o.y,vx:0,vy:0,m:o.m,ar:o.ar||.6,dir:1,dash:0,cd:rnd(0,COOL),tx:o.x,ty:o.y,ai:0,alive:true,bot:!!o.bot,name:o.name,img:o.img||null,skin:o.skin??0|Math.random()*10,ws:o.ws||null,best:o.m}}
function freeSpot(){let x,y,k=0;const ps=[...fish.values()].filter(f=>!f.bot&&f.alive);do{x=rnd(200,W-200);y=rnd(200,H-200)}while(ps.some(p=>Math.hypot(p.x-x,p.y-y)<600)&&++k<30);return[x,y]}
function botM(){const ps=[...fish.values()].filter(f=>!f.bot&&f.alive),b=ps.length?ps.reduce((a,f)=>a+f.m,0)/ps.length:1;return Math.random()<.7?cl(b*rnd(.3,.85),.25,40):cl(b*rnd(1.3,2.4),.6,60)}
function addBot(){const [x,y]=freeSpot(),f=mk({x,y,m:botM(),bot:true,name:NAMES[0|Math.random()*NAMES.length]});fish.set(f.id,f);bcast({t:'add',f:pub(f)})}
const addPel=i=>{const p=[rnd(120,W-120)|0,rnd(120,H-120)|0,rnd(4,7)|0];if(i==null)pel.push(p);else{pel[i]=p;pelEv.push([i,...p])}};
for(let i=0;i<PELLETS;i++)addPel();
const pub=f=>({id:f.id,name:f.name,bot:f.bot,skin:f.skin,ar:f.ar,img:f.img,p:f.p||null});
// 커스터마이징 값: 숫자와 짧은 색 문자열만 받음
const cleanP=p=>{if(!p||typeof p!=='object')return null;const o={};let n=0;for(const [k,v] of Object.entries(p)){if(++n>40||k.length>4)return null;if(typeof v==='number'&&Number.isFinite(v))o[k]=v;else if(typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v))o[k]=v}return o};
const dash=f=>{if(f.cd>0||!f.alive)return;f.dash=DASH;f.cd=COOL};
function fill(){const n=[...fish.values()].filter(f=>f.bot).length,ps=[...fish.values()].filter(f=>!f.bot).length;for(let i=n+ps;i<FISH;i++)addBot()}

/* 봇 판단 (솔로 모드와 같은 규칙) */
function think(f){const L=len(f);let th=null,td=1e9,pr=null,pd=1e9;
 for(const o of fish.values()){if(o===f||!o.alive)continue;const d=Math.hypot(o.x-f.x,o.y-f.y);if(o.m>f.m*EAT&&d<td&&d<320+L)th=o,td=d;else if(f.m>o.m*EAT&&d<pd&&d<460+L)pr=o,pd=d}
 if(th&&td<240+L*.5){const a=Math.atan2(f.y-th.y,f.x-th.x)+rnd(-.5,.5);f.tx=f.x+Math.cos(a)*300;f.ty=f.y+Math.sin(a)*300;if(td<150+L*.3&&Math.random()<.5)dash(f)}
 else if(pr){f.tx=pr.x-Math.sign(pr.x-f.x)*L*.4;f.ty=pr.y;if(pd<170+L*.3&&Math.random()<.35)dash(f)}
 else{let b=null,bd=380;for(const p of pel){const d=Math.hypot(p[0]-f.x,p[1]-f.y);if(d<bd)b=p,bd=d}
  if(b){f.tx=b[0];f.ty=b[1]}else if(Math.hypot(f.tx-f.x,f.ty-f.y)<40){f.tx=rnd(150,W-150);f.ty=rnd(150,H-150)}}}
function step(dt){
 for(const f of fish.values()){if(!f.alive)continue;f.cd=Math.max(0,f.cd-dt);f.dash=Math.max(0,f.dash-dt);
  if(f.bot&&(f.ai-=dt)<=0){f.ai=rnd(.2,.35);think(f)}
  const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy)||1,s=Math.min(210/Math.pow(f.m,.17)*(f.dash>0?2.5:1),d*3),a=Math.min(1,dt*(f.dash>0?8:4));
  f.vx+=(dx/d*s-f.vx)*a;f.vy+=(dy/d*s-f.vy)*a;const L=len(f),hh=L*f.ar/2;
  f.x=cl(f.x+f.vx*dt,40+L/2,W-40-L/2);f.y=cl(f.y+f.vy*dt,40+hh,H-40-hh);if(Math.abs(f.vx)>6)f.dir=f.vx>0?1:-1}
 for(const a of fish.values()){if(!a.alive)continue;const [mx,my]=mouth(a),La=len(a);
  for(const b of fish.values()){if(b===a||!b.alive||a.m<b.m*EAT)continue;
   if(Math.hypot(mx-b.x,my-b.y)<len(b)*.32+La*.12){b.alive=false;a.m+=b.m*.7;a.best=Math.max(a.best,a.m);events.push([a.id,'f',b.id]);
    if(b.bot){fish.delete(b.id);bcast({t:'del',id:b.id});setTimeout(fill,1200)}
    else send(b.ws,{t:'dead',by:a.name,best:Math.round(b.best*100)})}}
  for(let i=0;i<pel.length;i++){const p=pel[i];if(Math.hypot(mx-p[0],my-p[1])<La*.2+p[2]+4){a.m+=.035;a.best=Math.max(a.best,a.m);events.push([a.id,'p',p[0],p[1]]);addPel(i)}}}}

/* ---------- 네트워크 ---------- */
const wss=new WebSocketServer({server:srv,path:'/ws',maxPayload:1<<20});
const send=(ws,o)=>{if(ws&&ws.readyState===1)ws.send(JSON.stringify(o))};
const bcast=o=>{const s=JSON.stringify(o);for(const c of wss.clients)if(c.readyState===1&&c.joined)c.send(s)};
wss.on('connection',ws=>{
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch(e){return}
  if(m.t==='join'){const ps=[...fish.values()].filter(f=>!f.bot);if(!ws.f&&ps.length>=MAXP){send(ws,{t:'full'});return}
   if(ws.f){fish.delete(ws.f.id);bcast({t:'del',id:ws.f.id})}
   const img=typeof m.img==='string'&&m.img.startsWith('data:image/')&&m.img.length<700000?m.img:null,name=String(m.name||'이름 없음').slice(0,10);
   const [x,y]=freeSpot(),f=mk({x,y,m:1,name,img,ar:cl(+m.ar||.6,.15,2),ws});f.p=cleanP(m.p);f.cd=0;ws.f=f;fish.set(f.id,f);
   // 봇 하나 줄여서 전체 수 유지
   const bot=[...fish.values()].find(o=>o.bot);if(bot&&fish.size>FISH){fish.delete(bot.id);bcast({t:'del',id:bot.id})}
   ws.joined=true;send(ws,{t:'init',you:f.id,W,H,pel,fish:[...fish.values()].map(pub)});bcast({t:'add',f:pub(f)})}
  else if(m.t==='in'&&ws.f&&ws.f.alive){if(Number.isFinite(m.x)&&Number.isFinite(m.y)){ws.f.tx=cl(m.x,0,W);ws.f.ty=cl(m.y,0,H)}if(m.d)dash(ws.f)}});
 ws.on('close',()=>{if(ws.f){fish.delete(ws.f.id);bcast({t:'del',id:ws.f.id});fill()}})});

let acc=0,sacc=0,prev=Date.now();
setInterval(()=>{const now=Date.now(),dt=Math.min(.1,(now-prev)/1000);prev=now;acc+=dt;sacc+=dt;
 while(acc>=TICK){step(TICK);acc-=TICK}
 if(sacc>=SEND){sacc=0;const f=[...fish.values()].filter(o=>o.alive).map(o=>[o.id,o.x|0,o.y|0,Math.round(o.m*100),o.dir,o.dash>0?1:0,Math.round(o.cd*10)]);
  bcast({t:'s',f,pe:pelEv,ev:events});pelEv=[];events=[]}},1000/60);
fill();
srv.listen(PORT,()=>console.log(`Doodle your Aquarium: http://localhost:${PORT}  (멀티 방 /ws)`));
