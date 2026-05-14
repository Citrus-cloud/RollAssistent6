// ============================================================
// npcStorage.js — Работа с localStorage для NPC
// ============================================================

const NPC_STORAGE_KEY = "dnd_npcs";
const CUSTOM_NPC_TYPES_KEY = "custom_npc_types";
const CUSTOM_NPC_ALIGNMENT_KEY = "custom_npc_alignment";
const CUSTOM_NPC_PROFESSIONS_KEY = "custom_npc_professions";

// ─── Стандартные ключи для выпадающих списков ───

export const DEFAULT_NPC_TYPES = [
  "type_human", "type_elf", "type_dwarf", "type_gnome", "type_halfling",
  "type_half_orc", "type_tiefling", "type_dragonborn", "type_beast",
  "type_undead", "type_demon", "type_elemental", "type_giant", "type_dragon",
  "type_construct", "type_plant", "type_fiend", "type_celestial", "type_fey",
  "type_ooze", "type_monstrosity", "type_humanoid"
];

export const DEFAULT_ALIGNMENTS = [
  "align_lg", "align_ng", "align_cg",
  "align_ln", "align_tn", "align_cn",
  "align_le", "align_ne", "align_ce"
];

export const DEFAULT_PROFESSIONS = [
  "prof_merchant", "prof_warrior", "prof_officer", "prof_leader", "prof_boss",
  "prof_baron", "prof_mage", "prof_priest", "prof_thief", "prof_bandit",
  "prof_guard", "prof_bandit2", "prof_bandit_leader", "prof_dragon", "prof_lich",
  "prof_vampire", "prof_werewolf", "prof_ghost", "prof_golem", "prof_elemental",
  "prof_demon", "prof_devil", "prof_angel", "prof_fey", "prof_druid",
  "prof_ranger", "prof_paladin", "prof_bard", "prof_cleric", "prof_monk",
  "prof_rogue", "prof_wizard", "prof_sorcerer", "prof_warlock", "prof_artificer",
  "prof_blood_hunter"
];

// ─── NPC CRUD ───

/**
 * Получить все NPC
 */
export function getAllNPCs() {
  try {
    const data = localStorage.getItem(NPC_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading NPCs from localStorage:", e);
    return [];
  }
}

/**
 * Сохранить массив NPC
 */
export function saveAllNPCs(npcs) {
  try {
    localStorage.setItem(NPC_STORAGE_KEY, JSON.stringify(npcs));
  } catch (e) {
    console.error("Error saving NPCs to localStorage:", e);
  }
}

/**
 * Получить NPC по ID
 */
export function getNPCById(id) {
  const npcs = getAllNPCs();
  return npcs.find(npc => npc.id === id) || null;
}

/**
 * Создать нового NPC
 */
export function createNPC(npcData) {
  const npcs = getAllNPCs();
  const npc = {
    id: generateId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...npcData
  };
  npcs.push(npc);
  saveAllNPCs(npcs);
  return npc;
}

/**
 * Обновить NPC
 */
export function updateNPC(id, npcData) {
  const npcs = getAllNPCs();
  const index = npcs.findIndex(npc => npc.id === id);
  if (index === -1) return null;
  npcs[index] = { ...npcs[index], ...npcData, updatedAt: Date.now() };
  saveAllNPCs(npcs);
  return npcs[index];
}

/**
 * Удалить NPC
 */
export function deleteNPC(id) {
  const npcs = getAllNPCs();
  const filtered = npcs.filter(npc => npc.id !== id);
  saveAllNPCs(filtered);
  return filtered;
}

/**
 * Дублировать NPC
 */
export function duplicateNPC(id) {
  const npc = getNPCById(id);
  if (!npc) return null;
  const { id: _oldId, createdAt: _ca, updatedAt: _ua, ...data } = npc;
  data.name = data.name + " (копия)";
  return createNPC(data);
}

// ─── Кастомные значения выпадающих списков ───

export function getCustomTypes() {
  try {
    const data = localStorage.getItem(CUSTOM_NPC_TYPES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addCustomType(value) {
  const items = getCustomTypes();
  if (!items.includes(value)) {
    items.push(value);
    localStorage.setItem(CUSTOM_NPC_TYPES_KEY, JSON.stringify(items));
  }
  return items;
}

export function getCustomAlignments() {
  try {
    const data = localStorage.getItem(CUSTOM_NPC_ALIGNMENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addCustomAlignment(value) {
  const items = getCustomAlignments();
  if (!items.includes(value)) {
    items.push(value);
    localStorage.setItem(CUSTOM_NPC_ALIGNMENT_KEY, JSON.stringify(items));
  }
  return items;
}

export function getCustomProfessions() {
  try {
    const data = localStorage.getItem(CUSTOM_NPC_PROFESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function addCustomProfession(value) {
  const items = getCustomProfessions();
  if (!items.includes(value)) {
    items.push(value);
    localStorage.setItem(CUSTOM_NPC_PROFESSIONS_KEY, JSON.stringify(items));
  }
  return items;
}

// ─── Утилиты ───

function generateId() {
  return "npc_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Создать пустой шаблон NPC
 */
export function createEmptyNPC() {
  return {
    name: "",
    type: "type_humanoid",
    alignment: "align_tn",
    profession: "prof_warrior",
    cr: 1,
    hp: 10,
    ac: 10,
    speed: "30 фт",
    stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    weapons: [],
    appearance: "",
    abilities: [],
    equipment: [],
    notes: "",
    isActive: false
  };
}

/**
 * Предустановленные NPC для "Быстрого старта"
 */
export function getQuickStartNPCs() {
  return [
    {
      name: "Гоблин",
      type: "type_humanoid",
      alignment: "align_ne",
      profession: "prof_bandit",
      cr: 0.25,
      hp: 7,
      ac: 15,
      speed: "30 фт",
      stats: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
      weapons: [{ name: "Скимитар", damage: "1d6+2 рубящий", type: "Ближний бой" }],
      appearance: "Маленькое зелёное существо с острыми ушами и злобным взглядом",
      abilities: [{ name: "Ловкий побег", description: "Может совершить Отход или Укрытие бонусным действием" }],
      equipment: [{ name: "Кожаный доспех" }, { name: "Щит" }],
      notes: "Обычный гоблин из подземелья",
      isActive: false
    },
    {
      name: "Орк-берсерк",
      type: "type_humanoid",
      alignment: "align_ce",
      profession: "prof_warrior",
      cr: 2,
      hp: 45,
      ac: 13,
      speed: "30 фт",
      stats: { str: 16, dex: 12, con: 16, int: 7, wis: 11, cha: 10 },
      weapons: [{ name: "Секира", damage: "1d12+3 рубящий", type: "Ближний бой" }],
      appearance: "Массивный зеленокожий орк с боевыми шрамами и налитыми кровью глазами",
      abilities: [{ name: "Агрессивность", description: "Бонусным действием может переместиться на свою скорость к враждебному существу" }],
      equipment: [{ name: "Шкурный доспех" }, { name: "Великая секира" }],
      notes: "Свирепый воин из племени кровавого клыка",
      isActive: false
    },
    {
      name: "Молодой дракон",
      type: "type_dragon",
      alignment: "align_ce",
      profession: "prof_dragon",
      cr: 10,
      hp: 178,
      ac: 18,
      speed: "40 фт, полёт 80 фт",
      stats: { str: 23, dex: 10, con: 21, int: 14, wis: 11, cha: 19 },
      weapons: [
        { name: "Укус", damage: "2d10+6 колющий", type: "Ближний бой" },
        { name: "Когти", damage: "2d6+6 рубящий", type: "Ближний бой" },
        { name: "Огненное дыхание", damage: "16d6 огонь (спасбросок ЛОВ DC 18)", type: "Дальний" }
      ],
      appearance: "Величественный красный дракон, покрытый огненно-алой чешуёй. Размах крыльев около 15 метров.",
      abilities: [
        { name: "Огненное дыхание", description: "Перезарядка 5-6. Конус 30 фт. Спасбросок ЛОВ DC 18, 16d6 огонь." },
        { name: "Ужасающее присутствие", description: "Каждое существо в 120 фт. Спасбросок МДР DC 16 или испуг на 1 минуту." }
      ],
      equipment: [],
      notes: "Молодой красный дракон. Логово в горном ущелье.",
      isActive: false
    }
  ];
}
