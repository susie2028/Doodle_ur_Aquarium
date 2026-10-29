(()=>{
const DUA=window.DUA={gameCb:null};
const KEY='doodle-aquarium-v2',MAX=15,DAY=60,ADULT=180,COOL=300,WW=1280,WH=720,BOT=515,EGGY=514;
const $=s=>document.querySelector(s),rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const svg=p=>`<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC={fish:'<path d="M5 27c7-10 18-10 24 0-6 10-17 10-24 0zM29 27l8-7v14z"/><circle cx="13" cy="26" r="1.5"/><path d="M38 6v10M33 11h10"/>',fishl:'<path d="M4 18c5-8 14-8 19 0-5 8-14 8-19 0zM23 18l7-6v12z"/><path d="M16 36c5-8 14-8 19 0-5 8-14 8-19 0zM35 36l7-6v12z"/><circle cx="9" cy="17" r="1.5"/><circle cx="21" cy="35" r="1.5"/>',fishk:'<path d="M8 26l11 11L41 11"/>',food:'<circle cx="14" cy="14" r="3"/><circle cx="31" cy="10" r="3"/><circle cx="23" cy="25" r="3"/><circle cx="38" cy="29" r="3"/><circle cx="12" cy="37" r="3"/><circle cx="29" cy="42" r="3"/>',gear:'<path d="M37.3 19.6L43.1 20.3L43.1 27.7L37.3 28.4L36.5 30.3L40.2 34.9L34.9 40.2L30.3 36.5L28.4 37.3L27.7 43.1L20.3 43.1L19.6 37.3L17.7 36.5L13.1 40.2L7.8 34.9L11.5 30.3L10.7 28.4L4.9 27.7L4.9 20.3L10.7 19.6L11.5 17.7L7.8 13.1L13.1 7.8L17.7 11.5L19.6 10.7L20.3 4.9L27.7 4.9L28.4 10.7L30.3 11.5L34.9 7.8L40.2 13.1L36.5 17.7Z"/><circle cx="24" cy="24" r="6"/>',trash:'<path d="M9 13h30M19 13V7h10v6M13 13l2 29h18l2-29M20 20v15M28 20v15"/>',undo:'<path d="M17 12L7 22l10 10M7 22h23c8 0 12 5 12 14"/>',x:'<path d="M10 10l28 28M38 10L10 38"/>',plus:'<path d="M24 11v26M11 24h26"/>',game:'<path d="M15 15c7-12 22-11 24 9-2 20-17 21-24 9l10-9z"/><path d="M39 24l7-7v14z"/><circle cx="27" cy="15" r="1.8"/><path d="M1 24c1.6-3 5.2-3 6.8 0-1.6 3-5.2 3-6.8 0zM7.8 24l3-2.4v4.8z"/>',pen:'<path d="M9 39l3-10L31 10l7 7-19 19z"/><path d="M27 14l7 7"/>',mini:'<rect x="5" y="9" width="38" height="30" rx="4"/><rect x="23" y="24" width="16" height="11" rx="2"/>',dice:'<rect x="7" y="7" width="34" height="34" rx="7"/><circle cx="17" cy="17" r="2.2"/><circle cx="31" cy="17" r="2.2"/><circle cx="24" cy="24" r="2.2"/><circle cx="17" cy="31" r="2.2"/><circle cx="31" cy="31" r="2.2"/>'};
document.querySelectorAll('[data-ic]').forEach(b=>b.innerHTML=svg(IC[b.dataset.ic]));
/* 하단 버튼 테두리: 어항 선처럼 삐뚤빼뚤한 원 (고정) */
document.querySelectorAll('.cb').forEach((b,n)=>{const q=[];for(let i=0;i<18;i++){const a=i/18*6.283,h=Math.sin((i+n*31)*12.9898)*43758.5453,r=29.5+(h-Math.floor(h)-.5)*2.6;q.push((i?'L':'M')+(32+r*Math.cos(a)).toFixed(1)+' '+(32+r*Math.sin(a)).toFixed(1))}
 const d=q.join('')+'Z';b.insertAdjacentHTML('afterbegin',`<svg class="rg" viewBox="0 0 64 64"><defs><pattern id="tx${n}" patternUnits="userSpaceOnUse" width="192" height="120" x="${-n*41}" y="${-n*23}"><image href="assets/kiboecontor-paper-626781_1920.jpg" width="192" height="120"/></pattern></defs><path d="${d}"/><path class="tx" d="${d}" style="fill:url(#tx${n})"/><path class="ol" d="${d}"/></svg>`)});
const cv=$('#c'),cx=cv.getContext('2d');
let mxy=[0,0],follow=null,followZ=2.2,hovF=null,drag=null,pickO=null,addTarget=null,tanks=[{id:'t0',gx:0,gy:0}],hovTk=null,hovDir=null,hovLock=false,tkS={},mp=null,CW=1,CH=1,s0=1,cam={z:1,x:641,y:350},fish=[],foods=[],fx=[],eggs=[],sel=null,selE=null,feed=false,delArm=false,start=Date.now(),last=0,ink='#2b2a63',paper='#f3efe3',hatching=null;
const age=f=>(Date.now()-f.born)/1000;
/* 어항 여러 개: 어항마다 격자 칸(gx,gy)을 갖고, 안의 물고기·알·먹이는 자기 어항 좌표(가운데 641,380)를 그대로 씀 */
const SX=1010,SY=700,TK=id=>tanks.find(t=>t.id===id)||tanks[0],off=id=>{const t=TK(id);return[t.gx*SX,t.gy*SY]};
const actTk=()=>{let b=tanks[0],bd=1e18;for(const T of tanks){const d=(T.gx*SX+641-cam.x)**2+(T.gy*SY+380-cam.y)**2;if(d<bd){bd=d;b=T}}return b.id};
const loc=w=>{for(const T of tanks){const x=w.x-T.gx*SX,y=w.y-T.gy*SY;if(x>130&&x<1150&&y>0&&y<720)return{x,y,tk:T.id}}return null};
const tkBox=()=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;for(const T of tanks){const x=T.gx*SX,y=T.gy*SY;a=Math.min(a,x+150);b=Math.min(b,y+20);c=Math.max(c,x+1132);d=Math.max(d,y+700)}return[a,b,c,d]};
const zFit=()=>{const [a,b,c,d]=tkBox();return Math.min(1,Math.min(CW/(c-a+120),CH/(d-b+180))/(s0/.86*.86))};
function theme(){const s=getComputedStyle(document.documentElement);paper=s.getPropertyValue('--bg').trim()||paper}
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',theme);theme();
function toast(m,ms){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),ms||3000)}

/* ---------- 저장 ---------- */
function save(){try{localStorage.setItem(KEY,JSON.stringify({eggs,start,tanks,fish:fish.map(f=>({id:f.id,name:f.name,sex:f.sex,img:f.img,born:f.born,lb:f.lb,x:f.x,y:f.y,t:f.t,k:f.k,g:f.g,p:f.p,pt:f.pt,inh:f.inh,v:f.v,hu:f.hu,ml:f.ml,tk:f.tk}))}))}catch(e){toast('저장 공간이 부족해요. 물고기를 삭제해 주세요.')}}
const mtMig=p=>p&&p.mv!==2?{...p,mt:[0,1,2,3,4,1,5,6][cl(Math.round(p.mt??1),0,7)],mv:2}:p;
function mk(o){if(o.v===2&&o.p)o={...o,p:{...o.p,et:(o.p.et??1)+1,mt:(o.p.mt??0)+1,ft:(o.p.ft??0)+1},v:3,mig:true};if(o.p)o={...o,p:mtMig(o.p)};const f={id:o.id||('f'+Date.now()+Math.random().toString(36).slice(2,6)),name:o.name,sex:o.sex,img:o.img,born:o.born||Date.now(),lb:o.lb||0,t:o.t||null,k:o.k||'d',g:o.g||{c:'#2b2a63',w:6},p:o.p||null,pt:o.pt||null,inh:'',v:o.v||0,fr:null,mig:!!o.mig,hu:typeof o.hu==='number'?o.hu:rnd(0,.25),ml:o.ml|0,tk:o.tk||tanks[0].id,ate:0,chase:false,
 x:o.x??rnd(300,980),y:o.y??rnd(260,450),vx:rnd(-20,20),vy:0,sp:rnd(25,60),tx:0,ty:0,next:0,flip:1,dir:1,ph:rnd(0,6.28),sd:rnd(0,200),w:1,h:1,dw:60,dh:40,ok:false};
 f.im=new Image();f.im.onload=()=>{f.w=f.im.naturalWidth||1;f.h=f.im.naturalHeight||1;f.ok=true;if(f.v===3)bake(f);else bakeD(f)};f.im.src=f.img;return f}
try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&Array.isArray(d.fish)){
 fish=d.fish.slice(0,MAX).filter(f=>f&&typeof f.img==='string'&&f.img.startsWith('data:image/')).map(mk);
 if(Array.isArray(d.eggs))eggs=d.eggs.filter(e=>e&&e.t&&e.t.fa&&e.t.mo&&e.ga&&e.gb&&typeof e.x==='number'&&typeof e.y==='number').slice(0,MAX).map(e=>({...e,ga:{...e.ga,p:mtMig(e.ga.p)},gb:{...e.gb,p:mtMig(e.gb.p)}}));
 if(d.start)start=d.start;
 if(Array.isArray(d.tanks)){const ts=d.tanks.filter(t=>t&&typeof t.id==='string'&&Number.isInteger(t.gx)&&Number.isInteger(t.gy));if(ts.length)tanks=ts}
 const ok=new Set(tanks.map(t=>t.id));for(const o of fish)if(!ok.has(o.tk))o.tk=tanks[0].id;for(const o of eggs)if(!ok.has(o.tk))o.tk=tanks[0].id}}catch(e){}

/* ---------- 카메라 / 리사이즈 ---------- */
let camT=null;
function clampCam(){const k=s0*cam.z,[a,b,c,d]=tkBox(),mx=(a+c)/2,my=(b+d)/2-10,hx=Math.max(0,(c-a+300-CW/k)/2),hy=Math.max(0,(d-b+300-CH/k)/2);cam.x=cl(cam.x,mx-hx,mx+hx);cam.y=cl(cam.y,my-hy,my+hy)}
const isOv=()=>tanks.length>1&&cam.z<=zFit()+.03,focusTank=tk=>{const [ox,oy]=off(tk);follow=null;camT={x:ox+641,y:oy+350,z:1}};
function fitAll(){const [a,b,c,d]=tkBox();camT={x:(a+c)/2,y:(b+d)/2-10,z:zFit()}}
function camStep(dt){if(follow){const f=fish.find(o=>o.id===follow);if(!f||sel!==follow||f.drag)follow=null;else{const [ox,oy]=off(f.tk);camT={x:f.x+ox,y:f.y+oy,z:followZ}}}if(!camT)return;const a=Math.min(1,dt*6);cam.x+=(camT.x-cam.x)*a;cam.y+=(camT.y-cam.y)*a;cam.z+=(camT.z-cam.z)*a;clampCam();if(Math.abs(camT.x-cam.x)+Math.abs(camT.y-cam.y)+Math.abs(camT.z-cam.z)<.5)camT=null}
function focusFish(o){sel=o.id;selE=null;delArm=false;if(isOv()||o.tk!==actTk())focusTank(o.tk);panel()}
function resize(){const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);CW=r.width;CH=r.height;cv.width=CW*d;cv.height=CH*d;s0=Math.min(CW/982,CH/640)*.86;clampCam()}
addEventListener('resize',resize);
const w2=e=>{const r=cv.getBoundingClientRect(),k=s0*cam.z;return{x:(e.clientX-r.left-CW/2)/k+cam.x,y:(e.clientY-r.top-CH/2)/k+cam.y}};
cv.addEventListener('wheel',e=>{e.preventDefault();if(follow){followZ=cl(followZ*Math.exp(-e.deltaY*.0015),Math.min(1,zFit()),4);return}camT=null;const b=w2(e),k0=s0*cam.z;cam.z=cl(cam.z*Math.exp(-e.deltaY*.0015),Math.min(1,zFit()),4);const k=s0*cam.z,r=cv.getBoundingClientRect();cam.x=b.x-(e.clientX-r.left-CW/2)/k;cam.y=b.y-(e.clientY-r.top-CH/2)/k;clampCam()},{passive:false});

/* ---------- 소리: 물고기가 움직이기 시작할 때 보글보글 (짧게 잘라서 재생) ---------- */
const SND='assets/freesound_community-bubbles-003-6397.mp3',sndP=[...Array(6)].map(()=>{const a=new Audio(SND);a.preload='auto';return a});let sndI=0,sndOn=false;
/* 브라우저는 클릭/키 입력 전에는 소리를 막으므로, 첫 입력 때 미리 한 번씩 재생해 풀어 둠 */
function sndUnlock(){if(sndOn)return;sndOn=true;for(const a of sndP){a.muted=true;a.play().then(()=>{if(!a.busy)a.pause();a.muted=false}).catch(()=>{a.muted=false})}}
addEventListener('pointerdown',sndUnlock,{capture:true});
/* 버튼을 누를 때마다 '딸깍' (pick 소리에서 소리 나는 0.2초만 잘라 둔 파일) */
const clkP=[...Array(4)].map(()=>{const a=new Audio('assets/pick-click.wav');a.preload='auto';return a});let clkI=0;
addEventListener('pointerdown',e=>{const v=(+$('#vol').value||0)/100;if(v<=0||!e.target.closest||!e.target.closest('button'))return;const a=clkP[clkI=(clkI+1)%clkP.length];try{a.currentTime=0}catch(_){}a.volume=Math.min(1,v);a.play().catch(()=>{})},{capture:true});addEventListener('keydown',sndUnlock,{capture:true});
function blub(f){if(f){bsp(f.x+f.dir*f.dw*.48,f.y+rnd(-3,3),rnd(3,6),f.tk);if(Math.random()<.25)bsp(f.x+f.dir*(f.dw*.48+3),f.y-10,rnd(2.5,4.5),f.tk)}sndPlay()}
function sndPlay(){const v=(+$('#vol').value||0)/100;
 if(v<=0)return;if(!sndOn)return;
 const a=sndP[sndI=(sndI+1)%sndP.length],len=rnd(.5,.9),peak=v*.6;clearInterval(a.fid);a.busy=true;a.muted=false;a.volume=0;try{a.currentTime=rnd(0,Math.max(0,(a.duration||7.5)-1.2))}catch(e){}
 a.play().then(()=>{const t0=performance.now();a.fid=setInterval(()=>{const t=(performance.now()-t0)/1000;if(t>=len){clearInterval(a.fid);a.pause();return}a.volume=peak*Math.min(1,t/.08,(len-t)/.25)},30)}).catch(()=>{})}

/* ---------- 움직임 ---------- */
function fitPt(x,y,hw,hh){const rx=441-hw-14,ry=255-hh-14,dx=(x-641)/rx,dy=(y-380)/ry,d=Math.hypot(dx,dy);if(d>1){x=641+dx/d*rx;y=380+dy/d*ry}return[x,cl(y,215+hh,BOT-hh)]}
/* 먹이를 먹을수록 자람: 50번이면 몸집(면적)이 15배 → 어항 절반 크기, 15칸을 혼자 차지 */
const GROW=50,slot=f=>1+(MAX-1)*Math.min(f.ml|0,GROW)/GROW,usedIn=tk=>fish.reduce((a,f)=>a+(f.tk===tk?slot(f):0),0)+eggs.filter(e=>e.tk===tk).length,used=()=>usedIn(actTk()),full=tk=>usedIn(tk??actTk())+1>MAX+1e-6;
function size(f){const t=Math.min(f.ml|0,GROW)/GROW,k=Math.min(100/f.w,80/f.h),g=Math.sqrt(slot(f))*(1+.25*t);let dw=f.w*k*g,dh=f.h*k*g;const c=Math.min(1,480/dw,260/dh);f.dw=dw*c;f.dh=dh*c}
function update(dt,now){
 for(const o of foods)o.c=0;
 for(const f of fish){if(!f.ok)continue;size(f);if(f.drag)continue;f.hu=Math.min(1,f.hu+dt/360);let tx,ty,sp=f.sp*(f.hu>=.75?.55:1),best=null,bd=1e9;
  for(const o of foods){if(o.tk!==f.tk)continue;const d=Math.hypot(o.x-f.x,o.y-f.y)+o.c*90;if(d<bd){bd=d;best=o}}if(best)best.c++;
  if(best&&!f.chase)blub(f);f.chase=!!best;const wf=f.fl;f.fl=0;if(best){const sd=best.x>=f.x?1:-1;tx=best.x-sd*f.dw*.42;ty=best.y;sp*=(f.hu>.5?3:2.4)}else if(mp&&mp.tk===f.tk&&Date.now()-mp.t<4000){f.fl=1;if(!wf)blub(f);if(Math.hypot(mp.x-f.x,mp.y-f.y)>70){tx=mp.x;ty=mp.y;sp=Math.max(sp,40)*4.5}else{tx=f.x;ty=f.y}}else{if(now>f.next||Math.hypot(f.tx-f.x,f.ty-f.y)<12){[f.tx,f.ty]=fitPt(rnd(240,1040),rnd(230,500),f.dw/2,f.dh/2);f.next=now+rnd(2,6);if(Math.random()<.5)blub(f)}tx=f.tx;ty=f.ty}
  const dx=tx-f.x,dy=ty-f.y,d=Math.hypot(dx,dy)||1,s=Math.min(sp,d*3),a=Math.min(1,dt*(f.fl?5:2));
  f.vx+=(dx/d*s-f.vx)*a;f.vy+=(dy/d*s*(f.fl||f.chase?.9:.6)-f.vy)*a;
  for(const o of fish){if(o===f||!o.ok||o.tk!==f.tk)continue;const ex=f.x-o.x,ey=f.y-o.y,r=(f.dw+o.dw)*.42,e=Math.hypot(ex,ey)||.1;if(e<r){const k=(r-e)/r*dt*320;f.vx+=ex/e*k;f.vy+=ey/e*k*.8}}[f.x,f.y]=fitPt(f.x+f.vx*dt,f.y+f.vy*dt,f.dw/2,f.chase?Math.min(f.dh/2,12):f.dh/2);
  if(Math.abs(f.vx)>4)f.dir=f.vx>0?1:-1;f.flip+=(f.dir-f.flip)*Math.min(1,dt*9)}
 foods=foods.filter(o=>{o.t+=dt;if(o.y<520)o.y+=o.v*dt;
  for(const f of fish){if(f.ok&&!f.drag&&f.tk===o.tk&&Math.hypot(o.x-(f.x+f.dir*f.dw*.45),o.y-f.y)<Math.max(o.y>=520?26:18,f.dh*.5)){fx.push({x:o.x,y:o.y,t:0,k:'eat',f});f.ch=now;if(!f.say||now-f.say.t>2.2)f.say={s:YUM[0|Math.random()*YUM.length],t:now,sd:rnd(0,99)};f.hu=Math.max(0,f.hu-.55);f.ate=Date.now();if((f.ml|0)<GROW&&usedIn(f.tk)+(MAX-1)/GROW<=MAX+1e-6)f.ml=(f.ml|0)+1;return false}}return o.t<25});
 bubUpdate(dt);for(const e of eggs)e.y=Math.min(EGGY,e.y+dt*110);
 for(const e of fx)e.t+=dt;fx=fx.filter(e=>e.t<2.2)}

/* ---------- 그리기 (꾸물꾸물 낙서 선) ---------- */
const J=(i,f)=>{const s=Math.sin(i*12.9898+f*78.233)*43758.5453;return s-Math.floor(s)-.5};
function ln(p,fr,sd,cs){cx.beginPath();p.forEach((q,i)=>{const x=q[0]+J(i+sd,fr)*3,y=q[1]+J(i+sd+77,fr)*3;i?cx.lineTo(x,y):cx.moveTo(x,y)});if(cs)cx.closePath();cx.stroke()}
function scene(fr,t){
 cx.strokeStyle=ink;cx.lineCap=cx.lineJoin='round';cx.lineWidth=5;
 const b=[];for(let a=-.97;a<=4.12;a+=.05)b.push([641+441*Math.cos(a),380+255*Math.sin(a)]);ln(b,fr,0);
 ln([[392,170],[384,135],[374,108],[368,98]],fr,200);ln([[868,170],[876,135],[880,108],[882,92]],fr,210);
 ln([[368,98],[392,76],[520,62],[650,58],[790,62],[862,70],[882,92]],fr,220);cx.lineWidth=3.5;ln([[384,112],[520,106],[700,100],[868,98]],fr,230);
 const w=[];for(let x=329;x<=953;x+=14)w.push([x,200+Math.sin(x*.03+t*.8)*6]);ln(w,fr,300);
 cx.lineWidth=4.5;const s=[];for(let x=345;x<=940;x+=20)s.push([x,533+Math.sin(x*.05)*5]);for(let a=0;a<=3.15;a+=.2)s.push([641+296*Math.cos(a),540+60*Math.sin(a)]);
 const sd=[];for(let a=0;a<=3.15;a+=.2)sd.push([641+296*Math.cos(a),540+60*Math.sin(a)]);const top=[];for(let x=345;x<=940;x+=20)top.push([x,533+Math.sin(x*.05)*5]);ln(top,fr,400);
 cx.lineWidth=3;for(const [x,y,r] of [[430,560,16],[520,568,20],[610,570,14],[700,562,22],[790,568,18],[860,556,12],[480,585,10],[740,588,12]]){cx.beginPath();cx.arc(x+J(x,fr)*3,y+J(y,fr)*3,r,Math.PI*1.05,Math.PI*1.95);cx.stroke()}
 cx.lineWidth=4;for(const [x,h,ph] of [[382,70,0],[432,55,1],[868,120,2],[895,70,3],[918,60,4]]){const p=[];for(let y=0;y<=h;y+=8)p.push([x+Math.sin(y*.09+t*1.4+ph)*9*(y/h+.2),534-y]);ln(p,fr,500+x)}
 }
const PP=(()=>{const q=[];for(let a=-.97;a<=4.12;a+=.13)q.push([641+441*Math.cos(a),380+255*Math.sin(a)]);
 [[392,170],[384,135],[374,108],[368,98],[392,76],[520,62],[650,58],[790,62],[862,70],[882,92],[880,108],[876,135],[868,170]].forEach(p=>q.push(p));return q.map(p=>[p[0]+rnd(-3.5,3.5),p[1]+rnd(-3.5,3.5)])})();
function paperDraw(){cx.save();cx.lineJoin='round';cx.lineWidth=60;
 const pth=(dx,dy)=>{cx.beginPath();PP.forEach((p,i)=>i?cx.lineTo(p[0]+dx,p[1]+dy):cx.moveTo(p[0]+dx,p[1]+dy));cx.closePath()};
 for(const [dx,dy,al] of [[18,20,.07],[13,15,.09],[8,10,.12]]){cx.fillStyle=cx.strokeStyle=`rgba(20,20,40,${al})`;pth(dx,dy);cx.fill();cx.stroke()}
 cx.fillStyle=cx.strokeStyle='#fff';pth(0,0);cx.fill();cx.stroke();
 if(texI.complete&&texI.naturalWidth){texP=texP||cx.createPattern(texI,'no-repeat');texP.setTransform(new DOMMatrix([.53,0,0,.53,130,28]));cx.globalAlpha=.25;cx.fillStyle=cx.strokeStyle=texP;pth(0,0);cx.fill();cx.stroke()}
 cx.restore()}
const texI=new Image();let texP=null;texI.src='assets/kiboecontor-paper-626781_1920.jpg';
let bub=[];const inW=o=>{const rx=441-o.r-12,ry=255-o.r-12,dx=(o.x-641)/rx,dy=(o.y-380)/ry,d=Math.hypot(dx,dy);if(d>1){o.x=641+dx/d*rx;o.y=380+dy/d*ry}return o};
const bsp=(x,y,r,tk)=>{if(bub.length<40)bub.push(inW({tk:tk||tanks[0].id,x,y,r:r||rnd(5,11),v:rnd(28,55),ph:rnd(0,6.3),t:0,die:rnd(2.5,7)}))};
function bubUpdate(dt){for(const o of bub){o.t+=dt;o.y-=o.v*dt;o.x+=Math.sin(o.t*3+o.ph)*14*dt;inW(o);if(o.y<205+o.r||o.t>o.die){o.pop=true;fx.push({x:o.x,y:o.y,t:0,k:'bp',r:o.r,tk:o.tk})}}
 bub=bub.filter(o=>!o.pop)}
function bubDraw(fr,tk){cx.strokeStyle=ink;cx.lineWidth=3;bub.forEach((o,i)=>{if(o.tk!==tk)return;const x=o.x+J(i,fr)*1.6,y=o.y+J(i+9,fr)*1.6,r=(o.r+J(i+3,fr)*1.2)*(1+o.t*.04);cx.beginPath();cx.arc(x,y,r,0,6.3);cx.stroke();cx.beginPath();cx.arc(x,y,r*.6,3.6,4.6);cx.stroke()})}
function draw(t){
 const fr=Math.floor(t*6),d=Math.min(devicePixelRatio||1,2),k=s0*cam.z;
 cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.imageSmoothingQuality='high';
 cx.setTransform(d*k,0,0,d*k,d*(CW/2-cam.x*k),d*(CH/2-cam.y*k));
 const dk=drag&&drag.f.tk,ord=[...tanks].sort((a,b)=>((a.id===dk)*2+(a.id===hovTk))-((b.id===dk)*2+(b.id===hovTk)));
 for(const T of ord){const tk=T.id,ts=tkS[tk]=(tkS[tk]||1)+((tk===hovTk?1.03:1)-(tkS[tk]||1))*.2;cx.save();cx.translate(T.gx*SX+641,T.gy*SY+380);cx.scale(ts,ts);cx.translate(-641,-380);
 paperDraw();scene(fr,t);bubDraw(fr,tk);
 cx.fillStyle='#f08a4b';for(const o of foods){if(o.tk!==tk)continue;cx.beginPath();cx.arc(o.x,o.y,5,0,6.3);cx.fill()}
 cx.font='700 26px Gaegu,sans-serif';cx.textAlign='center';
 for(const e of eggs){if(e.tk!==tk)continue;cx.save();cx.translate(e.x+J(e.x,fr)*2,e.y);cx.fillStyle='#f0a6d8';cx.strokeStyle=ink;cx.lineWidth=4;cx.beginPath();cx.ellipse(0,0,18,22,0,0,6.3);cx.fill();cx.stroke();cx.strokeStyle='#fff';cx.lineWidth=3;cx.beginPath();cx.arc(4,-4,10,-1.1,.1);cx.stroke();
  if(e.id===selE){cx.strokeStyle=ink;cx.setLineDash([6,6]);cx.lineWidth=2.5;cx.beginPath();cx.ellipse(0,0,32,36,0,0,6.3);cx.stroke()}cx.restore();cx.fillStyle=ink;cx.fillText('알',e.x,e.y-34)}
 for(const f of fish){if(!f.ok||f.tk!==tk)continue;f.hs=(f.hs||1)+((f.drag?1.4:f.id===hovF&&!drag?1.12:1)-(f.hs||1))*.25;cx.save();cx.translate(f.x+J(f.sd,fr)*2.4,f.y+Math.sin(t*3+f.ph)*3+J(f.sd+5,fr)*2.4);cx.rotate(Math.sin(t*2.2+f.ph)*.05+J(f.sd+9,fr)*.04);cx.scale(f.hs,f.hs);cx.scale(-f.flip,1);
  /* 냠냠: 꼬리 쪽을 기준으로 머리가 앞으로 툭툭 튀어나옴 (머리는 -x 방향) */
  const ce=(t-(f.ch??-9))/.7;if(ce>=0&&ce<1){const pp=Math.sin(ce*Math.PI*6)*(1-ce),ax=f.dw*.5;cx.translate(ax,0);cx.scale(1+.1*Math.abs(pp),1-.05*pp);cx.translate(-ax,0)}
  {const o=f.fr&&f.fr[(fr+(f.sd|0))%4];if(o){const kx=f.dw/f.w,ky=f.dh/f.h,sw=o.s.width*kx,sh=o.s.height*ky;cx.shadowColor='rgba(20,20,40,.38)';cx.shadowBlur=d*k*4;cx.shadowOffsetX=d*k*5;cx.shadowOffsetY=d*k*6;cx.drawImage(o.s,-sw/2,-sh/2,sw,sh);cx.shadowColor='transparent'}else cx.drawImage(f.im,-f.dw/2,-f.dh/2,f.dw,f.dh)};
  cx.restore();
  if(f.drag){cx.save();cx.strokeStyle=ink;cx.lineWidth=3;cx.setLineDash([10,8]);cx.lineDashOffset=-t*40;cx.beginPath();cx.ellipse(f.x,f.y,f.dw/2*f.hs+16,f.dh/2*f.hs+16,0,0,6.3);cx.stroke();cx.restore()}
  if(f.id===sel){cx.strokeStyle=ink;cx.lineWidth=2.5;cx.setLineDash([9,8]);cx.beginPath();cx.ellipse(f.x,f.y,f.dw/2+16,f.dh/2+16,0,0,6.3);cx.stroke();cx.setLineDash([]);cx.fillStyle=ink;cx.fillText(f.name,f.x,f.y-f.dh/2-24)}}
 for(const f of fish)if(f.say&&f.tk===tk)say(f,t);
 for(const e of fx){if(e.t<0||(e.tk||(e.f&&e.f.tk)||tanks[0].id)!==tk)continue;if(e.k==='splash'){const q=e.t/.9;if(q<1){cx.save();cx.strokeStyle=ink;cx.lineWidth=2.5;cx.globalAlpha=1-q;cx.beginPath();cx.ellipse(e.x,e.y+e.r*.3,e.r*(1+q*1.6),e.r*.35*(1+q*1.6),0,0,6.3);cx.stroke();cx.fillStyle='#9ad6f0';for(const [vx,vy,r] of e.d){const x=e.x+vx*e.t,y=e.y+vy*e.t+420*e.t*e.t;cx.beginPath();cx.ellipse(x,y,r*.8,r*1.15,Math.atan2(vy+840*e.t,vx)+Math.PI/2,0,6.3);cx.fill();cx.stroke()}cx.restore()}continue}if(e.k==='heart'){const q=e.t/1.6;if(q<1){const s=e.s*(.6+.4*Math.min(1,e.t/.15))*9;cx.save();cx.translate(e.x+Math.sin(e.t*5)*5,e.y-e.t*45);cx.scale(s/9,s/9);cx.globalAlpha=Math.min(1,(1-q)*2);cx.beginPath();cx.moveTo(0,6);cx.bezierCurveTo(-12,-2,-8,-14,0,-7);cx.bezierCurveTo(8,-14,12,-2,0,6);cx.closePath();cx.fillStyle='#f47a9b';cx.fill();cx.strokeStyle=ink;cx.lineWidth=2.2;cx.lineJoin='round';cx.stroke();cx.restore()}continue}if(e.k==='eat'){const q=e.t/.5;if(q<1){const f=e.f,mx=f.x+f.dir*f.dw*.47,my=f.y,w=q*q*(3-2*q),px=e.x+(mx-e.x)*w,py=e.y+(my-e.y)*w+Math.sin(q*9)*3*(1-q);
  cx.fillStyle='#f08a4b';cx.beginPath();cx.ellipse(px,py,5*(1-q*.7)*(1+q*.6),5*(1-q*.7),Math.atan2(my-py,mx-px),0,6.3);cx.fill()}continue}if(e.k==='bp'){if(e.t<.4){const q=e.t/.4;cx.strokeStyle=`rgba(43,42,99,${1-q})`;cx.lineWidth=2.5;cx.beginPath();cx.arc(e.x,e.y,e.r*(1+q*.9),0,6.3);cx.stroke();for(let i=0;i<6;i++){const a=i*1.047+.3,r0=e.r*(1.3+q),r1=r0+5;cx.beginPath();cx.moveTo(e.x+Math.cos(a)*r0,e.y+Math.sin(a)*r0);cx.lineTo(e.x+Math.cos(a)*r1,e.y+Math.sin(a)*r1);cx.stroke()}}continue}const p=e.t/2.2;cx.strokeStyle=`rgba(240,138,75,${1-p*2.2})`;cx.lineWidth=3;cx.beginPath();cx.arc(e.x,e.y,5+p*50,0,6.3);cx.stroke()}
 cx.restore()}
 tankUI()}
/* 먹을 때 머리 위에 뜨는 말풍선: 종이를 삐뚤빼뚤 오려 붙인 느낌 */
const YUM=['맛있다!','냠냠','꿀맛!','최고야!','맛있어~','냠!'],PET=['헤헤','간지러워~','히히','꺄르르','보글보글~','쓰담쓰담~','행복해~','뽀글뽀글!'];
function say(f,t){const e=t-f.say.t,D=1.8;if(e>D||e<0){if(e>D)f.say=null;return}
 const a=Math.min(1,e/.12,(D-e)/.3),sc=.7+.3*Math.min(1,e/.15);cx.save();cx.font='700 22px Gaegu,sans-serif';const tw=cx.measureText(f.say.s).width,w=tw/2+16,h=19,x0=f.x,y0=f.y-f.dh/2-h-24;
 cx.translate(x0,y0+h+12);cx.scale(sc,sc);cx.translate(0,-h-12);cx.globalAlpha=a;const q=[],sd=f.say.sd;let tail=false;
 for(let k=0;k<36;k++){const an=k/36*6.283,c=Math.cos(an),s=Math.sin(an);if(!tail&&an>1.35){tail=true;q.push([6,h+4],[-2,h+13],[-7,h+3])}q.push([w*Math.sign(c)*Math.pow(Math.abs(c),.45)+J(k+sd,0)*3.5,h*Math.sign(s)*Math.pow(Math.abs(s),.45)+J(k+sd+40,0)*3])}
 const pth=(dx,dy)=>{cx.beginPath();q.forEach((p,i)=>i?cx.lineTo(p[0]+dx,p[1]+dy):cx.moveTo(p[0]+dx,p[1]+dy));cx.closePath()};
 cx.fillStyle='rgba(20,20,40,.16)';pth(2,3);cx.fill();cx.fillStyle='#fff';pth(0,0);cx.fill();
 cx.fillStyle=ink;cx.textAlign='center';cx.textBaseline='middle';cx.fillText(f.say.s,0,1);cx.restore()}
let pipW=null,rafP=false;
/* 미니 창이 열려 있으면 그 창의 프레임에 맞춰 돌림 (원래 탭이 가려져도 멈추지 않게) */
function sched(){if(rafP)return;rafP=true;(pipW||window).requestAnimationFrame(()=>{rafP=false;tick(performance.now())})}
function tick(ms){const dt=Math.min((ms-last)/1000,.05);last=ms;camStep(dt);const fq=Math.floor(ms/166);if(fq!==pf&&!$('#m').hidden){pf=fq;if(mode==='c')prv();else wob()}update(dt,ms/1000);draw(ms/1000);sched()}

/* ---------- 클릭 / 패널 ---------- */
let pdn=null;
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);const q=w2(e),L=loc(q),f=L&&!feed&&!pickO?fish.find(o=>o.ok&&o.tk===L.tk&&Math.abs(L.x-o.x)<o.dw/2+6&&Math.abs(L.y-o.y)<o.dh/2+6):null;
 pdn={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,m:false,ht:f?setTimeout(()=>grab(f),250):0}};
/* 물고기를 0.25초 꾹 누르면 집어 들고, 놓은 어항으로 이사 (자리가 없으면 제자리로) */
function grab(f){if(!pdn||pdn.m)return;pdn.m=true;drag={f,ox:f.x,oy:f.y,otk:f.tk};f.drag=true;cv.style.cursor='grabbing';sel=null;panel();bsp(f.x,f.y-f.dh/2,5,f.tk);sndPlay()}
const MOVE=['이사왔다!','새 집이다!','여기 좋다~','안녕 이웃들!','짐 풀어야지!'];
/* 첨벙: 물방울이 튀어 올랐다 떨어지고, 물결 고리가 퍼짐 */
function splash(f){fx.push({k:'splash',tk:f.tk,x:f.x,y:f.y,t:0,r:Math.max(30,f.dw*.5),d:[...Array(9)].map(()=>[rnd(-150,150),rnd(-260,-120),rnd(4,8)])});for(let i=0;i<5;i++)bsp(f.x+rnd(-f.dw*.4,f.dw*.4),f.y+rnd(-10,10),rnd(3,7),f.tk);sndPlay()}
function drop(q){const f=drag.f,L=loc(q),fits=L&&(L.tk===drag.otk||usedIn(L.tk)+slot(f)<=MAX+1e-6);f.drag=false;
 if(L&&onPaper(L.x,L.y)&&fits){const moved=L.tk!==drag.otk;f.tk=L.tk;[f.x,f.y]=fitPt(L.x,L.y,f.dw/2,f.dh/2);f.tx=f.x;f.ty=f.y;f.next=0;f.vx=f.vy=0;if(moved){splash(f);f.say={s:MOVE[0|Math.random()*MOVE.length],t:performance.now()/1000,sd:rnd(0,99)};toast(`${f.name}이(가) 이 어항으로 이사했어요`);save();ui()}else fx.push({x:f.x,y:f.y,t:0,k:'pop',tk:f.tk})}
 else{if(L&&!fits)toast('그 어항은 자리가 없어요');f.tk=drag.otk;f.x=drag.ox;f.y=drag.oy}
 drag=null;cv.style.cursor=feed?'crosshair':''}
cv.onpointermove=e=>{mxy=[e.clientX,e.clientY];const q=w2(e),L=loc(q);if(drag){const [ox,oy]=off(drag.f.tk);drag.f.x=q.x-ox;drag.f.y=q.y-oy;hovTk=L?L.tk:null;hovDir=null;return}hovSet(L);{const hf=L?fish.find(o=>o.ok&&o.tk===L.tk&&Math.abs(L.x-o.x)<o.dw/2+6&&Math.abs(L.y-o.y)<o.dh/2+6):null;hovF=hf?hf.id:null;if(!feed)cv.style.cursor=hf?'pointer':''}pet(L);mp=L&&Math.hypot((L.x-641)/500,(L.y-380)/310)<1?{x:L.x,y:L.y,tk:L.tk,t:Date.now()}:null;if(!pdn)return;const dx=e.clientX-pdn.x,dy=e.clientY-pdn.y;if(Math.hypot(dx,dy)>5){pdn.m=true;hovTk=null;clearTimeout(pdn.ht);follow=null;camT=null}if(pdn.m){camT=null;const k=s0*cam.z;cam.x=pdn.cx-dx/k;cam.y=pdn.cy-dy/k;clampCam()}};
cv.onpointerleave=()=>{mp=null;pt0=null;hovF=null;setTimeout(()=>{if(!hovLock){hovTk=null;hovDir=null}},150)};
/* 물고기 위에서 커서를 빙글빙글·문지르면 하트가 퐁퐁 */
let pt0=null;
function pet(q){if(feed||!q)return;const f=fish.find(o=>o.ok&&o.tk===q.tk&&Math.abs(q.x-o.x)<o.dw/2+6&&Math.abs(q.y-o.y)<o.dh/2+6),n=performance.now();
 if(!f||!pt0||pt0.id!==f.id||n-pt0.l>600){pt0=f?{id:f.id,x:q.x,y:q.y,a:0,l:n,h:0,c:0}:null;return}
 pt0.a+=Math.hypot(q.x-pt0.x,q.y-pt0.y);pt0.x=q.x;pt0.y=q.y;pt0.l=n;
 if(pt0.a>450&&n-pt0.h>800){pt0.a=0;pt0.h=n;pt0.c++;fx.push({k:'heart',tk:f.tk,x:f.x+rnd(-f.dw*.3,f.dw*.3),y:f.y-f.dh/2-rnd(0,10),t:0,s:rnd(.85,1.15)});
  /* 한참 문질러 주면(하트 2번째마다) 기분 좋은 한마디 */
  if(pt0.c%2===0&&(!f.say||n/1000-f.say.t>2.2))f.say={s:PET[0|Math.random()*PET.length],t:n/1000,sd:rnd(0,99)}}}
cv.onpointerup=e=>{if(pdn)clearTimeout(pdn.ht);if(drag){drop(w2(e));pdn=null;return}if(pipW&&pdn&&!pdn.m){pdn=null;pipW.close();return}if(pdn&&!pdn.m)click(w2(e));pdn=null};
/* ---------- 어항 추가(+)·삭제(휴지통): 피그잼 포스트잇처럼 마우스가 향한 쪽에 + ---------- */
const DIRS={n:[0,-1,641,10],s:[0,1,641,712],w:[-1,0,128,380],e:[1,0,1154,380]};
function hovSet(L){if(!L){if(!hovLock){hovTk=null;hovDir=null}return}hovTk=L.tk;const dx=(L.x-641)/500,dy=(L.y-370)/330;hovDir=Math.max(Math.abs(dx),Math.abs(dy))>.55?(Math.abs(dx)>Math.abs(dy)?(dx>0?'e':'w'):(dy>0?'s':'n')):null}
function tankUI(){const T=tanks.find(t=>t.id===hovTk),k=s0*cam.z,r=cv.getBoundingClientRect(),S=(x,y)=>[(x-cam.x)*k+CW/2+r.left,(y-cam.y)*k+CH/2+r.top],busy=pipW||drag||pickO||pdn&&pdn.m||!$('#m').hidden;
 const tt=$('#ttip'),tsh=!!T&&!pipW&&$('#m').hidden;if(tt.hidden===tsh)tt.hidden=!tsh;
 if(tsh){const hf=!drag&&hovF&&fish.find(f=>f.id===hovF),n=fish.filter(f=>f.tk===T.id).length,ne=eggs.filter(e=>e.tk===T.id).length,u=Math.ceil(usedIn(T.id)-1e-6),
  // 물고기 위면 그 물고기 정보, 아니면 어항 정보
  h=hf?`${esc(hf.name)} ${hf.sex==='M'?'♂':'♀'}<small>${ageS(age(hf))}</small>`:`물고기 ${n}마리${ne?` · 알 ${ne}개`:''}<small>${u} / ${MAX}칸${u>=MAX?' · 꽉 찼어요':''}</small>`;if(tt.innerHTML!==h)tt.innerHTML=h;const r2=cv.getBoundingClientRect(),w=tt.offsetWidth,hh=tt.offsetHeight;let x=mxy[0]+22,y=mxy[1]+22;if(x+w>r2.right-10)x=mxy[0]-w-16;if(y+hh>r2.bottom-10)y=mxy[1]-hh-16;tt.style.left=x+'px';tt.style.top=y+'px'}
 // 빈 어항마다 '물고기가 없어요' + 추가 버튼
 const ET=$('#tempty');ET.hidden=!!(pipW||pickO);const emp=new Set(tanks.filter(t=>!fish.some(f=>f.tk===t.id)&&!eggs.some(e=>e.tk===t.id)).map(t=>t.id));
 for(const el of [...ET.children])if(!emp.has(el.dataset.tk))el.remove();
 for(const id of emp){let el=ET.querySelector(`[data-tk="${id}"]`);if(!el){el=document.createElement('div');el.className='tempt';el.dataset.tk=id;el.innerHTML='<p>물고기가 없어요.<br>버튼을 눌러 새로 추가해 주세요.</p><button class="btn">물고기 추가하기</button>';el.querySelector('button').onclick=()=>addInto(id);ET.append(el)}
  const t=TK(id),[x,y]=S(t.gx*SX+641,t.gy*SY+395);el.style.left=x+'px';el.style.top=y+'px';el.style.transform=`translate(-50%,-50%) scale(${cl(cam.z,.45,1.6).toFixed(3)})`}
 for(const [d,[gx,gy,lx,ly]] of Object.entries(DIRS)){const b=$('#ta'+d),show=!!T&&!busy&&(hovDir===d||b.matches(':hover'))&&!tanks.some(t=>t.gx===T.gx+gx&&t.gy===T.gy+gy);if(b.hidden===show)b.hidden=!show;if(show){const [x,y]=S(T.gx*SX+lx,T.gy*SY+ly);b.style.left=x+'px';b.style.top=y+'px'}}
 const tb=$('#tdel'),sh=!!T&&!busy&&tanks.length>1;if(tb.hidden===sh)tb.hidden=!sh;if(!sh&&tb.dataset.arm){delete tb.dataset.arm;tb.classList.remove('arm')}if(sh){const [x,y]=S(T.gx*SX+1075,T.gy*SY+75);tb.style.left=x+'px';tb.style.top=y+'px'}}
function addInto(id){if(full(id)){toast('이 어항에 자리가 없어요');return}openDraw();addTarget=id}
/* 어항이 여러 개면, 물고기를 만든 뒤 살 어항을 고르게 함 */
function pickTank(o){pickO=o;$('#tpick').hidden=false;hovTk=null;fitAll()}
function endPick(){pickO=null;$('#tpick').hidden=true}
$('#tpx').onclick=()=>{endPick();toast('물고기 추가를 취소했어요')};
document.querySelectorAll('#tui button').forEach(b=>{b.onpointerenter=()=>{hovLock=true};b.onpointerleave=()=>{hovLock=false}});
for(const d of Object.keys(DIRS))$('#ta'+d).onclick=()=>{const T=TK(hovTk),[gx,gy]=DIRS[d];if(!hovTk||tanks.some(t=>t.gx===T.gx+gx&&t.gy===T.gy+gy))return;
 tanks.push({id:'t'+Date.now().toString(36),gx:T.gx+gx,gy:T.gy+gy});hovLock=false;hovTk=null;save();ui();fitAll();toast('새 어항을 추가했어요')};
$('#tdel').onclick=()=>{const b=$('#tdel'),T=TK(hovTk);if(!hovTk||tanks.length<2)return;
 // 이 어항의 물고기·알을 가까운 어항부터 자리 있는 곳에 나눠 넣을 계획 (큰 물고기부터)
 const rest=tanks.filter(t=>t!==T).sort((a,c)=>Math.hypot(a.gx-T.gx,a.gy-T.gy)-Math.hypot(c.gx-T.gx,c.gy-T.gy)),room=new Map(rest.map(t=>[t.id,MAX-usedIn(t.id)])),plan=[];
 const items=[...fish.filter(f=>f.tk===T.id).map(f=>[f,slot(f)]),...eggs.filter(e=>e.tk===T.id).map(e=>[e,1])].sort((a,c)=>c[1]-a[1]);
 for(const [o,n] of items){const t=rest.find(t=>room.get(t.id)+1e-6>=n);if(!t){toast('옮길 자리가 없어서 이 어항은 삭제할 수 없어요. 다른 어항의 물고기를 내보내거나 새 어항을 추가해 주세요.',4500);delete b.dataset.arm;b.classList.remove('arm');return}room.set(t.id,room.get(t.id)-n);plan.push([o,t.id])}
 const n=items.length,many=new Set(plan.map(p=>p[1])).size>1;
 if(!b.dataset.arm){b.dataset.arm=1;b.classList.add('arm');toast(n?`이 어항의 물고기·알 ${n}개는 ${many?'가까운 어항들':'가장 가까운 어항'}로 옮겨져요. 한 번 더 누르면 삭제돼요.`:'한 번 더 누르면 이 어항을 삭제해요.');return}
 delete b.dataset.arm;b.classList.remove('arm');for(const [o,tk] of plan)o.tk=tk;
 foods=foods.filter(o=>o.tk!==T.id);bub=bub.filter(o=>o.tk!==T.id);fx=fx.filter(e=>(e.tk||(e.f&&e.f.tk))!==T.id||e.f);
 tanks=tanks.filter(t=>t!==T);hovLock=false;hovTk=null;save();ui();fitAll();toast(n?'어항을 삭제하고 물고기들을 옆 어항으로 옮겼어요':'어항을 삭제했어요')};

/* ---------- 배경: 어항 밖을 누를 때마다 순서대로 바뀜 (세로 이미지는 자동으로 가로로 회전) ---------- */
const BGS=['assets/bg/4-lined-paper.jpg','assets/bg/2-mariesmolej-paper.jpg','assets/bg/1-grid-paper.jpg','assets/bg/3-ripped-paper.jpg'],bgU={};
let bgi=0;try{bgi=(+localStorage.getItem(KEY+'-bg')||0)%BGS.length}catch(e){}
function setBg(){const i=bgi,src=BGS[i];if(bgU[src]){document.body.style.backgroundImage=`url(${bgU[src]})`;return}
 const im=new Image();im.onload=()=>{if(im.naturalHeight<=im.naturalWidth){bgU[src]=src;if(bgi===i)setBg();return}
  const c=document.createElement('canvas');c.width=im.naturalHeight;c.height=im.naturalWidth;const g=c.getContext('2d');g.translate(c.width,0);g.rotate(Math.PI/2);g.drawImage(im,0,0);
  try{c.toBlob(b=>{bgU[src]=b?URL.createObjectURL(b):src;if(bgi===i)setBg()},'image/jpeg',.9)}catch(e){bgU[src]=src;if(bgi===i)setBg()}};im.onerror=()=>{bgU[src]=src};im.src=src}
function nextBg(){bgi=(bgi+1)%BGS.length;try{localStorage.setItem(KEY+'-bg',bgi)}catch(e){}setBg()}
setBg();
const hitC=document.createElement('canvas').getContext('2d');let ppPath=null;
function onPaper(x,y){if(!ppPath){ppPath=new Path2D();PP.forEach((p,i)=>i?ppPath.lineTo(p[0],p[1]):ppPath.moveTo(p[0],p[1]));ppPath.closePath();hitC.lineWidth=60;hitC.lineJoin='round'}return hitC.isPointInPath(ppPath,x,y)||hitC.isPointInStroke(ppPath,x,y)}
function click(W){const L=loc(W);
 if(pickO){if(L&&onPaper(L.x,L.y)){if(full(L.tk)){toast('이 어항은 자리가 없어요. 다른 어항을 골라 주세요');return}const o=pickO;endPick();o.tk=L.tk;addFish(o)}return}
 if(!L||!onPaper(L.x,L.y)){sel=selE=null;delArm=false;panel();if(tanks.length>1&&!isOv()){fitAll();return}nextBg();return}const w=L,tk=L.tk;
 if((isOv()||tanks.length>1&&tk!==actTk())&&!feed&&!fish.some(f=>f.tk===tk&&Math.abs(w.x-f.x)<f.dw/2+8&&Math.abs(w.y-f.y)<f.dh/2+8)&&!eggs.some(e=>e.tk===tk&&Math.abs(w.x-e.x)<28&&Math.abs(w.y-e.y)<32)){focusTank(tk);return}
 if(feed){const q=fitPt(w.x,w.y,0,0);if(w.y>205&&Math.hypot((w.x-641)/441,(w.y-380)/255)<1&&foods.length<60)for(let i=0;i<4;i++)foods.push({tk,x:w.x+rnd(-40,40),y:w.y+rnd(-14,14),v:rnd(20,36),t:0});return}
 if(w.y>205&&Math.hypot((w.x-641)/441,(w.y-380)/255)<1){const k=0|rnd(3,6);for(let i=0;i<k;i++)bsp(w.x+rnd(-12,12),w.y+rnd(-8,8),rnd(3,8),tk);sndPlay()}
 sel=selE=null;delArm=false;
 for(const e of eggs)if(e.tk===tk&&Math.abs(w.x-e.x)<28&&Math.abs(w.y-e.y)<32){selE=e.id;break}
 if(!selE)for(let i=fish.length-1;i>=0;i--){const f=fish[i];if(f.tk===tk&&Math.abs(w.x-f.x)<f.dw/2+8&&Math.abs(w.y-f.y)<f.dh/2+8){sel=f.id;break}}
 if(sel){const sf=fish.find(o=>o.id===sel);if(sf&&(isOv()||sf.tk!==actTk()))focusTank(sf.tk)}
 panel()}
function tn(n,d){const lv=fish.find(o=>o.id===n.id),g=!lv,src=lv?lv.img:n.im,hp=n.fa&&n.mo&&d<3;
 return `<div class="tn${hp?' hp':''}">${hp?`<div class="tp">${tn(n.fa,d+1)}${tn(n.mo,d+1)}</div>`:''}<div class="nb${g&&d?' gone':''}">${src&&src.startsWith('data:image/')?`<img src="${src}" alt="">`:''}<small>${esc(n.name)}</small></div></div>`}
function th(f){try{const c=document.createElement('canvas'),k=Math.min(64/f.w,48/f.h,1);c.width=Math.max(1,Math.round(f.w*k));c.height=Math.max(1,Math.round(f.h*k));c.getContext('2d').drawImage(f.im,0,0,c.width,c.height);return c.toDataURL('image/png')}catch(e){return ''}}
const cut=(n,d)=>n&&d<3?{id:n.id,name:n.name,sex:n.sex,im:n.im||'',fa:cut(n.fa,d+1),mo:cut(n.mo,d+1)}:null;
const nd=f=>cut({id:f.id,name:f.name,sex:f.sex,im:th(f),fa:f.t?f.t.fa:null,mo:f.t?f.t.mo:null},0);
const keep=f=>{const t=th(f);if(!t)return;const w=n=>{if(!n)return;if(n.id===f.id&&!n.im)n.im=t;w(n.fa);w(n.mo)};for(const o of fish)if(o.t){w(o.t.fa);w(o.t.mo)}for(const o of eggs){w(o.t.fa);w(o.t.mo)}};
function panel(){
 const p=$('#panel'),f=fish.find(o=>o.id===sel),eg=eggs.find(o=>o.id===selE);
 if(eg){p.hidden=false;p.innerHTML=`<button class="ic" id="pcx" aria-label="닫기">${svg(IC.x)}</button><p style="font-size:26px;padding-right:40px">${esc(eg.t.fa.name)}와(과) ${esc(eg.t.mo.name)}의 알.</p><div class="pb"><button class="btn" id="hh">부화</button><button class="btn" id="hn">부화X</button></div>`;
  $('#hn').onclick=()=>{eggs=eggs.filter(o=>o.id!==eg.id);selE=null;save();ui();panel();toast('알이 사라졌어요')};$('#hh').onclick=()=>hatch(eg);$('#pcx').onclick=()=>{selE=null;panel()};return}
 if(!f){p.hidden=true;return}
 const fam=famTree(f);
 p.hidden=false;p.innerHTML=`<button class="ic" id="pcx" aria-label="닫기">${svg(IC.x)}</button><h3 id="fnm">${esc(f.name)} <span class="sx">${f.sex==='M'?'♂':'♀'}</span> <button class="ed" id="ren" aria-label="이름 바꾸기" title="이름 바꾸기">${svg(IC.pen)}</button></h3><p id="age"></p><p id="gr"><span id="grv"></span><button class="btn" id="grs">크기 리셋</button></p><p id="st"></p>${f.inh?`<p style="font-size:18px;color:var(--mute);line-height:1.2">${esc(f.inh)}</p>`:''}<h4>가계도</h4><div class="tree"><div class="ftw" id="ftw">${fam.html}</div></div>${fam.sum}`;
 famDraw(fam);$('#ftw').onclick=e=>{const c=e.target.closest('[data-id]');if(!c)return;const o=fish.find(x=>x.id===c.dataset.id);if(o&&o.id!==f.id)focusFish(o)};ageTxt();$('#pcx').onclick=()=>{sel=null;panel()};
 $('#grs').onclick=e=>{const b=e.currentTarget;if(!(f.ml|0)){toast('이미 처음 크기예요');return}if(!b.dataset.arm){b.dataset.arm=1;b.textContent='정말?';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent='크기 리셋'}},3000);return}f.ml=0;save();ui();ageTxt();delete b.dataset.arm;b.textContent='크기 리셋';toast(`${f.name}이(가) 처음 크기로 돌아갔어요`)};
 $('#ren').onclick=()=>{const h=$('#fnm');h.innerHTML=`<input type="text" id="rnm" maxlength="10" value="${esc(f.name)}" aria-label="새 이름">`;const i=$('#rnm');i.focus();i.select();let done=false;
  const ok=()=>{if(done)return;done=true;const v=i.value.trim();if(v&&v!==f.name){const old=f.name;f.name=v;renameTree(f.id,v);save();ui();toast(`${old} → ${v}(으)로 이름을 바꿨어요`)}panel()};
  i.onkeydown=e=>{if(e.key==='Enter')ok();else if(e.key==='Escape'){done=true;panel()}};i.onblur=ok};
 $('#fnm').onclick=e=>{if(!e.target.closest('#ren,input,.sx'))$('#ren').click()}}
/* 이름을 바꾸면 다른 물고기·알의 가계도에 적힌 이름도 같이 바꿈 */
function renameTree(id,nm){const w=n=>{if(!n)return;if(n.id===id)n.name=nm;w(n.fa);w(n.mo)};for(const o of fish)if(o.t){w(o.t.fa);w(o.t.mo)}for(const o of eggs){w(o.t.fa);w(o.t.mo)}}
const rdy=(f,n)=>f.ok&&f.hu<.75&&n>=Math.max(f.born+ADULT*1000,f.lb+COOL*1000);
function state(f){const n=Date.now();
 if(foods.length&&f.chase)return f.hu>.5?'허겁지겁 먹이를 쫓는 중..':'먹이를 쫓는 중..';
 if(f.fl&&f.hu<.75)return '커서를 따라가는 중..';
 if(f.hu>=.75)return '많이 배고파하는 중..';
 if(f.hu>=.5)return '배고파하는 중..';
 if(f.lb&&n-f.lb<30000)return '알을 낳고 쉬는 중..';
 if(rdy(f,n)&&fish.some(o=>o!==f&&o.sex!==f.sex&&rdy(o,n)&&!kin(f,o)))return '짝을 찾는 중..';
 if(n-f.ate<25000)return '배불리 쉬는 중..';
 
 return '물을 떠다니는 중..'}
function famTree(f){
 let u=0;const E=[],C=[];
 const live=id=>fish.find(o=>o.id===id);
 const card=(n,cls)=>{const k='k'+(u++),lv=live(n.id),src=lv?lv.img:n.im;
  return{k,html:`<div class="nb ${cls||''}${lv?'':' gone'}" data-k="${k}"${lv?` data-id="${n.id}"`:''}>${src&&src.startsWith('data:image/')?`<img src="${src}" alt="">`:''}<small>${n.sex==='M'?'♂':'♀'} ${esc(n.name)}</small></div>`}};
 const ph='<div class="nb ph"></div>',me={id:f.id,name:f.name,sex:f.sex},S=card(me,'me');
 const fa=f.t&&f.t.fa,mo=f.t&&f.t.mo;let top='';
 const sibs=fish.filter(o=>o.id!==f.id&&o.t&&par(o).some(i=>par(f).includes(i)));
 const sc=sibs.map(o=>card({id:o.id,name:o.name,sex:o.sex},''));
 if(fa&&mo){
  const gp=[fa.fa,fa.mo,mo.fa,mo.mo].map(n=>n?card(n,''):null),A=card(fa,''),B=card(mo,'');
  if(gp.some(Boolean))top+=`<div class="fg">${gp.map(g=>g?g.html:ph).join('')}</div>`;
  top+=`<div class="fg"><div style="grid-column:1/3;justify-self:center">${A.html}</div><div style="grid-column:3/5;justify-self:center">${B.html}</div></div>`;
  if(gp[0]&&gp[1])E.push([[gp[0].k,gp[1].k],A.k]);else if(gp[0]||gp[1])E.push([[(gp[0]||gp[1]).k],A.k]);
  if(gp[2]&&gp[3])E.push([[gp[2].k,gp[3].k],B.k]);else if(gp[2]||gp[3])E.push([[(gp[2]||gp[3]).k],B.k]);
  E.push([[A.k,B.k],S.k]);sc.forEach(c=>E.push([[A.k,B.k],c.k]))}
 const kids=fish.filter(o=>o.t&&par(o).includes(f.id)),mates=[],mk={};
 for(const o of kids){const m=o.t.fa.id===f.id?o.t.mo:o.t.fa;if(!mk[m.id]){mk[m.id]=card(m,'');mates.push(m)}}
 const row=sc.map(c=>c.html).join('')+S.html+mates.map(m=>mk[m.id].html).join('');
 mates.forEach(m=>C.push([S.k,mk[m.id].k]));
 let bot='';
 if(kids.length){const cc=kids.map(o=>{const c=card({id:o.id,name:o.name,sex:o.sex},''),m=o.t.fa.id===f.id?o.t.mo:o.t.fa;E.push([[S.k,mk[m.id].k],c.k]);return c});bot=`<div class="fr">${cc.map(c=>c.html).join('')}</div>`}
 const nm=a=>a.map(x=>esc(x.name)).join(', ')||'없음';
 const sum=`<p class="fsum">${fa?'':'처음부터 어항에 있던 물고기라<br>부모 정보가 없어요.<br>'}짝: ${nm(mates)} · 자식: ${nm(kids)} · 형제자매: ${nm(sibs)}</p>`;
 return{html:`${top}<div class="fr">${row}</div>${bot}<svg id="fsv"></svg>`,E,C,sum}}
function famDraw(fam){const w=$('#ftw'),sv=$('#fsv');if(!w||!sv)return;const o=w.getBoundingClientRect(),R=k=>{const e=w.querySelector(`[data-k="${k}"]`);if(!e)return null;const r=e.getBoundingClientRect();return{l:r.left-o.left,r:r.right-o.left,t:r.top-o.top,b:r.bottom-o.top,cx:r.left+r.width/2-o.left,cy:r.top+r.height/2-o.top}};
 let d='';for(const [ps,c] of fam.E){const C=R(c),P=ps.map(R).filter(Boolean);if(!C||!P.length)continue;const ym=(Math.max(...P.map(p=>p.b))+C.t)/2;for(const p of P)d+=`M${p.cx} ${p.b}V${ym}H${C.cx}V${C.t}`}
 for(const [a,b] of fam.C){const A=R(a),B=R(b);if(A&&B)d+=`M${A.r} ${A.cy}H${B.l}`}
 sv.setAttribute('viewBox',`0 0 ${o.width} ${o.height}`);sv.innerHTML=`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`}
/* 태어난 지 얼마나 됐는지: 초 → 분 → 시간 → 일 */
function ageS(a){a=Math.floor(a);const d=Math.floor(a/86400),h=Math.floor(a/3600)%24,m=Math.floor(a/60)%60,s=a%60;return '태어난 지 '+(d?`${d}일 ${h}시간`:h?`${h}시간 ${m}분`:m?`${m}분 ${s}초`:`${s}초`)}
function ageTxt(){const f=fish.find(o=>o.id===sel),e=$('#age');if(!f||!e)return;const a=age(f);e.textContent=ageS(a);const gq=$('#grv'),pc=Math.min(f.ml|0,GROW)/GROW;if(gq){const h=`몸집 <span class="gbw" data-tip="${Math.ceil(slot(f)-1e-6)} / ${MAX}칸 차지"><span class="gb"><i style="width:${Math.max(4,pc*100)}%"></i></span></span>`;if(gq.innerHTML!==h)gq.innerHTML=h}$('#st').textContent='지금: '+state(f)}
function ui(){const nw=new Date(),z=n=>String(n).padStart(2,'0');$('#day').innerHTML=`<span class="yr">${nw.getFullYear()}</span>${nw.getMonth()+1}월 ${nw.getDate()}일 <span class="sc">${nw.getHours()%12||12}:${z(nw.getMinutes())}:${z(nw.getSeconds())}<i>${nw.getHours()<12?'AM':'PM'}</i></span><small>${fish.length}마리${eggs.length?` · 알 ${eggs.length}`:''}</small>`}

/* ---------- 번식 / 유전 ---------- */
const par=f=>f.t&&f.t.fa&&f.t.mo?[f.t.fa.id,f.t.mo.id]:[];
const kin=(a,b)=>par(a).includes(b.id)||par(b).includes(a.id)||par(a).some(i=>par(b).includes(i));
const gn=f=>({k:f.k,g:f.g,p:f.p,pt:f.pt||null});
function eggX(x0,tk){x0=cl(x0,380,900);for(let i=0;i<20;i++){const x=x0+(i%2?1:-1)*Math.ceil(i/2)*44;if(x>=380&&x<=900&&eggs.every(e=>e.tk!==tk||Math.abs(e.x-x)>=44))return x}return rnd(380,900)}
let eggOn=true;try{eggOn=localStorage.getItem('doodle-eggs')!=='0'}catch(e){}
function breedCheck(){
 if(!eggOn)return;const n=Date.now(),ok=f=>f.ok&&f.hu<.75&&n>=Math.max(f.born+ADULT*1000,f.lb+COOL*1000);
 const m=fish.filter(f=>f.sex==='M'&&ok(f)),w=fish.filter(f=>f.sex==='F'&&ok(f)),pr=[];
 for(const x of m)for(const y of w)if(x.tk===y.tk&&!full(x.tk)&&!kin(x,y))pr.push([x,y]);if(!pr.length)return;
 const [a,b]=pr[0|Math.random()*pr.length];a.lb=b.lb=n;
 eggs.push({id:'e'+n+Math.random().toString(36).slice(2,5),tk:b.tk,x:eggX(b.x,b.tk),y:b.y,t:{fa:nd(a),mo:nd(b)},ga:gn(a),gb:gn(b)});
 toast(`${a.name}와(과) ${b.name} 사이에서 알을 낳았어요! 알을 눌러 보세요.`);save();ui()}
const autoName=e=>(e.t.fa.name.slice(0,1)+e.t.mo.name.slice(-1)).slice(0,10)||'새끼';
const hex=(r,g,b)=>'#'+[r,g,b].map(x=>cl(Math.round(x),0,255).toString(16).padStart(2,'0')).join('');
const mixC=(a,b)=>{const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16),w=rnd(.35,.65),m=(s,t)=>(s*w+t*(1-w))+rnd(-12,12);return hex(m(x>>16,y>>16),m(x>>8&255,y>>8&255),m(x&255,y&255))};
const jc=c=>{const n=parseInt(c.slice(1),16);return hex((n>>16)+rnd(-8,8),(n>>8&255)+rnd(-8,8),(n&255)+rnd(-8,8))};
function mixP(a,b){const o={};for(const k in P0){const x=a[k]??(k==='fc'?a.bc:P0[k]),y=b[k]??(k==='fc'?b.bc:P0[k]);if(k==='bc'||k==='lc'||k==='fc'||k==='pc')o[k]=jc(Math.random()<.5?x:y);else{const s=SLm[k],v=cl((Math.random()<.5?x:y)+rnd(-.03,.03)*(s[3]-s[2]),s[2],s[3]);o[k]=s[4]>=1?Math.round(v):v}}return o}
const dk=c=>{const n=parseInt(c.slice(1),16);return hex((n>>16)*.55,(n>>8&255)*.55,(n&255)*.55)};
const gp=x=>x.k==='c'&&x.p?{...P0,...x.p,fc:x.p.fc??x.p.bc}:(g=>g.d?{...g.d}:{bc:g.c,lc:dk(g.c),fc:g.c,pc:dk(g.c),lw:cl(g.w/1.5,1.5,8)})(x.g||{c:'#2b2a63',w:6});
/* 묶음 유전: 부모에게 값이 없는 묶음은 상대 부모 것을 받고, 둘 다 없으면 무작위. 낮은 확률로 돌연변이 */
const GR={body:['bt','bh','bl'],face:['et','es','ex','ey','mt','ms','my'],fins:['ft','ts','dt','fs','fp','sf','sp'],color:['bc','lc','fc','pc','lw'],pattern:['pa','ps']},GL={body:'몸통',face:'얼굴',fins:'지느러미',color:'색',pattern:'무늬'},COLK=k=>k==='bc'||k==='lc'||k==='fc'||k==='pc';
function rv(k){if(COLK(k))return rc();const q=SLm[k],v=rnd(q[2],q[3]);return q[4]>=1?Math.round(v):Math.round(v*100)/100}
const shade=c=>{const [h,s,v]=hex2(c),k=Math.random()<.5?rnd(.72,.92):rnd(1.08,1.3);return hsv2((h+rnd(-8,8)+360)%360,cl(s*(2-k)*rnd(.9,1.1),0,1),cl(v*k,.15,1))};
function mixG(a,b,pta,ptb,na,nb){
 const p={...P0},src={},gs=Object.keys(GR),mg=Math.random()<.08?gs[0|Math.random()*gs.length]:null;
 for(const g of gs){const ks=GR[g],ha=ks.some(k=>a[k]!==undefined),hb=ks.some(k=>b[k]!==undefined);
  const d=g===mg?'M':ha&&hb?(Math.random()<.5?'A':'B'):ha?'A':hb?'B':'R';src[g]=d;
  for(const k of ks){let v,fp=true;
   if(d==='M'&&(k==='lc'||k==='lw')){const f1=Math.random()<.5?a:b,f2=f1===a?b:a;v=f1[k]??f2[k]??P0[k]}
   else if(d==='M'||d==='R'){v=rv(k);fp=false}
   else{const f1=d==='A'?a:b,f2=d==='A'?b:a;v=f1[k]!==undefined?f1[k]:f2[k];if(v===undefined){v=rv(k);fp=false}}
   if(fp){if(COLK(k))v=k==='lc'?jc(v):shade(v);else{const q=SLm[k];v=cl(v+rnd(-.03,.03)*(q[3]-q[2]),q[2],q[3]);if(q[4]>=1)v=Math.round(v)}}
   p[k]=v}}
 const pt=src.pattern==='A'?pta:src.pattern==='B'?ptb:null,by={A:[],B:[],R:[],M:[]};
 for(const g of gs)by[src[g]].push(GL[g]);
 const parts=[];if(by.A.length)parts.push(`${na}: ${by.A.join('·')}`);if(by.B.length)parts.push(`${nb}: ${by.B.join('·')}`);if(by.R.length)parts.push(`무작위: ${by.R.join('·')}`);if(by.M.length)parts.push(`돌연변이: ${by.M.join('·')}`);
 return{p,pt:typeof pt==='string'?pt:null,txt:'',mut:!!mg}}
const NMF=['몽실','뽀삐','보리','콩이','나비','하늘','모모','단비','별이','솜이','해든','초롱','달래','봄이','루나','미소','은별','아롱','다홍','포도'],NMM=['철수','바다','두부','구름','튼튼','초코','토리','대박','우주','깜장','달봉','호야','쿠키','만두','범이','도토리','맹구','탄이','하루','대장'],NMN=['동글','말랑','뭉치','방울','똘이','반짝','마루','새롬'];
function rname(sx){const pool=(sx==='F'?NMF:NMM).concat(NMN);let n;for(let i=0;i<10;i++){n=pool[0|Math.random()*pool.length];if(!fish.some(o=>o.name===n))break}return n}
function hatch(e){
 if(usedIn(e.tk)>MAX+1e-6){toast(`어항에 자리가 없어요. 자리가 나면 부화시킬 수 있어요.`);return}
 e.cs=e.cs||(Math.random()<.5?'M':'F');save();
 $('#panel').innerHTML=`<p style="font-size:26px">새끼는 <b>${e.cs==='M'?'♂ 수컷':'♀ 암컷'}</b>이에요. 이름을 지어 주세요.</p><div class="row" style="align-items:center"><input type="text" id="hn2" maxlength="10" placeholder="물고기 이름" aria-label="새끼 이름"><button class="dc" id="hd" aria-label="랜덤 이름"></button></div><div class="pb"><button class="btn" id="hok">확인</button><button class="btn" id="hcx">취소</button></div>`;
 $('#hd').innerHTML=svg(IC.dice);$('#hd').onclick=()=>{$('#hn2').value=rname(e.cs)};$('#hok').onclick=()=>mkChild(e,$('#hn2').value.trim());$('#hcx').onclick=panel;$('#hn2').onkeydown=ev=>{if(ev.key==='Enter')$('#hok').click()};$('#hn2').focus()}
function mkChild(e,nm){
 if(usedIn(e.tk)>MAX+1e-6){toast(`어항에 자리가 없어요. 자리가 나면 부화시킬 수 있어요.`);return}
 {
  const M=mixG(gp(e.ga),gp(e.gb),e.ga.pt,e.gb.pt,e.t.fa.name,e.t.mo.name),p=M.p,pt0=M.pt,
  done=im=>{const c=document.createElement('canvas');c.width=420;c.height=280;render(c.getContext('2d'),420,280,p,im);const tc=trimC(c,bbox(c,10));if(!tc){toast('부화에 실패했어요');return}
   addFish({name:nm||autoName(e),sex:e.cs||(Math.random()<.5?'M':'F'),img:tc.toDataURL('image/png'),k:'c',p,pt:im?pt0:null,inh:M.txt,mut:M.mut,v:3,t:e.t,x:e.x,y:e.y,tk:e.tk});eggs=eggs.filter(o=>o.id!==e.id);panel();ui();save()};
  if(typeof pt0==='string'&&pt0.startsWith('data:image/')){const i=new Image();i.onload=()=>done(i);i.onerror=()=>done(null);i.src=pt0}else done(null)}
 }
function addFish(o){o.tk=o.tk||actTk();const f=mk(o);fish.push(f);sel=f.id;selE=null;delArm=false;fx.push({x:f.x,y:f.y,t:0,k:'pop',tk:f.tk});save();ui();panel();toast((o.mut?'돌연변이가 태어났어요! ':'')+`${f.name}이(가) 어항에 왔어요!`+(f.inh?' '+f.inh:''),f.inh?6000:3000)}

/* ---------- 커스터마이징 렌더 ---------- */
const SL=[['bt','몸통 종류',0,4,.05],['bh','몸통 높이',.5,1.6,.01],['bl','몸통 길이',.6,1.5,.01],['et','눈 종류',0,7,1],['es','눈 크기',.3,1.5,.01],['ex','눈 위치 (앞뒤)',0,1,.01],['ey','눈 위치 (위아래)',0,1,.01],['mt','입 종류',0,6,1],['ms','입 크기',0,1,.01],['my','입 위치',0,1,.01],['ft','꼬리 종류',0,5,1],['ts','꼬리 크기',.3,1.6,.01],['dt','등지느러미 종류',0,4,1],['fs','등지느러미 크기',0,1.6,.01],['fp','등지느러미 위치',0,1,.01],['sf','가슴지느러미 크기',0,1.6,.01],['sp','가슴지느러미 위치',0,1,.01],['pa','무늬 종류',0,6,1],['ps','무늬 크기',.5,2,.01],['lw','선 굵기',1,8,.1]];
const SLm=Object.fromEntries(SL.map(s=>[s[0],s]));
const P0={mv:2,bt:0,bh:1,bl:1,et:2,es:1,ex:.45,ey:.4,mt:1,ms:.6,my:.5,ft:1,ts:1,dt:1,fs:.8,fp:.5,sf:.6,sp:.5,pa:0,ps:1,lw:2.5,bc:'#9ad6f0',lc:'#2b2a63',fc:'#8bcbe8',pc:'#5b8fb9'};
const AR=[{l:55,h:36,p:[0,.66,.87,.97,1,.97,.87,.66,0]},{l:80,h:13,p:[0,.7,.92,1,1,.98,.9,.72,.3]},{l:66,h:24,p:[0,.45,.8,1,.98,.8,.55,.35,.18]},{l:50,h:52,p:[0,.55,.85,1,.9,.62,.38,.18,.05]},{l:44,h:44,p:[0,.75,.93,.99,1,.99,.93,.75,0]}];
const arch=bt=>{const i=Math.min(3,Math.floor(bt)),f=bt-i,A=AR[i],B=AR[i+1],m=(x,y)=>x+(y-x)*f;return{l:m(A.l,B.l),h:m(A.h,B.h),p:A.p.map((v,k)=>m(v,B.p[k]))}};
const prof=(P,u)=>{const t=cl(u,0,1)*8,i=Math.min(7,Math.floor(t)),f=(1-Math.cos((t-i)*Math.PI))/2;return P[i]+(P[i+1]-P[i])*f};
function render(g,w,h,p,pat,fr,hit){
 const p0=p;p={...P0,...p};if(p0.fc==null)p.fc=p.bc;const j=i=>fr?J(i,fr)*2:0;
 g.save();g.clearRect(0,0,w,h);g.scale(w/260,h/173);
 const A=arch(cl(+p.bt,0,4)),a=Math.min(80,A.l*p.bl),b=A.h*p.bh,ftI=Math.round(p.ft),ts=28*p.ts,tl=[0,1,1.05,1,1.5,1.4][cl(ftI,0,5)]*ts,x0=130-(2*a+tl)/2,Y=86,xAt=u=>x0+2*a*u,tY=u=>Y-b*prof(A.p,u),bY=u=>Y+b*prof(A.p,u);
 { /* 등지느러미·가슴지느러미가 캔버스 밖으로 잘리지 않게 필요할 때만 축소 */
  const di=Math.round(p.dt),dh=p.fs>.05?[0,16,34,11.2,18][cl(di,0,4)]*p.fs:0,top=Y-b-dh-p.lw-4,bot=Math.max(Y+b,Y+b*.28+(p.sf>.05?22*p.sf:0))+p.lw+4;
  if(top<2||bot>171){const k=Math.min(1,169/(bot-top));g.translate(130,86.5);g.scale(k,k);g.translate(-130,-(top+bot)/2)}}
 const HP=hit?{}:null,poly=q=>{const o=new Path2D();q.forEach((s,i)=>i?o.lineTo(s[0],s[1]):o.moveTo(s[0],s[1]));o.closePath();return o},circ=(x,y,r)=>{const o=new Path2D();o.arc(x,y,r,0,6.3);return o};if(hit)hit.m=g.getTransform();
 g.lineWidth=p.lw;g.lineJoin=g.lineCap='round';g.strokeStyle=p.lc;g.fillStyle=p.bc;
 const path=(q,sm)=>{g.beginPath();if(sm){const n=q.length;g.moveTo((q[n-1][0]+q[0][0])/2,(q[n-1][1]+q[0][1])/2);for(let i=0;i<n;i++){const A1=q[i],B1=q[(i+1)%n];g.quadraticCurveTo(A1[0],A1[1],(A1[0]+B1[0])/2,(A1[1]+B1[1])/2)}}else{q.forEach((s,i)=>i?g.lineTo(s[0],s[1]):g.moveTo(s[0],s[1]))}g.closePath()};
 const S=(pts,sd)=>{const q=pts.map((s,i)=>[s[0]+j(i*2+sd),s[1]+j(i*2+sd+31)]);path(q,false);g.fill();g.stroke()};
 const xt=xAt(1),T=[
  [[xt-3,Y-4],[xt+ts,Y-ts*.8],[xt+ts*.5,Y],[xt+ts,Y+ts*.8],[xt-3,Y+4]],
  [[xt-3,Y-4],[xt+ts*.7,Y-ts*.9],[xt+ts*1.05,Y-ts*.4],[xt+ts*1.05,Y+ts*.4],[xt+ts*.7,Y+ts*.9],[xt-3,Y+4]],
  [[xt-3,Y-4],[xt+ts,Y-ts],[xt+ts*.55,Y],[xt+ts,Y+ts],[xt-3,Y+4]],
  [[xt-3,Y-3],[xt+ts*.6,Y-ts*.45],[xt+ts*1.5,Y-ts*.15],[xt+ts*1.2,Y+ts*.2],[xt+ts*.6,Y+ts*.55],[xt-3,Y+3]],
  [[xt-3,Y-3],[xt+ts*1.4,Y-2],[xt+ts*1.4,Y+2],[xt-3,Y+3]]];
 g.fillStyle=p.fc;if(ftI>0)S(T[cl(ftI-1,0,4)],10);if(HP)HP.tail=ftI>0?poly(T[cl(ftI-1,0,4)]):circ(xt+10,Y,13);
 const dt=Math.round(p.dt),fs=p.fs,cu=.2+.6*p.fp;
 if(dt>0&&fs>.05){const u1=cl(cu-.12,.03,.97),u2=cl(cu+.12,.03,.97),um=(u1+u2)/2;let D;
  if(dt===1)D=[[xAt(u1),tY(u1)+2],[xAt(um),tY(um)-16*fs],[xAt(u2),tY(u2)+2]];
  else if(dt===2)D=[[xAt(u1),tY(u1)+2],[xAt(u2)+6*fs,tY(um)-34*fs],[xAt(u2),tY(u2)+2]];
  else if(dt===3){D=[];for(let k=0;k<=10;k++){const u=.12+.76*k/10;D.push([xAt(u),tY(u)-8*fs*(1+.4*Math.sin(k*1.7))+2])}for(let k=10;k>=0;k--){const u=.12+.76*k/10;D.push([xAt(u),tY(u)+2])}}
  else{D=[];for(let k=0;k<=5;k++){const u=u1+(u2-u1)*k/5,v=u1+(u2-u1)*(k+.5)/5;D.push([xAt(u),tY(u)+2]);if(k<5)D.push([xAt(v),tY(v)-18*fs])}}
  S(D,20);if(HP)HP.dors=poly(D)}
 if(HP&&!HP.dors)HP.dors=circ(xAt(cu),tY(cu)-6,11);
 if(Math.round(p.mt)===3){const dy=(p.my-.5)*b*.8;let u=0;while(u<.5&&b*prof(A.p,u)<Math.abs(dy))u+=.01;
  const ml=3+p.ms*13,x0=xAt(u)+j(11)*.4,my=Y+dy+j(12)*.4,hh=ml*.6,r=hh/2,cx0=x0-ml*.45;
  /* 위·아래 입술을 반원 두 개로: 앞에서 보면 'ε'(3을 뒤집은 모양) */
  g.fillStyle=p.bc;g.lineWidth=Math.max(1.5,p.lw*.8);g.beginPath();g.moveTo(x0+ml*.6,my-hh);g.lineTo(cx0,my-hh);
  g.arc(cx0,my-r,r,-Math.PI/2,Math.PI/2,true);g.arc(cx0,my+r,r,-Math.PI/2,Math.PI/2,true);g.lineTo(x0+ml*.6,my+hh);g.closePath();g.fill();g.stroke();
  g.beginPath();g.moveTo(cx0,my);g.lineTo(cx0+ml*.35,my);g.stroke();if(HP)HP.mouth=circ(cx0,my,Math.max(8,ml*.8))}
 const bp=[];for(let k=0;k<=22;k++){const u=k/22;bp.push([xAt(u),tY(u)])}for(let k=21;k>=1;k--){const u=k/22;bp.push([xAt(u),bY(u)])}
 const bq=bp.map((s,i)=>[s[0]+j(i+100),s[1]+j(i+140)]);
 g.fillStyle=p.bc;path(bq,true);g.fill();if(HP)HP.body=poly(bq);
 const pa=Math.round(p.pa);
 if(pa>0){g.save();path(bq,true);g.clip();g.fillStyle=g.strokeStyle=p.pc;const sz=6*p.ps,x1=xAt(0),x2=xAt(1),y1=Y-b-4,y2=Y+b+4;g.lineWidth=Math.max(1.5,sz*.35);
  if(pa===1){for(let x=x1+sz;x<x2;x+=sz*1.9)for(let y=y1+sz,r=0;y<y2;y+=sz*1.9,r++){g.beginPath();g.arc(x+(r%2)*sz*.95+j(x+y)*.5,y+j(x*2+y)*.5,sz*.38,0,6.3);g.fill()}}
  else if(pa===2){for(let x=x1+sz;x<x2;x+=sz*1.8){g.beginPath();g.moveTo(x+j(x),y1);g.lineTo(x+j(x+3),y2);g.stroke()}}
  else if(pa===3){for(let y=y1;y<y2;y+=sz*1.8){g.beginPath();g.moveTo(x1,y+j(y));g.lineTo(x2,y+j(y+3));g.stroke()}}
  else if(pa===4){for(let i=0;i<7;i++){const ccx=x1+(x2-x1)*((i*.37+.11)%1),ccy=Y+(((i*.53)%1)-.5)*b*1.6;g.beginPath();g.ellipse(ccx+j(i),ccy+j(i+5),sz*(1.1+(i%3)*.5),sz*(.8+(i%2)*.5),i,0,6.3);g.fill()}}
  else if(pa===5){for(let x=x1-b;x<x2+b;x+=sz*2){g.beginPath();g.moveTo(x+j(x),y2);g.lineTo(x+b*1.2+j(x+3),y1);g.stroke()}}
  else{for(let y=y1,r=0;y<y2;y+=sz*1.2,r++)for(let x=x1+(r%2)*sz*.9;x<x2;x+=sz*1.8){g.beginPath();g.arc(x+j(x+y)*.4,y,sz*.9,0,3.14);g.stroke()}}
  g.restore()}
 if(pat){g.save();path(bq,true);g.clip();g.drawImage(pat,0,0,260,173);g.restore()}
 path(bq,true);g.stroke();
 {const s=p.sf,x1=xAt(.28+.4*p.sp),y1=Y+b*.28,q=[[x1,y1],[x1+20*s,y1+4*s],[x1+34*s,y1+22*s],[x1+10*s,y1+14*s]];if(s>.05){g.fillStyle=p.fc;S(q,30)}if(HP)HP.pec=s>.25?poly(q):circ(x1+8,y1+6,11)}
 const eu=.12+p.ex*.4,ex=xAt(eu)+j(9)*.5,ey=Y+(p.ey-.5)*b*prof(A.p,eu)*1.5+j(10)*.5,r=2+p.es*4.5,et=Math.round(p.et);if(HP)HP.eye=circ(ex,ey,Math.max(8,r*2.2));
 g.lineWidth=Math.max(1.5,p.lw*.7);g.fillStyle=p.lc;g.beginPath();
 if(et===0){}
 else if(et===1){g.arc(ex,ey,r*.8,0,6.3);g.fill()}
 else if(et===2){g.fillStyle='#fff';g.arc(ex,ey,r*1.5,0,6.3);g.fill();g.stroke();g.beginPath();g.fillStyle=p.lc;g.arc(ex-r*.2,ey,r*.7,0,6.3);g.fill()}
 else if(et===3){g.moveTo(ex-r*1.2,ey);g.quadraticCurveTo(ex,ey+r*1.1,ex+r*1.2,ey);g.stroke();g.beginPath();g.moveTo(ex-r*1.2,ey-r*.9);g.lineTo(ex+r*1.2,ey-r*.9);g.stroke()}
 else if(et===4){g.fillStyle='#fff';g.arc(ex,ey,r*1.8,0,6.3);g.fill();g.stroke();g.beginPath();g.fillStyle=p.lc;g.arc(ex-r*.2,ey,r*1.1,0,6.3);g.fill();g.beginPath();g.fillStyle='#fff';g.arc(ex-r*.5,ey-r*.4,r*.35,0,6.3);g.fill()}
 else if(et===5){g.moveTo(ex-r*1.3,ey+r*.5);g.quadraticCurveTo(ex,ey-r*1.5,ex+r*1.3,ey+r*.5);g.stroke()}
 else if(et===6){g.fillStyle='#fff';g.arc(ex,ey,r*2.1,0,6.3);g.fill();g.stroke();g.beginPath();g.fillStyle=p.lc;g.arc(ex-r*.6,ey,r*1.1,0,6.3);g.fill();g.beginPath();g.fillStyle='#fff';g.arc(ex-r*.9,ey-r*.4,r*.35,0,6.3);g.fill()}
 else{g.arc(ex,ey+r*.2,r*.9,0,6.3);g.fill();g.beginPath();g.moveTo(ex-r*1.5,ey-r*.5);g.lineTo(ex+r*1.3,ey-r*1.8);g.stroke()}
 const mt=[0,5,2,3,4,6,7][cl(Math.round(p.mt),0,6)],dy=(p.my-.5)*b*.8;let u=0;while(u<.5&&b*prof(A.p,u)<Math.abs(dy))u+=.01;
 const mx=xAt(u)+3+j(11)*.4,my=Y+dy+j(12)*.4,ml=3+p.ms*13;if(HP&&mt!==3)HP.mouth=circ(mx+ml*.5,my,Math.max(8,ml*.8));g.lineWidth=Math.max(1.5,p.lw*.8);g.fillStyle='#fff';g.beginPath();
 if(mt===0){}
 else if(mt===1){g.moveTo(mx,my);g.quadraticCurveTo(mx+ml*.5,my+ml*.35,mx+ml,my);g.stroke()}
 else if(mt===2){g.ellipse(mx+ml*.2,my,ml*.3,ml*.4,0,0,6.3);g.fill();g.stroke()}
 else if(mt===3){}
 else if(mt===4){g.moveTo(mx,my);g.lineTo(mx+ml*1.3,my);g.stroke();for(let k=0;k<4;k++){const x=mx+ml*(.1+k*.3);g.beginPath();g.moveTo(x,my);g.lineTo(x+ml*.14,my+ml*.5);g.lineTo(x+ml*.28,my);g.closePath();g.fill();g.stroke()}}
 else if(mt===5){g.moveTo(mx,my-ml*.15);g.quadraticCurveTo(mx+ml*.6,my+ml*.8,mx+ml*1.2,my-ml*.35);g.stroke()}
 else if(mt===6){g.fillStyle='#e8707a';g.moveTo(mx,my);g.lineTo(mx+ml*1.3,my-ml*.55);g.lineTo(mx+ml*1.3,my+ml*.7);g.closePath();g.fill();g.stroke()}
 else{g.fillStyle=p.bc;g.moveTo(mx-ml*.7,my);g.lineTo(mx+ml*.3,my-ml*.3);g.lineTo(mx+ml*.3,my+ml*.3);g.closePath();g.fill();g.stroke()}
 if(hit)hit.p=HP;g.restore()}
function bbox(src,m){const w=src.width,h=src.height,d=src.getContext('2d').getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 if(x1<0||(x1-x0<6&&y1-y0<6))return null;m=m||4;return[Math.max(0,x0-m),Math.max(0,y0-m),Math.min(w-1,x1+m),Math.min(h-1,y1+m)]}
function trimC(src,bx,cap){bx=bx||bbox(src);if(!bx)return null;cap=cap||[220,170];const[x0,y0,x1,y1]=bx,sw=x1-x0+1,sh=y1-y0+1,k=Math.min(1,cap[0]/sw,cap[1]/sh),c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(sw*k));c.height=Math.max(1,Math.round(sh*k));c.getContext('2d').drawImage(src,x0,y0,sw,sh,0,0,c.width,c.height);return c}
/* 커스텀 물고기: 일렁이는 선 프레임 4장을 미리 만들어 둔다 */
const HR=2;/* 어항에서 확대해도 덜 깨지도록 물고기 프레임을 이 배율로 크게 만들어 둠 */
function bake(f){if(f.k!=='c'||!f.p)return;
 const go=pt=>{try{const b=document.createElement('canvas');b.width=420;b.height=280;render(b.getContext('2d'),420,280,f.p,pt,0);const bx=bbox(b,10);if(!bx)return;
  const k0=Math.min(1,220/(bx[2]-bx[0]+1),170/(bx[3]-bx[1]+1)),bxH=bx.map(v=>v*HR);
  const fr=[1,2,3,4].map(i=>{const c=document.createElement('canvas');c.width=420*HR;c.height=280*HR;render(c.getContext('2d'),c.width,c.height,f.p,pt,i*5+1);return trimC(c,bxH,[1e4,1e4])});
  if(f.mig){const s=trimC(b,bx);f.im=s;f.img=s.toDataURL('image/png');f.mig=false}f.fr=fr.map(c=>stick(c,HR/k0));f.w=fr[0].width;f.h=fr[0].height}catch(e){}};
 if(f.pt){const i=new Image();i.onload=()=>go(i);i.src=f.pt}else go(null)}
function stick(c,s){s=s||1;const m=Math.round(16*s),R=m-2*s,w=c.width+2*m,h=c.height+2*m,t=document.createElement('canvas');t.width=w;t.height=h;const g=t.getContext('2d',{willReadFrequently:true});g.drawImage(c,m,m);
 const im=g.getImageData(0,0,w,h),d=im.data,N=w*h,D=new Float32Array(N);for(let i=0;i<N;i++)D[i]=d[i*4+3]>40?0:1e4;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;let v=D[i];if(x>0)v=Math.min(v,D[i-1]+1);if(y>0){v=Math.min(v,D[i-w]+1);if(x>0)v=Math.min(v,D[i-w-1]+1.41);if(x<w-1)v=Math.min(v,D[i-w+1]+1.41)}D[i]=v}
 for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;let v=D[i];if(x<w-1)v=Math.min(v,D[i+1]+1);if(y<h-1){v=Math.min(v,D[i+w]+1);if(x<w-1)v=Math.min(v,D[i+w+1]+1.41);if(x>0)v=Math.min(v,D[i+w-1]+1.41)}D[i]=v}
 const T=i=>{const x=i%w,y=(i/w)|0;return R+(Math.sin((x*.21+y*.08)/s)*1.6+Math.cos((y*.17-x*.05)/s)*1.4)*s};
 const seen=new Uint8Array(N),st=[0];seen[0]=1;
 while(st.length){const p=st.pop(),x=p%w;for(const q of [x>0?p-1:-1,x<w-1?p+1:-1,p>=w?p-w:-1,p<N-w?p+w:-1]){if(q<0||seen[q]||D[q]<=T(q))continue;seen[q]=1;st.push(q)}}
 const out=g.createImageData(w,h),o=out.data;for(let i=0;i<N;i++)if(!seen[i]){o[i*4]=o[i*4+1]=o[i*4+2]=255;o[i*4+3]=255}
 g.putImageData(out,0,0);g.drawImage(c,m,m);return{s:t}}
function warp(src,seed,amp,out){const w=src.width,h=src.height,t=out||document.createElement('canvas');t.width=w;t.height=h;const g=t.getContext('2d'),m=document.createElement('canvas');m.width=w;m.height=h;const mg=m.getContext('2d');
 for(let y=0;y<h;y+=2){const dx=Math.sin(y*.045+seed*1.3)*amp+Math.sin(y*.11+seed*2.9)*amp*.5;mg.drawImage(src,0,y,w,2,dx,y,w,2)}
 for(let x=0;x<w;x+=2){const dy=Math.sin(x*.05+seed*1.9)*amp+Math.sin(x*.13+seed*3.1)*amp*.5;g.drawImage(m,x,0,2,h,x,dy,2,h)}
 return t}
const up=(c,s)=>{const t=document.createElement('canvas');t.width=Math.round(c.width*s);t.height=Math.round(c.height*s);const g=t.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(c,0,0,t.width,t.height);return t};
function bakeD(f){try{const S=1.5;f.fr=[1,2,3,4].map(i=>stick(up(warp(f.im,i*5+(f.sd|0),.9),S),S));f.w=(f.im.naturalWidth||1)*S;f.h=(f.im.naturalHeight||1)*S}catch(e){}}
function wob(){if(mode==='d')warp(pad,pf,1.3,pw)}
function patURL(){const d=patc.getImageData(0,0,420,280).data;let any=0;for(let i=3;i<d.length;i+=4)if(d[i]>10){any=1;break}if(!any)return null;const t=document.createElement('canvas');t.width=260;t.height=173;t.getContext('2d').drawImage(pat,0,0,260,173);return t.toDataURL('image/png')}

/* ---------- 그리기 모달 ---------- */
const pw=$('#pw'),pad=$('#pad'),pc=pad.getContext('2d',{willReadFrequently:true}),pv=$('#pv'),pvc=pv.getContext('2d'),pat=document.createElement('canvas');pat.width=420;pat.height=280;const patc=pat.getContext('2d',{willReadFrequently:true});
let pf=0,mode='d',tool='p',lw=4,hsv=[240,.85,.4],col='#2b2a63',sexv='M',stk={d:[],c:[]},strokes=[],fills=[],drawing=false,lp,P={...P0};
const hsv2=(h,s,v)=>{const f=n=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};return hex(f(5)*255,f(3)*255,f(1)*255)};
const hex2=h=>{const n=parseInt(h.slice(1),16),r=(n>>16)/255,g=(n>>8&255)/255,b=(n&255)/255,M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let hh=0;if(d)hh=M===r?((g-b)/d+6)%6:M===g?(b-r)/d+2:(r-g)/d+4;return[hh*60,M?d/M:0,M]};
const svc=$('#sv').getContext('2d');
function svDraw(){const sv=$('#sv'),r=sv.getBoundingClientRect(),d=devicePixelRatio||1;if(r.width&&(sv.width!==Math.round(r.width*d)||sv.height!==Math.round(r.height*d))){sv.width=Math.round(r.width*d);sv.height=Math.round(r.height*d)}const w=sv.width,h=sv.height;svc.fillStyle=`hsl(${hsv[0]},100%,50%)`;svc.fillRect(0,0,w,h);let g=svc.createLinearGradient(0,0,w,0);g.addColorStop(0,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');svc.fillStyle=g;svc.fillRect(0,0,w,h);g=svc.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#000');svc.fillStyle=g;svc.fillRect(0,0,w,h);
 svc.strokeStyle='#fff';svc.lineWidth=2*d;svc.beginPath();svc.arc(hsv[1]*w,(1-hsv[2])*h,6*d,0,6.3);svc.stroke();svc.strokeStyle='#000';svc.lineWidth=d;svc.stroke()}
new ResizeObserver(()=>svDraw()).observe($('#sv'));
function setCol(c){col=c;hsv=hex2(c);$('#hue').value=hsv[0];svDraw()}
function pickSV(e){const r=$('#sv').getBoundingClientRect();hsv[1]=cl((e.clientX-r.left)/r.width,0,1);hsv[2]=1-cl((e.clientY-r.top)/r.height,0,1);col=hsv2(...hsv);svDraw()}
let svd=false;$('#sv').onpointerdown=e=>{svd=true;$('#sv').setPointerCapture(e.pointerId);pickSV(e)};$('#sv').onpointermove=e=>{if(svd)pickSV(e)};$('#sv').onpointerup=()=>svd=false;
$('#hue').oninput=e=>{hsv[0]=+e.target.value;col=hsv2(...hsv);svDraw()};
[2,4,8].forEach((s,i)=>{const b=document.createElement('button');b.className='btn'+(i==1?' on':'');b.dataset.w=s;b.setAttribute('aria-label','굵기 '+s);b.innerHTML=`<i style="display:inline-block;width:${s+3}px;height:${s+3}px;border-radius:50%;background:currentColor;vertical-align:middle"></i>`;b.onclick=()=>{lw=s;mark()};$('#sizes').append(b)});
function mark(){document.querySelectorAll('#sizes .btn').forEach(b=>b.classList.toggle('on',+b.dataset.w===lw));document.querySelectorAll('#tools .btn').forEach(b=>b.classList.toggle('on',b.dataset.t===tool));
 const hs=mode==='c'&&tool==='s';['#sizes','#sv','#hue'].forEach(q=>$(q).style.display=hs?'none':'');if(mode==='c')prv()}
document.querySelectorAll('#tools .btn').forEach(b=>b.onclick=()=>{tool=b.dataset.t;mark()});
document.querySelectorAll('#sex .btn').forEach(b=>b.onclick=()=>{sexv=b.dataset.s;document.querySelectorAll('#sex .btn').forEach(x=>x.classList.toggle('on',x===b))});
/* 커스터마이징 슬라이더 */
const NM={et:['없음','점','동그라미','졸린 눈','반짝 눈','웃는 눈','붕어눈','화난 눈'],mt:['없음','웃는 입','뻐끔 입','튀어나온 입','날카로운 이빨','쩍 벌린 입','뾰족 부리'],ft:['없음','삼각 꼬리','부채 꼬리','제비 꼬리','리본 꼬리','채찍 꼬리'],dt:['없음','낮은 곡선','높은 삼각','길게 이어진','가시'],pa:['없음','점박이','세로 줄무늬','가로 줄무늬','큰 얼룩','대각 줄무늬','비늘'],bt:['기본 물고기','장어','상어','가오리','복어']};
function lab(){document.querySelectorAll('#cust [data-k]').forEach(i=>{const b=i.parentNode.querySelector('b'),n=NM[i.dataset.k];if(b&&n)b.textContent=n[cl(Math.round(i.value),0,n.length-1)]})}
SL.forEach(([k,l,a,b,st])=>{const L=document.createElement('label');L.innerHTML=`<span>${l}${NM[k]?' · <b></b>':''}</span><input type="range" min="${a}" max="${b}" step="${st}" value="${P0[k]}" data-k="${k}" aria-label="${l}">`;$('#cust').append(L)});$('#cols').append($('#cust [data-k="lw"]').parentNode);lab();
function onCust(e){const t=e.target;if(t.dataset.k){P[t.dataset.k]=+t.value;lab()}else if(t.id==='bc')P.bc=t.value;else if(t.id==='lc')P.lc=t.value;else if(t.id==='fc')P.fc=t.value;else if(t.id==='pc')P.pc=t.value;prv()}
$('#cust').oninput=onCust;$('#cols').oninput=onCust;
const rc=()=>hsv2(rnd(0,360),rnd(.3,.65),rnd(.82,1));
function rndFish(){for(const [k,,a,b,st] of SL){if(k==='lw')continue;let v=rnd(a,b);P[k]=st>=1?Math.round(v):Math.round(v*100)/100}
 P.bt=Math.round(cl(Math.round(rnd(0,4))+rnd(-.2,.2),0,4)*20)/20;P.lw=Math.round(rnd(1.5,4)*10)/10;
 P.bc=rc();P.lc=Math.random()<.5?'#2b2a63':dk(P.bc);P.fc=Math.random()<.6?rc():P.bc;P.pc=rc();if(Math.random()<.35)P.pa=0;
 document.querySelectorAll('#cust [data-k],#cols [data-k]').forEach(i=>i.value=P[i.dataset.k]);$('#bc').value=P.bc;$('#lc').value=P.lc;$('#fc').value=P.fc;$('#pc').value=P.pc;lab();prv()}
$('#rf').onclick=rndFish;$('#dn').onclick=()=>{$('#nm').value=rname(sexv)};
/* 커스터마이징: 물고기 부위를 눌러서 그 부위 슬라이더만 보기 */
const HIT={},PKc={body:['bc','pc'],tail:['fc'],dors:['fc'],pec:['fc']},PK={body:['bt','bh','bl','pa','ps'],eye:['et','es','ex','ey'],mouth:['mt','ms','my'],tail:['ft','ts'],dors:['dt','fs','fp'],pec:['sf','sp']},PN={body:'몸통 · 무늬',eye:'눈',mouth:'입',tail:'꼬리',dors:'등지느러미',pec:'가슴지느러미'};
let hovP=null,selP=null,PVS=1;
/* 미리보기는 실제 표시 크기 × 화면 배율 해상도로 그림 (420×280 고정이면 늘어나서 흐려짐) */
function pvSize(){const r=pv.getBoundingClientRect();if(!r.width)return;const s=cl(r.width*(devicePixelRatio||1)/420,1,4);if(Math.abs(s-PVS)>.01){PVS=s;pv.width=Math.round(420*s);pv.height=Math.round(280*s)}}
function pick(x,y){if(!HIT.p)return null;pvc.save();pvc.setTransform(HIT.m);const k=['eye','mouth','pec','dors','tail','body'].find(k=>HIT.p[k]&&pvc.isPointInPath(HIT.p[k],x*PVS,y*PVS));pvc.restore();return k||null}
function selPart(k){selP=k;$('#cust').classList.toggle('empty',!k);$('#cpt').innerHTML=k?`<b>${PN[k]}</b> <small>다른 부위를 누르면 바뀌어요</small>`:'바꾸고 싶은 물고기 부위를 눌러 주세요';
 document.querySelectorAll('#cust [data-k]').forEach(i=>i.parentNode.hidden=!k||!PK[k].includes(i.dataset.k));document.querySelectorAll('#cust [data-c]').forEach(l=>l.hidden=!k||!(PKc[k]||[]).includes(l.dataset.c));prv()}
function prv(){pvSize();render(pvc,pv.width,pv.height,P,pat,pf,HIT);if(!HIT.p||mode!=='c'||tool!=='s')return;pvc.save();pvc.setTransform(HIT.m);pvc.lineWidth=2;pvc.setLineDash([5,4]);
 if(hovP&&hovP!==selP){pvc.fillStyle='rgba(90,169,230,.2)';pvc.fill(HIT.p[hovP]);pvc.strokeStyle='rgba(90,169,230,.9)';pvc.stroke(HIT.p[hovP])}
 if(selP){pvc.fillStyle='rgba(90,169,230,.12)';pvc.fill(HIT.p[selP]);pvc.strokeStyle='#2f7fc4';pvc.stroke(HIT.p[selP])}pvc.restore()}
function setMode(m){mode=m;const c=m==='c';pad.style.visibility=c?'hidden':'';pad.style.opacity=c?'':0;pv.hidden=!c;$('#pw').hidden=c;$('#cust').hidden=!c;$('#cols').hidden=!c;$('#rf').hidden=!c;$('#gd').style.display=c?'none':'';$('#tf').style.display=c?'none':'';$('#tsel').style.display=c?'':'none';document.querySelectorAll('#tabs .btn').forEach(b=>b.classList.toggle('on',b.dataset.tab===m));if(c)tool='s';else if(tool==='s')tool='p';hovP=null;padw.style.cursor='';mark();if(c)selPart(null)}
document.querySelectorAll('#tabs .btn').forEach(b=>b.onclick=()=>setMode(b.dataset.tab));
const tg=()=>mode==='d'?{c:pc,s:stk.d}:{c:patc,s:stk.c};
const padw=$('#padw'),pos=e=>{const r=padw.getBoundingClientRect();return[(e.clientX-r.left)*420/r.width,(e.clientY-r.top)*280/r.height]};
function stroke(a,b){const g=tg().c;g.globalCompositeOperation=tool==='e'?'destination-out':'source-over';g.strokeStyle=col;g.lineWidth=tool==='e'?lw*2.5:lw;g.lineCap=g.lineJoin='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0]+.01,b[1]);g.stroke();if(mode==='c')prv();else wob()}
padw.onpointerdown=e=>{e.preventDefault();if(mode==='c'&&tool==='s'){selPart(pick(...pos(e)));return}padw.setPointerCapture(e.pointerId);const T=tg();T.s.push(T.c.getImageData(0,0,420,280));if(T.s.length>25)T.s.shift();lp=pos(e);
 if(tool==='f'&&mode==='d'){strokes.push([col,lw]);flood(lp[0],lp[1]);return}drawing=true;if(tool!=='e'&&mode==='d')strokes.push([col,lw]);stroke(lp,lp);if(tool==='p')penS.start()};
padw.onpointermove=e=>{if(mode==='c'&&tool==='s'){const k=pick(...pos(e));padw.style.cursor=k?'pointer':'default';if(k!==hovP){hovP=k;prv()}return}padw.style.cursor='';if(!drawing)return;const p=pos(e);penS.move(Math.hypot(p[0]-lp[0],p[1]-lp[1]));stroke(lp,p);lp=p};padw.onpointerup=padw.onpointercancel=()=>{drawing=false;penS.stop()};
/* 펜 사각사각: 긴 낙서 구간에서 재생하고, 펜이 움직이는 동안만 들리게(멈추거나 떼면 바로 잦아듦)
   → 짧게 그으면 짧게, 길게 그으면 길게 들림 */
const penS=(()=>{const a=new Audio('assets/voicebosch-pencil-scribbling-200560.mp3'),R=[[1.3,16.4],[25.1,38.7],[40.8,43],[45.3,47.7]];a.preload='auto';
 let on=false,lv=0,tg=0,last=0,seg=null,id=0;
 const jump=()=>{seg=R[0|Math.random()*R.length];try{a.currentTime=rnd(seg[0],Math.max(seg[0],seg[1]-1.5))}catch(e){}};
 const loop=()=>{const v=(+$('#vol').value||0)/100;if(performance.now()-last>90)tg=0;lv+=(tg-lv)*(tg>lv?.5:.25);a.volume=cl(lv*v*2,0,1);
  if(seg&&a.currentTime>seg[1]-.05)jump();if(!on&&lv<.01){clearInterval(id);id=0;a.pause()}};
 return{start(){on=true;jump();a.play().catch(()=>{});if(!id)id=setInterval(loop,30)},move(d){last=performance.now();tg=tg*.6+cl(d/5,.5,1)*.4},stop(){on=false;tg=0}}})();
$('#undo').onclick=()=>{const T=tg(),s=T.s.pop();if(s){T.c.globalCompositeOperation='source-over';T.c.putImageData(s,0,0);if(mode==='c')prv();else wob()}};
$('#clr').onclick=()=>{const T=tg();T.s.push(T.c.getImageData(0,0,420,280));T.c.clearRect(0,0,420,280);if(mode==='c')prv();else wob()};
function flood(sx,sy){const w=420,h=280,im=pc.getImageData(0,0,w,h),d=im.data;sx=cl(sx|0,0,w-1);sy=cl(sy|0,0,h-1);
 const i0=(sy*w+sx)*4,T=[d[i0],d[i0+1],d[i0+2],d[i0+3]],n=parseInt(col.slice(1),16),R=n>>16,G=n>>8&255,B=n&255;if(T[3]===255&&T[0]===R&&T[1]===G&&T[2]===B)return;
 const seen=new Uint8Array(w*h),st=[sy*w+sx],got=[],ok=p=>{p*=4;return Math.abs(d[p]-T[0])+Math.abs(d[p+1]-T[1])+Math.abs(d[p+2]-T[2])+Math.abs(d[p+3]-T[3])<=60};
 while(st.length){const p=st.pop();if(seen[p]||!ok(p))continue;seen[p]=1;got.push(p);const x=p%w;if(x>0)st.push(p-1);if(x<w-1)st.push(p+1);if(p>=w)st.push(p-w);if(p<w*(h-1))st.push(p+w)}
 for(const p of got){const q=p*4;d[q]=R;d[q+1]=G;d[q+2]=B;d[q+3]=255}
 for(const p of got)for(const o of [p-1,p+1,p-w,p+w]){if(o<0||o>=w*h||seen[o])continue;const q=o*4,a=d[q+3];if(a===0||a===255)continue;const k=a/255;d[q]=d[q]*k+R*(1-k);d[q+1]=d[q+1]*k+G*(1-k);d[q+2]=d[q+2]*k+B*(1-k);d[q+3]=255;seen[o]=2}
 fills.push([col,got.length]);pc.putImageData(im,0,0);wob()}
function dgenes(src,st,fl){
 const w=src.width,h=src.height,im=src.getContext('2d').getImageData(0,0,w,h).data,bins={},top=new Int16Array(w).fill(-1),bot=new Int16Array(w).fill(-1);let x0=w,y0=h,x1=-1,y1=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(im[i+3]<60)continue;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;if(top[x]<0)top[x]=y;bot[x]=y;
  const k=(im[i]>>5)*64+(im[i+1]>>5)*8+(im[i+2]>>5),b=bins[k]||(bins[k]=[0,0,0,0]);b[0]++;b[1]+=im[i];b[2]+=im[i+1];b[3]+=im[i+2]}
 if(x1<0)return null;
 const arr=Object.values(bins).sort((p,q)=>q[0]-p[0]).map(b=>[b[1]/b[0],b[2]/b[0],b[3]/b[0]]),cs=[];
 for(const c of arr){if(cs.every(o=>Math.hypot(o[0]-c[0],o[1]-c[1],o[2]-c[2])>70))cs.push(c);if(cs.length>=3)break}
 const lum=c=>.3*c[0]+.59*c[1]+.11*c[2],hx=c=>hex(c[0],c[1],c[2]),dark=cs.reduce((m,c)=>lum(c)<lum(m)?c:m,cs[0]);let lc,rest;
 if(cs.length>1&&lum(dark)<110){lc=hx(dark);rest=cs.filter(c=>c!==dark)}else{rest=cs;lc=dk(hx(cs[0]))}
 const bc=hx(rest[0]),fc=rest[1]?hx(rest[1]):bc,pc=rest[2]?hx(rest[2]):dk(bc);
 const FA={};for(const [c,a] of fl||[])FA[c]=(FA[c]||0)+a;const FC=Object.keys(FA).sort((p,q)=>FA[q]-FA[p]);
 const W=x1-x0+1,H=y1-y0+1,r=W/H,avgw=st.length?st.reduce((q,z)=>q+z[1],0)/st.length:4;
 let mh=1;for(let x=x0;x<=x1;x++)if(top[x]>=0)mh=Math.max(mh,bot[x]-top[x]+1);
 let ts=0,tn=0;for(let x=Math.floor(x1-W*.18);x<=x1;x++)if(top[x]>=0){ts+=bot[x]-top[x]+1;tn++}
 const tr=tn?ts/tn/mh:.5,tops=[];let xp=x0,pk=1e9;
 for(let x=Math.floor(x0+W*.15);x<=x0+W*.85;x++)if(top[x]>=0){tops.push(top[x]);if(top[x]<pk){pk=top[x];xp=x}}
 tops.sort((p,q)=>p-q);const med=tops.length?tops[tops.length>>1]:pk,bump=(med-pk)/H;
 return{bt:r<1.3?4:r<2.1?0:r<2.9?2:1,bh:cl(2/r,.5,1.6),bl:cl(r/2,.6,1.5),ts:cl(.4+tr*1.5,.3,1.6),dt:bump<.04?0:bump<.12?1:2,fs:cl(.4+bump*5,.3,1.6),fp:cl(((xp-x0)/W-.2)/.6,0,1),
  pa:cs.length>=3&&st.length>=12?1+st.length%6:0,ps:cl(.6+avgw*.15,.6,1.8),lw:cl(avgw/1.5,1.5,8),bc:FC[0]||bc,lc,fc:FC[1]||FC[0]||fc,pc:FC[2]||pc}}
function genesD(src){if(!strokes.length)return{c:'#2b2a63',w:6};const m={};let ws=0;for(const [c,w] of strokes){m[c]=(m[c]||0)+1;ws+=w}
 const g={c:Object.keys(m).sort((a,b)=>m[b]-m[a])[0],w:Math.round(ws/strokes.length*10)/10};try{const d=dgenes(src,strokes,fills);if(d)g.d=d}catch(e){}return g}
const gv=x=>x.k==='c'&&x.p?{c:x.p.bc,w:x.p.lw*1.5}:(x.g||{c:'#2b2a63',w:6});
function openDraw(e){hatching=e||null;pc.clearRect(0,0,420,280);patc.clearRect(0,0,420,280);stk={d:[],c:[]};strokes=[];fills=[];P={...P0};
 document.querySelectorAll('#cust [data-k],#cols [data-k]').forEach(i=>i.value=P0[i.dataset.k]);lab();$('#bc').value=P0.bc;$('#lc').value=P0.lc;$('#fc').value=P0.fc;$('#pc').value=P0.pc;
 $('#tabs').style.display=e?'none':'';setMode('d');tool='p';mark();sexv=Math.random()<.5?'M':'F';
 document.querySelectorAll('#sex .btn').forEach(x=>x.classList.toggle('on',x.dataset.s===sexv));
 if(e){const a=gv(e.ga),b=gv(e.gb);setCol(Math.random()<.5?a.c:b.c);lw=Math.max(2,Math.round((a.w+b.w)/2*10)/10);$('#nm').value=autoName(e);$('#mt').textContent='새끼 물고기 그리기';mark()}
 else{setCol('#2b2a63');lw=4;$('#nm').value='';$('#mt').textContent='물고기 그리기'}
 mark();$('#m').hidden=false;wob()}
const closeDraw=()=>{$('#m').hidden=true;addTarget=null;if(DUA.gameCb){const cb=DUA.gameCb;DUA.gameCb=null;cb(null)}};
$('#mx').onclick=closeDraw;$('#sx').onclick=()=>$('#sm').hidden=true;
addEventListener('keydown',e=>{if(e.key==='Escape'){if(pickO){endPick();toast('물고기 추가를 취소했어요')}closeDraw();$('#sm').hidden=true;$('#lm').hidden=true}});
$('#ok').onclick=()=>{
 if(!hatching&&!DUA.gameCb&&(addTarget?full(addTarget):tanks.length>1?tanks.every(t=>full(t.id)):full())){toast(`어항에 자리가 없어요. 큰 물고기는 자리를 많이 차지해요.`);return}
 let src=pad;if(mode==='c'){src=document.createElement('canvas');src.width=420;src.height=280;render(src.getContext('2d'),420,280,P,pat)}
 const c=trimC(src,mode==='c'?bbox(src,10):null,mode==='d'?[420,280]:null);if(!c){toast('먼저 물고기를 그려 주세요');return}
 if(DUA.gameCb){const cb=DUA.gameCb;DUA.gameCb=null;const nm=$('#nm').value.trim()||rname(sexv);$('#m').hidden=true;cb({img:c,name:nm,p:mode==='c'?{...P}:null});return}
 let img;try{img=c.toDataURL('image/png')}catch(e){toast('그림을 저장하지 못했어요');return}
 const o={name:$('#nm').value.trim()||'이름 없는 물고기',sex:sexv,img,k:mode,t:hatching?hatching.t:null};
 if(mode==='c'){o.p={...P};o.v=3;o.pt=patURL()}else o.g=genesD(src);o.k=mode==='c'?'c':'d';
 if(hatching){o.x=hatching.x;o.y=hatching.y;o.tk=hatching.tk}
 else if(addTarget)o.tk=addTarget;else if(tanks.length>1){closeDraw();pickTank(o);return}
 addFish(o);if(hatching){eggs=eggs.filter(x=>x.id!==hatching.id);hatching=null;save();ui()}closeDraw()};

/* ---------- 미니 모드: 어항만 항상 위에 뜨는 작은 창으로 (크롬·엣지 Document Picture-in-Picture) ---------- */
if(!('documentPictureInPicture' in window))$('#bm').hidden=true;
$('#bm').onclick=async()=>{if(pipW){pipW.close();return}
 try{pipW=await documentPictureInPicture.requestWindow({width:380,height:260})}catch(e){toast('미니 모드를 열 수 없어요');return}
 const d=pipW.document,fl=document.querySelector('link[href*="fonts.googleapis"]');if(fl)d.head.append(fl.cloneNode());const st=d.createElement('style');st.textContent='#c{position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:pointer}';d.head.append(st);
 d.title='Doodle your Aquarium!';d.body.style.cssText='margin:0;overflow:hidden;background:'+getComputedStyle(document.body).backgroundColor;
 try{pipW.moveTo(screen.availLeft+screen.availWidth-pipW.outerWidth-12,screen.availTop+screen.availHeight-pipW.outerHeight-12)}catch(e){}
 d.body.append(cv);{const [ox,oy]=off(actTk());cam.x=641+ox;cam.y=350+oy;cam.z=1}camT=null;sel=selE=null;panel();
 $('#minimsg').hidden=false;$('#bm').classList.add('on');rafP=false;sched();
 pipW.addEventListener('resize',resize);resize();
 pipW.addEventListener('pagehide',()=>{document.body.prepend(cv);pipW=null;rafP=false;sched();$('#minimsg').hidden=true;$('#bm').classList.remove('on');mp=null;resize();window.focus()},{once:true})};
$('#minimsg').onclick=()=>{if(pipW)pipW.close()};

/* ---------- 버튼 / 설정 ---------- */
$('#bd').onclick=()=>{if(tanks.length>1?tanks.every(t=>full(t.id)):full()){toast(tanks.length>1?'지금 보고 있는 어항에 자리가 없어요. 다른 어항으로 옮겨 보거나 새 어항을 추가해 보세요.':'어항에 자리가 없어요. 어항에 마우스를 올려 옆에 새 어항을 추가해 보세요.');return}openDraw()};
$('#bf').onclick=()=>{feed=!feed;$('#bf').classList.toggle('on',feed);cv.style.cursor=feed?'crosshair':'grab';if(feed)toast('어항을 클릭하면 먹이를 줄 수 있어요')};
let lArm=null;
function roster(){const L=$('#lst');if(!fish.length){L.innerHTML='<p style="color:var(--mute)">어항에 물고기가 없어요.</p>';return}
 L.innerHTML=fish.map(f=>{const a=age(f);return `<div class="lr"><img src="${f.img.startsWith('data:image/')?f.img:''}" alt=""><div><b>${esc(f.name)}</b> <span class="sx" style="width:26px;height:26px;line-height:20px;font-size:18px">${f.sex==='M'?'♂':'♀'}</span><small>${ageS(a)} · ${Math.ceil(slot(f)-1e-6)}칸 차지</small><small>${esc(state(f))}</small></div><button class="btn" data-id="${f.id}">${lArm===f.id?'정말?':'삭제'}</button></div>`}).join('');
 L.querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>{const f=fish.find(o=>o.id===b.dataset.id);if(!f)return;
  if(lArm!==f.id){lArm=f.id;roster();return}
  keep(f);fish=fish.filter(o=>o.id!==f.id);if(sel===f.id)sel=null;lArm=null;save();ui();panel();roster();toast(`${f.name}을(를) 내보냈어요`)})}
$('#bl').onclick=()=>{lArm=null;roster();$('#lm').hidden=false};$('#lx').onclick=()=>{$('#lm').hidden=true};
$('#bs').onclick=()=>{$('#sm').hidden=false};
$('#egg').checked=eggOn;$('#egg').onchange=e=>{eggOn=e.target.checked;try{localStorage.setItem('doodle-eggs',eggOn?'1':'0')}catch(_){}toast(eggOn?'알 낳기를 켰어요':'알 낳기를 껐어요')};
try{$('#vol').value=localStorage.getItem('doodle-vol')||50}catch(e){}$('#vol').oninput=e=>{try{localStorage.setItem('doodle-vol',e.target.value)}catch(_){}};
let rsA=0;$('#rs').onclick=()=>{const b=$('#rs');if(!rsA){rsA=setTimeout(()=>{rsA=0;b.textContent='어항 리셋'},4000);b.textContent='모두 사라져요. 한 번 더!';return}
 clearTimeout(rsA);rsA=0;b.textContent='어항 리셋';fish=[];foods=[];fx=[];eggs=[];bub=[];tanks=[{id:'t0',gx:0,gy:0}];hovTk=null;fitAll();sel=selE=null;start=Date.now();save();ui();panel();$('#sm').hidden=true;toast('어항을 새로 비웠어요')};

/* ---------- 게임(game.js)과 공유 ---------- */
function genP(){const p={...P0};for(const [k,,a,b,st] of SL){if(k==='lw')continue;const v=rnd(a,b);p[k]=st>=1?Math.round(v):Math.round(v*100)/100}
 p.bt=Math.round(cl(Math.round(rnd(0,4))+rnd(-.2,.2),0,4)*20)/20;p.lw=Math.round(rnd(1.5,4)*10)/10;p.bc=rc();p.lc=Math.random()<.5?'#2b2a63':dk(p.bc);p.fc=Math.random()<.6?rc():p.bc;p.pc=rc();if(Math.random()<.35)p.pa=0;return p}
Object.assign(DUA,{fishList:()=>fish.filter(f=>f.ok).map(f=>({name:f.name,img:f.img,im:f.im,p:f.k==='c'&&f.p?f.p:null})),render,stick,up,trimC,bbox,genP,rname:sx=>rname(sx),snd:()=>sndPlay(),toast,
 openGameDraw(cb){openDraw();$('#mt').textContent='내 물고기 만들기';DUA.gameCb=cb},
 zoomIn(){const [ox,oy]=off(actTk());camT={x:641+ox,y:380+oy,z:4}},zoomOut(){const [ox,oy]=off(actTk());camT={x:641+ox,y:350+oy,z:1}}});

new ResizeObserver(resize).observe(cv);resize();ui();
if(tanks.length>1){fitAll();Object.assign(cam,camT);camT=null;clampCam()}
setInterval(()=>{breedCheck();ageTxt();ui()},1000);setInterval(save,6000);
addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
last=performance.now();sched();
})();
