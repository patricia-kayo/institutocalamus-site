/* Instituto Calamus · comportamento das páginas (versão D, 03/11/2026) */
(function () {
  // Produtos na home: trilha com setas, barra de posição e slide automático a cada 4 s.
  // Para ao passar o mouse, ao tocar ou com o botão "Pausar"; não anda para quem pediu menos movimento.
  var col = document.querySelector('.colecao');
  if (col && col.children.length > 1) {
    var cards = [].slice.call(col.children), barra = document.querySelector('.trilha-barra span'),
        pausa = document.querySelector('.pausa'), calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        timer = null, sobre = false, parado = calmo;
    var passo = function () { return cards[1].offsetLeft - cards[0].offsetLeft; };
    var noFim = function () { return col.scrollLeft + col.clientWidth >= col.scrollWidth - 4; };
    var atualiza = function () {
      if (!barra) return;
      barra.style.width = (col.clientWidth / col.scrollWidth * 100) + '%';
      barra.style.left = (col.scrollLeft / col.scrollWidth * 100) + '%';
    };
    var anda = function (d) {
      if (d > 0 && noFim()) col.scrollTo({ left: 0 });
      else if (d < 0 && col.scrollLeft < 4) col.scrollTo({ left: col.scrollWidth });
      else col.scrollBy({ left: d * passo() });
    };
    var inicia = function () {
      clearInterval(timer);
      timer = parado ? null : setInterval(function () { if (!sobre && !document.hidden) anda(1); }, 4000);
    };
    [].forEach.call(document.querySelectorAll('.seta'), function (b) {
      b.addEventListener('click', function () { anda(+b.dataset.dir); inicia(); });
    });
    if (pausa) {
      if (calmo) pausa.hidden = true;
      pausa.addEventListener('click', function () {
        parado = !parado;
        pausa.setAttribute('aria-pressed', parado ? 'true' : 'false');
        pausa.textContent = parado ? 'Continuar' : 'Pausar';
        inicia();
      });
    }
    var area = col.parentNode;
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (e) { area.addEventListener(e, function () { sobre = true; }, { passive: true }); });
    ['mouseleave', 'focusout', 'touchend'].forEach(function (e) { area.addEventListener(e, function () { sobre = false; }, { passive: true }); });
    col.addEventListener('scroll', atualiza, { passive: true });
    window.addEventListener('resize', atualiza);
    atualiza(); inicia();
  }

  // Menu do celular: fecha ao escolher um link
  [].forEach.call(document.querySelectorAll('.topo-movel nav a'), function (a) {
    a.addEventListener('click', function () { a.closest('details').open = false; });
  });
})();
