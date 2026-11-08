(function(){
  var h=document.documentElement,key="np-lang",titles=window.NP_T||{
    de:"Nino Purtseladze, Design, Web und Sicherheit",
    en:"Nino Purtseladze, Design, Web and Security",ka:"ნინო ფურცელაძე, დიზაინი, ვები და უსაფრთხოება"};
  function set(l){
    h.lang=l;document.title=titles[l];
    document.querySelectorAll(".lang button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.set===l)});
    try{localStorage.setItem(key,l)}catch(e){}
  }
  var saved="de";try{saved=localStorage.getItem(key)||"de"}catch(e){}
  if(saved!=="de")set(saved);
  document.querySelectorAll(".lang button").forEach(function(b){b.addEventListener("click",function(){set(b.dataset.set)})});
  var addr=["purtseladze.nino","gmail.com"].join("@");
  document.querySelectorAll(".mail").forEach(function(a){a.href="mailto:"+addr});
  document.querySelectorAll(".addr").forEach(function(o){o.textContent=addr});
  var hero=document.querySelector(".hero"),nav=document.querySelector(".bar nav");
  var ANT='<svg class="wa" viewBox="0 0 193.5 188.5" aria-hidden="true"><path d="M78.5 148.1L76.2 148.1L73.5 147.4L71.5 146.4L67.5 143.1L62.6 138.5L56.9 132.2L56.1 131.0L55.1 127.5L55.1 125.2L55.9 120.8L56.9 118.2L61.9 112.0L65.0 109.4L66.8 108.4L69.2 107.1L73.8 105.9L74.6 105.0L74.0 104.4L70.0 104.9L65.2 104.9L56.0 106.6L54.0 106.1L53.1 105.2L52.9 102.0L54.1 101.2L55.0 99.4L56.2 98.9L77.5 99.1L83.0 100.1L84.2 100.9L85.5 100.9L86.8 101.6L88.0 101.6L89.2 101.1L90.5 100.1L92.5 99.4L92.9 99.0L93.1 97.2L94.1 95.5L97.8 91.9L100.1 90.5L99.6 89.0L99.9 88.2L101.2 86.9L104.0 86.4L104.8 87.1L105.6 87.2L105.9 84.0L106.4 82.2L107.4 80.2L111.0 76.4L113.0 75.1L115.2 74.6L121.8 74.9L122.9 74.2L123.1 73.8L122.2 73.1L120.2 73.1L118.8 72.4L118.0 72.4L116.9 71.2L117.4 69.8L121.5 65.1L125.0 64.1L127.2 62.1L129.8 61.1L130.0 60.1L131.2 59.9L132.5 59.9L133.8 60.9L135.2 60.9L138.2 62.4L139.5 62.4L140.6 63.5L140.9 64.2L140.4 65.5L140.9 67.2L140.9 69.8L140.1 72.5L140.4 76.2L139.4 78.5L136.8 81.9L133.8 83.6L132.4 82.8L132.4 82.2L130.2 79.4L129.5 79.4L129.1 79.8L129.1 87.8L127.9 90.8L126.1 93.5L123.1 96.2L123.1 96.8L123.9 97.2L123.6 100.2L122.2 101.6L120.5 102.1L116.2 100.1L114.8 100.4L114.1 102.2L110.9 107.2L108.8 109.1L106.8 110.1L105.8 110.1L104.6 111.0L103.1 113.5L103.1 114.2L103.9 115.2L103.6 117.5L102.2 118.9L101.8 118.4L101.4 118.8L101.6 121.0L101.1 123.0L99.9 125.8L97.9 127.8L97.4 130.8L96.1 134.2L93.1 139.8L90.5 142.9L86.2 145.6L83.0 147.1L78.5 148.1ZM113.0 138.9L111.0 138.6L110.0 137.9L108.9 135.8L108.1 132.8L108.4 132.0L110.2 130.4L111.5 130.1L113.8 130.4L114.4 131.0L116.1 134.8L116.1 136.0L115.4 136.8L115.4 137.8L114.2 138.6L113.0 138.9Z"/><path class="lg lgA" style="transform-origin:52.8px 102.2px" d="M15.5 124.4L10.8 124.1L7.8 122.6L6.2 122.4L5.6 121.5L6.5 120.6L13.8 120.9L16.2 120.1L18.5 120.1L20.0 119.9L21.5 119.1L22.5 119.1L31.0 115.1L31.6 114.5L31.6 113.8L32.8 112.6L36.0 111.1L48.0 104.4L52.5 102.1L52.9 102.2L52.9 104.5L53.8 106.1L52.5 106.4L39.5 113.1L37.8 114.4L35.5 117.1L35.0 117.4L33.0 117.1L31.2 118.4L23.8 122.1L18.0 124.1L15.5 124.4Z"/><path class="lg lgB" style="transform-origin:103.0px 86.2px" d="M99.5 89.4L91.5 83.9L89.0 81.6L88.2 81.4L83.5 77.4L81.5 76.1L80.9 75.2L80.9 73.8L75.9 68.5L72.9 63.5L70.4 60.2L68.1 56.2L67.9 54.5L67.1 53.5L61.0 48.4L59.0 47.4L58.0 46.4L55.5 45.1L54.8 44.4L49.2 41.4L48.4 40.0L48.6 39.5L49.0 39.1L51.5 39.1L57.5 42.4L64.8 47.6L68.1 50.8L68.8 51.9L71.0 53.1L74.4 57.5L78.6 64.0L81.1 67.0L83.9 71.8L85.2 73.1L87.0 73.4L89.0 74.9L90.2 75.4L93.2 77.9L95.5 79.1L101.0 83.4L104.1 86.2L101.2 86.9L99.9 88.2L99.5 89.4Z"/><path class="lg lgA" style="transform-origin:131.2px 59.8px" d="M131.0 60.1L129.8 60.1L128.9 58.5L126.4 55.8L124.9 53.0L124.1 52.2L122.9 49.5L122.9 48.8L122.1 48.0L121.1 45.5L118.4 41.2L118.1 36.5L115.9 28.5L112.4 22.2L109.9 16.5L105.6 11.8L105.1 10.8L104.9 6.5L105.2 5.9L106.5 5.9L107.2 6.4L109.9 9.0L111.9 11.8L115.1 18.0L117.9 25.0L118.1 27.0L119.4 30.8L119.4 32.5L120.1 34.5L120.1 36.0L120.8 36.9L122.0 36.6L123.1 37.8L124.4 42.8L125.1 43.8L125.4 45.2L127.1 49.0L127.4 50.5L132.4 59.5L132.2 59.9L131.0 60.1Z"/><path class="lg lgB" style="transform-origin:139.5px 62.2px" d="M141.0 64.6L140.6 63.5L139.5 62.1L150.5 55.9L151.5 54.9L152.8 54.4L155.5 52.1L161.8 48.1L164.6 48.0L167.4 38.5L167.9 38.0L169.1 34.0L169.9 33.0L170.1 31.8L171.4 29.2L174.1 25.2L178.8 20.6L181.2 19.1L183.2 18.6L187.0 18.6L187.6 19.2L187.2 20.1L186.0 20.6L182.5 23.1L179.9 25.5L176.4 30.8L175.4 31.8L168.1 46.0L166.4 50.2L166.4 52.0L165.2 53.4L162.0 55.1L160.5 55.4L154.2 58.4L153.5 58.4L151.2 59.4L141.0 64.6Z"/><path class="lg lgA" style="transform-origin:124.0px 97.2px" d="M160.2 109.1L149.0 108.9L146.8 108.4L143.2 108.4L140.5 107.9L139.0 107.9L138.2 108.4L136.2 108.4L131.5 106.9L130.2 106.1L129.5 106.1L128.5 105.4L120.6 102.0L122.2 101.6L123.6 100.2L123.9 97.2L124.2 97.1L125.5 97.9L127.0 98.1L132.0 100.9L133.2 101.1L138.0 103.9L138.2 103.6L147.8 103.9L148.0 104.1L154.2 104.4L158.8 105.4L161.0 105.4L163.5 103.9L168.2 100.1L175.0 95.9L182.2 92.4L183.6 92.8L183.6 93.5L183.0 94.1L182.0 94.4L181.2 95.1L177.5 97.1L171.2 101.4L163.5 108.1L160.2 109.1Z"/><path class="lg lgB" style="transform-origin:104.0px 115.2px" d="M108.2 132.6L106.9 127.2L106.1 126.2L104.1 121.2L102.4 119.0L103.6 117.5L104.0 115.1L107.1 118.5L110.1 122.5L111.6 125.0L112.6 128.0L114.1 130.2L114.0 130.6L112.5 130.1L110.2 130.4L108.4 132.0L108.2 132.6Z"/><path class="lg lgA" style="transform-origin:115.2px 138.0px" d="M117.8 182.4L116.5 181.9L114.1 179.5L114.1 179.0L113.1 177.8L112.9 176.2L112.1 174.8L110.9 166.8L111.1 160.5L110.6 158.5L111.9 156.0L112.1 153.8L111.9 143.8L111.4 142.2L111.1 138.8L114.2 138.6L115.2 137.9L115.6 146.2L115.9 146.5L115.6 152.0L115.4 152.2L115.4 157.0L115.1 157.2L115.1 160.0L113.4 161.8L113.4 167.0L113.9 168.0L114.4 171.8L116.4 176.2L117.4 179.8L118.4 181.2L118.4 181.8L117.8 182.4Z"/></svg>';
  var box=document.createElement("div");box.className="wander";box.setAttribute("aria-hidden","true");document.body.appendChild(box);
  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches,ants=[];
  function W(){return document.documentElement.clientWidth}function Hh(){return document.documentElement.scrollHeight}
  for(var n=0;n<3;n++){var d=document.createElement("div");d.innerHTML=ANT;var el=d.firstChild;box.appendChild(el);
    ants.push({el:el,x:Math.random()*W(),y:(hero?hero.offsetHeight:0)+Math.random()*(Hh()-(hero?hero.offsetHeight:0)-60),h:Math.random()*360,v:20+Math.random()*14,t:0,p:0,turn:0})}
  function draw(a){a.el.style.transform="translate("+a.x+"px,"+a.y+"px) rotate("+(a.h+41.5)+"deg)"}
  var last=performance.now();
  function tick(now){var dt=Math.min((now-last)/1000,.1);last=now;var w=W(),h=Hh();
    ants.forEach(function(a){
      if(a.p>0){a.p-=dt}else{
        a.t-=dt;if(a.t<=0){a.t=1+Math.random()*3;a.turn=(Math.random()-.5)*100;if(Math.random()<.2)a.p=1+Math.random()*3}
        a.h+=a.turn*dt;var r=a.h*Math.PI/180;a.x+=Math.cos(r)*a.v*dt;a.y+=Math.sin(r)*a.v*dt;
        if(a.x<0||a.x>w-44){a.h=180-a.h;a.x=Math.max(0,Math.min(w-44,a.x))}
        var tp=(hero?hero.offsetHeight:0);if(a.y<tp||a.y>h-44){a.h=-a.h;a.y=Math.max(tp,Math.min(h-44,a.y))}}
      a.el.classList.toggle("still",a.p>0);draw(a)});
    requestAnimationFrame(tick)}
  ants.forEach(draw);if(!rm)requestAnimationFrame(tick);
  if(hero){var bd=document.createElement("div");bd.innerHTML=ANT.replace('class="wa"','class="bigant"');var big=bd.firstChild;big.classList.add("still");hero.appendChild(big);
  var bs=1,bx=0,by=0,walking=false;
  function setBig(dx,dy,sc,rot){big.style.transform="translate(-50%,-50%) translate3d("+dx.toFixed(2)+"px,"+dy.toFixed(2)+"px,0) rotate("+rot.toFixed(2)+"deg) scale("+sc+")"}
  function layoutBig(){var r=hero.getBoundingClientRect();bs=Math.max(r.width/2576,r.height/2060);big.style.width=(193.5*bs)+"px";bx=r.width/2;by=r.height/2;setBig(0,0,1,0)}
  layoutBig();addEventListener("resize",function(){if(!walking)layoutBig()});
  if(!rm)setTimeout(function(){walking=true;big.classList.remove("still");
    // wander through a few random points inside the yellow section, then leave through an edge
    var r=hero.getBoundingClientRect(),W=r.width,H=r.height,bw=big.getBoundingClientRect().width,m=bw*.7,
      rx=function(){return (Math.random()-.5)*(W-2*m)},ry=function(){return (Math.random()-.5)*(H-2*m)},
      P=[[0,0],[rx(),ry()],[rx(),ry()],[rx(),ry()]],last=P[3],side=Math.floor(Math.random()*3),out=bw*1.1,E;
    if(side===0)E=[last[0]*.6+(Math.random()-.5)*W*.3,-H/2-out];
    else if(side===1)E=[-W/2-out,last[1]*.5];else E=[W/2+out,last[1]*.5];
    P.push(E);var Q=[P[0]].concat(P,[E]);
    function cr(p0,p1,p2,p3,t){var t2=t*t,t3=t2*t;return[0,1].map(function(i){return .5*(2*p1[i]+(-p0[i]+p2[i])*t+(2*p0[i]-5*p1[i]+4*p2[i]-p3[i])*t2+(-p0[i]+3*p1[i]-3*p2[i]+p3[i])*t3)})}
    var pts=[];for(var i=1;i<Q.length-2;i++)for(var k=0;k<60;k++)pts.push(cr(Q[i-1],Q[i],Q[i+1],Q[i+2],k/60));pts.push(E);
    var L=[0];for(var j=1;j<pts.length;j++)L.push(L[j-1]+Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]));var total=L[L.length-1];
    function at(d){var lo=0,hi=L.length-1;while(hi-lo>1){var mid=(lo+hi)>>1;if(L[mid]<d)lo=mid;else hi=mid}var f=(d-L[lo])/((L[hi]-L[lo])||1),p=pts[lo],q=pts[hi];return[p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f,Math.atan2(q[1]-p[1],q[0]-p[0])*180/Math.PI+41.5]}
    // heading from a look-ahead window and eased toward the target, so the ant never snaps
    function head(d){var a=at(Math.max(0,d-14)),b=at(Math.min(total,d+14));return Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI+41.5}
    var speed=.03,turnD=1200,ang=head(0),cur=0,t0=performance.now(),d=0,prev=t0;
    (function step(now){var e=now-t0;
      if(e<turnD){var k=e/turnD;k=k*k*(3-2*k);cur=ang*k;setBig(0,0,1,cur);prev=now}
      else{var dt=Math.min(50,now-prev);prev=now;d+=dt*speed*(1+.2*Math.sin(now/1100));var q=at(Math.min(d,total)),tgt=head(d),diff=((tgt-cur)%360+540)%360-180;cur+=diff*Math.min(1,dt/180);setBig(q[0],q[1],1,cur);
        if(d>=total){big.remove();return}}
      requestAnimationFrame(step)})(t0)},1400);}

  // back to top: terminal style "cd ~"
  (function(){
    var lab={de:"Nach oben",en:"Back to top",ka:"ზემოთ ასვლა"};
    var b=document.createElement("button");b.type="button";b.className="totop";
    b.innerHTML='<span class="tcmd">cd ~</span><span class="tcur" aria-hidden="true"></span><span class="tarr" aria-hidden="true">&#8593;</span>';
    function lbl(){var l=h.lang||"de";b.setAttribute("aria-label",lab[l]||lab.de);b.title=lab[l]||lab.de}
    lbl();new MutationObserver(lbl).observe(h,{attributes:true,attributeFilter:["lang"]});
    document.body.appendChild(b);
    function vis(){b.classList.toggle("on",window.scrollY>innerHeight*.8)}
    addEventListener("scroll",vis,{passive:true});vis();
    b.addEventListener("click",function(){
      var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({top:0,behavior:rm?"auto":"smooth"});
      var t=document.querySelector(".bar a");if(t)t.focus({preventScroll:true});
    });
  })();

})();
