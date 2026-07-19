// Client-side island script inlined into the rendered document.
// Constant infra (never skill data), injected by the Shell. Tiny, dependency-free.

/**
 * Opt-in (any page with a CodeExplorer): switches the open file and flips a file's before/after
 * pane. Scoped to the nearest [data-explorer] so multiple explorers coexist; early-returns when
 * none are present, so it is inert everywhere else. Code is already highlighted at render time —
 * this only toggles visibility.
 */
export const CODE_EXPLORER_SCRIPT = `(function(){
  if(!document.querySelector('[data-explorer]'))return;
  function setFile(root,path){
    root.querySelectorAll('[data-file]').forEach(function(pane){pane.classList.toggle('hidden',pane.getAttribute('data-file')!==path);});
    root.querySelectorAll('[data-file-open]').forEach(function(btn){
      var on=btn.getAttribute('data-file-open')===path;
      btn.classList.toggle('bg-white',on);btn.classList.toggle('font-medium',on);btn.classList.toggle('text-indigo-600',on);
      btn.classList.toggle('dark:bg-slate-800',on);btn.classList.toggle('dark:text-white',on);
      btn.classList.toggle('text-slate-600',!on);btn.classList.toggle('dark:text-slate-300',!on);
    });
  }
  function setVariant(pane,want){
    pane.querySelectorAll('[data-variant]').forEach(function(v){v.classList.toggle('hidden',v.getAttribute('data-variant')!==want);});
    pane.querySelectorAll('[data-variant-btn]').forEach(function(b){
      var on=b.getAttribute('data-variant-btn')===want;
      b.classList.toggle('bg-emerald-500',on);b.classList.toggle('text-white',on);b.classList.toggle('font-medium',on);b.classList.toggle('text-slate-500',!on);
    });
  }
  document.addEventListener('click',function(e){
    var open=e.target.closest&&e.target.closest('[data-file-open]');
    if(open){var root=open.closest('[data-explorer]');if(root)setFile(root,open.getAttribute('data-file-open'));return;}
    var vb=e.target.closest&&e.target.closest('[data-variant-btn]');
    if(vb){var pane=vb.closest('[data-file]');if(pane)setVariant(pane,vb.getAttribute('data-variant-btn'));}
  });
})();`;
