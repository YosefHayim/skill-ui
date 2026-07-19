// Client-side island script inlined into the rendered document.
// Constant infra (never skill data), injected by the Shell. Tiny, dependency-free.

/**
 * Opt-in (any page with a slideshow Carousel): auto-advances discrete slides on a timer, wires the
 * prev/next arrows + dots, syncs dots to manual swipes, pauses on hover/focus, and loops infinitely.
 * Honours prefers-reduced-motion (no autoplay). Marquee carousels are pure CSS and ignored here.
 * Scoped to [data-carousel] so it is inert on every page without one.
 */
export const CAROUSEL_SCRIPT = `(function(){
  if(!document.querySelector('[data-carousel]'))return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-carousel][data-mode="slideshow"]').forEach(function(root){
    var view=root.querySelector('[data-carousel-viewport]');if(!view)return;
    var slides=root.querySelectorAll('[data-slide]');
    var dots=root.querySelectorAll('[data-carousel-dot]');
    var n=slides.length;if(n<2)return;
    var index=0,timer=null;
    var interval=parseInt(root.getAttribute('data-interval'),10)||4000;
    function paint(){dots.forEach(function(d,i){var on=i===index;d.classList.toggle('bg-indigo-500',on);d.classList.toggle('w-4',on);d.classList.toggle('bg-slate-300',!on);d.classList.toggle('dark:bg-slate-600',!on);});}
    function goto(i){index=(i%n+n)%n;view.scrollTo({left:index*view.clientWidth,behavior:'smooth'});paint();}
    function next(){goto(index+1);}
    function start(){if(reduce||timer)return;timer=setInterval(next,interval);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    var prev=root.querySelector('[data-carousel-prev]'),fwd=root.querySelector('[data-carousel-next]');
    if(fwd)fwd.addEventListener('click',function(){stop();next();start();});
    if(prev)prev.addEventListener('click',function(){stop();goto(index-1);start();});
    dots.forEach(function(d,i){d.addEventListener('click',function(){stop();goto(i);start();});});
    root.addEventListener('mouseenter',stop);root.addEventListener('mouseleave',start);
    root.addEventListener('focusin',stop);root.addEventListener('focusout',start);
    var ticking=false;
    view.addEventListener('scroll',function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;var i=Math.round(view.scrollLeft/view.clientWidth);if(i!==index){index=(i%n+n)%n;paint();}});});
    paint();start();
  });
})();`;
