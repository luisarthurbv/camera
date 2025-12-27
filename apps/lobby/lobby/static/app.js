function showView(viewName) {
  // Update nav
  document.querySelectorAll('nav a').forEach((a) => a.classList.remove('active'));
  const navItem = document.getElementById(`nav-${viewName}`);
  if (navItem) navItem.classList.add('active');

  // Update views
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(`view-${viewName}`).classList.add('active');

  if (viewName === 'deputados') {
    loadDeputados();
  }
}

async function search() {
  const query = document.getElementById('queryInput').value;
  if (!query) return;

  const resultsDiv = document.getElementById('search-results');
  const loader = document.getElementById('search-loader');

  resultsDiv.innerHTML = '';
  loader.style.display = 'block';

  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: query, n_results: 5 }),
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    loader.style.display = 'none';

    if (data.length === 0) {
      resultsDiv.innerHTML = '<p style="text-align: center">No results found.</p>';
      return;
    }

    data.forEach((result) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
                  <div class="card-header">
                      <span style="color: var(--accent); font-weight: 600;">${result.speech.metadata.speaker}</span>
                      <span>${result.speech.metadata.section}</span>
                  </div>
                  <p class="text">${result.speech.text}</p>
              `;
      resultsDiv.appendChild(card);
    });
  } catch (error) {
    loader.style.display = 'none';
    resultsDiv.innerHTML = `<p style="color: #ef4444; text-align: center">Error: ${error.message}</p>`;
  }
}

async function loadDeputados() {
  const resultsDiv = document.getElementById('deputados-results');
  const loader = document.getElementById('deputados-loader');

  resultsDiv.innerHTML = '';
  loader.style.display = 'block';

  try {
    const response = await fetch('/api/deputados?limit=50');
    if (!response.ok) throw new Error('Failed to fetch deputados');

    const data = await response.json();
    loader.style.display = 'none';

    if (data.deputados.length === 0) {
      resultsDiv.innerHTML = '<p style="text-align: center">No deputados found.</p>';
      return;
    }

    data.deputados.forEach((dep) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';
      card.onclick = () => loadDeputadoDetails(dep.id);

      const imgSrc = 'avatar.jpg';

      card.innerHTML = `
                  <div class="card-content">
                      <img src="${imgSrc}" class="card-img" onerror="this.style.display='none'">
                      <div style="flex: 1">
                          <div class="card-title">${dep.nome}</div>
                          <div class="text-small">${dep.nome_civil}</div>
                          <div class="text-small" style="margin-top: 0.5rem">
                              ${dep.uf_nascimento || 'N/A'} - ${dep.municipio_nascimento || ''}
                          </div>
                          ${
                            dep.website
                              ? `<a href="${dep.website}" target="_blank" class="text-small" style="color: var(--accent); text-decoration: none; display: block; margin-top: 0.5rem">Website</a>`
                              : ''
                          }
                      </div>
                  </div>
              `;
      resultsDiv.appendChild(card);
    });
  } catch (error) {
    loader.style.display = 'none';
    resultsDiv.innerHTML = `<p style="color: #ef4444; text-align: center">Error: ${error.message}</p>`;
  }
}

async function loadDeputadoDetails(id) {
  const detailView = document.getElementById('view-deputado-detail');
  const contentDiv = document.getElementById('deputado-detail-content');
  const loader = document.getElementById('deputado-detail-loader');

  showView('deputado-detail');
  contentDiv.innerHTML = '';
  loader.style.display = 'block';

  try {
    const response = await fetch(`/api/deputados/${id}`);
    if (!response.ok) throw new Error('Failed to fetch deputado details');

    const dep = await response.json();
    loader.style.display = 'none';

    const imgSrc = 'avatar.jpg';

    contentDiv.innerHTML = `
            <div class="card" style="max-width: 800px; margin: 0 auto;">
                <div class="detail-header">
                    <img src="${imgSrc}" class="detail-img" onerror="this.style.display='none'">
                    <div>
                        <h2 class="card-title" style="font-size: 2.5rem; margin-bottom: 0.5rem;">${dep.nome}</h2>
                        <div class="text-small" style="font-size: 1.1rem; opacity: 0.8;">${dep.nome_civil}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div>
                        <div class="text-small" style="font-weight: 600; color: var(--accent); margin-bottom: 0.25rem;">Birth Info</div>
                        <div>${dep.data_nascimento || 'N/A'}</div>
                        <div class="text-small">${dep.municipio_nascimento || ''} - ${dep.uf_nascimento || ''}</div>
                    </div>
                    <div>
                        <div class="text-small" style="font-weight: 600; color: var(--accent); margin-bottom: 0.25rem;">Profile</div>
                        <div>${dep.sexo === 'M' ? 'Male' : 'Female'}</div>
                        <div class="text-small">${dep.escolaridade || 'N/A'}</div>
                    </div>
                    ${
                      dep.website
                        ? `
                    <div>
                        <div class="text-small" style="font-weight: 600; color: var(--accent); margin-bottom: 0.25rem;">Online</div>
                        <a href="${dep.website}" target="_blank" style="color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent);">Official Website</a>
                    </div>`
                        : ''
                    }
                </div>
            </div>
        `;
  } catch (error) {
    loader.style.display = 'none';
    contentDiv.innerHTML = `<p style="color: #ef4444; text-align: center">Error: ${error.message}</p>`;
  }
}

// Global initialization if needed
document.addEventListener('DOMContentLoaded', () => {
  // Initial view is search
});
