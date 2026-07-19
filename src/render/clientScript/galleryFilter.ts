// Client-side island script inlined into the rendered document.
// Constant infra (never skill data), injected by the Shell. Tiny, dependency-free.

/**
 * Opt-in (the Library gallery only): filters component cards as you type in the search box, and
 * hides a category section once all its cards are filtered out. No deps; early-returns when there
 * is no filter box, so it is inert on every other page.
 */
export const GALLERY_FILTER = `(function(){
  var box=document.getElementById('pp-filter');if(!box)return;
  function apply(){
    var q=box.value.trim().toLowerCase();
    document.querySelectorAll('[data-sec]').forEach(function(sec){
      var any=false;
      sec.querySelectorAll('[data-card]').forEach(function(c){
        var hit=!q||c.getAttribute('data-card').indexOf(q)>=0;
        c.classList.toggle('hidden',!hit);if(hit)any=true;
      });
      sec.classList.toggle('hidden',!any);
    });
  }
  box.addEventListener('input',apply);
})();`;
