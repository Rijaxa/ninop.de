// Otodecks web demo: a browser rebuild of the C++/JUCE DJ application.
// Two decks (play, loop, load, volume and speed dials, waveform scrubbing, 8 hot cues, tap BPM),
// a music library, a recordings sampler and a session bar, mirroring the original layout.
(function () {
  "use strict";
  var CYAN = "#00d2ff";
  var CUE_COLORS = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#1abc9c", "#3498db", "#9b59b6", "#e84393"];
  var TRACKS = [
    ["c_major_theme", "C Major Theme"], ["aon_inspired", "Aon Inspired"], ["stomper_reggae_bit", "Stomper Reggae Bit"],
    ["selection1", "Selection 1"], ["bleep_10", "Bleep 10"], ["soft", "Soft"], ["hard", "Hard"]
  ];

  // Opened straight from disk (file://), browsers mute audio that is routed through Web Audio
  // for security reasons. In that case the decks play directly through the audio element.
  var ROUTE = /^https?:$/.test(location.protocol);
  var ctx = null, master = null, recDest = null;
  function audio() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.connect(ctx.destination);
      recDest = ctx.createMediaStreamDestination();
      master.connect(recDest);
      if (ROUTE) { decks.forEach(function (d) { d.wire(); }); preview.wire(); }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function fmt(s) { s = Math.max(0, s || 0); var m = Math.floor(s / 60), x = Math.floor(s % 60); return (m < 10 ? "0" : "") + m + ":" + (x < 10 ? "0" : "") + x; }
  function fmtT(s) { var t = Math.floor(s), m = Math.floor(t / 60), x = t % 60, d = Math.floor((s - t) * 10); return (m < 10 ? "0" : "") + m + ":" + (x < 10 ? "0" : "") + x + "." + d; }
  function toast(msg) { var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var peakCache = window.OTO_PEAKS || {};
  function peaksFor(src, n) {
    if (peakCache[src]) return Promise.resolve(peakCache[src]);
    return fetch(src).then(function (r) { return r.arrayBuffer(); })
      .then(function (buf) { return new Promise(function (res, rej) { audio().decodeAudioData(buf, res, rej); }); })
      .then(function (ab) {
        var ch = ab.getChannelData(0), step = Math.floor(ch.length / n) || 1, out = [];
        for (var i = 0; i < n; i++) { var mn = 0, mx = 0; for (var j = i * step; j < (i + 1) * step && j < ch.length; j += 16) { var v = ch[j]; if (v < mn) mn = v; if (v > mx) mx = v; } out.push([mn, mx]); }
        peakCache[src] = { peaks: out, duration: ab.duration };
        return peakCache[src];
      });
  }

  // ---------- Deck ----------
  function Deck(el, id) {
    var self = this; this.id = id; this.el = el;
    el.appendChild(document.getElementById("deckTpl").content.cloneNode(true));
    this.a = new Audio(); this.a.preload = "auto";
    if ("preservesPitch" in this.a) this.a.preservesPitch = false; else this.a.mozPreservesPitch = false;
    this.vol = 1; this.speed = 1; this.src = ""; this.key = ""; this.peaks = null; this.cues = [-1, -1, -1, -1, -1, -1, -1, -1]; this.taps = [];
    var q = function (s) { return el.querySelector(s); };
    this.playBtn = q(".play"); this.loopBtn = q(".loop"); this.nameEl = q(".tname"); this.timeEl = q(".ttime"); this.wave = q(".wave"); this.bpm = q(".bpm");
    this.playBtn.onclick = function () { self.toggle(); };
    this.loopBtn.onclick = function () { var on = self.loopBtn.getAttribute("aria-pressed") !== "true"; self.loopBtn.setAttribute("aria-pressed", on); self.a.loop = on; };
    q(".load input").onchange = function (e) { var f = e.target.files[0]; if (f) self.load(URL.createObjectURL(f), f.name.replace(/\.[^.]+$/, ""), "local:" + f.name); e.target.value = ""; };
    q(".clear").onclick = function () { self.cues = self.cues.map(function () { return -1; }); self.saveCues(); self.drawCues(); self.drawWave(); };
    q(".tap").onclick = function () { self.tap(); };
    this.a.addEventListener("ended", function () { self.setPlayUI(false); });
    this.a.addEventListener("loadedmetadata", function () { self.drawWave(); });
    this.dialVol = new Dial(q(".dial.vol"), q(".vv"), 0, 5, 1, function (v) { self.vol = v; if (self.g) self.g.gain.value = v; else self.a.volume = Math.min(1, v); });
    this.dialSpd = new Dial(q(".dial.spd"), q(".sv"), 0.1, 5, 1, function (v) { self.speed = v; self.a.playbackRate = v; });
    this.buildCues(); this.bindWave(); this.bindDrop();
    window.addEventListener("resize", function () { self.drawWave(); });
    this.drawWave();
  }
  Deck.prototype.wire = function () { this.node = ctx.createMediaElementSource(this.a); this.g = ctx.createGain(); this.g.gain.value = this.vol; this.node.connect(this.g); this.g.connect(master); };
  Deck.prototype.load = function (src, name, key) {
    var self = this; this.src = src; this.key = key || src;
    var wasLoop = this.a.loop; this.a.pause(); this.a.src = src; this.a.loop = wasLoop; this.a.playbackRate = this.speed;
    this.nameEl.textContent = name; this.setPlayUI(false); this.peaks = null; this.drawWave();
    this.cues = store("oto_cues_" + this.key) || [-1, -1, -1, -1, -1, -1, -1, -1]; this.drawCues();
    store("oto_deck_" + this.id, { src: src.indexOf("blob:") === 0 ? "" : src, name: name, key: this.key });
    peaksFor(src, 600).then(function (p) { if (self.src === src) { self.peaks = p.peaks; self.drawWave(); } }).catch(function () {});
  };
  Deck.prototype.toggle = function () {
    if (!this.src) { toast("Load a track first: use LOAD or a Deck button in the Music Library."); return; }
    audio();
    if (this.a.paused) { if (this.a.ended) this.a.currentTime = 0; var pr = this.a.play(); if (pr && pr.catch) pr.catch(function () { toast("The browser blocked playback. Click PLAY again."); }); this.setPlayUI(true); } else { this.a.pause(); this.setPlayUI(false); }
  };
  Deck.prototype.play = function () { audio(); this.a.play(); this.setPlayUI(true); };
  Deck.prototype.setPlayUI = function (on) { this.playBtn.textContent = on ? "STOP" : "PLAY"; this.playBtn.classList.toggle("on", on); lib.sync(); };
  Deck.prototype.tick = function () {
    var d = this.a.duration || 0, t = this.a.currentTime || 0;
    this.timeEl.textContent = fmt(t) + " / " + fmt(d);
    if (!this.a.paused && this.playBtn.textContent === "PLAY") this.setPlayUI(true);
    this.drawWave();
  };
  Deck.prototype.bindWave = function () {
    var self = this, down = false;
    function seek(e) { var r = self.wave.getBoundingClientRect(), x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); if (self.a.duration) { self.a.currentTime = x * self.a.duration; self.tick(); } }
    this.wave.addEventListener("pointerdown", function (e) { down = true; self.wave.setPointerCapture(e.pointerId); seek(e); });
    this.wave.addEventListener("pointermove", function (e) { if (down) seek(e); });
    this.wave.addEventListener("pointerup", function () { down = false; });
  };
  Deck.prototype.drawWave = function () {
    var c = this.wave, w = c.clientWidth, h = c.clientHeight, dpr = window.devicePixelRatio || 1;
    if (!w) return;
    if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    var g = c.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    g.fillStyle = "#181818"; g.fillRect(0, 0, w, h);
    if (!this.src) { g.fillStyle = "#888"; g.font = "bold 13px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NO TRACK LOADED", w / 2, h / 2); return; }
    if (this.peaks) {
      var grad = g.createLinearGradient(0, 0, 0, h); grad.addColorStop(0, "#005c8a"); grad.addColorStop(.5, CYAN); grad.addColorStop(1, "#005c8a");
      g.fillStyle = grad; var n = this.peaks.length, bw = w / n, mid = h / 2, amp = h / 2 - 3;
      for (var i = 0; i < n; i++) { var p = this.peaks[i]; g.fillRect(i * bw, mid - p[1] * amp, Math.max(1, bw), Math.max(1, (p[1] - p[0]) * amp)); }
    } else { g.fillStyle = "#555"; g.font = "12px system-ui"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("Loading waveform...", w / 2, h / 2); }
    var d = this.a.duration;
    if (d) {
      var self = this;
      this.cues.forEach(function (t, i) { if (t >= 0) { var x = t / d * w; g.fillStyle = CUE_COLORS[i]; g.fillRect(x - 1, 0, 2, h); g.fillRect(x - 1, 0, 9, 9); } });
      var px = (this.a.currentTime / d) * w;
      g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(0, 0, px, h);
      g.fillStyle = "rgba(0,210,255,.5)"; g.fillRect(px - 2, 0, 5, h);
      g.fillStyle = "#fff"; g.fillRect(px, 0, 1, h);
    }
  };
  Deck.prototype.buildCues = function () {
    var self = this, box = this.el.querySelector(".cues"); this.cueEls = [];
    for (var i = 0; i < 8; i++) (function (i) {
      var s = document.createElement("div"); s.className = "cue";
      var b = document.createElement("button"); b.className = "main"; b.title = "Click: set or jump to cue. Shift+click: overwrite. Right-click: menu.";
      var x = document.createElement("button"); x.className = "x"; x.textContent = "×"; x.setAttribute("aria-label", "Clear cue " + (i + 1));
      b.onclick = function (e) { self.cueClick(i, e.shiftKey); };
      b.oncontextmenu = function (e) { e.preventDefault(); self.cues[i] = self.cues[i] >= 0 ? -1 : self.a.currentTime; self.saveCues(); self.drawCues(); self.drawWave(); };
      x.onclick = function () { self.cues[i] = -1; self.saveCues(); self.drawCues(); self.drawWave(); };
      s.appendChild(b); s.appendChild(x); box.appendChild(s); self.cueEls.push(s);
    })(i);
    this.drawCues();
  };
  Deck.prototype.cueClick = function (i, shift) {
    if (!this.src) { toast("Load a track first."); return; }
    if (shift || this.cues[i] < 0) { this.cues[i] = this.a.currentTime; this.saveCues(); this.drawCues(); }
    else { this.a.currentTime = this.cues[i]; }
    this.tick();
  };
  Deck.prototype.drawCues = function () {
    var self = this;
    this.cueEls.forEach(function (s, i) {
      var t = self.cues[i], b = s.firstChild, set = t >= 0;
      s.classList.toggle("set", set); b.textContent = set ? fmtT(t) : String(i + 1);
      b.style.background = set ? CUE_COLORS[i] : CUE_COLORS[i] + "40"; b.style.color = set && i === 2 ? "#000" : (set ? "#fff" : "rgba(255,255,255,.55)");
      b.setAttribute("aria-label", set ? "Jump to cue " + (i + 1) + " at " + fmtT(t) : "Set cue " + (i + 1));
    });
  };
  Deck.prototype.saveCues = function () { if (this.key) store("oto_cues_" + this.key, this.cues); };
  Deck.prototype.tap = function () {
    var now = performance.now();
    if (this.taps.length && now - this.taps[this.taps.length - 1] > 2000) this.taps = [];
    this.taps.push(now);
    if (this.taps.length >= 4) { if (this.taps.length > 8) this.taps.shift(); var avg = (this.taps[this.taps.length - 1] - this.taps[0]) / (this.taps.length - 1); this.bpm.textContent = "BPM: " + (60000 / avg).toFixed(1); }
    else if (this.taps.length === 1) this.bpm.textContent = "BPM: Tap...";
  };
  Deck.prototype.bindDrop = function () {
    var self = this, el = this.el;
    el.addEventListener("dragover", function (e) { e.preventDefault(); el.classList.add("drop"); });
    el.addEventListener("dragleave", function () { el.classList.remove("drop"); });
    el.addEventListener("drop", function (e) {
      e.preventDefault(); el.classList.remove("drop");
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) { self.load(URL.createObjectURL(f), f.name.replace(/\.[^.]+$/, ""), "local:" + f.name); return; }
      var data = e.dataTransfer.getData("text/plain"); if (!data) return;
      try { var o = JSON.parse(data); self.load(o.src, o.name, o.key); } catch (err) {}
    });
  };

  // ---------- Rotary dial (drag up/down, arrow keys, wheel) ----------
  function Dial(c, out, min, max, val, cb) {
    var self = this; this.c = c; this.out = out; this.min = min; this.max = max; this.cb = cb; this.set(val);
    var sy = 0, sv = 0, down = false;
    c.addEventListener("pointerdown", function (e) { down = true; sy = e.clientY; sv = self.v; c.setPointerCapture(e.pointerId); });
    c.addEventListener("pointermove", function (e) { if (down) self.set(sv + (sy - e.clientY) / 150 * (max - min)); });
    c.addEventListener("pointerup", function () { down = false; });
    c.addEventListener("dblclick", function () { self.set(val); });
    c.addEventListener("wheel", function (e) { e.preventDefault(); self.set(self.v - Math.sign(e.deltaY) * (max - min) / 100); }, { passive: false });
    c.addEventListener("keydown", function (e) { var st = (max - min) / 100; if (e.key === "ArrowUp" || e.key === "ArrowRight") { self.set(self.v + st); e.preventDefault(); } if (e.key === "ArrowDown" || e.key === "ArrowLeft") { self.set(self.v - st); e.preventDefault(); } });
  }
  Dial.prototype.set = function (v) {
    this.v = Math.min(this.max, Math.max(this.min, v)); this.out.textContent = this.v.toFixed(2);
    this.c.setAttribute("aria-valuenow", this.v.toFixed(2)); this.cb(this.v); this.draw();
  };
  Dial.prototype.draw = function () {
    var g = this.c.getContext("2d"), W = this.c.width, cx = W / 2, cy = W / 2, r = W / 2 - 8;
    var a0 = Math.PI * 0.75, a1 = Math.PI * 2.25, a = a0 + (this.v - this.min) / (this.max - this.min) * (a1 - a0);
    g.clearRect(0, 0, W, W);
    g.fillStyle = "#252525"; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "#121212"; g.lineWidth = 3; g.stroke();
    g.strokeStyle = CYAN; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, r - 7, a0, a); g.stroke();
    g.save(); g.translate(cx, cy); g.rotate(a + Math.PI / 2); g.fillStyle = "#fff"; g.fillRect(-3, -(r - 7), 6, r - 7); g.restore();
  };

  // ---------- Sample preview (Recordings) ----------
  var preview = {
    a: new Audio(), row: -1, vol: 0.75,
    wire: function () { this.n = ctx.createMediaElementSource(this.a); this.g = ctx.createGain(); this.g.gain.value = this.vol; this.n.connect(this.g); this.g.connect(master); },
    play: function (src, vol) { audio(); this.a.src = src; if (this.g) this.g.gain.value = vol; else this.a.volume = Math.min(1, vol); this.a.play(); },
    stop: function () { this.a.pause(); }
  };
  preview.a.addEventListener("ended", function () { rec.playing = -1; rec.render(); });

  // ---------- Music library ----------
  var lib = {
    items: [], playing: -1,
    tb: document.querySelector("#libTable tbody"),
    init: function () {
      var self = this;
      this.items = TRACKS.map(function (t) { return { file: t[0] + ".mp3", name: t[1], artist: "unknown", src: "tracks/" + t[0] + ".mp3", key: t[0], dur: 0 }; });
      this.render();
      this.items.forEach(function (it) { var a = new Audio(); a.preload = "metadata"; a.src = it.src; a.onloadedmetadata = function () { it.dur = a.duration; self.render(); }; });
      document.getElementById("libFile").onchange = function (e) {
        [].forEach.call(e.target.files, function (f) {
          var it = { file: f.name, name: f.name.replace(/\.[^.]+$/, ""), artist: "unknown", src: URL.createObjectURL(f), key: "local:" + f.name, dur: 0 };
          var a = new Audio(); a.src = it.src; a.onloadedmetadata = function () { it.dur = a.duration; self.render(); };
          self.items.push(it);
        });
        e.target.value = ""; self.render();
      };
    },
    sync: function () {
      var src = decks[0] && !decks[0].a.paused ? decks[0].src : "";
      var p = -1; this.items.forEach(function (it, i) { if (src && it.src === src) p = i; }); if (p !== this.playing) { this.playing = p; this.render(); }
    },
    render: function () {
      var self = this; this.tb.innerHTML = "";
      this.items.forEach(function (it, i) {
        var tr = document.createElement("tr"); tr.draggable = true; if (i === self.playing) tr.className = "playing";
        tr.innerHTML = "<td></td><td></td><td></td><td></td><td><button class='p'></button></td><td><button class='k'>1</button><button class='k'>2</button></td><td><button class='d' aria-label='Delete'>x</button></td>";
        var td = tr.children; td[0].textContent = it.file; td[1].textContent = it.name; td[2].textContent = it.artist; td[3].textContent = it.dur ? Math.floor(it.dur / 60) + ":" + ("0" + Math.floor(it.dur % 60)).slice(-2) : "...";
        var pb = td[4].firstChild; pb.textContent = i === self.playing ? "stop" : "play";
        pb.onclick = function () { if (i === self.playing) { decks[0].a.pause(); decks[0].setPlayUI(false); } else { decks[0].load(it.src, it.name, it.key); decks[0].play(); } };
        td[5].children[0].onclick = function () { decks[0].load(it.src, it.name, it.key); };
        td[5].children[1].onclick = function () { decks[1].load(it.src, it.name, it.key); };
        td[6].firstChild.onclick = function () { self.items.splice(i, 1); self.render(); };
        tr.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", JSON.stringify({ src: it.src, name: it.name, key: it.key })); });
        self.tb.appendChild(tr);
      });
    }
  };

  // ---------- Recordings sampler ----------
  var rec = {
    items: [], playing: -1, mr: null, chunks: [], t0: 0, micStream: null,
    tb: document.querySelector("#recTable tbody"), btn: document.getElementById("recBtn"),
    init: function () {
      var self = this;
      this.btn.onclick = function () { self.mr ? self.stop() : self.start(); };
      document.getElementById("recVol").oninput = function (e) { preview.vol = +e.target.value; if (preview.g) preview.g.gain.value = preview.vol; else preview.a.volume = Math.min(1, preview.vol); };
    },
    streamFor: function (srcSel) {
      audio();
      if (srcSel === "mic") {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return Promise.reject(new Error("no mic"));
        return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { rec.micStream = s; return s; });
      }
      if (!ROUTE) return Promise.reject(new Error("offline"));
      if (srcSel === "master") return Promise.resolve(recDest.stream);
      var d = decks[+srcSel - 1], dst = ctx.createMediaStreamDestination(); d.g.connect(dst); this.tap = { from: d.g, to: dst };
      return Promise.resolve(dst.stream);
    },
    start: function () {
      var self = this, sel = document.getElementById("recSource"), srcSel = sel.value, label = sel.options[sel.selectedIndex].text;
      if (!window.MediaRecorder) { toast("Recording is not supported in this browser."); return; }
      this.streamFor(srcSel).then(function (stream) {
        self.chunks = []; self.mr = new MediaRecorder(stream); self.t0 = performance.now();
        self.mr.ondataavailable = function (e) { if (e.data.size) self.chunks.push(e.data); };
        self.mr.onstop = function () {
          var blob = new Blob(self.chunks, { type: self.mr.mimeType || "audio/webm" }), dur = (performance.now() - self.t0) / 1000, n = self.items.length + 1;
          self.items.push({ name: "Sample " + n, source: label, dur: dur, src: URL.createObjectURL(blob), vol: 1, key: "sample" + Date.now() });
          self.mr = null; if (self.micStream) { self.micStream.getTracks().forEach(function (t) { t.stop(); }); self.micStream = null; }
          if (self.tap) { try { self.tap.from.disconnect(self.tap.to); } catch (e) {} self.tap = null; }
          self.render();
        };
        self.mr.start(); self.btn.textContent = "STOP REC"; self.btn.classList.add("on");
      }).catch(function (err) { toast(err && err.message === "offline" ? "Recording decks only works on the online version of the site." : "Microphone access was not granted."); });
    },
    stop: function () { if (this.mr) this.mr.stop(); this.btn.textContent = "REC"; this.btn.classList.remove("on"); },
    render: function () {
      var self = this; this.tb.innerHTML = ""; document.getElementById("recEmpty").style.display = this.items.length ? "none" : "";
      this.items.forEach(function (it, i) {
        var tr = document.createElement("tr"); tr.draggable = true; if (i === self.playing) tr.className = "playing";
        tr.innerHTML = "<td></td><td></td><td></td><td><button class='p'></button></td><td><input type='range' min='0' max='3' step='0.01' aria-label='Sample volume'></td><td><button class='k'>1</button><button class='k'>2</button></td><td><button class='d' aria-label='Delete'>x</button></td>";
        var td = tr.children; td[0].textContent = it.name; td[1].textContent = it.source; td[2].textContent = fmt(it.dur);
        var pb = td[3].firstChild; pb.textContent = i === self.playing ? "⏹ stop" : "▶ play";
        pb.onclick = function () { if (i === self.playing) { preview.stop(); self.playing = -1; } else { preview.play(it.src, it.vol * preview.vol); self.playing = i; } self.render(); };
        var vr = td[4].firstChild; vr.value = it.vol; vr.oninput = function () { it.vol = +vr.value; if (self.playing === i) { if (preview.g) preview.g.gain.value = it.vol * preview.vol; else preview.a.volume = Math.min(1, it.vol * preview.vol); } };
        td[5].children[0].onclick = function () { decks[0].load(it.src, it.name, it.key); };
        td[5].children[1].onclick = function () { decks[1].load(it.src, it.name, it.key); };
        td[6].firstChild.onclick = function () { if (self.playing === i) preview.stop(); self.items.splice(i, 1); self.playing = -1; self.render(); };
        tr.addEventListener("dragstart", function (e) { e.dataTransfer.setData("text/plain", JSON.stringify({ src: it.src, name: it.name, key: it.key })); });
        self.tb.appendChild(tr);
      });
    }
  };

  // ---------- Session bar ----------
  var session = {
    mr: null, chunks: [],
    init: function () {
      var self = this, setBtn = document.getElementById("setBtn");
      setBtn.onclick = function () {
        if (self.mr) { self.mr.stop(); return; }
        if (!window.MediaRecorder) { toast("Recording is not supported in this browser."); return; }
        if (!ROUTE) { toast("Recording the set only works on the online version of the site."); return; }
        audio(); self.chunks = []; self.mr = new MediaRecorder(recDest.stream);
        self.mr.ondataavailable = function (e) { if (e.data.size) self.chunks.push(e.data); };
        self.mr.onstop = function () {
          var type = self.mr.mimeType || "audio/webm", ext = type.indexOf("ogg") >= 0 ? "ogg" : (type.indexOf("mp4") >= 0 ? "m4a" : "webm");
          download(new Blob(self.chunks, { type: type }), "MyLiveMix." + ext); self.mr = null; setBtn.textContent = "RECORD SET"; setBtn.classList.remove("on");
        };
        self.mr.start(); setBtn.textContent = "STOP RECORDING"; setBtn.classList.add("on");
      };
      document.getElementById("exportBtn").onclick = function () { download(new Blob([lib.items.map(function (i) { return i.file; }).join("\n") + "\n"], { type: "audio/x-mpegurl" }), "MyPlaylist.m3u"); };
      document.getElementById("importFile").onchange = function (e) {
        var f = e.target.files[0]; if (!f) return;
        f.text().then(function (txt) {
          var added = 0;
          txt.split(/\r?\n/).forEach(function (line) {
            var base = line.trim().split(/[\\/]/).pop(); if (!base) return;
            var t = TRACKS.filter(function (x) { return x[0] + ".mp3" === base; })[0];
            if (t) { lib.items.push({ file: base, name: t[1], artist: "unknown", src: "tracks/" + base, key: t[0], dur: (peakCache["tracks/" + base] || {}).duration || 0 }); added++; }
          });
          lib.render(); toast(added ? added + " track(s) imported." : "No matching tracks found in this playlist.");
        });
        e.target.value = "";
      };
    }
  };
  function download(blob, name) { var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }

  // ---------- Boot ----------
  var decks = [].map.call(document.querySelectorAll(".deck"), function (el, i) { return new Deck(el, i + 1); });
  lib.init(); rec.init(); session.init(); rec.render();
  // restore last loaded tracks like the original's deck state, otherwise preload two tracks
  [0, 1].forEach(function (i) {
    var s = store("oto_deck_" + (i + 1));
    if (s && s.src) decks[i].load(s.src, s.name, s.key);
    else { var t = TRACKS[i]; decks[i].load("tracks/" + t[0] + ".mp3", t[1], t[0]); }
  });
  (function loop() { decks.forEach(function (d) { d.tick(); }); requestAnimationFrame(loop); })();
  document.addEventListener("pointerdown", function () { if (ctx && ctx.state === "suspended") ctx.resume(); });
})();
