const STATUS_LABEL = { have: "Есть", buy: "Купить", rent: "Прокат" };
const STATUS_ICON = { have: "✅", buy: "🛒", rent: "📦" };

let currentFilter = "all";
let gearData = null;

async function loadData() {
  const res = await fetch("data/gear.json", { cache: "no-store" });
  gearData = await res.json();
  render();
}

function computeStats() {
  const counts = { have: 0, buy: 0, rent: 0, total: 0 };
  gearData.zones.forEach((zone) =>
    zone.items.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
      counts.total += 1;
    })
  );
  return counts;
}

function renderStats() {
  const counts = computeStats();
  const statsEl = document.getElementById("stats");
  const pct = (n) => (counts.total ? (n / counts.total) * 100 : 0);
  statsEl.innerHTML = `
    <div class="stat-card have"><span class="num">${counts.have}</span><span class="label">Есть</span></div>
    <div class="stat-card buy"><span class="num">${counts.buy}</span><span class="label">Купить</span></div>
    <div class="stat-card rent"><span class="num">${counts.rent}</span><span class="label">Прокат</span></div>
    <div class="progress-wrap">
      <div class="seg have" style="width:${pct(counts.have)}%"></div>
      <div class="seg buy" style="width:${pct(counts.buy)}%"></div>
      <div class="seg rent" style="width:${pct(counts.rent)}%"></div>
    </div>
  `;
}

function cardHTML(item) {
  const photo = item.photo
    ? `<img src="images/${item.photo}" alt="${item.name}" loading="lazy">`
    : STATUS_ICON[item.status];
  return `
    <div class="card" data-status="${item.status}">
      <div class="card-photo" data-photo="${item.photo ? `images/${item.photo}` : ""}">${photo}</div>
      <div class="card-body">
        <span class="badge ${item.status}">${STATUS_LABEL[item.status]}</span>
        <div class="card-name">${item.name}</div>
        ${item.layer ? `<div class="card-layer">${item.layer}</div>` : ""}
        ${item.notes ? `<div class="card-notes">${item.notes}</div>` : ""}
      </div>
    </div>
  `;
}

function render() {
  document.getElementById("updated").textContent = `Обновлено: ${gearData.updated}`;
  renderStats();

  const zonesEl = document.getElementById("zones");
  zonesEl.innerHTML = gearData.zones
    .map(
      (zone) => `
      <section class="zone">
        <h2 class="zone-title">${zone.title}</h2>
        <div class="zone-grid">
          ${zone.items.map(cardHTML).join("")}
        </div>
      </section>
    `
    )
    .join("");

  applyFilter();
  attachPhotoHandlers();
}

function applyFilter() {
  document.querySelectorAll(".card").forEach((card) => {
    const match = currentFilter === "all" || card.dataset.status === currentFilter;
    card.classList.toggle("hidden", !match);
  });
  document.querySelectorAll(".zone").forEach((zone) => {
    const visible = zone.querySelectorAll(".card:not(.hidden)").length > 0;
    zone.style.display = visible ? "" : "none";
  });
}

function attachPhotoHandlers() {
  document.querySelectorAll(".card-photo[data-photo]").forEach((el) => {
    const src = el.dataset.photo;
    if (!src) return;
    el.style.cursor = "zoom-in";
    el.addEventListener("click", () => {
      document.getElementById("lightbox-img").src = src;
      document.getElementById("lightbox").classList.add("open");
    });
  });
}

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  applyFilter();
});

document.getElementById("lightbox").addEventListener("click", () => {
  document.getElementById("lightbox").classList.remove("open");
});

loadData();
