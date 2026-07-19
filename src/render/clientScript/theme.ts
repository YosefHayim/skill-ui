// Client-side island script inlined into the rendered document.
// Constant infra (never skill data), injected by the Shell. Tiny, dependency-free.

/** Always-on: the header ◐ button toggles light/dark by flipping `.dark` on <html>. */
export const THEME_TOGGLE = `document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-action="theme"]');if(b)document.documentElement.classList.toggle('dark');});`;
