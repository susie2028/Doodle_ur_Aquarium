/* ---------- 물방울 공원: 산책 나온 내 물고기와 동네 물고기가 어울리는 사교의 장 ---------- */
(()=>{
const D=window.DUA,P=D.park,$=s=>document.querySelector(s),rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v)),pk=a=>a[0|Math.random()*a.length];
const SC=1.5,W=1800*SC,H=1100*SC,INK='#2b2a63',SKEY='doodle-aquarium-v2-park',NPCN=7;
const G=$('#park'),cv=$('#pkc'),g=cv.getContext('2d');
let cam={z:1,x:W/2,y:H/2},on=false,raf=0,last=0,CW=1,CH=1,ents=[],npcs=[],snacks=[],fx=[],news=[],drag=null,pdn=null,pt0=null,relS={},syncT=0,saveT=0;
const tex=new Image();tex.src='assets/kiboecontor-paper-626781_1920.jpg';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SPOTS=[{k:'forest',x:310,y:650,r:190,n:'수초 숲'},{k:'stage',x:900,y:300,r:180,n:'조개 무대'},{k:'bench',x:1490,y:660,r:170,n:'산호 벤치'},{k:'fountain',x:900,y:830,r:150,n:'거품 분수'}].map(p=>({...p,x:p.x*SC,y:p.y*SC,r:p.r*SC}));
const seeded=(sd,fn)=>{const R=Math.random;let x=sd*9301+49297;Math.random=()=>(x=(x*16807)%2147483647)/2147483647;try{return fn()}finally{Math.random=R}};

/* ---------- 동네 물고기 (저장해 두고 다음에 와도 그대로) ---------- */
const ADJ=['느긋한','날쌘','수줍은','용감한','엉뚱한','새침한','통통한','반짝이는','부지런한','꼬마'],FN=['고등어','송사리','피라미','도미','꽁치','연어','복어','가자미','망둥이','열대어'],SEA=['파도','산호','소라','진주','물결','해초','조개','불가사리','물방울','은비늘'];
const npcName=()=>Math.random()<.5?pk(ADJ)+' '+pk(FN):pk(SEA);
function newNpc(){const seed=1+Math.floor(Math.random()*1e6),used=new Set([...npcs.map(n=>n.name)]);let name;for(let i=0;i<15;i++){name=npcName();if(!used.has(name))break}
 return{nid:'n_'+seed.toString(36)+Date.now().toString(36).slice(-3),seed,name,sex:Math.random()<.5?'M':'F',tr:[pk(Object.keys(P.TR))],af:{}}}
function loadN(){try{const d=JSON.parse(localStorage.getItem(SKEY)||'null');if(d&&Array.isArray(d.n))npcs=d.n.filter(n=>n&&n.nid&&n.seed)}catch(e){}while(npcs.length<NPCN)npcs.push(newNpc())}
function saveN(){try{localStorage.setItem(SKEY,JSON.stringify({n:npcs.map(n=>({nid:n.nid,seed:n.seed,name:n.name,sex:n.sex,tr:n.tr,af:n.af}))}))}catch(e){}}
const pOf=n=>seeded(n.seed,D.genP);
function sprNpc(n){const c=document.createElement('canvas');c.width=630;c.height=420;D.render(c.getContext('2d'),630,420,pOf(n),null,0);const t=D.trimC(c,D.bbox(c,12),[1e4,1e4]);const s=t?D.stick(t,1.5).s:c,k=105/Math.max(s.width,s.height*1.4);return{img:s,w:s.width*k,h:s.height*k}}

/* ---------- 무리 (내 물고기 + 동네 물고기) ---------- */
function mkEnt(o){return{x:rnd(160,W-160),y:rnd(220,H-160),vx:0,vy:0,dir:1,flip:1,tx:0,ty:0,next:0,ph:rnd(0,6.3),say:null,act:'',talk:rnd(2,6),hs:1,...o}}
function myEnt(f,from){const s=P.sprOf(f),k=1.0;return mkEnt({me:true,f,id:f.id,name:f.name,tr:f.tr||[],sex:f.sex,spr:{img:s.img,w:s.w*k,h:s.h*k},y:from?-120:rnd(220,H-160),arrive:!!from})}
function npcEnt(n){return mkEnt({me:false,n,id:n.nid,name:n.name,tr:n.tr,sex:n.sex,spr:sprNpc(n)})}
const afOf=e=>e.me?e.f.af:e.n.af,av=(a,b)=>afOf(a)[b.id]||0;
const addAv=(a,b,dv)=>{const m=afOf(a);m[b.id]=cl((m[b.id]||0)+dv,-100,a.me&&b.me&&P.kin(a.f,b.f)?79:100)};
const stg=(a,b)=>{const v=av(a,b),w=av(b,a);return v<=-50?'라이벌':v>=80&&w>=80?'연인':v>=80?'짝사랑':v>=60?'단짝':v>=30?'친구':'보통'};
const RANK={라이벌:0,보통:1,친구:2,단짝:3,짝사랑:4,연인:5};
const has=(e,k)=>(e.tr||[]).includes(k);
const comp=(a,b)=>{let c=1;if(has(a,'soc')||has(b,'soc'))c+=.4;if((a.tr||[]).some(k=>has(b,k)))c+=.3;for(const [x,y] of [['play','shy'],['neat','glut'],['play','lazy']])if(has(a,x)&&has(b,y)||has(a,y)&&has(b,x))c-=1.7;return c};
const taste=(a,b)=>{let h=7;for(const c of a.id+'|'+b.id)h=(h*31+c.charCodeAt(0))|0;return .5+((h>>>0)%1000)/1000};
function bub(e,s){e.say={s,t:performance.now()/1000,d:Math.min(3.4,1.6+s.length*.08)}}
function hearts(a,b,k){for(let i=0;i<k;i++)fx.push({k:'heart',x:(a.x+b.x)/2+rnd(-30,30),y:Math.min(a.y,b.y)-30-rnd(0,20),t:-i*.18,s:rnd(.9,1.3)})}
function say(t){news.unshift(t);news=news.slice(0,60);$('#pknews').innerHTML='<h4>공원 소식</h4>'+news.map(n=>`<p>${n}</p>`).join('')}
// 관계가 한 단계 올라가면 소식 + 말풍선
function relCheck(a,b){const key=a.id+'>'+b.id,s=stg(a,b),p=relS[key]||'보통';if(s===p)return;relS[key]=s;if(a.me&&b.me)a.f.rs[b.id]=s;if(RANK[s]<RANK[p]&&s!=='라이벌')return;
 const A=esc(a.name),B=esc(b.name);
 if(s==='연인'){relS[b.id+'>'+a.id]='연인';if(a.me&&b.me)b.f.rs[a.id]='연인';bub(a,`${b.name}, 너무 좋아!`);setTimeout(()=>bub(b,`${a.name}, 나도 좋아!`),900);hearts(a,b,6);say(`💕 ${A}와(과) ${B}가 서로 좋아하게 됐어요!`);if(a.me||b.me)P.toast(`💕 공원에서 ${a.name}와(과) ${b.name}가 서로 좋아하게 됐어요!`,4000)}
 else if(s==='짝사랑'){bub(a,pk([`${b.name}… 자꾸 생각나`,`${b.name} 근처만 가면 떨려…`]));hearts(a,b,1);say(`💗 ${A}가 ${B}를 짝사랑하기 시작했어요…`)}
 else if(s==='단짝'){bub(a,`${b.name}, 최고야!`);say(`${A}와(과) ${B}가 단짝이 됐어요`)}
 else if(s==='친구'){bub(a,`${b.name}, 우리 이제 친구야!`);say(`${A}와(과) ${B}가 친구가 됐어요`)}
 else if(s==='라이벌'){bub(a,`${b.name}, 미워!`);say(`💢 ${A}와(과) ${B}는 라이벌이 됐어요`)}}
// 수다: 처음 보는 사이면 성격대로, 아는 사이면 관계대로
const OPEN={glut:['너 간식 있어?','여기 맛있는 거 많대!','분수 옆 먹이 맛집 알아?','나 방금 간식 세 번 먹었어'],shy:['아, 안녕…','저, 저기…','(말 걸어도 되나…?)','그, 그 지느러미 예쁘다…'],play:['술래잡기 할래?','나 잡아봐라~','무대에서 춤 대결 할래?','너 술래!'],lazy:['여기 햇살 좋다…','좀 쉬었다 갈래?','벤치 자리 맡아 놨어…','오늘은 아무것도 안 할 거야'],soc:['안녕! 처음 보는 얼굴이네?','우리 친구 할래?','너 어느 어항에서 왔어?','오늘 공원 사람 많다!'],neat:['여기 깨끗해서 좋다','지느러미 정리 좀 했어','비늘에 모래 묻었어!','오늘 물 맑다~'],d:['안녕~ 산책 나왔어?','날씨 좋다!','너 여기 자주 와?','오늘 뭐 했어?']};
const REPLY={glut:['간식? 어디?!','나도 배고파~','먹을 거 얘기 좋아!','나 지금 침 흘렸어'],shy:['으, 응…','아… 안녕…','고, 고마워…','(얼굴 빨개짐)'],play:['좋아! 잡아봐!','히히 따라와!','나 엄청 빠르다?','져도 울기 없기!'],lazy:['응… 좋네…','천천히 하자~','5분만 쉬고…','그래… 언젠가…'],soc:['응! 반가워!','좋아 좋아!','우리 벌써 친구 같아!','다음에 우리 어항 놀러 와!'],neat:['응, 깔끔하지?','정리 잘 했네!','모래 털어 줄게','깨끗한 게 최고지'],d:['응! 반가워~','날씨 진짜 좋다','자주 와! 난 매일 와','그냥 둥둥 떠다녔어']};
const SPOTL={stage:['오늘 무대는 내가 접수한다!','관객 여러분 박수~!','지느러미 웨이브!','나 춤 좀 추지?'],bench:['여기 앉아서 물멍하자…','벤치 최고…','오늘 하늘(수면) 예쁘다','잠깐 쉬었다 가자'],fountain:['거품 받아라~','거품 터뜨리기 대회!','보글보글 분수다!','이 거품 내 거!'],forest:['여기 숨으면 아무도 몰라…','수초가 간질간질해','쉿… 나 여기 없어','숲속은 조용해서 좋아']};
const tk=e=>(e.tr&&e.tr[0])||'d';
function chat(a,b,boost){const s=stg(a,b);let A,B;
 if(s==='연인'){A=`${b.name}, 보고 싶었어!`;B=`나도, ${a.name}!`}
 else if(s==='라이벌'){A=`흥, ${b.name}잖아`;B=pk(['너 또 왔어?','저리 가!'])}
 else if(s==='짝사랑'){A=pk([`${b.name}… 아, 안녕!`,`(${b.name} 앞이라 떨려…)`]);B=av(b,a)>=30?'응! 안녕~':'어, 안녕?'}
 else if(s==='친구'||s==='단짝'){A=`${b.name}, 또 만났네!`;B=pk(['반가워!','같이 놀자!'])}
 else{A=pk(OPEN[tk(a)]||OPEN.d);B=pk(REPLY[tk(b)]||REPLY.d)}
 a.dir=b.x>a.x?1:-1;b.dir=-a.dir;bub(a,A);setTimeout(()=>{if(on)bub(b,B)},1100);
 const c=comp(a,b),k=boost?14:6;addAv(a,b,k*c*(c>0?taste(a,b):1));addAv(b,a,k*c*(c>0?taste(b,a):1));relCheck(a,b);relCheck(b,a);a.talk=b.talk=rnd(7,12)}

/* ---------- 들어가기 / 나오기 ---------- */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function resize(){const d=Math.min(devicePixelRatio||1,2);CW=innerWidth;CH=innerHeight;cv.width=CW*d;cv.height=CH*d}
addEventListener('resize',()=>{if(!G.hidden)resize()});
async function openPark(){if(!G.hidden)return;$('#m').hidden=true;cam={z:1,x:W/2,y:H/2};resize();G.hidden=false;G.classList.remove('run');$('#pkload').hidden=false;$('#pkcard').hidden=true;
 setTimeout(()=>G.classList.add('on'),20);await sleep(800);
 if(!npcs.length)loadN();ents=[];snacks=[];fx=[];relS={};
 for(const n of npcs){ents.push(npcEnt(n));await sleep(0)}
 for(const f of P.walkers())ents.push(myEnt(f,false));
 for(const a of ents)for(const b of ents)if(a!==b)relS[a.id+'>'+b.id]=stg(a,b);
 cam={z:1,x:W/2,y:H/2};$('#pkload').hidden=true;G.classList.add('run');if(!news.length)say('공원에 온 걸 환영해요!');
 $('#pkhelp').hidden=false;
 on=true;last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function leave(){on=false;news=[];$('#pknews').innerHTML='';cancelAnimationFrame(raf);saveN();P.save();G.classList.remove('on');setTimeout(()=>{G.hidden=true;G.classList.remove('run')},800)}
$('#pkexit').onclick=leave;$('#bpk').onclick=openPark;D.openPark=openPark;

/* ---------- 움직임 ---------- */
function spotFor(e){const lv=ents.find(o=>o!==e&&stg(e,o)==='연인');
 if(lv&&Math.random()<.5)return SPOTS[2];
 const w={forest:has(e,'shy')?4:1,stage:has(e,'play')||has(e,'soc')?3:1,bench:has(e,'lazy')?3:1,fountain:1.5};let s=Math.random()*Object.values(w).reduce((a,b)=>a+b,0);
 for(const p of SPOTS){s-=w[p.k];if(s<=0)return p}return SPOTS[3]}
function step(dt,now){
 if(now-syncT>1000){syncT=now;
  // 새로 산책 나온 물고기는 위에서 둥실 내려오고, 집에 간 물고기는 빠짐
  for(const f of P.walkers())if(!ents.some(e=>e.me&&e.f===f)){ents.push(myEnt(f,true));say(`🫧 ${esc(f.name)}가 산책 나왔어요`)}
  for(const e of ents)if(e.me&&!e.f.walk&&!e.bye){e.bye=1;bub(e,'이제 집에 갈래~');say(`${esc(e.name)}가 집으로 돌아갔어요`)}}
 if(now-saveT>6000){saveT=now;saveN()}
 for(const e of ents){e.talk-=dt;if(e.drag)continue;
  if(e.bye){e.vy-=dt*260;e.y+=e.vy*dt;if(e.y<-200)e.gone=1;continue}
  if(e.arrive){e.y+=(220-e.y)*Math.min(1,dt*2);if(e.y>200){e.arrive=false}continue}
  let sn=null,sd=450;for(const s of snacks){const d=Math.hypot(s.x-e.x,s.y-e.y);if(d<sd){sd=d;sn=s}}
  if(sn){e.tx=sn.x;e.ty=sn.y;if(sd<34){snacks.splice(snacks.indexOf(sn),1);e.ate=now;if(e.me){e.f.hu=Math.max(0,e.f.hu-.15);e.f.bo=Math.max(0,e.f.bo-.05)}
    for(const o of ents)if(o!==e&&now-(o.ate||-1e9)<2500&&Math.hypot(o.x-e.x,o.y-e.y)<180){addAv(e,o,3);addAv(o,e,3);relCheck(e,o);relCheck(o,e)}
    if(Math.random()<.4)bub(e,pk(['냠!','맛있다!','같이 먹으니 맛있다~']))}}
  else if(now>e.next||Math.hypot(e.tx-e.x,e.ty-e.y)<14){if(e.spot&&!e.say&&Math.random()<.35&&Math.hypot(e.x-e.spot.x,e.y-e.spot.y)<e.spot.r)bub(e,pk(SPOTL[e.spot.k]));const p=spotFor(e),a=rnd(0,6.28),r=rnd(0,p.r*.8);e.spot=p;e.tx=cl(p.x+Math.cos(a)*r,90,W-90);e.ty=cl(p.y+Math.sin(a)*r*.6,140,H-90);e.next=now+rnd(4,9)*1000*(has(e,'lazy')?1.6:1)}
  const dx=e.tx-e.x,dy=e.ty-e.y,d=Math.hypot(dx,dy)||1,sp=Math.min((sn?150:70)*(has(e,'lazy')?.7:1),d*2),k=Math.min(1,dt*2.5);
  e.vx+=(dx/d*sp-e.vx)*k;e.vy+=(dy/d*sp-e.vy)*k;
  for(const o of ents){if(o===e||o.bye)continue;const ex=e.x-o.x,ey=e.y-o.y,r=(stg(e,o)==='라이벌'?150:85),q=Math.hypot(ex,ey)||.1;if(q<r){e.vx+=ex/q*(r-q)*dt*4;e.vy+=ey/q*(r-q)*dt*3}}
  e.x=cl(e.x+e.vx*dt,70,W-70);e.y=cl(e.y+e.vy*dt,120,H-70);if(Math.abs(e.vx)>5)e.dir=e.vx>0?1:-1;e.flip+=(e.dir-e.flip)*Math.min(1,dt*9);
  if(e.me){e.f.bo=Math.max(0,e.f.bo-dt/80);e.f.lo=Math.max(0,e.f.lo-dt/80)}}
 ents=ents.filter(e=>!e.gone);
 // 가까이 있으면 조금씩 친해지고, 가끔 수다
 const L=ents.filter(e=>!e.bye&&!e.arrive&&!e.drag);
 for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d>160)continue;const c=comp(a,b);
  addAv(a,b,dt*.5*c*(c>0?taste(a,b):1));addAv(b,a,dt*.5*c*(c>0?taste(b,a):1));relCheck(a,b);relCheck(b,a);
  if(a.talk<=0&&b.talk<=0&&d<150&&Math.random()<dt*.5)chat(a,b);
  if(stg(a,b)==='연인'&&d<130&&Math.random()<dt/6)hearts(a,b,1)}
 for(const e of fx)e.t+=dt;fx=fx.filter(e=>e.t<1.8);
 if(Math.random()<dt*2)fx.push({k:'fb',x:(900+rnd(-50,50))*SC,y:800*SC,t:0,r:rnd(4,9)})}

/* ---------- 그리기 ---------- */
const sc=()=>Math.min(CW/W,CH/H)*.96*cam.z;
const clampC=()=>{const k=sc(),hx=Math.max(0,(W-CW/k)/2),hy=Math.max(0,(H-CH/k)/2);cam.x=cl(cam.x,W/2-hx,W/2+hx);cam.y=cl(cam.y,H/2-hy,H/2+hy)};
const toW=(x,y)=>{const k=sc();return[(x-CW/2)/k+cam.x,(y-CH/2)/k+cam.y]};
cv.addEventListener('wheel',e=>{e.preventDefault();const [bx,by]=toW(e.clientX,e.clientY);cam.z=cl(cam.z*Math.exp(-e.deltaY*.0015),1,3.5);const k=sc();cam.x=bx-(e.clientX-CW/2)/k;cam.y=by-(e.clientY-CH/2)/k;clampC()},{passive:false});
function scenery(t){g.save();g.scale(SC,SC);g.lineCap=g.lineJoin='round';g.strokeStyle=INK;
 // 수초 숲
 g.lineWidth=5;for(let i=0;i<9;i++){const x=180+i*30+Math.sin(i*7)*12,h=150+(i*37%90);g.beginPath();for(let y=0;y<=h;y+=12){const xx=x+Math.sin(y*.04+t*1.2+i)*12*(y/h+.15);y?g.lineTo(xx,760-y):g.moveTo(xx,760)}g.stroke()}
 // 조개 무대
 g.lineWidth=5;g.fillStyle='#fff';g.beginPath();g.moveTo(780,360);for(let a=0;a<=9;a++){const an=Math.PI+a/9*Math.PI;g.lineTo(900+Math.cos(an)*130,360+Math.sin(an)*110)}g.closePath();g.fill();g.stroke();g.lineWidth=3;for(let a=1;a<9;a++){const an=Math.PI+a/9*Math.PI;g.beginPath();g.moveTo(900,360);g.lineTo(900+Math.cos(an)*126,360+Math.sin(an)*106);g.stroke()}g.lineWidth=5;g.beginPath();g.moveTo(740,372);g.lineTo(1060,372);g.stroke()
 // 산호 벤치
 g.lineWidth=5;g.beginPath();g.moveTo(1400,720);g.lineTo(1580,720);g.moveTo(1415,720);g.lineTo(1415,760);g.moveTo(1565,720);g.lineTo(1565,760);g.stroke();
 for(const [x,s] of [[1380,1],[1610,-1]]){g.beginPath();g.moveTo(x,760);g.lineTo(x,640);g.moveTo(x,690);g.lineTo(x+30*s,650);g.moveTo(x,665);g.lineTo(x-24*s,630);g.stroke()}
 // 거품 분수
 g.fillStyle='#fff';g.lineWidth=5;g.beginPath();g.ellipse(900,880,110,30,0,0,6.3);g.fill();g.stroke();g.beginPath();g.moveTo(880,860);g.lineTo(890,820);g.lineTo(910,820);g.lineTo(920,860);g.stroke();
 g.font='400 26px Gaegu,sans-serif';g.textAlign='center';g.fillStyle='rgba(43,42,99,.55)';for(const p of SPOTS)g.fillText(p.n,p.x/SC,p.k==='stage'?412:p.k==='fountain'?940:800);g.restore()}
function speech(e,t){const el=t-e.say.t;if(el>e.say.d){e.say=null;return}const a=Math.min(1,el/.12,(e.say.d-el)/.3);g.save();g.translate(e.x,e.y-e.spr.h/2-46);g.globalAlpha=a;g.font='700 22px Gaegu,sans-serif';
 const w=g.measureText(e.say.s).width/2+16,h=19,q=[];for(let i=0;i<30;i++){const an=i/30*6.283,c=Math.cos(an),s=Math.sin(an);if(i===8)q.push([6,h+3],[-2,h+12],[-7,h+2]);q.push([w*Math.sign(c)*Math.pow(Math.abs(c),.45)+Math.sin(i*7.1)*2.5,h*Math.sign(s)*Math.pow(Math.abs(s),.45)+Math.cos(i*5.3)*2])}
 const p=(dx,dy)=>{g.beginPath();q.forEach((v,i)=>i?g.lineTo(v[0]+dx,v[1]+dy):g.moveTo(v[0]+dx,v[1]+dy));g.closePath()};g.fillStyle='rgba(20,20,40,.16)';p(2,3);g.fill();g.fillStyle='#fff';p(0,0);g.fill();
 g.fillStyle=INK;g.textAlign='center';g.textBaseline='middle';g.fillText(e.say.s,0,1);g.restore()}
function draw(now){const d=cv.width/CW,k=sc(),t=now/1000;g.setTransform(1,0,0,1,0,0);g.fillStyle='#ecebe6';g.fillRect(0,0,cv.width,cv.height);
 g.setTransform(d*k,0,0,d*k,d*(CW/2-cam.x*k),d*(CH/2-cam.y*k));
 g.fillStyle='rgba(20,20,40,.1)';g.fillRect(16,20,W,H);g.fillStyle='#fff';g.fillRect(0,0,W,H);if(tex.complete&&tex.naturalWidth){g.globalAlpha=.35;g.drawImage(tex,0,0,W,H);g.globalAlpha=1}
 g.strokeStyle=INK;g.lineWidth=6;g.strokeRect(0,0,W,H);scenery(t);
 g.fillStyle='#f08a4b';for(const s of snacks){g.beginPath();g.arc(s.x,s.y,6,0,6.3);g.fill()}
 for(const e of [...ents].sort((a,b)=>a.y-b.y)){const dance=e.spot&&e.spot.k==='stage'&&Math.hypot(e.x-e.spot.x,e.y-e.spot.y)<e.spot.r,hide=has(e,'shy')&&e.spot&&e.spot.k==='forest'&&Math.hypot(e.x-e.spot.x,e.y-e.spot.y)<e.spot.r;
  e.hs+=((e.drag?1.35:1)-e.hs)*.25;const w=e.spr.w*e.hs,h=e.spr.h*e.hs,r=Math.max(w,h)*.6+8,y=e.y+Math.sin(t*2.6+e.ph)*5;
  g.save();g.translate(e.x,y);g.save();if(dance)g.rotate(Math.sin(t*6+e.ph)*.25);g.scale(-e.flip,1);g.globalAlpha=hide?.6:1;g.shadowColor='rgba(20,20,40,.3)';g.shadowBlur=6;g.shadowOffsetX=4;g.shadowOffsetY=5;g.drawImage(e.spr.img,-w/2,-h/2,w,h);g.restore();
  if(e.drag){g.strokeStyle=INK;g.lineWidth=2.5;g.setLineDash([9,7]);g.lineDashOffset=-t*40;g.beginPath();g.arc(0,0,r+10,0,6.3);g.stroke();g.setLineDash([])}
  if(dance&&(t+e.ph)%2<1){g.fillStyle=INK;g.font='700 22px Gaegu,sans-serif';g.fillText('♪',r*.8,-r*.7)}
  g.font=`${e.me?700:400} 18px Gaegu,sans-serif`;g.textAlign='center';g.fillStyle=e.me?INK:'rgba(43,42,99,.6)';g.fillText(e.name+(e.me?' ★':''),0,h/2+22);g.restore()}
 for(const e of fx){if(e.t<0||!P.opt.fx)continue;if(e.k==='heart'){const q=e.t/1.6;if(q<1){g.save();g.translate(e.x+Math.sin(e.t*5)*5,e.y-e.t*45);g.scale(e.s,e.s);g.globalAlpha=Math.min(1,(1-q)*2);g.beginPath();g.moveTo(0,6);g.bezierCurveTo(-12,-2,-8,-14,0,-7);g.bezierCurveTo(8,-14,12,-2,0,6);g.closePath();g.fillStyle='#f47a9b';g.fill();g.strokeStyle=INK;g.lineWidth=2.2;g.stroke();g.restore()}}
  else if(e.k==='fb'){const q=e.t/1.8;g.strokeStyle='rgba(43,42,99,'+(1-q)+')';g.lineWidth=2.5;g.beginPath();g.arc(e.x+Math.sin(e.t*4)*8,e.y-e.t*120,e.r,0,6.3);g.stroke()}}
 if(P.opt.say)for(const e of ents)if(e.say)speech(e,t)}
function loop(){if(!on)return;const now=performance.now(),dt=cl((now-last)/1000,0,.05);last=now;step(dt,now);draw(now);raf=requestAnimationFrame(loop)}

/* ---------- 조작: 간식 · 쓰다듬기 · 소개팅(꾹 눌러 옮기기) · 정보 카드 ---------- */
const hit=(x,y)=>[...ents].reverse().find(e=>!e.bye&&Math.abs(e.x-x)<e.spr.w/2+10&&Math.abs(e.y-y)<e.spr.h/2+12);
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);const [x,y]=toW(e.clientX,e.clientY),h=hit(x,y);pdn={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,m:false,e:h,ht:h?setTimeout(()=>{if(pdn&&!pdn.m){drag=h;h.drag=true;bub(h,pk(['어어? 어디 가?','우와 난다!']));$('#pkcard').hidden=true}},250):0}});
cv.addEventListener('pointermove',e=>{const [x,y]=toW(e.clientX,e.clientY);
 if(drag){drag.x=x;drag.y=y;return}
 if(pdn&&Math.hypot(e.clientX-pdn.x,e.clientY-pdn.y)>6){pdn.m=true;clearTimeout(pdn.ht)}
 if(pdn&&pdn.m&&!pdn.e){const k=sc();cam.x=pdn.cx-(e.clientX-pdn.x)/k;cam.y=pdn.cy-(e.clientY-pdn.y)/k;clampC();return}
 // 쓰다듬기: 물고기 위에서 문지르면 하트
 const h=hit(x,y),n=performance.now();if(!h||!pt0||pt0.e!==h||n-pt0.l>600){pt0=h?{e:h,x,y,a:0,l:n,h:0}:null;return}
 pt0.a+=Math.hypot(x-pt0.x,y-pt0.y);pt0.x=x;pt0.y=y;pt0.l=n;if(pt0.a>420&&n-pt0.h>800){pt0.a=0;pt0.h=n;fx.push({k:'heart',x:h.x,y:h.y-h.spr.h/2-10,t:0,s:1});if(h.me)h.f.bo=Math.max(0,h.f.bo-.2);if(Math.random()<.5)bub(h,pk(['헤헤','간지러워~','히히','좋아~']))}});
cv.addEventListener('pointerup',e=>{const [x,y]=toW(e.clientX,e.clientY);if(pdn)clearTimeout(pdn.ht);
 if(drag){const a=drag;a.drag=false;drag=null;a.tx=a.x;a.ty=a.y;a.next=performance.now()+4000;
  // 다른 물고기 옆에 놓으면 소개팅
  const b=ents.filter(o=>o!==a&&!o.bye).sort((p,q)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(q.x-a.x,q.y-a.y))[0];
  if(b&&Math.hypot(b.x-a.x,b.y-a.y)<200){b.tx=b.x;b.ty=b.y;b.next=performance.now()+4000;a.talk=b.talk=0;chat(a,b,true);say(`소개팅! ${esc(a.name)}와(과) ${esc(b.name)}`)}
  pdn=null;return}
 if(pdn&&!pdn.m){const h=pdn.e;if(h)card(h);else{$('#pkcard').hidden=true;for(let i=0;i<5;i++)snacks.push({x:cl(x+rnd(-50,50),80,W-80),y:cl(y+rnd(-30,30),130,H-80)});if(snacks.length>40)snacks.splice(0,snacks.length-40)}}
 pdn=null});
function card(e){const c=$('#pkcard'),rel=ents.filter(o=>o!==e).map(o=>({o,s:stg(e,o)})).filter(r=>r.s!=='보통').sort((a,b)=>RANK[b.s]-RANK[a.s]).slice(0,3);
 c.innerHTML=`<button class="pkx" aria-label="닫기">×</button><h4>${esc(e.name)} <small>${e.me?'내 물고기':'동네 물고기'} · ${e.sex==='M'?'♂':'♀'}</small></h4><p>성격: ${(e.tr||[]).map(k=>P.TR[k]).join(' · ')||'없음'}</p>
  <p class="pkrel">${rel.length?rel.map(r=>`${esc(r.o.name)} — ${r.s==='연인'?'💕 서로 좋아해요':r.s==='짝사랑'?'💗 짝사랑':r.s==='라이벌'?'💢 라이벌':r.s}`).join('<br>'):'아직 친한 물고기가 없어요'}</p>
  <div class="row">${e.me?'<button class="btn" id="pkhome">집에 보내기</button>':P.canAdopt()?'<button class="btn" id="pkadopt">집으로 데려오기</button>':'<button class="btn" disabled>어항에 자리가 없어요</button>'}</div>`;
 c.hidden=false;c.querySelector('.pkx').onclick=()=>c.hidden=true;
 if(e.me)$('#pkhome').onclick=()=>{P.callHome(e.f);c.hidden=true};
 else if($('#pkadopt'))$('#pkadopt').onclick=()=>adopt(e)}
// 동네 물고기 데려오기: 공원을 떠나 내 어항으로 (자리 있는 어항)
function adopt(e){const n=e.n,c=document.createElement('canvas');c.width=420;c.height=280;const p=pOf(n);D.render(c.getContext('2d'),420,280,p,null,0);const t=D.trimC(c,D.bbox(c,10));if(!t)return;
 const f=P.adopt({name:n.name,sex:n.sex,img:t.toDataURL('image/png'),k:'c',p,v:3,tr:n.tr,af:{...n.af},nid:n.nid});if(!f){P.toast('어항에 자리가 없어요');return}
 for(const o of ents)if(o.me&&o.f.af[n.nid]!=null){o.f.af[f.id]=o.f.af[n.nid];delete o.f.af[n.nid]}
 bub(e,'정말? 같이 가는 거야?!');e.bye=1;$('#pkcard').hidden=true;npcs=npcs.filter(x=>x!==n);const nn=newNpc();npcs.push(nn);setTimeout(()=>{if(on)ents.push(npcEnt(nn))},1500);saveN();
 say(`🏠 ${esc(n.name)}를 집으로 데려왔어요!`);P.toast(`${n.name}이(가) 우리 집 어항에 왔어요!`)}
})();
