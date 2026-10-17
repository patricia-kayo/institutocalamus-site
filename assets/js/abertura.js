/* Abertura animada da página inicial: documento sob UV -> assinatura -> lupa -> microscópio (17/10/2026) */
(function(){
  if(!document.getElementById('mundo')) return;
  var mundo=document.getElementById('mundo'), palco=document.getElementById('palco'), mic=document.getElementById('mic'), cv=document.getElementById('cv'),
      faixa=document.getElementById('faixaRect'), feixe=document.getElementById('feixe'), selo=document.getElementById('seloUV'),
      notas=document.getElementById('notas'), lupa=document.getElementById('lupa'), lc=document.getElementById('lc'), zoom=document.getElementById('zoom'),
      pts=[].slice.call(document.querySelectorAll('.hh-pontos li'));
  var CAM0=[-70,-50,480,560], cam=CAM0.slice();
  function rot(x,y){ var a=-3*Math.PI/180, cx=170, cy=230, dx=x-cx, dy=y-cy; return [cx+dx*Math.cos(a)-dy*Math.sin(a), cy+dx*Math.sin(a)+dy*Math.cos(a)]; }
  function setCam(v){ cam=v; mundo.setAttribute('viewBox', v.map(function(n){return n.toFixed(2);}).join(' ')); }
  function ease(t){ return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function voa(alvo, ms, fim){ var ini=cam.slice(), t0=performance.now();
    (function f(ts){ var u=Math.min(1,(ts-t0)/ms), e=ease(u); setCam(ini.map(function(a,i){ return a+(alvo[i]-a)*e; })); if(u<1) requestAnimationFrame(f); else if(fim) fim(); })(t0); }
  function caixa(cx,cy,w){ var p=rot(cx,cy), r=palco.clientHeight/palco.clientWidth, h=w*r; return [p[0]-w/2,p[1]-h/2,w,h]; }
  function ponto(k){ pts.forEach(function(p,j){ p.classList.toggle('on',j===k); }); }

  // feixe UV
  var uvOn=false, uvT0=0;
  function uvFrame(ts){ if(uvOn){ var t=(ts-uvT0)/1000, u=Math.min(1,t/3.2), x=-110+(460)*(u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2);
      faixa.setAttribute('x',x); feixe.setAttribute('x',x); selo.setAttribute('x',x+8); } requestAnimationFrame(uvFrame); }
  requestAnimationFrame(uvFrame);

  // lupa percorrendo a assinatura
  var lupaOn=false, lT0=0, lupaP=[60,392];
  function lupaFrame(ts){ if(lupaOn){ var t=Math.min(1,(ts-lT0)/2000), u=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      var x=62+(198-62)*u, y=392-10*Math.sin(u*Math.PI*3)-u*6; lupaP=[x,y];
      lupa.setAttribute('transform','translate('+x+','+y+')'); lc.setAttribute('cx',x); lc.setAttribute('cy',y);
      zoom.setAttribute('transform','translate('+x+','+y+') scale(2.4) translate('+(-x)+','+(-y)+')'); }
    requestAnimationFrame(lupaFrame); }
  requestAnimationFrame(lupaFrame);

  // microscópio (canvas)
  var x=cv.getContext('2d'), W=880, Hh=880, seed=11; function rnd(){ seed=(seed*16807)%2147483647; return seed/2147483647; }
  var fib=[]; for(var i=0;i<260;i++) fib.push({x:rnd()*W*1.4-W*.2,y:rnd()*Hh,a:rnd()*Math.PI,l:40+rnd()*160,c:rnd()*0.6+0.2,w:.6+rnd()*1.6,k:(rnd()-.5)*.02});
  var gr=[]; for(var j=0;j<900;j++) gr.push({t:rnd(),o:(rnd()-.5)*2,r:.8+rnd()*2.4});
  (function draw(ts){ var dx=(ts/1000)*8; x.fillStyle='#EDE3D2'; x.fillRect(0,0,W,Hh);
    for(var i=0;i<fib.length;i++){ var f=fib[i], fx=((f.x+dx)%(W*1.4))-W*.2; x.strokeStyle='rgba(150,128,105,'+f.c*.55+')'; x.lineWidth=f.w; x.beginPath(); x.moveTo(fx,f.y);
      x.quadraticCurveTo(fx+Math.cos(f.a)*f.l*.5+20,f.y+Math.sin(f.a)*f.l*.5-14,fx+Math.cos(f.a+f.k*40)*f.l,f.y+Math.sin(f.a+f.k*40)*f.l); x.stroke(); }
    x.save(); x.translate(440,440); x.rotate(-1.15); x.translate(-440,-440); x.translate(dx*.5%60-30,0);
    var g=x.createLinearGradient(0,330,0,560); g.addColorStop(0,'rgba(42,31,61,0)'); g.addColorStop(.18,'rgba(42,31,61,.92)'); g.addColorStop(.5,'rgba(30,22,46,.97)'); g.addColorStop(.82,'rgba(42,31,61,.9)'); g.addColorStop(1,'rgba(42,31,61,0)');
    x.fillStyle=g; x.beginPath(); x.moveTo(-200,380); x.bezierCurveTo(250,330,520,520,1100,440); x.lineTo(1100,560); x.bezierCurveTo(520,640,250,450,-200,500); x.closePath(); x.fill();
    for(var k=0;k<gr.length;k++){ var q=gr[k], px=-200+q.t*1300, py=440-Math.sin(q.t*3.1)*30+q.o*70; x.fillStyle='rgba(22,14,34,'+(0.25+0.5*(1-Math.abs(q.o)))+')'; x.beginPath(); x.arc(px,py,q.r,0,6.3); x.fill(); }
    x.restore(); requestAnimationFrame(draw); })(0);

  function ciclo(){
    // 1 · documento sob luz UV
    mic.classList.remove('anima'); mic.style.opacity=0; mic.style.width=mic.style.height='0px';
    mundo.style.transition='none'; mundo.style.opacity=1; setCam(CAM0); void mundo.offsetWidth; mundo.style.transition='';
    notas.setAttribute('opacity',0); lupa.setAttribute('opacity',0); lupaOn=false; lc.setAttribute('cx',-300);
    ponto(0); uvOn=true; uvT0=performance.now(); feixe.style.opacity=1; selo.style.opacity=1;
    // 2 · zoom na assinatura + lupa
    setTimeout(function(){ feixe.style.transition=selo.style.transition='opacity .8s'; feixe.style.opacity=0; selo.style.opacity=0;
      ponto(1); voa(caixa(172,376,250), 1400, function(){ notas.setAttribute('opacity',1);
        setTimeout(function(){ lupa.setAttribute('opacity',1); lupaOn=true; lT0=performance.now(); }, 200); }); }, 3600);
    // 3 · mergulho na lupa -> microscópio
    setTimeout(function(){ ponto(2); notas.setAttribute('opacity',0);
      var r=document.getElementById('aroLupa').getBoundingClientRect(), pr=palco.getBoundingClientRect();
      mic.classList.remove('anima'); mic.style.left=(r.left-pr.left)+'px'; mic.style.top=(r.top-pr.top)+'px'; mic.style.width=r.width+'px'; mic.style.height=r.height+'px'; mic.style.opacity=0;
      void mic.offsetWidth; mic.classList.add('anima');
      var D=Math.min(440, pr.height-80); mic.style.left=(pr.width-D)/2+'px'; mic.style.top=(pr.height-D)/2+'px'; mic.style.width=mic.style.height=D+'px'; mic.style.opacity=1;
      cv.classList.remove('foco'); void cv.offsetWidth; cv.classList.add('foco');
      voa(caixa(lupaP[0],lupaP[1],8), 1100); mundo.style.opacity=0; }, 7600);
    // volta ao início
    setTimeout(function(){ mic.style.opacity=0; lupaOn=false; lupa.setAttribute('opacity',0); lc.setAttribute('cx',-300); mundo.style.transition='none'; setCam(CAM0); void mundo.offsetWidth; mundo.style.transition='opacity 1.2s'; mundo.style.opacity=1; }, 10800);
  }
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches){ ponto(0); return; }
  ciclo(); setInterval(ciclo, 12200);
})();
