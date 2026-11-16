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

  // origem da venda (16/11/2026): o anúncio chega com ?src=etiqueta (ex.: stories-iniciante-a).
  // A etiqueta vai para a Kiwify em "src" e a página onde a compra começou (comece, geral) vai em "s1".
  // Fica guardada 30 dias neste navegador, para quem vê o anúncio e volta depois. Só a etiqueta, nenhum dado pessoal.
  // Parâmetros aceitos pela Kiwify: src, sck, utm_*, s1, s2, s3.
  try{
    var ACEITOS=['src','sck','utm_source','utm_medium','utm_campaign','utm_term','utm_content','s2','s3'];
    var CHAVE='calamus_origem', agora=Date.now(), q=new URLSearchParams(location.search), novo={}, tem=false;
    ACEITOS.forEach(function(k){ var x=q.get(k); if(x){ novo[k]=x.slice(0,100); tem=true; } });
    if(tem) localStorage.setItem(CHAVE, JSON.stringify({t:agora,p:novo}));
    var g=JSON.parse(localStorage.getItem(CHAVE)||'null'), origem=(g&&agora-g.t<30*864e5)?g.p:null;
    if(origem){
      [].forEach.call(d.querySelectorAll('a[href*="pay.kiwify.com.br"]'),function(a){
        var u=new URL(a.href), pagina=u.searchParams.get('src');
        Object.keys(origem).forEach(function(k){ u.searchParams.set(k,origem[k]); });
        if(pagina&&origem.src) u.searchParams.set('s1',pagina);
        a.href=u.toString();
      });
    }
  }catch(e){}
})();
