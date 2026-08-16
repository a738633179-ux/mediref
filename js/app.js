(() => {
  "use strict";

  const DATA_URL = "data/diseases.json";
  let diseases = [];
  let activeCategory = "全部";
  let searchQuery = "";

  const $ = (sel) => document.querySelector(sel);
  const homeView = $("#home-view");
  const detailView = $("#detail-view");

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function categories() {
    const set = new Set(diseases.map((d) => d.category));
    return ["全部", ...Array.from(set).sort()];
  }

  function filteredDiseases() {
    const q = searchQuery.trim().toLowerCase();
    return diseases.filter((d) => {
      if (activeCategory !== "全部" && d.category !== activeCategory) return false;
      if (!q) return true;
      const haystack = [d.name, ...(d.aliases || []), d.overview, ...d.symptoms]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  function renderCategoryBar() {
    const bar = $("#category-bar");
    bar.innerHTML = categories()
      .map((c) => `<button class="chip ${c === activeCategory ? "active" : ""}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
      .join("");
    bar.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeCategory = chip.dataset.category;
        renderHome();
      });
    });
  }

  function renderGrid() {
    const list = filteredDiseases();
    const grid = $("#disease-grid");
    const empty = $("#empty-state");

    if (list.length === 0) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    grid.innerHTML = list
      .map(
        (d) => `
        <article class="disease-card" data-id="${escapeHtml(d.id)}">
          <div class="card-top">
            <h2>${escapeHtml(d.name)}</h2>
            <span class="badge">${escapeHtml(d.category)}</span>
          </div>
          <p class="card-overview">${escapeHtml(d.overview)}</p>
        </article>`
      )
      .join("");
    grid.querySelectorAll(".disease-card").forEach((card) => {
      card.addEventListener("click", () => {
        location.hash = `#/disease/${encodeURIComponent(card.dataset.id)}`;
      });
    });
  }

  function renderHome() {
    detailView.classList.add("hidden");
    homeView.classList.remove("hidden");
    renderCategoryBar();
    renderGrid();
  }

  function renderDetail(id) {
    const d = diseases.find((item) => item.id === id);
    if (!d) {
      location.hash = "#/";
      return;
    }
    homeView.classList.add("hidden");
    detailView.classList.remove("hidden");

    const section = (title, items) => `
      <section class="detail-section">
        <h2>${escapeHtml(title)}</h2>
        <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>`;

    $("#detail-content").innerHTML = `
      <div class="detail-header">
        <h1>${escapeHtml(d.name)}</h1>
        <span class="badge">${escapeHtml(d.category)}</span>
        ${d.aliases && d.aliases.length ? `<p style="color:var(--text-light);font-size:14px;margin:8px 0 0;">别名：${d.aliases.map(escapeHtml).join("、")}</p>` : ""}
      </div>
      ${section("疾病概述", [d.overview])}
      ${section("常见症状", d.symptoms)}
      ${section("检查方法", d.examinations)}
      ${section("治疗方法", d.treatments)}
      ${section("预防建议", d.prevention)}
      <div class="disclaimer-box">${escapeHtml(d.note || "以上内容仅作科普参考，不能替代执业医师的诊断与治疗。")}</div>`;

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function route() {
    const hash = location.hash || "#/";
    const match = hash.match(/^#\/disease\/(.+)$/);
    if (match) {
      renderDetail(decodeURIComponent(match[1]));
    } else {
      renderHome();
    }
  }

  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      diseases = await res.json();
    } catch (err) {
      $("#disease-grid").innerHTML =
        `<div class="empty-state"><p>数据加载失败（${escapeHtml(String(err))}）。请确认 data/diseases.json 存在，或稍后重试。</p></div>`;
      return;
    }

    $("#search-input").addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderGrid();
    });
    $("#back-button").addEventListener("click", () => {
      location.hash = "#/";
    });
    window.addEventListener("hashchange", route);
    route();
  }

  init();
})();
