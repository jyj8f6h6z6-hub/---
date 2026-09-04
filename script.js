
const BANK = window.QUESTION_BANK || [];
const $ = s => document.querySelector(s);
const els = {
  home: $('#homeView'), quiz: $('#quizView'), total: $('#totalQuestions'), answered: $('#answeredCount'), accuracy: $('#accuracy'),
  category: $('#categorySelect'), type: $('#typeSelect'), order: $('#orderSelect'), selectionCount: $('#selectionCount'),
  start: $('#startBtn'), wrong: $('#wrongBtn'), fav: $('#favoriteBtn'), wrongCount: $('#wrongCount'), favoriteCount: $('#favoriteCount'),
  reset: $('#resetStatsBtn'), fill: $('#progressFill'), progressText: $('#progressText'), theme: $('#themeBtn'),
  back: $('#backBtn'), qCategory: $('#quizCategory'), qProgress: $('#quizProgress'), qFill: $('#quizProgressFill'), star: $('#starBtn'),
  qType: $('#questionType'), qNum: $('#questionNumber'), qText: $('#questionText'), options: $('#options'), result: $('#resultBox'), legal: $('#legalBasisBox'),
  prev: $('#prevBtn'), next: $('#nextBtn')
};
const KEY='procurementQuizV1';
let state = JSON.parse(localStorage.getItem(KEY) || '{}');
state.answers ||= {}; state.favorites ||= {}; state.dark ||= false;
let chosenCount = 20, session=[], current=0, mode='normal';

function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function categories(){return [...new Set(BANK.map(q=>q.category))];}
function init(){
  document.documentElement.classList.toggle('dark', !!state.dark);
  els.total.textContent = BANK.length.toLocaleString();
  els.category.innerHTML = `<option value="all">全部分類</option>` + categories().map(c=>`<option value="${escapeAttr(c)}">${c}</option>`).join('');
  updateHome(); updateSelection();
}
function escapeAttr(s){return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');}
function filtered(){
  return BANK.filter(q => (els.category.value==='all'||q.category===els.category.value) && (els.type.value==='all'||q.type===els.type.value));
}
function updateSelection(){els.selectionCount.textContent=`${filtered().length.toLocaleString()} 題`;}
function updateHome(){
  const vals=Object.values(state.answers); const answered=vals.length; const correct=vals.filter(x=>x.correct).length;
  els.answered.textContent=answered.toLocaleString(); els.accuracy.textContent=answered?`${Math.round(correct/answered*100)}%`:'—';
  const wrongIds=new Set(vals.filter(x=>!x.correct).map(x=>x.id));
  els.wrongCount.textContent=wrongIds.size; els.favoriteCount.textContent=Object.keys(state.favorites).filter(k=>state.favorites[k]).length;
  const pct=BANK.length?Math.min(100,answered/BANK.length*100):0; els.fill.style.width=`${pct}%`;
  els.progressText.textContent=answered?`已作答 ${answered.toLocaleString()} 題，其中答對 ${correct.toLocaleString()} 題。`:'尚未開始作答';
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startSession(source, name='normal'){
  let arr=[...source]; if(els.order.value==='random' || name!=='normal') shuffle(arr);
  if(name==='normal' && chosenCount!=='all') arr=arr.slice(0,Number(chosenCount));
  if(!arr.length){alert('目前沒有符合條件的題目。'); return;}
  session=arr; current=0; mode=name; els.home.classList.remove('active'); els.quiz.classList.add('active'); renderQuestion(); window.scrollTo({top:0});
}
function renderQuestion(){
  const q=session[current]; if(!q)return;
  const rec=state.answers[q.id];
  els.qCategory.textContent=q.category; els.qProgress.textContent=`${current+1} / ${session.length}`; els.qFill.style.width=`${(current+1)/session.length*100}%`;
  els.qType.textContent=q.type==='choice'?'選擇題':'是非題'; els.qNum.textContent=`原題號 ${q.number}`; els.qText.textContent=q.question;
  els.star.textContent=state.favorites[q.id]?'★':'☆'; els.star.classList.toggle('active',!!state.favorites[q.id]);
  els.result.className='result-box hidden'; els.result.textContent=''; els.legal.className='legal-box hidden'; els.legal.textContent='';
  els.options.innerHTML='';
  if(q.type==='choice'){
    const letters=['A','B','C','D'];
    q.options.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='option-btn'; b.innerHTML=`<span class="option-key">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
      b.addEventListener('click',()=>answer(q,i+1)); els.options.appendChild(b);
    });
  }else{
    [[true,'O','正確'],[false,'X','錯誤']].forEach(([v,key,label])=>{
      const b=document.createElement('button'); b.className='option-btn tf-btn'; b.innerHTML=`<span class="option-key">${key}</span><span>${label}</span>`; b.addEventListener('click',()=>answer(q,v)); els.options.appendChild(b);
    });
  }
  if(rec) reveal(q,rec.value,false);
  els.prev.disabled=current===0; els.next.textContent=current===session.length-1?'完成':'下一題';
}
function escapeHtml(s){return String(s).replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));}
function answer(q,value){if(state.answers[q.id])return; const correct=value===q.answer; state.answers[q.id]={id:q.id,value,correct,at:Date.now()}; save(); reveal(q,value,true); updateHome();}
function reveal(q,value,animate){
  const correct=value===q.answer; const btns=[...els.options.children];
  btns.forEach((b,i)=>{b.disabled=true; const v=q.type==='choice'?i+1:(i===0); if(v===value)b.classList.add('selected',correct?'correct':'wrong'); if(v===q.answer)b.classList.add('reveal-correct');});
  els.result.className=`result-box ${correct?'good':'bad'}`;
  const ansText=q.type==='choice'?['A','B','C','D'][Number(q.answer)-1]:(q.answer?'O（正確）':'X（錯誤）');
  els.result.innerHTML=`<strong>${correct?'✓ 答對了':'✕ 答錯了'}</strong><br>正確答案：${ansText}`;
  if(q.legalBasis){els.legal.className='legal-box'; els.legal.textContent=`依據法源：${q.legalBasis}`;}
}
function goHome(){els.quiz.classList.remove('active'); els.home.classList.add('active'); updateHome(); window.scrollTo({top:0});}

document.querySelectorAll('#countButtons button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#countButtons button').forEach(x=>x.classList.remove('active'));b.classList.add('active');chosenCount=b.dataset.count==='all'?'all':Number(b.dataset.count);}));
els.category.addEventListener('change',updateSelection); els.type.addEventListener('change',updateSelection);
els.start.addEventListener('click',()=>startSession(filtered(),'normal'));
els.wrong.addEventListener('click',()=>{const ids=new Set(Object.values(state.answers).filter(x=>!x.correct).map(x=>x.id));startSession(BANK.filter(q=>ids.has(q.id)),'wrong');});
els.fav.addEventListener('click',()=>startSession(BANK.filter(q=>state.favorites[q.id]),'favorite'));
els.back.addEventListener('click',goHome);
els.prev.addEventListener('click',()=>{if(current>0){current--;renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}});
els.next.addEventListener('click',()=>{if(current<session.length-1){current++;renderQuestion();window.scrollTo({top:0,behavior:'smooth'});}else goHome();});
els.star.addEventListener('click',()=>{const q=session[current];state.favorites[q.id]=!state.favorites[q.id];if(!state.favorites[q.id])delete state.favorites[q.id];save();renderQuestion();updateHome();});
els.reset.addEventListener('click',()=>{if(confirm('要清除所有答題紀錄、錯題與收藏嗎？')){state.answers={};state.favorites={};save();updateHome();}});
els.theme.addEventListener('click',()=>{state.dark=!state.dark;document.documentElement.classList.toggle('dark',state.dark);save();});
init();
