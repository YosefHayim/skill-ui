// Client-side island script inlined into the rendered document.
// Constant infra (never skill data), injected by the Shell. Tiny, dependency-free.

/**
 * Opt-in (Quiz template + any QuizCard): grades a graded multiple-choice card on click — reveals
 * ✓ on the correct option, ✗ on a wrong pick, unhides the explanation, locks the card, and tracks a
 * running score/progress. Posts the score back (same POST /decision + clipboard fallback). Scoped to
 * [data-quiz-card] so it is inert on every page without one. Grades a lone card too (no score/bar).
 */
export const QUIZ_SCRIPT = `(function(){
  if(!document.querySelector('[data-quiz-card]'))return;
  var cards=document.querySelectorAll('[data-quiz-card]');
  var total=cards.length;
  var results=new Map();
  var progressFill=document.querySelector('[data-progress-fill]');
  var scoreEl=document.querySelector('[data-quiz-score]');

  function answeredCount(){return document.querySelectorAll('[data-quiz-card].answered').length;}
  function correctCount(){var n=0;results.forEach(function(r){if(r.correct)n++;});return n;}
  function update(){
    if(progressFill)progressFill.style.width=(answeredCount()/total*100)+'%';
    if(scoreEl)scoreEl.textContent=String(correctCount());
    if(answeredCount()===total){var bar=document.getElementById('pp-bar');if(bar)bar.classList.remove('hidden');}
  }

  function grade(card,picked){
    if(card.classList.contains('answered'))return;
    var isCorrect=picked.getAttribute('data-correct')==='true';
    card.querySelectorAll('[data-quiz-option]').forEach(function(o){
      var right=o.getAttribute('data-correct')==='true';
      o.setAttribute('aria-checked',o===picked?'true':'false');
      if(right){o.classList.add('quiz-correct');var m=o.querySelector('.mark-correct');if(m)m.classList.remove('hidden');}
      else if(o===picked){o.classList.add('quiz-wrong');var w=o.querySelector('.mark-wrong');if(w)w.classList.remove('hidden');}
      else{o.classList.add('opacity-50');}
    });
    var expl=card.querySelector('[data-explanation]');
    if(expl){expl.classList.remove('hidden');expl.classList.add('flex');}
    card.classList.add('answered');
    results.set(card.getAttribute('data-id'),{picked:picked.getAttribute('data-id'),correct:isCorrect});
    update();
  }

  document.addEventListener('click',function(e){
    var opt=e.target.closest&&e.target.closest('[data-quiz-option]');
    if(!opt)return;
    var card=opt.closest('[data-quiz-card]');if(card)grade(card,opt);
  });

  document.addEventListener('keydown',function(e){
    var opt=document.activeElement&&document.activeElement.closest&&document.activeElement.closest('[data-quiz-option]');
    if(!opt)return;
    var card=opt.closest('[data-quiz-card]');if(!card)return;
    var opts=Array.from(card.querySelectorAll('[data-quiz-option]'));
    var idx=opts.indexOf(opt);
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();opts[(idx+1)%opts.length].focus();}
    else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();opts[(idx-1+opts.length)%opts.length].focus();}
    else if(e.key==='Enter'||e.key===' '){e.preventDefault();grade(card,opt);}
  });

  function collect(){
    var answers=[];
    cards.forEach(function(c){
      var id=c.getAttribute('data-id');var r=results.get(id);
      answers.push({questionId:id,picked:r?r.picked:null,correct:r?r.correct:false,answered:!!r});
    });
    var notes=document.getElementById('pp-notes');
    return {answers:answers,score:correctCount(),total:total,completed:answeredCount()===total,notes:notes?notes.value:''};
  }
  function done(msg){var b=document.getElementById('pp-bar');if(b)b.innerHTML='<div class="mx-auto max-w-5xl font-semibold text-emerald-500 py-1">'+msg+'</div>';}
  async function submit(approved){
    var payload=collect();payload.approved=approved;
    try{var r=await fetch('/decision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw 0;done('Sent — close this tab and return to your terminal.');}
    catch(_){var token=btoa(unescape(encodeURIComponent(JSON.stringify(payload))));try{await navigator.clipboard.writeText(token);done('No server — copied, paste it back in your terminal.');}catch(__){var p=document.getElementById('pp-token');if(p){p.textContent=token;p.classList.remove('hidden');}}}
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-action]');if(!b)return;
    var a=b.getAttribute('data-action');
    if(a==='approve')submit(true);
    else if(a==='adjust')submit(false);
    else if(a==='copy'){var token=btoa(unescape(encodeURIComponent(JSON.stringify(collect()))));navigator.clipboard.writeText(token).then(function(){done('Copied!');}).catch(function(){});}
  });
})();`;
