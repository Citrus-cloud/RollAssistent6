// ============================================================
// npcList.js — Экран списка NPC (Бестиарий)
// ============================================================

import { t } from "../utils/lang.js";
import {
  getAllNPCs, deleteNPC, duplicateNPC, generateQuickStart,
  getDropdownValue, getTypeOptions, getProfessionOptions
} from "./npc.js";
import { saveAllNPCs } from "../utils/npcStorage.js";

let onCreateCallback = null;
let onViewCallback = null;
let onEditCallback = null;
let currentFilters = { name: "", type: "", profession: "", cr: "" };

/**
 * Отрисовать список NPC
 * @param {HTMLElement} container
 * @param {object} options - { onCreate, onView, onEdit, onBack }
 */
export function renderNPCList(container, options = {}) {
  const { onCreate, onView, onEdit, onBack } = options;
  onCreateCallback = onCreate;
  onViewCallback = onView;
  onEditCallback = onEdit;

  container.innerHTML = buildListHTML();
  attachListEvents(container, options);
}

function buildListHTML() {
  const npcs = getFilteredNPCs();

  return `
    <div class="npc-list-container">
      <!-- Header -->
      <div class="npc-list-header">
        <h2>👹 ${t("bestiary_title")}</h2>
        <div class="npc-list-header-actions">
          <button class="btn btn-primary" id="createNpcBtn">${t("create_npc")}</button>
          <button class="btn btn-secondary" id="quickStartBtn">${t("npc_quick_start")}</button>
        </div>
      </div>

      <!-- Фильтры -->
      <div class="npc-filters">
        <input type="text" id="filterName" class="form-input" 
               placeholder="${t("filter_by_name")}" value="${escapeHtml(currentFilters.name)}" />
        <select id="filterType" class="form-select">
          <option value="">${t("filter_all_types")}</option>
          ${getTypeOptions().map(o => `<option value="${escapeHtml(o.value)}" ${currentFilters.type === o.value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join("")}
        </select>
        <select id="filterProfession" class="form-select">
          <option value="">${t("filter_all_professions")}</option>
          ${getProfessionOptions().map(o => `<option value="${escapeHtml(o.value)}" ${currentFilters.profession === o.value ? 'selected' : ''}>${escapeHtml(o.label)}</option>`).join("")}
        </select>
        <select id="filterCR" class="form-select">
          <option value="">${t("filter_all_cr")}</option>
          ${getCROptions().map(cr => `<option value="${cr}" ${currentFilters.cr === String(cr) ? 'selected' : ''}>CR ${cr}</option>`).join("")}
        </select>
      </div>

      <!-- Список NPC -->
      <div class="npc-grid" id="npcGrid">
        ${npcs.length === 0 ? `
          <div class="npc-empty">
            <p>${t("npc_no_items")}</p>
          </div>
        ` : npcs.map(npc => buildNPCCard(npc)).join("")}
      </div>
    </div>
  `;
}

function buildNPCCard(npc) {
  return `
    <div class="npc-card" data-id="${npc.id}">
      <div class="npc-card-header">
        <h3 class="npc-card-name">${escapeHtml(npc.name)}</h3>
        ${npc.isActive ? '<span class="npc-active-badge">★</span>' : ''}
      </div>
      <div class="npc-card-info">
        <span class="badge badge-type">${getDropdownValue(npc.type)}</span>
        <span class="badge badge-prof">${getDropdownValue(npc.profession)}</span>
      </div>
      <div class="npc-card-stats">
        <span class="npc-stat"><strong>CR</strong> ${npc.cr}</span>
        <span class="npc-stat"><strong>HP</strong> ${npc.hp}</span>
        <span class="npc-stat"><strong>AC</strong> ${npc.ac}</span>
      </div>
      <div class="npc-card-actions">
        <button class="btn btn-sm btn-primary btn-view-npc" data-id="${npc.id}" title="${t("edit")}">${t("edit")}</button>
        <button class="btn btn-sm btn-secondary btn-dup-npc" data-id="${npc.id}" title="${t("duplicate")}">📋</button>
        <button class="btn btn-sm btn-secondary btn-active-npc" data-id="${npc.id}" title="${t("npc_select_main")}">★</button>
        <button class="btn btn-sm btn-danger btn-del-npc" data-id="${npc.id}" title="${t("delete")}">✕</button>
      </div>
    </div>
  `;
}

function getFilteredNPCs() {
  let npcs = getAllNPCs();

  if (currentFilters.name) {
    const q = currentFilters.name.toLowerCase();
    npcs = npcs.filter(n => n.name.toLowerCase().includes(q));
  }
  if (currentFilters.type) {
    npcs = npcs.filter(n => n.type === currentFilters.type);
  }
  if (currentFilters.profession) {
    npcs = npcs.filter(n => n.profession === currentFilters.profession);
  }
  if (currentFilters.cr !== "") {
    npcs = npcs.filter(n => String(n.cr) === currentFilters.cr);
  }

  return npcs;
}

function getCROptions() {
  return [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
}

// ─── События ───
function attachListEvents(container, options) {
  // Создать NPC
  container.querySelector("#createNpcBtn").addEventListener("click", () => {
    if (onCreateCallback) onCreateCallback();
  });

  // Быстрый старт
  container.querySelector("#quickStartBtn").addEventListener("click", () => {
    generateQuickStart();
    renderNPCList(container, options);
  });

  // Фильтры
  container.querySelector("#filterName").addEventListener("input", (e) => {
    currentFilters.name = e.target.value;
    refreshGrid(container, options);
  });
  container.querySelector("#filterType").addEventListener("change", (e) => {
    currentFilters.type = e.target.value;
    refreshGrid(container, options);
  });
  container.querySelector("#filterProfession").addEventListener("change", (e) => {
    currentFilters.profession = e.target.value;
    refreshGrid(container, options);
  });
  container.querySelector("#filterCR").addEventListener("change", (e) => {
    currentFilters.cr = e.target.value;
    refreshGrid(container, options);
  });

  // Клик по карточке (открыть просмотр)
  container.querySelectorAll(".npc-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Не открывать при клике на кнопки
      if (e.target.closest("button")) return;
      if (onViewCallback) onViewCallback(card.dataset.id);
    });
  });

  // Кнопка просмотра/редактирования
  container.querySelectorAll(".btn-view-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onEditCallback) onEditCallback(btn.dataset.id);
    });
  });

  // Дублировать
  container.querySelectorAll(".btn-dup-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      duplicateNPC(btn.dataset.id);
      renderNPCList(container, options);
    });
  });

  // Выбрать основного
  container.querySelectorAll(".btn-active-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveNPC(btn.dataset.id);
      renderNPCList(container, options);
    });
  });

  // Удалить
  container.querySelectorAll(".btn-del-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(t("delete_npc_confirm"))) {
        deleteNPC(btn.dataset.id);
        renderNPCList(container, options);
      }
    });
  });
}

function refreshGrid(container, options) {
  const grid = container.querySelector("#npcGrid");
  const npcs = getFilteredNPCs();
  if (npcs.length === 0) {
    grid.innerHTML = `<div class="npc-empty"><p>${t("npc_no_items")}</p></div>`;
  } else {
    grid.innerHTML = npcs.map(npc => buildNPCCard(npc)).join("");
  }
  // Re-attach card events
  attachCardEvents(container, options);
}

function attachCardEvents(container, options) {
  container.querySelectorAll(".npc-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      if (onViewCallback) onViewCallback(card.dataset.id);
    });
  });

  container.querySelectorAll(".btn-view-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (onEditCallback) onEditCallback(btn.dataset.id);
    });
  });

  container.querySelectorAll(".btn-dup-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      duplicateNPC(btn.dataset.id);
      renderNPCList(container, options);
    });
  });

  container.querySelectorAll(".btn-active-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveNPC(btn.dataset.id);
      renderNPCList(container, options);
    });
  });

  container.querySelectorAll(".btn-del-npc").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(t("delete_npc_confirm"))) {
        deleteNPC(btn.dataset.id);
        renderNPCList(container, options);
      }
    });
  });
}

function setActiveNPC(id) {
  const npcs = getAllNPCs();
  npcs.forEach(npc => {
    npc.isActive = (npc.id === id);
  });
  saveAllNPCs(npcs);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
