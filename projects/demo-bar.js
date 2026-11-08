(function(){var l="de";try{l=localStorage.getItem("np-lang")||"de"}catch(e){}
var framed=false;try{framed=window.self!==window.top}catch(e){framed=true}
document.querySelectorAll(".dbar").forEach(function(b){b.setAttribute("data-lang",l);if(framed)b.style.display="none"});
if(framed)document.documentElement.classList.add("framed")})();
