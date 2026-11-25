// Fill a source only when the actual clip is available. Empty values keep honest placeholders.
const videoSources={full:'',roundabout:'',merge:'',signal:'',unsignalized:'',tjunction:'',clear:'',fog:''};
function mountVideo(slot,key){
 const src=videoSources[key];if(!src)return;
 const video=document.createElement('video');video.src=src;video.controls=true;video.playsInline=true;video.preload='metadata';
 const poster=slot.querySelector('img');if(poster)video.poster=poster.src;
 slot.replaceChildren(video);slot.dataset.loaded='true';
}
document.querySelectorAll('[data-video-slot]').forEach(slot=>mountVideo(slot,slot.dataset.videoSlot));
const header=document.getElementById('site-header');
function updateHeader(){header.classList.toggle('scrolled',window.scrollY>50)}
window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const notice=document.getElementById('notice-dialog');
document.querySelectorAll('[data-pending]').forEach(button=>button.addEventListener('click',()=>notice.showModal()));
notice.querySelector('.close').addEventListener('click',()=>notice.close());notice.querySelector('.notice-ok').addEventListener('click',()=>notice.close());
notice.addEventListener('click',e=>{if(e.target!==notice)return;const r=notice.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notice.close()});
document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
 const code=document.getElementById(button.dataset.copy);
 try{await navigator.clipboard.writeText(code.textContent.trim());button.textContent='Copied';setTimeout(()=>button.textContent='Copy',2000)}
 catch{const r=document.createRange();r.selectNodeContents(code);const s=window.getSelection();s.removeAllRanges();s.addRange(r);button.textContent='Selected · Copy manually'}
}));

const rainImage=document.getElementById('rain-animation');
if(rainImage && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 rainImage.src=rainImage.dataset.still;
}

document.querySelectorAll('a[href="#visibility-source"],a[href="#tourism-sources"]').forEach(link=>link.addEventListener('click',()=>{
 const sources=document.getElementById('background-sources');if(sources)sources.open=true;
}));
