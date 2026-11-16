/* Página de vendas · Sistema de Gestão Pericial: vídeo da abertura, revelação ao rolar, barra de compra no celular */
(function(){
  var d=document, reduz=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var temIO='IntersectionObserver' in window;

  // vídeo da abertura: escolhe a versão (computador ou celular) e só aparece quando já pode tocar
  var v=d.querySelector('.lp-hero-video');
  if(v&&!reduz){
    var cel=matchMedia('(max-width: 820px)').matches;
    v.src=v.getAttribute(cel?'data-cel':'data-pc');
    v.addEventListener('playing',function(){ v.classList.add('on'); },{once:true});
    var p=v.play(); if(p&&p.catch) p.catch(function(){});
  }

  // revelação ao rolar
  var els=[].slice.call(d.querySelectorAll('[data-rev]'));
  if(!temIO||reduz){ els.forEach(function(e){ e.classList.add('on'); }); }
  else{
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -10% 0px',threshold:.12});
    els.forEach(function(e){ io.observe(e); });
  }

  // barra de compra (celular): aparece sempre que o botão da abertura está fora da tela, abaixo (celular pequeno) ou já rolado para cima (16/11/2026)
  var barra=d.querySelector('.lp-barra'), alvo=d.querySelector('.lp-hero .lp-btn');
  if(barra){
    if(temIO&&alvo){ new IntersectionObserver(function(es){ barra.classList.toggle('on',!es[0].isIntersecting); }).observe(alvo); }
    else barra.classList.add('on');
  }
})();
