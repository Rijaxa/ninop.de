let currentEra = '2020s';
let pageData = []; 

// Hamburger Menu Logic
function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

function setEra(era) {
    currentEra = era;
    document.body.className = `theme-${era}`;
    document.querySelectorAll('.era-controls button').forEach(btn => {
        btn.classList.remove('active-era');
        if(btn.innerText.includes(era.replace('s', ''))) btn.classList.add('active-era');
    });
    
    // Auto-close menu on mobile after picking an era
    document.getElementById('nav-menu').classList.remove('active');
    
    renderTimeline();
}

const SAMPLE = "ქართული ანბანის სამი სახეობის ცოცხალი კულტურა";
const SCRIPTS = {
    mkhedruli: { offset: 0, desc: "Mkhedruli: the standard modern script (Unicode 1.0, 1991)." },
    asomtavruli: { offset: 0x10A0 - 0x10D0, desc: "Asomtavruli: the ancient monumental script (5th century)." },
    nuskhuri: { offset: 0x2D00 - 0x10D0, desc: "Nuskhuri: the ecclesiastical script (9th century, Unicode 4.1)." },
    mtavruli: { offset: 0x1C90 - 0x10D0, desc: "Mtavruli: modern capital letters (Unicode 11.0, 2018)." }
};

function convertScript(text, offset) {
    return Array.from(text).map(ch => {
        const c = ch.codePointAt(0);
        return (c >= 0x10D0 && c <= 0x10F0) ? String.fromCodePoint(c + offset) : ch;
    }).join('');
}

function updateTypeLab() {
    const select = document.getElementById('script-select');
    const display = document.getElementById('sample-text');
    const desc = document.getElementById('script-desc');
    if(!select || !display) return;
    const s = SCRIPTS[select.value] || SCRIPTS.mkhedruli;
    display.innerText = convertScript(SAMPLE, s.offset);
    desc.innerText = s.desc;
}

function getPageType() {
    return document.body.dataset.page || 'isps';
}

function nextEra() {
    if (currentEra === '1990s') {
        return '2000s';
    }

    if (currentEra === '2000s') {
        return '2010s';
    }

    if (currentEra === '2010s') {
        return '2020s';
    }

    throw new Error("couldn't find the next era for:" + " " + currentEra);
}

function previousEra() {
    if (currentEra === '2000s') {
        return '1990s';
    }

    if (currentEra === '2010s') {
        return '2000s';
    }

    if (currentEra === '2020s') {
        return '2010s';
    }

    throw new Error("couldn't find the previous era for:" + " " + currentEra);
}

function renderTimeline() {
    const container = document.getElementById('dynamic-container');
    if (!container) return;
    
    const filteredData = pageData.filter(item => item.era === currentEra);
    container.innerHTML = '';
    const type = getPageType();

    if (currentEra !== '1990s') {
        container.innerHTML += `
        <div class='era-controls row-button-top'>
            <button class='era-controls' onclick="setEra('${previousEra()}')">Past</button>
        </div>`
    }

    filteredData.forEach((item, index) => {
        let content = '';

        if (type === 'isps') {
            const title = item.title || item.title_en || item.title_ka || 'ISP Record';
            content = `<h2>${title}</h2>${item.description ? `<p>${item.description}</p>` : ''}${item.connection_type ? `<small>Tech: ${item.connection_type}</small>` : ''}`;
        } 
        else if (type === 'forum') {
            const topic = item.topic || item.topic_en || item.topic_ka || 'Archived Thread';
            content = `<h2>${topic}</h2><p><strong>@${item.username || 'Anonymous'}</strong>: "${item.message_body || ''}"</p>${item.historical_context ? `<small>Context: ${item.historical_context}</small>` : ''}`;
        } 
        else if (type === 'infrastructure') {
            const title = item.title || item.project_name_en || item.project_name_ka || 'Infrastructure Project';
            content = `<h2>${title}</h2>${item.description ? `<p>${item.description}</p>` : ''}${item.impact ? `<p><strong>Impact:</strong> ${item.impact}</p>` : ''}${item.scope ? `<small>Scope: ${item.scope}</small>` : ''}`;
        } 
        else if (type === 'typography') {
            const title = item.title || 'Typography Phase';
            content = `<h2>${title}</h2>${item.description ? `<p>${item.description}</p>` : ''}${item.impact ? `<small>Result: ${item.impact}</small>` : ''}`;
        }

        const sideClass = index % 2 === 0 ? 'row-left' : 'row-right';
        
        container.innerHTML += `
            <div class="timeline-row ${sideClass}">
                <div class="timeline-dot" style="top: 35px;"></div>
                <div class="timeline-card">
                    <div class="badge">${item.year}</div>
                    ${content}
                </div>
            </div>`;
    });

    if (currentEra !== '2020s') {
        container.innerHTML += `
        <div class='era-controls row-button-top'>
            <button class='era-controls' onclick="setEra('${nextEra()}')">Future</button>
        </div>`
    }
}

function init() {
    const type = getPageType();
    // Static demo: data comes from data.js instead of the /api routes.
    pageData = (window.GIH_DATA[type] || []).slice().sort((a,b) => a.year - b.year);
    setEra('1990s');
    if (type === 'typography') updateTypeLab();
}
init();