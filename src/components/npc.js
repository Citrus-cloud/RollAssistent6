// ============================================================
// npc.js — Основной модуль NPC (бизнес-логика)
// ============================================================

import { t, getLanguage } from "../utils/lang.js";
import {
  getAllNPCs, createNPC, updateNPC, deleteNPC, duplicateNPC,
  getNPCById, createEmptyNPC, getQuickStartNPCs,
  DEFAULT_NPC_TYPES, DEFAULT_ALIGNMENTS, DEFAULT_PROFESSIONS,
  getCustomTypes, getCustomAlignments, getCustomProfessions,
  addCustomType, addCustomAlignment, addCustomProfession
} from "../utils/npcStorage.js";

// ─── Утилита для расчёта модификатора характеристики ───
export function getModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function getModifierStr(score) {
  const mod = getModifier(score);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ─── Получить значение для выпадающего списка (перевод или кастом) ───
export function getDropdownValue(key) {
  // Если ключ начинается с "type_", "align_", "prof_" — это стандартный ключ, переводим
  if (key.startsWith("type_") || key.startsWith("align_") || key.startsWith("prof_")) {
    return t(key);
  }
  // Иначе это кастомное значение — отображаем как есть
  return key;
}

// ─── Получить все варианты для выпадающего списка ───
export function getTypeOptions() {
  const defaults = DEFAULT_NPC_TYPES.map(key => ({ value: key, label: t(key) }));
  const custom = getCustomTypes().map(val => ({ value: val, label: val }));
  return [...defaults, ...custom];
}

export function getAlignmentOptions() {
  const defaults = DEFAULT_ALIGNMENTS.map(key => ({ value: key, label: t(key) }));
  const custom = getCustomAlignments().map(val => ({ value: val, label: val }));
  return [...defaults, ...custom];
}

export function getProfessionOptions() {
  const defaults = DEFAULT_PROFESSIONS.map(key => ({ value: key, label: t(key) }));
  const custom = getCustomProfessions().map(val => ({ value: val, label: val }));
  return [...defaults, ...custom];
}

// ─── Quick Start ───
export function generateQuickStart() {
  const templates = getQuickStartNPCs();
  const created = [];
  for (const tpl of templates) {
    created.push(createNPC(tpl));
  }
  return created;
}

// Re-export storage functions
export {
  getAllNPCs, createNPC, updateNPC, deleteNPC, duplicateNPC,
  getNPCById, createEmptyNPC,
  addCustomType, addCustomAlignment, addCustomProfession
};
