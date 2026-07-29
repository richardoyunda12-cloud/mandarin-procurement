const state={session:null,sec:3600,running:false,tick:null,zhVoice:null,mode:'auto'};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function voices(){
  if(!('speechSynthesis'in window))return[];
  return speechSynthesis.getVoices();
}
function loadVoice(){
  const v=voices();
  state.zhVoice=v.find(x=>/^zh-CN/i.test(x.lang))||v.find(x=>/^zh-SG/i.test(x.lang))||v.find(x=>/^zh-HK/i.test(x.lang))||v.find(x=>/^zh-TW/i.test(x.lang))||v.find(x=>/^zh/i.test(x.lang))||null;
  const el=$('#audioStatus');if(el){el.textContent=state.zhVoice?`Audio device: ${state.zhVoice.name} (${state.zhVoice.lang})`:'Audio device: suara Mandarin belum terdeteksi. Lihat panduan iOS/Android.';el.className='audio-status '+(state.zhVoice?'ok':'warn')}
}
function setAudioMode(mode){state.mode=mode;$$('[data-audio-mode]').forEach(b=>b.classList.toggle('active',b.dataset.audioMode===mode));const m=$('#audioModeText');if(m)m.textContent=mode==='ios'?'Mode iOS: gunakan voice Mandarin yang diunduh di perangkat.':mode==='android'?'Mode Android: gunakan voice zh-CN perangkat/browser.':'Mode otomatis: sistem memilih voice Mandarin terbaik.'}
function speak(text,slow=false){
  if(!('speechSynthesis'in window)){alert('Browser tidak mendukung audio.');return}
  loadVoice();
  if(!state.zhVoice){alert('Suara Mandarin belum tersedia.\n\niPhone/iPad: Settings > Accessibility > Read & Speak (atau Baca & Bicara) > Voices > Chinese > Mandarin.\n\nAndroid: Settings > Text-to-speech output > Preferred engine/language > Chinese (Mandarin).');return}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang=state.zhVoice.lang;u.voice=state.zhVoice;u.rate=slow?.43:.74;u.pitch=1;
  speechSynthesis.speak(u);
}
function renderTimer(){const e=$('#timer');if(!e)return;const m=Math.floor(state.sec/60),s=state.sec%60;e.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function setTimer(){state.running=!state.running;const b=$('#timerStart');if(!b)return;b.textContent=state.running?'Jeda Timer':'Mulai Timer';if(state.running){state.tick=setInterval(()=>{if(state.sec>0){state.sec--;renderTimer()}else{clearInterval(state.tick);state.running=false;b.textContent='Selesai';alert('Sesi selesai. Lakukan exit check sebelum lanjut.')}},1000)}else clearInterval(state.tick)}
async function loadSession(slug){
  try{const r=await fetch(`sessions/${slug}.html`);if(!r.ok)throw Error();const html=await r.text();$('#lesson').innerHTML=html;state.session=slug;state.sec=3600;state.running=false;clearInterval(state.tick);renderTimer();localStorage.setItem('mp_active_session',slug);$$('.nav button[data-session]').forEach(b=>b.classList.toggle('active',b.dataset.session===slug));bindLesson();window.scrollTo({top:0,behavior:'smooth'});}catch(e){$('#lesson').innerHTML='<div class="card"><h2>Materi belum termuat</h2><p>Pastikan aplikasi dibuka melalui GitHub Pages, bukan Quick Look atau file lokal.</p></div>';}}
function key(){return 'mp_'+state.session}
function save(){if(!state.session)return;localStorage.setItem(key(),JSON.stringify({prod1:$('#prod1')?.value||'',prod2:$('#prod2')?.value||'',prod3:$('#prod3')?.value||'',role:$('#roleAnswer')?.value||''}))}
function bindLesson(){
 const saved=JSON.parse(localStorage.getItem(key())||'{}');['prod1','prod2','prod3','roleAnswer'].forEach(id=>{const e=$('#'+id);if(e){e.value=saved[id==='roleAnswer'?'role':id]||'';e.addEventListener('input',save)}});
 $$('#lesson .speak').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.text,false)));
 $$('#lesson .slow').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.text,true)));
 $('#timerStart')?.addEventListener('click',setTimer);$('#timerReset')?.addEventListener('click',()=>{clearInterval(state.tick);state.running=false;state.sec=3600;renderTimer();const b=$('#timerStart');if(b)b.textContent='Mulai Timer'});
 $('#checkProduction')?.addEventListener('click',()=>{const a=($('#prod1')?.value||'').trim(),b=($('#prod2')?.value||'').replace(/\s/g,''),c=$('#prod3')?.value||'';let n=0;if(state.session==='session-1'){if(a==='叫'||a==='jiào')n++;if(b.includes('我是采购员'))n++;if(c.includes('我叫')&&c.includes('采购员'))n++;}if(state.session==='session-2'){if(a==='是'||a==='shì')n++;if(b.includes('公司')&&b.includes('工作'))n++;if(c.includes('我叫')&&c.includes('采购'))n++;}if(state.session==='session-3'){if(a==='是'||a==='shì')n++;if(b.includes('我们需要')&&b.includes('个'))n++;if(c.includes('我们需要')&&c.includes('个'))n++;}const f=$('#productionFeedback');if(f)f.textContent=`Skor ${n}/3. ${n===3?'Bagus!':'Cek lagi pola target pada contoh di atas.'}`;save();});
 $('#checkRole')?.addEventListener('click',()=>{const t=$('#roleAnswer')?.value||'',f=$('#roleFeedback');const ok=state.session==='session-1'?t.includes('您好')&&t.includes('我叫'):state.session==='session-2'?(t.includes('公司')||t.includes('采购')):t.includes('需要')&&t.includes('个');if(f)f.textContent=ok?'✓ Bagus. Pesan sudah memakai pola target.':'Belum lengkap. Gunakan pola target yang tertulis di placeholder.';save();});
 $('#saveRole')?.addEventListener('click',()=>{save();const f=$('#roleFeedback');if(f)f.textContent='Tersimpan di browser perangkat ini.'});
 $$('#lesson .quick').forEach(b=>b.addEventListener('click',()=>{const f=$('#quickFeedback'),ok=b.dataset.ok==='true';if(f){f.textContent=ok?'✓ Tepat.':'Belum tepat. Dengarkan lagi dan pilih respons paling sesuai.';f.style.color=ok?'var(--brand)':'var(--warn)'}}));
}
document.addEventListener('DOMContentLoaded',()=>{if('speechSynthesis'in window){loadVoice();speechSynthesis.onvoiceschanged=loadVoice}$$('.nav button[data-session]').forEach(b=>b.addEventListener('click',()=>loadSession(b.dataset.session)));$$('[data-audio-mode]').forEach(b=>b.addEventListener('click',()=>setAudioMode(b.dataset.audioMode)));$('#openActive')?.addEventListener('click',()=>loadSession(localStorage.getItem('mp_active_session')||'session-1'));setAudioMode('auto');loadSession(localStorage.getItem('mp_active_session')||'session-1');if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});});
