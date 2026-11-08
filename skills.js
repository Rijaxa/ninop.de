(function(){
  var sec=document.getElementById("skills");if(!sec)return;
  var h=document.documentElement;
  var rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var T={
    hintDir:{de:"# Ordner antippen",en:"# tap a folder",ka:"# დააკლიკეთ საქაღალდეს"},
    hintSkill:{de:"# Skill antippen, um zu sehen, wo ich ihn eingesetzt habe",en:"# tap a skill to see where I have used it",ka:"# დააკლიკეთ უნარს, რომ ნახოთ, სად გამოვიყენე"},
    found:{de:"# gefunden in:",en:"# found in:",ka:"# ნაპოვნია:"},
    tool:{de:"# fester Teil meines Werkzeugkastens",en:"# a regular part of my toolkit",ka:"# ჩემი სამუშაო ინსტრუმენტების მუდმივი ნაწილი"},
    back:{de:"zurück",en:"back",ka:"უკან"},
    ai:{de:"# täglich im Einsatz: zum Lernen, beim Programmieren, für Texte und Kommunikation. Ergebnisse prüfe ich immer selbst.",en:"# used daily: for learning, coding, writing and communication. I always check the results myself.",ka:"# ყოველდღიურად ვიყენებ სწავლისთვის, პროგრამირებისთვის, ტექსტებისა და კომუნიკაციისთვის. შედეგებს ყოველთვის თავად ვამოწმებ."}
  };
  var P={
    km:{href:"#erfahrung",t:{de:"K&M Vet IT, Berufserfahrung",en:"K&M Vet IT, experience",ka:"K&M Vet IT, გამოცდილება"}},
    bay:{href:"#erfahrung",t:{de:"BayernLB, Berufserfahrung",en:"BayernLB, experience",ka:"BayernLB, გამოცდილება"}},
    free:{href:"#erfahrung",t:{de:"Freelance, Berufserfahrung",en:"Freelance, experience",ka:"ფრილანსი, გამოცდილება"}},
    gih:{href:"#projekte",t:{de:"Georgian Internet History, Projekte",en:"Georgian Internet History, projects",ka:"ქართული ინტერნეტის ისტორია, პროექტები"}},
    dv:{href:"#projekte",t:{de:"Data Visualisation, Projekte",en:"Data Visualisation, projects",ka:"მონაცემთა ვიზუალიზაცია, პროექტები"}},
    gold:{href:"#ausbildung",t:{de:"Goldsmiths, Ausbildung",en:"Goldsmiths, education",ka:"გოლდსმიტსი, განათლება"}},
    baf:{href:"#ausbildung",t:{de:"BAF, Ausbildung",en:"BAF, education",ka:"BAF, განათლება"}},
    plug:{href:"#erfahrung",t:{de:"Kalender- und Buchungs-Plugins, K&M Vet IT",en:"calendar and booking plugins, K&M Vet IT",ka:"კალენდრისა და დაჯავშნის პლაგინები, K&M Vet IT"}},
    bot:{href:"#sportsbuddy",t:{de:"SportsBuddy, Chatbot in Python, Projekte",en:"SportsBuddy, chatbot in Python, projects",ka:"SportsBuddy, ჩატბოტი Python-ზე, პროექტები"}},
    art:{href:"/hobbies#kunst",t:{de:"Meine Illustrationen, Kunst auf der Hobby-Seite",en:"my illustrations, art on the hobbies page",ka:"ჩემი ილუსტრაციები, ხელოვნება ჰობების გვერდზე"}},
    ph:{href:"#erfahrung",t:{de:"PlanetHome, Berufserfahrung",en:"PlanetHome, experience",ka:"PlanetHome, გამოცდილება"}},
    reel:{href:"https://www.youtube.com/watch?v=Hn9tZCwtBAA",ext:1,t:{de:"Motion-Design-Showreel auf YouTube ↗",en:"motion design showreel on YouTube ↗",ka:"მოუშენ დიზაინის შოურილი YouTube-ზე ↗"}},
    mog:{href:"#mogvel",t:{de:"Mogvel, Startup-Projekt, Projekte",en:"Mogvel, startup project, projects",ka:"Mogvel, სტარტაპ-პროექტი, პროექტები"}},
    dj:{href:"#otodecks",t:{de:"Otodecks, DJ-Software, Projekte",en:"Otodecks, DJ software, projects",ka:"Otodecks, DJ პროგრამა, პროექტები"}},
    gh:{href:"#projekte",t:{de:"Projekte auf GitHub",en:"projects on GitHub",ka:"პროექტები GitHub-ზე"}}
  };
  var D=[
    {id:"design",s:[["Figma",["plug"]],["Adobe Illustrator",["art"]],["Adobe Photoshop",["art"]],["UI/UX Design",["km","mog","bay","free","ph"]]]},
    {id:"motion",s:[["Adobe Premiere Pro",["reel"]],["Adobe After Effects",["reel"]],["Animation & VFX",["reel","baf"]]]},
    {id:"code",s:[["JavaScript",["gih","dv","mog"]],["HTML & CSS",["gih","mog"]],["Node.js & Express",["gih","gold"]],["Python",["bot","gold"]],["C++",["dj","gold"]],["p5.js",["dv"]],["JSON",["gih","bot"]],["Git",["gh"]]]},
    {id:"web",s:[["WordPress",["plug"]],["Joomla",["plug"]],["SEO"],["Google Analytics"],["Google Search Console"],["Web Security",["km"]],["Web Operations",["km"]]]},
    {id:"ai",s:[["Claude",["plug"],1],["Gemini",["plug"],1],["GitHub Copilot",null,1],["Adobe Firefly",null,1],["Figma AI",null,1]]}
  ];
  function L(o){return o[h.lang]||o.de}
  function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")}
  var term=document.createElement("div");term.className="term";
  term.innerHTML='<div class="tbar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ttitle">~/skills</span></div>'+
    '<div class="tbody"><div class="tl"><span class="tp">$</span> <span class="tc" data-cmd="ls ~/skills"></span></div><div class="tdirs" role="group" aria-label="Skills"></div><div class="tout" aria-live="polite"></div></div>';
  sec.querySelector(".wrap").appendChild(term);sec.classList.add("js");
  var dirs=term.querySelector(".tdirs"),out=term.querySelector(".tout"),state={dir:null,skill:null};
  D.forEach(function(d){var b=document.createElement("button");b.type="button";b.className="tdir";b.textContent=d.id+"/";b.addEventListener("click",function(){openDir(d.id,true)});dirs.appendChild(b)});
  function type(el,text,cb){if(rm){el.textContent=text;cb&&cb();return}el.textContent="";var i=0;(function n(){el.textContent=text.slice(0,++i);if(i<text.length)setTimeout(n,22);else cb&&cb()})()}
  function line(cmd){var d=document.createElement("div");d.className="tl";d.innerHTML='<span class="tp">$</span> <span class="tc"></span>';return d}
  function render(animate){
    out.innerHTML="";
    dirs.querySelectorAll(".tdir").forEach(function(b){b.setAttribute("aria-pressed",b.textContent===state.dir+"/")});
    if(!state.dir){var c=document.createElement("div");c.className="tcm";c.textContent=L(T.hintDir);out.appendChild(c);return}
    var d=D.filter(function(x){return x.id===state.dir})[0];
    if(!state.skill){
      var l=line();out.appendChild(l);
      var body=document.createElement("div");body.className="tskills";
      d.s.forEach(function(s){var b=document.createElement("button");b.type="button";b.className="tskill"+(s[1]?" has":"");b.textContent=s[0];b.addEventListener("click",function(){state.skill=s;render(true)});body.appendChild(b)});
      var hint=document.createElement("div");hint.className="tcm";hint.textContent=L(T.hintSkill);
      var reel=null;if(d.id==="motion"){reel=document.createElement("a");reel.className="thit treel";reel.href=P.reel.href;reel.target="_blank";reel.rel="noopener";reel.textContent="▶ showreel_baf.mp4  "+L({de:"auf YouTube ansehen ↗",en:"watch on YouTube ↗",ka:"ნახეთ YouTube-ზე ↗"})}
      var cmd="ls "+d.id+"/";
      var show=function(){out.appendChild(body);if(reel)out.appendChild(reel);out.appendChild(hint)};
      if(animate)type(l.querySelector(".tc"),cmd,show);else{l.querySelector(".tc").textContent=cmd;show()}
    }else{
      var s=state.skill,l2=line();out.appendChild(l2);
      var res=document.createElement("div");res.className="tres";
      if(s[2]){var nt=document.createElement("div");nt.className="tcm";nt.textContent=L(T.ai);res.appendChild(nt)}
      if(s[1]||!s[2]){var head=document.createElement("div");head.className="tcm";head.textContent=s[1]?L(T.found):L(T.tool);res.appendChild(head);}
      (s[1]||[]).forEach(function(k){var a=document.createElement("a");a.href=P[k].href;a.className="thit";if(P[k].ext){a.target="_blank";a.rel="noopener"}a.innerHTML='<span aria-hidden="true">&rarr;</span> '+esc(L(P[k].t));res.appendChild(a)});
      var back=document.createElement("button");back.type="button";back.className="tback";back.textContent="cd .. ("+L(T.back)+")";back.addEventListener("click",function(){state.skill=null;render(true)});res.appendChild(back);
      var cmd='grep -r "'+s[0]+'" ~/life';
      var show2=function(){out.appendChild(res)};
      if(animate)type(l2.querySelector(".tc"),cmd,show2);else{l2.querySelector(".tc").textContent=cmd;show2()}
    }
  }
  function openDir(id,animate){state.dir=id;state.skill=null;render(animate)}
  var started=false;
  function start(){if(started)return;started=true;var c=term.querySelector('.tl .tc');type(c,c.dataset.cmd,function(){dirs.classList.add("on");setTimeout(function(){openDir("design",true)},rm?0:350)})}
  if("IntersectionObserver" in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){start();o.disconnect()}},{threshold:.3}).observe(term)}else start();
  new MutationObserver(function(){if(started)render(false)}).observe(h,{attributes:true,attributeFilter:["lang"]});
})();
