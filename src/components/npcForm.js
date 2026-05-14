// ============================================================
// npcForm.js — Форма создания / редактирования NPC
// ============================================================

import { t, getLanguage } from "../utils/lang.js";
import {
  getModifierStr, getTypeOptions, getAlignmentOptions, getProfessionOptions,
  createNPC, updateNPC, getNPCById, createEmptyNPC, getDropdownValue,
  addCustomType, addCustomAlignment, addCustomProfession
} from "./npc.js";

let currentNPC = null;
let isEditMode = false;
let onSaveCallback = null;
let onCancelCallback = null;

/**
 * Отрисовать форму NPC
 * @param {HTMLElement} container 
 * @param {object} options - { npcId, onSave, onCancel }
 */
export function renderNPCForm(container, options = {}) {
  const { npcId, onSave, onCancel } = options;
  onSaveCallback = onSave;
  onCancelCallback = onCancel;

  if (npcId) {
    isEditMode = true;
    currentNPC = { ...getNPCById(npcId) };
  } else {
    isEditMode = false;
    currentNPC = createEmptyNPC();
  }

  container.innerHTML = buildFormHTML();
  attachFormEvents(container);
}

function buildFormHTML() {
  const npc = currentNPC;
  const title = isEditMode ? t("edit_npc") : t("create_npc");

  return `
    <div class="npc-form-container">
      <div class="npc-form-header">
        <h2>${title}</h2>
        <button class="btn btn-secondary npc-form-cancel">${t("cancel")}</button>
      </div>

      <form class="npc-form" id="npcForm">
        <!-- Основная информация -->
        <div class="form-section">
          <h3>${t("npc_name")}</h3>
          <input type="text" id="npc_name" class="form-input" value="${escapeHtml(npc.name)}" 
                 placeholder="${t("npc_name")}" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>${t("npc_type")}</label>
            <div class="dropdown-with-custom">
              <select id="npc_type" class="form-select">
                ${buildOptions(getTypeOptions(), npc.type)}
              </select>
              <button type="button" class="btn btn-sm btn-add-custom" data-field="type">${t("custom_add")}</button>
            </div>
          </div>

          <div class="form-group">
            <label>${t("npc_alignment")}</label>
            <div class="dropdown-with-custom">
              <select id="npc_alignment" class="form-select">
                ${buildOptions(getAlignmentOptions(), npc.alignment)}
              </select>
              <button type="button" class="btn btn-sm btn-add-custom" data-field="alignment">${t("custom_add")}</button>
            </div>
          </div>

          <div class="form-group">
            <label>${t("npc_profession")}</label>
            <div class="dropdown-with-custom">
              <select id="npc_profession" class="form-select">
                ${buildOptions(getProfessionOptions(), npc.profession)}
              </select>
              <button type="button" class="btn btn-sm btn-add-custom" data-field="profession">${t("custom_add")}</button>
            </div>
          </div>
        </div>

        <!-- Боевые характеристики -->
        <div class="form-row">
          <div class="form-group">
            <label>${t("npc_cr")}</label>
            <input type="number" id="npc_cr" class="form-input" value="${npc.cr}" min="0" max="30" step="0.25" />
          </div>
          <div class="form-group">
            <label>${t("npc_hp")}</label>
            <input type="number" id="npc_hp" class="form-input" value="${npc.hp}" min="1" />
          </div>
          <div class="form-group">
            <label>${t("npc_ac")}</label>
            <input type="number" id="npc_ac" class="form-input" value="${npc.ac}" min="1" />
          </div>
          <div class="form-group">
            <label>${t("npc_speed")}</label>
            <input type="text" id="npc_speed" class="form-input" value="${escapeHtml(npc.speed)}" />
          </div>
        </div>

        <!-- Характеристики -->
        <div class="form-section">
          <h3>${t("npc_stats")}</h3>
          <div class="stats-grid">
            ${buildStatsInputs(npc.stats)}
          </div>
        </div>

        <!-- Оружие и атаки -->
        <div class="form-section">
          <h3>${t("npc_weapons")}</h3>
          <div id="weapons-list">
            ${buildWeaponsList(npc.weapons)}
          </div>
          <button type="button" class="btn btn-sm btn-add" id="addWeaponBtn">${t("npc_add_weapon")}</button>
        </div>

        <!-- Особые способности -->
        <div class="form-section">
          <h3>${t("npc_abilities")}</h3>
          <div id="abilities-list">
            ${buildAbilitiesList(npc.abilities)}
          </div>
          <button type="button" class="btn btn-sm btn-add" id="addAbilityBtn">${t("npc_add_ability")}</button>
        </div>

        <!-- Снаряжение -->
        <div class="form-section">
          <h3>${t("npc_equipment")}</h3>
          <div id="equipment-list">
            ${buildEquipmentList(npc.equipment)}
          </div>
          <button type="button" class="btn btn-sm btn-add" id="addEquipmentBtn">${t("npc_add_equipment")}</button>
        </div>

        <!-- Внешний вид -->
        <div class="form-section">
          <h3>${t("npc_appearance")}</h3>
          <textarea id="npc_appearance" class="form-textarea" rows="3" placeholder="${t("npc_appearance")}">${escapeHtml(npc.appearance)}</textarea>
        </div>

        <!-- Заметки -->
        <div class="form-section">
          <h3>${t("npc_notes")}</h3>
          <textarea id="npc_notes" class="form-textarea" rows="3" placeholder="${t("npc_notes")}">${escapeHtml(npc.notes)}</textarea>
        </div>

        <!-- Кнопки -->
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">${t("save")}</button>
          <button type="button" class="btn btn-secondary npc-form-cancel">${t("cancel")}</button>
        </div>
      </form>
    </div>

    <!-- Модальное окно для создания кастомного варианта -->
    <div class="modal-overlay" id="customModal" style="display:none;">
      <div class="modal">
        <h3 id="customModalTitle">${t("custom_add_title")}</h3>
        <input type="text" id="customModalInput" class="form-input" placeholder="${t("custom_add_placeholder")}" />
        <div class="modal-actions">
          <button class="btn btn-primary" id="customModalSave">${t("save")}</button>
          <button class="btn btn-secondary" id="customModalCancel">${t("cancel")}</button>
        </div>
      </div>
    </div>
  `;
}

function buildOptions(options, selectedValue) {
  return options.map(opt => 
    `<option value="${escapeHtml(opt.value)}" ${opt.value === selectedValue ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`
  ).join("");
}

function buildStatsInputs(stats) {
  const statKeys = ["str", "dex", "con", "int", "wis", "cha"];
  return statKeys.map(key => `
    <div class="stat-input-group">
      <label class="stat-label">${t("stat_" + key)}</label>
      <input type="number" class="stat-input" data-stat="${key}" value="${stats[key]}" min="1" max="30" />
      <span class="stat-mod">${getModifierStr(stats[key])}</span>
    </div>
  `).join("");
}

function buildWeaponsList(weapons) {
  if (!weapons || weapons.length === 0) return "";
  return weapons.map((w, i) => `
    <div class="list-item" data-index="${i}">
      <div class="list-item-content">
        <input type="text" class="form-input weapon-name" value="${escapeHtml(w.name)}" placeholder="${t("npc_weapon_name")}" />
        <input type="text" class="form-input weapon-damage" value="${escapeHtml(w.damage || "")}" placeholder="${t("npc_weapon_damage")}" />
        <input type="text" class="form-input weapon-type" value="${escapeHtml(w.type || "")}" placeholder="${t("npc_weapon_type")}" />
      </div>
      <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-list="weapons" data-index="${i}">✕</button>
    </div>
  `).join("");
}

function buildAbilitiesList(abilities) {
  if (!abilities || abilities.length === 0) return "";
  return abilities.map((a, i) => `
    <div class="list-item" data-index="${i}">
      <div class="list-item-content">
        <input type="text" class="form-input ability-name" value="${escapeHtml(a.name)}" placeholder="${t("npc_ability_name")}" />
        <textarea class="form-textarea ability-desc" rows="2" placeholder="${t("npc_ability_desc")}">${escapeHtml(a.description || "")}</textarea>
      </div>
      <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-list="abilities" data-index="${i}">✕</button>
    </div>
  `).join("");
}

function buildEquipmentList(equipment) {
  if (!equipment || equipment.length === 0) return "";
  return equipment.map((e, i) => `
    <div class="list-item" data-index="${i}">
      <div class="list-item-content">
        <input type="text" class="form-input equipment-name" value="${escapeHtml(e.name)}" placeholder="${t("npc_equipment_name")}" />
      </div>
      <button type="button" class="btn btn-danger btn-sm btn-remove-item" data-list="equipment" data-index="${i}">✕</button>
    </div>
  `).join("");
}

// ─── Привязка событий ───
function attachFormEvents(container) {
  const form = container.querySelector("#npcForm");
  
  // Отмена
  container.querySelectorAll(".npc-form-cancel").forEach(btn => {
    btn.addEventListener("click", () => {
      if (onCancelCallback) onCancelCallback();
    });
  });

  // Сохранение формы
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveForm(container);
  });

  // Обновление модификаторов при вводе характеристик
  container.querySelectorAll(".stat-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const mod = e.target.closest(".stat-input-group").querySelector(".stat-mod");
      mod.textContent = getModifierStr(parseInt(e.target.value) || 10);
    });
  });

  // Добавление оружия
  container.querySelector("#addWeaponBtn").addEventListener("click", () => {
    const list = container.querySelector("#weapons-list");
    const index = list.querySelectorAll(".list-item").length;
    list.insertAdjacentHTML("beforeend", buildWeaponsList([{ name: "", damage: "", type: "" }]).replace(/data-index="\d+"/, `data-index="${index}"`));
    attachRemoveButtons(container);
  });

  // Добавление способности
  container.querySelector("#addAbilityBtn").addEventListener("click", () => {
    const list = container.querySelector("#abilities-list");
    const index = list.querySelectorAll(".list-item").length;
    list.insertAdjacentHTML("beforeend", buildAbilitiesList([{ name: "", description: "" }]).replace(/data-index="\d+"/, `data-index="${index}"`));
    attachRemoveButtons(container);
  });

  // Добавление снаряжения
  container.querySelector("#addEquipmentBtn").addEventListener("click", () => {
    const list = container.querySelector("#equipment-list");
    const index = list.querySelectorAll(".list-item").length;
    list.insertAdjacentHTML("beforeend", buildEquipmentList([{ name: "" }]).replace(/data-index="\d+"/, `data-index="${index}"`));
    attachRemoveButtons(container);
  });

  // Удаление элементов
  attachRemoveButtons(container);

  // Кнопки "Создать свой"
  container.querySelectorAll(".btn-add-custom").forEach(btn => {
    btn.addEventListener("click", () => {
      openCustomModal(container, btn.dataset.field);
    });
  });
}

function attachRemoveButtons(container) {
  container.querySelectorAll(".btn-remove-item").forEach(btn => {
    btn.onclick = () => {
      btn.closest(".list-item").remove();
    };
  });
}

// ─── Модальное окно для кастомных значений ───
let currentCustomField = null;

function openCustomModal(container, field) {
  currentCustomField = field;
  const modal = container.querySelector("#customModal");
  const input = container.querySelector("#customModalInput");
  input.value = "";
  modal.style.display = "flex";

  const saveBtn = container.querySelector("#customModalSave");
  const cancelBtn = container.querySelector("#customModalCancel");

  saveBtn.onclick = () => {
    const value = input.value.trim();
    if (value) {
      let select;
      if (field === "type") {
        addCustomType(value);
        select = container.querySelector("#npc_type");
      } else if (field === "alignment") {
        addCustomAlignment(value);
        select = container.querySelector("#npc_alignment");
      } else if (field === "profession") {
        addCustomProfession(value);
        select = container.querySelector("#npc_profession");
      }
      // Добавить новый вариант в select
      if (select) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        option.selected = true;
        select.appendChild(option);
      }
    }
    modal.style.display = "none";
  };

  cancelBtn.onclick = () => {
    modal.style.display = "none";
  };
}

// ─── Сохранение формы ───
function saveForm(container) {
  const name = container.querySelector("#npc_name").value.trim();
  if (!name) {
    alert(t("npc_form_required"));
    return;
  }

  const npcData = {
    name,
    type: container.querySelector("#npc_type").value,
    alignment: container.querySelector("#npc_alignment").value,
    profession: container.querySelector("#npc_profession").value,
    cr: parseFloat(container.querySelector("#npc_cr").value) || 0,
    hp: parseInt(container.querySelector("#npc_hp").value) || 1,
    ac: parseInt(container.querySelector("#npc_ac").value) || 10,
    speed: container.querySelector("#npc_speed").value.trim() || "30 фт",
    stats: collectStats(container),
    weapons: collectWeapons(container),
    abilities: collectAbilities(container),
    equipment: collectEquipment(container),
    appearance: container.querySelector("#npc_appearance").value.trim(),
    notes: container.querySelector("#npc_notes").value.trim(),
  };

  let result;
  if (isEditMode && currentNPC.id) {
    result = updateNPC(currentNPC.id, npcData);
  } else {
    result = createNPC(npcData);
  }

  if (onSaveCallback) onSaveCallback(result);
}

function collectStats(container) {
  const stats = {};
  container.querySelectorAll(".stat-input").forEach(input => {
    stats[input.dataset.stat] = parseInt(input.value) || 10;
  });
  return stats;
}

function collectWeapons(container) {
  const weapons = [];
  container.querySelectorAll("#weapons-list .list-item").forEach(item => {
    const name = item.querySelector(".weapon-name").value.trim();
    if (name) {
      weapons.push({
        name,
        damage: item.querySelector(".weapon-damage").value.trim(),
        type: item.querySelector(".weapon-type").value.trim()
      });
    }
  });
  return weapons;
}

function collectAbilities(container) {
  const abilities = [];
  container.querySelectorAll("#abilities-list .list-item").forEach(item => {
    const name = item.querySelector(".ability-name").value.trim();
    if (name) {
      abilities.push({
        name,
        description: item.querySelector(".ability-desc").value.trim()
      });
    }
  });
  return abilities;
}

function collectEquipment(container) {
  const equipment = [];
  container.querySelectorAll("#equipment-list .list-item").forEach(item => {
    const name = item.querySelector(".equipment-name").value.trim();
    if (name) {
      equipment.push({ name });
    }
  });
  return equipment;
}

// ─── Утилиты ───
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
