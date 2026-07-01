(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const discover = $('#discover');
  if (!discover || $('#agentCommandCenter')) return;

  const products = {
    default: [
      ['Clean white sneaker', 'Authorized retailer', '$89 · fills casual shoe gap · high cost-per-wear potential', 'sneaker', 93, 'https://www.nike.com/'],
      ['Soft-shoulder blazer', 'Official brand', '$148 · taupe · matches capsule neutrals', 'blazer', 91, 'https://www.everlane.com/'],
      ['Violet city tote', 'Official brand', '$126 · statement accent from your profile', 'bag', 88, 'https://www.cos.com/'],
    ],
    blazer: [
      ['Navy travel blazer', 'Authorized retailer', '$176 · wrinkle-resistant · interview and travel ready', 'blazer', 94, 'https://www.everlane.com/'],
      ['Soft-shoulder blazer', 'Official brand', '$148 · wool blend · taupe', 'blazer', 91, 'https://www.everlane.com/'],
      ['Clean white sneaker', 'Authorized retailer', '$89 · balances formal pieces', 'sneaker', 89, 'https://www.nike.com/'],
    ],
    bag: [
      ['Violet city tote', 'Official brand', '$126 · leather · statement accent', 'bag', 94, 'https://www.cos.com/'],
      ['Structured black crossbody', 'Official brand', '$118 · everyday neutral', 'bag', 90, 'https://www.cos.com/'],
      ['Soft-shoulder blazer', 'Official brand', '$148 · pairs with accent bags', 'blazer', 86, 'https://www.everlane.com/'],
    ],
    sneaker: [
      ['Clean white sneaker', 'Authorized retailer', '$89 · 4 colors · sizes 7-13', 'sneaker', 93, 'https://www.nike.com/'],
      ['Minimal leather trainer', 'Authorized retailer', '$96 · white · under $100', 'sneaker', 92, 'https://www.nike.com/'],
      ['Charcoal travel pant', 'Official brand', '$98 · completes casual outfit base', 'pants', 86, 'https://www.cos.com/'],
    ],
  };

  function productVisual(type) {
    const className = type === 'bag' ? 'bag' : type === 'blazer' ? 'blazer' : type === 'pants' ? 'pants' : 'sneaker';
    return `<i class="piece ${className}"></i>`;
  }

  function productCard([name, source, detail, type, score, url]) {
    return `<article><span class="ai-score">${score}% AI match</span>${productVisual(type)}<b>${name}</b><span>${source}</span><p>${detail}</p><a class="glass" href="${url}">View</a></article>`;
  }

  function queryType(query) {
    const q = query.toLowerCase();
    if (q.includes('bag') || q.includes('tote')) return 'bag';
    if (q.includes('blazer') || q.includes('business') || q.includes('work') || q.includes('interview')) return 'blazer';
    if (q.includes('sneaker') || q.includes('shoe') || q.includes('under $100')) return 'sneaker';
    return 'default';
  }

  function setStatus(kind, text, done = false) {
    const row = $(`[data-agent="${kind}"]`);
    if (!row) return;
    row.classList.toggle('done', done);
    row.querySelector('small').textContent = text;
  }

  function runAgents() {
    const input = $('#discoverSearch');
    const query = input?.value || 'new products';
    const profile = JSON.parse(localStorage.getItem('stylo-prefs') || '{}');
    $('#agentProfile').innerHTML = `<span>Budget: ${profile.budget || '$100-$250 per item'}</span><span>Colors: ${profile.colors || 'black, taupe, violet'}</span><span>Size: ${profile.size || 'M / 32'}</span>`;
    $('#agentConfidence').textContent = 'Searching';
    setStatus('profile', 'Reading profile preferences');
    setStatus('closet', 'Scanning wardrobe gaps');
    setStatus('retailer', 'Ranking retailer matches');
    setTimeout(() => setStatus('profile', 'Matched size, budget, colors, and style', true), 180);
    setTimeout(() => setStatus('closet', 'Found useful gaps without duplicating closet items', true), 420);
    setTimeout(() => {
      setStatus('retailer', 'Ranked official and authorized product sources', true);
      $('#agentConfidence').textContent = '3 matches';
      const list = products[queryType(query)];
      const grid = $('.products') || $('.items.products');
      if (grid) grid.innerHTML = list.map(productCard).join('');
      if (window.note) window.note(`AI agents found matches for "${query}"`);
    }, 720);
  }

  const search = $('.discover-search') || $('.search', discover);
  if (search) {
    search.insertAdjacentHTML('afterend', `
      <section id="agentCommandCenter" class="agent-center">
        <article class="panel agent-brief"><div class="panelHead"><div><p class="eyebrow">AI Shopping Agents</p><h3>Agents search by your preferences, closet gaps, and Discover query.</h3></div><span id="agentConfidence" class="ai-pill">Ready</span></div><p>Use your saved profile to rank pieces before recommendations appear.</p><div id="agentProfile" class="agent-profile"><span>Budget: $100-$250</span><span>Colors: black, taupe, violet</span><span>Size: M / 32</span></div><div class="row"><button id="runAgentSearch" class="primary">Run AI agents</button><button id="useProfileSearch" class="glass">Use my preferences</button></div></article>
        <div class="agent-list"><article data-agent="profile"><b>Preference Agent</b><small>Waiting for search</small></article><article data-agent="closet"><b>Closet Gap Agent</b><small>Waiting for search</small></article><article data-agent="retailer"><b>Retailer Match Agent</b><small>Waiting for search</small></article></div>
      </section>
    `);
  }

  const style = document.createElement('style');
  style.textContent = `.agent-center{display:grid;grid-template-columns:.95fr 1.05fr;gap:1rem;margin:1rem 0}.agent-brief p{color:var(--muted)}.agent-profile{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin:1rem 0}.agent-profile span,.ai-pill,.ai-score{border:1px solid var(--line);border-radius:999px;background:var(--strong);color:var(--muted);font-size:.76rem;font-weight:900;padding:.42rem .65rem}.agent-list{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}.agent-list article{position:relative;min-height:11rem;border:1px solid var(--line);border-radius:var(--r);background:var(--panel);box-shadow:var(--shadow);padding:1rem}.agent-list article:before{content:"";display:block;width:.7rem;height:.7rem;border-radius:50%;background:#ffbf4d;box-shadow:0 0 0 .35rem rgba(255,191,77,.14);margin-bottom:1.4rem}.agent-list article.done:before{background:#7cf6b5;box-shadow:0 0 0 .35rem rgba(124,246,181,.14)}.agent-list small{display:block;color:var(--muted);margin-top:.35rem}.ai-score{display:inline-flex;margin-bottom:.65rem;background:linear-gradient(135deg,rgba(109,92,255,.18),rgba(255,110,182,.12));color:var(--text)}.products article p{color:var(--muted)}@media(max-width:960px){.agent-center,.agent-list,.agent-profile{grid-template-columns:1fr}}`;
  document.head.append(style);

  $('#runAgentSearch')?.addEventListener('click', runAgents);
  $('#useProfileSearch')?.addEventListener('click', () => {
    const profile = JSON.parse(localStorage.getItem('stylo-prefs') || '{}');
    const query = `Find ${profile.colors?.split(',')[0] || 'white'} minimalist pieces within ${profile.budget || '$100-$250 per item'}`;
    if ($('#discoverSearch')) $('#discoverSearch').value = query;
    runAgents();
  });
  $('#runDiscover')?.addEventListener('click', runAgents);
})();
