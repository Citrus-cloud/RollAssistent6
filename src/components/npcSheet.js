// ============================================================
// npcSheet.js — Карточка NPC (детальный просмотр)
// ============================================================

import { t } from "../utils/lang.js";
import { getModifier, getModifierStr, getDropdownValue, deleteNPC, duplicateNPC, getNPCById } from "./npc.js";

let onBackCallback = null;
let onEditCallback = null;
let onDeleteCallback = null;

/**
 * Отрисовать карточку NPC
 * @param {HTMLElement} container
 * @param {object} options - { npcId, onBack, onEdit, onDelete }
 */
export function renderNPCSheet(container, options = {}) {
  const { npcId, onBack, onEdit, onDelete } = options;
  onBackCallback = onBack;
  onEditCallback = onEdit;
  onDeleteCallback = onDelete;

  const npc = getNPCById(npcId);
  if (!npc) {
    container.innerHTML = `<p>NPC not found</p>`;
    return;
  }

  container.innerHTML = buildSheetHTML(npc);
  attachSheetEvents(container, npc);
}

function buildSheetHTML(npc) {
  const stats = npc.stats || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

  return `
    <div class="npc-sheet">
      <!-- Header -->
      <div class="npc-sheet-header">
        <button class="btn btn-secondary btn-back">${t("back")}</button>
        <div class="npc-sheet-title">
          <h1>${escapeHtml(npc.name)}</h1>
          <div class="npc-sheet-subtitle">
            <span class="badge badge-type">${getDropdownValue(npc.type)}</span>
            <span class="badge badge-prof">${getDropdownValue(npc.profession)}</span>
            <span class="badge badge-align">${getDropdownValue(npc.alignment)}</span>
          </div>
        </div>
        <div class="npc-sheet-actions">
          <button class="btn btn-primary btn-edit-npc">${t("edit")}</button>
          <button class="btn btn-secondary btn-duplicate-npc">${t("duplicate")}</button>
          <button class="btn btn-danger btn-delete-npc">${t("delete")}</button>
        </div>
      </div>

      <!-- Основные параметры -->
      <div class="npc-sheet-combat">
        <div class="combat-stat">
          <span class="combat-label">CR</span>
          <span class="combat-value">${npc.cr}</span>
        </div>
        <div class="combat-stat">
          <span class="combat-label">HP</span>
          <span class="combat-value">${npc.hp}</span>
        </div>
        <div class="combat-stat">
          <span class="combat-label">AC</span>
          <span class="combat-value">${npc.ac}</span>
        </div>
        <div class="combat-stat">
          <span class="combat-label">${t("npc_speed")}</span>
          <span class="combat-value combat-value-sm">${escapeHtml(npc.speed)}</span>
        </div>
      </div>

      <!-- Характеристики -->
      <div class="npc-sheet-section">
        <h3>${t("npc_stats")}</h3>
        <div class="stats-grid stats-display">
          ${buildStatsDisplay(stats)}
        </div>
      </div>

      <!-- Спасброски -->
      <div class="npc-sheet-section">
        <h3>${t("saving_throw")}</h3>
        <div class="stats-grid stats-display">
          ${buildSavingThrows(stats)}
        </div>
      </div>

      <!-- Оружие и атаки -->
      ${npc.weapons && npc.weapons.length > 0 ? `
      <div class="npc-sheet-section">
        <h3>${t("npc_weapons")}</h3>
        <div class="npc-list-items">
          ${npc.weapons.map(w => `
            <div class="npc-item-card">
              <strong>${escapeHtml(w.name)}</strong>
              ${w.damage ? `<span class="item-detail">${escapeHtml(w.damage)}</span>` : ""}
              ${w.type ? `<span class="item-tag">${escapeHtml(w.type)}</span>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!-- Особые способности -->
      ${npc.abilities && npc.abilities.length > 0 ? `
      <div class="npc-sheet-section">
        <h3>${t("npc_abilities")}</h3>
        <div class="npc-list-items">
          ${npc.abilities.map(a => `
            <div class="npc-item-card">
              <strong>${escapeHtml(a.name)}</strong>
              ${a.description ? `<p class="item-description">${escapeHtml(a.description)}</p>` : ""}
            </div>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!-- Снаряжение -->
      ${npc.equipment && npc.equipment.length > 0 ? `
      <div class="npc-sheet-section">
        <h3>${t("npc_equipment")}</h3>
        <div class="npc-list-items">
          ${npc.equipment.map(e => `
            <div class="npc-item-card">
              <span>${escapeHtml(e.name)}</span>
            </div>
          `).join("")}
        </div>
      </div>
      ` : ""}

      <!-- Внешний вид -->
      ${npc.appearance ? `
      <div class="npc-sheet-section">
        <h3>${t("npc_appearance")}</h3>
        <p class="npc-text-block">${escapeHtml(npc.appearance)}</p>
      </div>
      ` : ""}

      <!-- Заметки -->
      ${npc.notes ? `
      <div class="npc-sheet-section">
        <h3>${t("npc_notes")}</h3>
        <p class="npc-text-block">${escapeHtml(npc.notes)}</p>
      </div>
      ` : ""}

      <!-- PDF Export -->
      <div class="npc-sheet-footer">
        <button class="btn btn-secondary btn-export-pdf">${t("export_pdf")}</button>
      </div>
    </div>
  `;
}

function buildStatsDisplay(stats) {
  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
  return statKeys.map(key => `
    <div class="stat-display">
      <span class="stat-label">${t("stat_" + key)}</span>
      <span class="stat-value">${stats[key]}</span>
      <span class="stat-mod">${getModifierStr(stats[key])}</span>
    </div>
  `).join("");
}

function buildSavingThrows(stats) {
  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
  return statKeys.map(key => `
    <div class="stat-display">
      <span class="stat-label">${t("stat_" + key)}</span>
      <span class="stat-mod">${getModifierStr(stats[key])}</span>
    </div>
  `).join("");
}

// ─── События ───
function attachSheetEvents(container, npc) {
  container.querySelector(".btn-back").addEventListener("click", () => {
    if (onBackCallback) onBackCallback();
  });

  container.querySelector(".btn-edit-npc").addEventListener("click", () => {
    if (onEditCallback) onEditCallback(npc.id);
  });

  container.querySelector(".btn-duplicate-npc").addEventListener("click", () => {
    const dup = duplicateNPC(npc.id);
    if (dup && onBackCallback) onBackCallback();
  });

  container.querySelector(".btn-delete-npc").addEventListener("click", () => {
    if (confirm(t("delete_npc_confirm"))) {
      deleteNPC(npc.id);
      if (onDeleteCallback) onDeleteCallback();
    }
  });

  container.querySelector(".btn-export-pdf").addEventListener("click", () => {
    exportNPCToPDF(npc);
  });
}

// ─── PDF Export (простая реализация через print) ───
function exportNPCToPDF(npc) {
  const printWindow = window.open("", "_blank");
  const stats = npc.stats || {};
  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${npc.name} - NPC Card</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1 { color: #8b0000; border-bottom: 2px solid #8b0000; padding-bottom: 5px; }
        .stats-row { display: flex; gap: 20px; margin: 10px 0; }
        .stat-box { text-align: center; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; }
        .stat-box label { display: block; font-size: 11px; color: #666; }
        .stat-box .val { font-size: 18px; font-weight: bold; }
        .stat-box .mod { font-size: 12px; color: #444; }
        .section { margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 4px; }
        .section h3 { margin: 0 0 8px; color: #333; }
        .badges { margin: 5px 0; }
        .badge { display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 3px; font-size: 12px; background: #eee; }
        .combat-row { display: flex; gap: 30px; margin: 15px 0; font-size: 16px; }
        .combat-item label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>${escapeHtml(npc.name)}</h1>
      <div class="badges">
        <span class="badge">${getDropdownValue(npc.type)}</span>
        <span class="badge">${getDropdownValue(npc.profession)}</span>
        <span class="badge">${getDropdownValue(npc.alignment)}</span>
      </div>
      <div class="combat-row">
        <div class="combat-item"><label>CR:</label> ${npc.cr}</div>
        <div class="combat-item"><label>HP:</label> ${npc.hp}</div>
        <div class="combat-item"><label>AC:</label> ${npc.ac}</div>
        <div class="combat-item"><label>Speed:</label> ${escapeHtml(npc.speed)}</div>
      </div>
      <div class="stats-row">
        ${statKeys.map(k => `
          <div class="stat-box">
            <label>${k.toUpperCase()}</label>
            <div class="val">${stats[k] || 10}</div>
            <div class="mod">${getModifierStr(stats[k] || 10)}</div>
          </div>
        `).join("")}
      </div>
      ${npc.weapons && npc.weapons.length ? `
        <div class="section"><h3>Weapons & Attacks</h3>
          ${npc.weapons.map(w => `<p><strong>${escapeHtml(w.name)}</strong> — ${escapeHtml(w.damage || "")} (${escapeHtml(w.type || "")})</p>`).join("")}
        </div>` : ""}
      ${npc.abilities && npc.abilities.length ? `
        <div class="section"><h3>Special Abilities</h3>
          ${npc.abilities.map(a => `<p><strong>${escapeHtml(a.name)}:</strong> ${escapeHtml(a.description || "")}</p>`).join("")}
        </div>` : ""}
      ${npc.equipment && npc.equipment.length ? `
        <div class="section"><h3>Equipment</h3>
          <p>${npc.equipment.map(e => escapeHtml(e.name)).join(", ")}</p>
        </div>` : ""}
      ${npc.appearance ? `<div class="section"><h3>Appearance</h3><p>${escapeHtml(npc.appearance)}</p></div>` : ""}
      ${npc.notes ? `<div class="section"><h3>Notes</h3><p>${escapeHtml(npc.notes)}</p></div>` : ""}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
