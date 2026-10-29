/* ---------- 미니게임: 작은 물고기를 잡아먹고 몸집을 키우는 솔로 게임 ---------- */
(()=>{
const D=window.DUA,$=s=>document.querySelector(s),rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const W=3600,H=2300,SAND=H-190,SKINS=32,BOTS=22,PELLETS=300,DASH=.35,COOL=3,EAT=1.18,INK='#2b2a63';
const G=$('#game'),gc=$('#gc'),g=gc.getContext('2d');
let act=false,CW=1,CH=1,run=false,over=false,fish=[],pel=[],fx=[],me=null,cam={x:W/2,y:H/2,z:1},mouse=null,last=0,raf=0,bestRank=99,bestM=1,spr=[],mySpr=null,myName='';
const tex=new Image();tex.src='assets/kiboecontor-paper-626781_1920.jpg';let texP=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// 봇 모양은 정해진 씨앗으로 만들어서 매번 같은 친구들이 나오게
const seeded=(sd,fn)=>{const R=Math.random;let x=sd*9301+49297;Math.random=()=>(x=(x*16807)%2147483647)/2147483647;try{return fn()}finally{Math.random=R}};

/* 바깥 테두리: 어항처럼 삐뚤빼뚤한 선 (한 번만 만들어 둠) */
const RIM=(()=>{const q=[],r=90,c=[[r,r],[W-r,r],[W-r,H-r],[r,H-r]];for(let i=0;i<4;i++){const [cx,cy]=c[i];for(let a=0;a<=8;a++){const t=(i-2)*Math.PI/2+a/8*Math.PI/2;q.push([cx+Math.cos(t)*r+rnd(-5,5),cy+Math.sin(t)*r+rnd(-5,5)])}
 const n=c[(i+1)%4],m=Math.round(Math.hypot(n[0]-cx,n[1]-cy)/70);for(let k=1;k<m;k++){const t=(i-1)*Math.PI/2,ox=Math.cos(t)*r,oy=Math.sin(t)*r;q.push([cx+(n[0]-cx)*k/m+ox+rnd(-5,5),cy+(n[1]-cy)*k/m+oy+rnd(-5,5)])}}return q})();

/* 바닥: 어항처럼 모래 선, 자갈, 흔들리는 수초 */
const FLOOR=(()=>{const top=[];for(let x=60;x<=W-60;x+=40)top.push([x,SAND+Math.sin(x*.008)*14+rnd(-4,4)]);
 const peb=[],NP=24;for(let i=0;i<NP;i++)peb.push([180+(W-360)*(i+rnd(.15,.85))/NP,rnd(SAND+45,H-80),rnd(10,22)]);
 const weed=[],NW=9;for(let i=0;i<NW;i++){const x=220+(W-440)*(i+rnd(.2,.8))/NW;for(let k=0;k<1+(Math.random()<.55);k++)weed.push({x:x+k*rnd(22,34),h:rnd(130,260),ph:rnd(0,6.3)})}return{top,peb,weed}})();
function resize(){const d=Math.min(devicePixelRatio||1,2);CW=innerWidth;CH=innerHeight;gc.width=CW*d;gc.height=CH*d}
addEventListener('resize',()=>{if(!G.hidden)resize()});

/* ---------- 물고기 그림 만들기 ---------- */
// 커스텀 물고기는 2배 해상도로 그려 스티커 테두리를 붙임
function sprFromP(p){const c=document.createElement('canvas');c.width=840;c.height=560;D.render(c.getContext('2d'),840,560,p,null,0);const t=D.trimC(c,D.bbox(c,14),[1e4,1e4]);return t?D.stick(t,2):null}
function sprFromImg(img){return D.stick(D.up(img,1.5),1.5)}
const len=f=>76*Math.sqrt(f.m),score=f=>Math.round(f.m*100);

function mkFish(o){const s=o.spr.s;return{si:o.si??-1,x:o.x,y:o.y,vx:0,vy:0,m:o.m,spr:s,ar:s.height/s.width,name:o.name,me:!!o.me,dir:1,flip:1,dash:0,cd:rnd(0,COOL),ai:0,tx:o.x,ty:o.y,ph:rnd(0,6.3),alive:true,born:performance.now()}}
function spawnBot(m){const live=fish.filter(f=>f.alive&&!f.me),used=new Set(live.map(f=>f.si)),free=spr.map((_,i)=>i).filter(i=>!used.has(i)),si=free.length?free[0|Math.random()*free.length]:0|Math.random()*spr.length;
 let x,y,k=0;do{x=rnd(200,W-200);y=rnd(200,SAND-80)}while(me&&Math.hypot(x-me.x,y-me.y)<600&&++k<20);
 // 이름도 살아 있는 물고기끼리 겹치지 않게
 const names=new Set(fish.filter(f=>f.alive).map(f=>f.name));let nm;for(let i=0;i<20;i++){nm=botName();if(!names.has(nm))break}
 return mkFish({x,y,m:m??botM(),spr:spr[si],si,name:nm})}
// 봇 이름: '느긋한 고등어'처럼 꾸밈말+물고기, 또는 바다에서 온 한 단어
const ADJ=['느긋한','졸린','날쌘','수줍은','용감한','배고픈','까칠한','통통한','반짝이는','심심한','부지런한','엉뚱한','새침한','멋쟁이','꼬마'],
 FN=['고등어','송사리','피라미','도미','꽁치','연어','참치','금붕어','구피','베타','복어','가자미','망둥이','쏘가리','멸치','정어리','갈치','우럭','광어','열대어'],
 SEA=['파도','산호','소라','진주','물결','해초','미역','다시마','조개','불가사리','해파리','물방울','꼬르륵','뽀글','썰물','밀물','모래알','등대','소용돌이','은비늘'];
const botName=()=>Math.random()<.6?ADJ[0|Math.random()*ADJ.length]+' '+FN[0|Math.random()*FN.length]:SEA[0|Math.random()*SEA.length];
// 대부분은 나보다 작게, 일부는 크게 (긴장감)
function botM(){const b=me?me.m:1;return Math.random()<.7?cl(b*rnd(.3,.85),.25,40):cl(b*rnd(1.3,2.4),.6,60)}
const addPel=()=>pel.push({x:rnd(120,W-120),y:rnd(120,SAND-30),r:rnd(4,7),ph:rnd(0,6.3)});

/* ---------- 시작 / 끝 ---------- */
async function enter(){if(!G.hidden)return;act=true;D.zoomIn();resize();G.hidden=false;G.classList.remove('run');$('#gload').hidden=false;$('#gload').textContent='어항 속으로 풍덩!';$('#gover').hidden=true;$('#gpick').hidden=true;$('#grank').hidden=true;$('#gdash').hidden=true;
 setTimeout(()=>G.classList.add('on'),20);await sleep(850);if(!act)return;
 if(!spr.length){$('#gload').textContent='물고기 친구들 부르는 중...';await sleep(30);for(let i=0;i<SKINS;i++){const s=sprFromP(seeded(i+1,D.genP));if(s)spr.push(s);if(i%3===2){$('#gload').textContent=`물고기 친구들 부르는 중... ${Math.round((i+1)/SKINS*100)}%`;await sleep(0)}}}
 if(!act)return;choose()}
function choose(){const list=D.fishList();if(list.length)pick(list);else newFish()}
/* 어항에 있는 물고기로 할지, 새로 만들지 고르기 */
function pick(list){$('#gload').hidden=true;const b=$('#gpick');b.hidden=false;
 b.innerHTML=`<h3>어떤 물고기로 할까요?</h3><p>어항에 있는 물고기를 고르거나 새로 만들어요</p><div class="gpl">${list.map((f,i)=>`<button data-i="${i}"><img src="${f.img}" alt=""><span>${esc(f.name)}</span></button>`).join('')}<button id="gnew" class="gnew"><b>+</b><span>새로 만들기</span></button></div>`;
 b.querySelectorAll('[data-i]').forEach(e=>e.onclick=()=>{const f=list[+e.dataset.i];b.hidden=true;ready(f.name,()=>f.p?sprFromP(f.p)||sprFromImg(f.im):sprFromImg(f.im))});
 $('#gnew').onclick=()=>{b.hidden=true;newFish()}}
function newFish(){$('#gpick').hidden=true;$('#gload').hidden=false;$('#gload').textContent='내 물고기를 만들어 주세요';
 D.openGameDraw(r=>{if(!r){leave();return}ready(r.name,()=>r.p?sprFromP(r.p)||sprFromImg(r.img):sprFromImg(r.img))})}
function ready(name,mk){myName=name;$('#gload').hidden=false;$('#gload').textContent='준비 중...';setTimeout(()=>{mySpr=mk();start()},30)}
function start(){fish=[];pel=[];fx=[];over=false;bestRank=99;me=mkFish({x:W/2,y:H/2,m:1,spr:mySpr,name:myName,me:true});me.cd=0;bestM=1;fish.push(me);
 for(let i=0;i<BOTS;i++)fish.push(spawnBot());for(let i=0;i<PELLETS;i++)addPel();
 cam={x:me.x,y:me.y,z:zoomFor()};$('#gload').hidden=true;$('#gover').hidden=true;$('#grank').hidden=false;$('#gdash').hidden=false;G.classList.add('run');
 help(true);run=true;last=performance.now();uiT=0;hud(last);cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function leave(){act=false;run=false;cancelAnimationFrame(raf);G.classList.remove('on');D.zoomOut();help(false);setTimeout(()=>{G.hidden=true;G.classList.remove('run')},800)}
function help(on){let h=$('#ghelp');if(!on){if(h)h.remove();return}if(!h){h=document.createElement('div');h.id='ghelp';h.className='gbox';G.append(h)}h.textContent='마우스로 헤엄치기 · Space로 돌진 · 나보다 작은 물고기를 먹어요!';clearTimeout(help.t);help.t=setTimeout(()=>h.remove(),6000)}
function gameOver(by){over=true;run=false;const r=$('#gover');r.hidden=false;
 r.innerHTML=`<h3>꿀꺽!</h3><p><b>${esc(by.name)}</b>에게 먹혔어요</p><p>최고 크기 <b>${Math.round(bestM*100)}</b> · 최고 순위 <b>${bestRank}위</b></p><div class="row"><button class="btn" id="gre">다시 하기</button><button class="btn" id="gout">어항으로</button></div>`;
 $('#gre').onclick=start;$('#gout').onclick=leave}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- 조작 ---------- */
gc.addEventListener('pointermove',e=>{mouse={x:e.clientX,y:e.clientY}});
gc.addEventListener('pointerdown',e=>{mouse={x:e.clientX,y:e.clientY}});
const dash=f=>{if(f.cd>0||!f.alive)return;f.dash=DASH;f.cd=COOL};
const doDash=()=>{if(run)dash(me)};
addEventListener('keydown',e=>{if(!run||!$('#m').hidden)return;if(e.code==='Space'){e.preventDefault();doDash()}});
$('#gdb').onclick=doDash;
$('#gexit').onclick=leave;
$('#bgm').onclick=enter;

/* ---------- 움직임 ---------- */
const sp=f=>210/Math.pow(f.m,.17)*(f.dash>0?2.5:1);
const mouth=f=>[f.x+f.dir*len(f)*.42,f.y];
function think(f){const L=len(f);let th=null,td=1e9,pr=null,pd=1e9;
 for(const o of fish){if(o===f||!o.alive)continue;const d=Math.hypot(o.x-f.x,o.y-f.y);if(o.m>f.m*EAT&&d<td&&d<320+L)th=o,td=d;else if(f.m>o.m*EAT&&d<pd&&d<460+L)pr=o,pd=d}
 if(th&&td<240+L*.5){const a=Math.atan2(f.y-th.y,f.x-th.x)+rnd(-.5,.5);f.tx=f.x+Math.cos(a)*300;f.ty=f.y+Math.sin(a)*300;if(td<150+L*.3&&Math.random()<.5)dash(f)}
 else if(pr){f.tx=pr.x;f.ty=pr.y;if(pd<170+L*.3&&Math.random()<.35)dash(f)}
 else{let b=null,bd=380;for(const p of pel){const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<bd)b=p,bd=d}
  if(b){f.tx=b.x;f.ty=b.y}else if(Math.hypot(f.tx-f.x,f.ty-f.y)<40){f.tx=rnd(150,W-150);f.ty=rnd(150,SAND-60)}}}
function step(dt,now){
 for(const f of fish){if(!f.alive)continue;f.cd=Math.max(0,f.cd-dt);f.dash=Math.max(0,f.dash-dt);
  if(f.me){if(mouse)[f.tx,f.ty]=mouseW()}
  else if((f.ai-=dt)<=0){f.ai=rnd(.2,.35);think(f)}
  const dx=f.tx-f.x,dy=f.ty-f.y,d=Math.hypot(dx,dy)||1,s=Math.min(sp(f),d*3),a=Math.min(1,dt*(f.dash>0?8:4));
  f.vx+=(dx/d*s-f.vx)*a;f.vy+=(dy/d*s-f.vy)*a;const L=len(f),hh=L*f.ar/2;
  f.x=cl(f.x+f.vx*dt,40+L/2,W-40-L/2);f.y=cl(f.y+f.vy*dt,40+hh,SAND-hh*.3);
  if(Math.abs(f.vx)>6)f.dir=f.vx>0?1:-1;f.flip+=(f.dir-f.flip)*Math.min(1,dt*10)}
 // 먹기: 몸 어디든 닿으면 꿀꺽 (내가 1.18배 이상 클 때)
 for(const a of fish){if(!a.alive)continue;const La=len(a),rx=La/2,ry=La*a.ar/2,inA=(x,y,p)=>((x-a.x)/(rx+p))**2+((y-a.y)/(ry+p))**2<1;
  for(const b of fish){if(b===a||!b.alive||a.m<b.m*EAT)continue;if(inA(b.x,b.y,len(b)*.2)){b.alive=false;a.m+=b.m*.7;eatFx(a,b,true);if(b.me){gameOver(a);return}setTimeout(()=>{if(!over){const i=fish.indexOf(b);if(i>=0)fish.splice(i,1,spawnBot())}},1200)}}
  for(let i=pel.length-1;i>=0;i--){const p=pel[i];if(inA(p.x,p.y,p.r+4)){pel.splice(i,1);a.m+=.035;if(a.me)eatFx(a,p,false);addPel()}}}
 if(me.m>bestM)bestM=me.m;
 for(const e of fx)e.t+=dt;fx=fx.filter(e=>e.t<1.6)}
const SAY=['냠!','꿀꺽!','맛있다!','냠냠'];
function eatFx(a,b,big){fx.push({k:'suck',x:b.x,y:b.y,f:a,t:0,r:big?len(b)*.18:b.r});if(a.me&&big){fx.push({k:'say',f:a,s:SAY[0|Math.random()*SAY.length],t:0});try{D.snd()}catch(e){}}}

/* ---------- 화면 ---------- */
const sc=()=>Math.min(CW,CH)/900;
const zoomFor=()=>cl(1.15/Math.pow(me.m,.32),.3,1.15);
const mouseW=()=>{const k=cam.z*sc();return[(mouse.x-CW/2)/k+cam.x,(mouse.y-CH/2)/k+cam.y]};
function draw(now){const d=gc.width/CW;g.setTransform(1,0,0,1,0,0);g.fillStyle='#e9e9ec';g.fillRect(0,0,gc.width,gc.height);
 cam.z+=(zoomFor()-cam.z)*.04;cam.x+=(me.x-cam.x)*.12;cam.y+=(me.y-cam.y)*.12;const k=cam.z*sc();
 g.setTransform(d*k,0,0,d*k,d*(CW/2-cam.x*k),d*(CH/2-cam.y*k));g.imageSmoothingQuality='high';
 // 종이 바닥 + 구겨진 텍스쳐 + 삐뚤빼뚤 테두리
 const rim=()=>{g.beginPath();RIM.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()};
 g.fillStyle='rgba(20,20,40,.1)';g.save();g.translate(14,18);rim();g.fill();g.restore();g.fillStyle='#fff';rim();g.fill();
 if(tex.complete&&tex.naturalWidth){if(!texP){texP=g.createPattern(tex,'no-repeat');const z=Math.max(W/tex.naturalWidth,H/tex.naturalHeight);texP.setTransform(new DOMMatrix([z,0,0,z,0,0]))}g.globalAlpha=.3;g.fillStyle=texP;rim();g.fill();g.globalAlpha=1}
 g.save();rim();g.clip();g.strokeStyle=INK;g.lineCap=g.lineJoin='round';const t0=now/1000;
 g.lineWidth=5;for(const w of FLOOR.weed){g.beginPath();for(let y=0;y<=w.h;y+=12){const x=w.x+Math.sin(y*.035+t0*1.3+w.ph)*14*(y/w.h+.15);y?g.lineTo(x,SAND+6-y):g.moveTo(x,SAND+6)}g.stroke()}
 g.lineWidth=5.5;g.beginPath();FLOOR.top.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
 g.lineWidth=4;for(const [x,y,r] of FLOOR.peb){g.beginPath();g.arc(x,y,r,Math.PI*1.05,Math.PI*1.95);g.stroke()}g.restore();
 g.strokeStyle=INK;g.lineWidth=7;g.lineJoin='round';rim();g.stroke();
 for(const p of pel){g.fillStyle='#f08a4b';g.beginPath();g.arc(p.x,p.y+Math.sin(now/600+p.ph)*2,p.r,0,6.3);g.fill()}
 const t=now/1000;
 for(const f of [...fish].sort((a,b)=>a.m-b.m)){if(!f.alive)continue;const L=len(f),h=L*f.ar;g.save();g.translate(f.x,f.y+Math.sin(t*3+f.ph)*3);g.rotate(cl(f.vy/400,-.35,.35)*f.dir*.6);g.scale(-f.flip,1);
  if(f.dash>0){g.globalAlpha=.25;g.drawImage(f.spr,-L/2+L*.25,-h/2,L,h);g.globalAlpha=1}
  g.shadowColor='rgba(20,20,40,.32)';g.shadowBlur=6;g.shadowOffsetX=5;g.shadowOffsetY=6;g.drawImage(f.spr,-L/2,-h/2,L,h);g.restore();
  g.font=`${f.me?700:400} ${18/Math.max(.5,cam.z)}px Gaegu,sans-serif`;g.textAlign='center';g.fillStyle=f.me?INK:'rgba(43,42,99,.6)';g.fillText(f.name,f.x,f.y-h/2-10)}
 for(const e of fx){if(e.k==='suck'){const q=e.t/.4;if(q<1){const f=e.f,[mx,my]=mouth(f),w=q*q*(3-2*q);g.fillStyle='rgba(240,138,75,'+(1-q)+')';g.beginPath();g.arc(e.x+(mx-e.x)*w,e.y+(my-e.y)*w,Math.max(2,e.r*(1-q*.8)),0,6.3);g.fill()}}
  else if(e.k==='say')bubble(e,t)}}
function bubble(e,t){const f=e.f,a=Math.min(1,e.t/.12,(1.6-e.t)/.3);if(a<=0)return;const L=len(f),z=1/Math.max(.45,cam.z);g.save();g.translate(f.x,f.y-L*f.ar/2-28*z);g.scale(z,z);g.globalAlpha=a;
 g.font='700 22px Gaegu,sans-serif';const w=g.measureText(e.s).width/2+16,h=19,q=[];for(let i=0;i<30;i++){const an=i/30*6.283,c=Math.cos(an),s=Math.sin(an);if(i===8)q.push([6,h+3],[-2,h+12],[-7,h+2]);q.push([w*Math.sign(c)*Math.pow(Math.abs(c),.45)+Math.sin(i*7.1)*2.5,h*Math.sign(s)*Math.pow(Math.abs(s),.45)+Math.cos(i*5.3)*2])}
 const p=(dx,dy)=>{g.beginPath();q.forEach((v,i)=>i?g.lineTo(v[0]+dx,v[1]+dy-h-10):g.moveTo(v[0]+dx,v[1]+dy-h-10));g.closePath()};g.fillStyle='rgba(20,20,40,.16)';p(2,3);g.fill();g.fillStyle='#fff';p(0,0);g.fill();
 g.fillStyle=INK;g.textAlign='center';g.textBaseline='middle';g.fillText(e.s,0,-h-9);g.restore()}

/* ---------- 순위표 / 돌진 게이지 ---------- */
let uiT=0;
function hud(now){const gd=$('#gdash');gd.querySelector('i').style.width=(100*(1-me.cd/COOL))+'%';gd.classList.toggle('ready',me.cd<=0);
 if(now-uiT<300)return;uiT=now;const live=fish.filter(f=>f.alive).sort((a,b)=>b.m-a.m),r=live.indexOf(me)+1;if(r&&r<bestRank)bestRank=r;
 const row=(f,i)=>`<li class="${f.me?'me':''}"><span>${i+1}. ${esc(f.name)}</span><small>${score(f)}</small></li>`;
 $('#grank').innerHTML=`<h4>순위</h4><ol>${live.slice(0,5).map(row).join('')}${r>5?`<li class="gap">···</li>${row(me,r-1)}`:''}</ol>`}

function loop(){if(!run)return;const now=performance.now(),dt=cl((now-last)/1000,0,.05);last=now;step(dt,now);if(!run&&!over)return;draw(now);if(run)hud(now);raf=requestAnimationFrame(loop)}
})();
