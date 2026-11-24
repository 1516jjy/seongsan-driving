// Fill a source only when the actual clip is available. Empty values keep honest placeholders.
const videoSources={full:'',roundabout:'',merge:'',signal:'',unsignalized:'',clear:'',fog:''};
const scenes={
 roundabout:{index:1,title:'회전 차량 사이로 진입하기',copy:'회전 중인 차량과의 간격을 고려해 진입 시점과 속도를 결정합니다.',image:'assets/roundabout.webp',alt:'회전교차로의 일반 차량과 AV',task:'진입 · 양보 · 속도 조절'},
 merge:{index:2,title:'본선 차량과 간격 맞추기',copy:'본선 교통과의 간격을 살피고, 합류 시점과 가감속을 결정합니다.',image:'assets/merge.webp',alt:'본선과 진입로 차량이 만나는 SUMO 합류 구간',task:'합류 · 간격 확보 · 가감속'},
 signal:{index:3,title:'신호에 맞춰 멈추고 출발하기',copy:'신호 상태와 앞차 움직임을 고려해 정지·출발하고 교차로를 통과합니다.',image:'assets/signal-intersection.webp',alt:'신호 교차로에서 대기하고 통과하는 차량',task:'정지 · 출발 · 앞차 추종'},
 unsignalized:{index:4,title:'다른 진입로의 차량 살피기',copy:'교차하는 차량의 접근과 통행 우선순위를 고려해 진입을 판단합니다.',image:'assets/unsignalized.webp',alt:'여러 방향의 차량이 접근하는 무신호 교차로',task:'접근 차량 파악 · 양보 · 통과'}
};
function mountVideo(slot,key){
 const src=videoSources[key];if(!src)return;
 const video=document.createElement('video');video.src=src;video.controls=true;video.playsInline=true;video.preload='metadata';
 const poster=slot.querySelector('img');if(poster)video.poster=poster.src;
 slot.replaceChildren(video);slot.dataset.loaded='true';
}
document.querySelectorAll('[data-video-slot]').forEach(slot=>mountVideo(slot,slot.dataset.videoSlot));
document.querySelectorAll('[data-scene]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.scene;const scene=scenes[key];
 document.querySelectorAll('[data-scene]').forEach(b=>{const selected=b.dataset.scene===key;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 document.getElementById('scene-number').textContent=`SCENE ${String(scene.index).padStart(2,'0')} / 04`;
 document.getElementById('scene-title').textContent=scene.title;
 document.getElementById('scene-copy').textContent=scene.copy;
 const slot=document.querySelector('.scene-film');
 slot.replaceChildren();
 const image=document.createElement('img');image.id='scene-image';image.src=scene.image;image.alt=scene.alt;
 const label=document.createElement('div');label.className='scene-film-label';
 const main=document.createElement('span');main.textContent='SUMO 구현 화면';const sub=document.createElement('small');sub.textContent='구간 영상 준비 중';label.append(main,sub);slot.append(image,label);
 slot.dataset.videoSlot=key;delete slot.dataset.loaded;mountVideo(slot,key);
 const task=document.getElementById('scene-task');task.replaceChildren();const prefix=document.createElement('span');prefix.textContent='DECISION';task.append(prefix,document.createTextNode(scene.task));
}));
document.querySelectorAll('[data-map-view]').forEach(button=>button.addEventListener('click',()=>{
 const sumo=button.dataset.mapView==='sumo';
 document.getElementById('explore-map').style.objectFit=sumo?'fill':'contain';
 document.getElementById('explore-map').src=sumo?'assets/sumo-network.webp':'assets/selected-route.webp';
 document.getElementById('explore-map').alt=sumo?'성산 SUMO 지도: 번호를 선택하면 구간 설명이 표시됩니다':'실제 위성 지도에 표시한 핵심 선정 구간';
 document.getElementById('map-pins').hidden=!sumo;
 document.querySelectorAll('[data-map-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
}));
const header=document.getElementById('site-header');
function updateHeader(){header.classList.toggle('scrolled',window.scrollY>50)}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const notice=document.getElementById('notice-dialog');
document.querySelectorAll('[data-pending]').forEach(button=>button.addEventListener('click',()=>notice.showModal()));
notice.querySelector('.close').addEventListener('click',()=>notice.close());notice.querySelector('.notice-ok').addEventListener('click',()=>notice.close());
notice.addEventListener('click',e=>{if(e.target!==notice)return;const r=notice.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notice.close()});
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
 const code=document.getElementById(button.dataset.copy);
 try{await navigator.clipboard.writeText(code.textContent.trim());button.textContent='복사 완료';setTimeout(()=>button.textContent='복사',2000)}
 catch{const r=document.createRange();r.selectNodeContents(code);const s=window.getSelection();s.removeAllRanges();s.addRange(r);button.textContent='선택됨 · 직접 복사'}
}));

const rainImage=document.getElementById('rain-animation');
const rainToggle=document.getElementById('rain-toggle');
function setRainPaused(paused){rainImage.src=paused?rainImage.dataset.still:rainImage.dataset.animation;rainToggle.setAttribute('aria-pressed',String(paused));rainToggle.textContent=paused?'재생':'일시정지';rainToggle.setAttribute('aria-label',paused?'빗길 GIF 재생':'빗길 GIF 일시정지');}
rainToggle.addEventListener('click',()=>setRainPaused(rainToggle.getAttribute('aria-pressed')!=='true'));
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)setRainPaused(true);
