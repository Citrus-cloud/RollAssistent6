// ============================================================
// lang.js — Двуязычная система локализации (RU / EN)
// ============================================================

const translations = {
  // ─── Общие ───
  app_title: { ru: "Roll Assistant", en: "Roll Assistant" },
  save: { ru: "Сохранить", en: "Save" },
  cancel: { ru: "Отмена", en: "Cancel" },
  delete: { ru: "Удалить", en: "Delete" },
  edit: { ru: "Редактировать", en: "Edit" },
  create: { ru: "Создать", en: "Create" },
  close: { ru: "Закрыть", en: "Close" },
  confirm: { ru: "Подтвердить", en: "Confirm" },
  search: { ru: "Поиск", en: "Search" },
  filter: { ru: "Фильтр", en: "Filter" },
  all: { ru: "Все", en: "All" },
  yes: { ru: "Да", en: "Yes" },
  no: { ru: "Нет", en: "No" },
  name: { ru: "Имя", en: "Name" },
  back: { ru: "Назад", en: "Back" },
  add: { ru: "Добавить", en: "Add" },
  duplicate: { ru: "Дублировать", en: "Duplicate" },
  export_pdf: { ru: "Экспорт в PDF", en: "Export to PDF" },

  // ─── Главное меню ───
  menu_characters: { ru: "🧙 Персонажи", en: "🧙 Characters" },
  menu_bestiary: { ru: "👹 Бестиарий", en: "👹 Bestiary" },
  menu_settings: { ru: "⚙️ Настройки", en: "⚙️ Settings" },
  menu_language: { ru: "🌐 Язык", en: "🌐 Language" },

  // ─── NPC / Бестиарий ───
  bestiary_title: { ru: "Бестиарий", en: "Bestiary" },
  create_npc: { ru: "➕ Создать NPC", en: "➕ Create NPC" },
  edit_npc: { ru: "Редактировать NPC", en: "Edit NPC" },
  delete_npc: { ru: "Удалить NPC", en: "Delete NPC" },
  delete_npc_confirm: { ru: "Вы уверены, что хотите удалить этого NPC?", en: "Are you sure you want to delete this NPC?" },
  npc_name: { ru: "Имя", en: "Name" },
  npc_type: { ru: "Тип", en: "Type" },
  npc_alignment: { ru: "Мировоззрение", en: "Alignment" },
  npc_profession: { ru: "Профессия / Роль", en: "Profession / Role" },
  npc_cr: { ru: "Уровень (CR)", en: "Challenge Rating (CR)" },
  npc_hp: { ru: "Хиты (HP)", en: "Hit Points (HP)" },
  npc_ac: { ru: "Класс Доспеха (AC)", en: "Armor Class (AC)" },
  npc_speed: { ru: "Скорость", en: "Speed" },
  npc_stats: { ru: "Характеристики", en: "Ability Scores" },
  npc_weapons: { ru: "Оружие и атаки", en: "Weapons & Attacks" },
  npc_appearance: { ru: "Внешний вид", en: "Appearance" },
  npc_abilities: { ru: "Особые способности", en: "Special Abilities" },
  npc_equipment: { ru: "Снаряжение", en: "Equipment" },
  npc_notes: { ru: "Заметки", en: "Notes" },
  npc_select_main: { ru: "Выбрать основного", en: "Set as Active" },
  npc_quick_start: { ru: "⚡ Быстрый старт", en: "⚡ Quick Start" },
  npc_quick_start_desc: { ru: "Создать примеры NPC", en: "Create sample NPCs" },
  npc_no_items: { ru: "Нет NPC. Создайте первого!", en: "No NPCs yet. Create your first!" },
  npc_duplicate: { ru: "Дублировать NPC", en: "Duplicate NPC" },
  npc_add_weapon: { ru: "➕ Добавить оружие", en: "➕ Add Weapon" },
  npc_add_ability: { ru: "➕ Добавить способность", en: "➕ Add Ability" },
  npc_add_equipment: { ru: "➕ Добавить предмет", en: "➕ Add Item" },
  npc_weapon_name: { ru: "Название оружия", en: "Weapon Name" },
  npc_weapon_damage: { ru: "Урон", en: "Damage" },
  npc_weapon_type: { ru: "Тип атаки", en: "Attack Type" },
  npc_ability_name: { ru: "Название способности", en: "Ability Name" },
  npc_ability_desc: { ru: "Описание способности", en: "Ability Description" },
  npc_equipment_name: { ru: "Название предмета", en: "Item Name" },
  npc_form_required: { ru: "Заполните обязательные поля", en: "Fill in required fields" },
  npc_saved: { ru: "NPC сохранён", en: "NPC saved" },
  npc_deleted: { ru: "NPC удалён", en: "NPC deleted" },
  npc_duplicated: { ru: "NPC дублирован", en: "NPC duplicated" },

  // ─── Выпадающие списки - Создание своих ───
  custom_add: { ru: "➕ Создать свой", en: "➕ Create Custom" },
  custom_add_title: { ru: "Создать новый вариант", en: "Create New Option" },
  custom_add_placeholder: { ru: "Введите название...", en: "Enter name..." },

  // ─── Характеристики ───
  stat_str: { ru: "СИЛ", en: "STR" },
  stat_dex: { ru: "ЛОВ", en: "DEX" },
  stat_con: { ru: "ТЕЛ", en: "CON" },
  stat_int: { ru: "ИНТ", en: "INT" },
  stat_wis: { ru: "МДР", en: "WIS" },
  stat_cha: { ru: "ХАР", en: "CHA" },
  stat_str_full: { ru: "Сила", en: "Strength" },
  stat_dex_full: { ru: "Ловкость", en: "Dexterity" },
  stat_con_full: { ru: "Телосложение", en: "Constitution" },
  stat_int_full: { ru: "Интеллект", en: "Intelligence" },
  stat_wis_full: { ru: "Мудрость", en: "Wisdom" },
  stat_cha_full: { ru: "Харизма", en: "Charisma" },

  // ─── Стандартные типы NPC ───
  type_human: { ru: "Человек", en: "Human" },
  type_elf: { ru: "Эльф", en: "Elf" },
  type_dwarf: { ru: "Дварф", en: "Dwarf" },
  type_gnome: { ru: "Гном", en: "Gnome" },
  type_halfling: { ru: "Полурослик", en: "Halfling" },
  type_half_orc: { ru: "Полуорк", en: "Half-Orc" },
  type_tiefling: { ru: "Тифлинг", en: "Tiefling" },
  type_dragonborn: { ru: "Драконорождённый", en: "Dragonborn" },
  type_beast: { ru: "Зверь", en: "Beast" },
  type_undead: { ru: "Нежить", en: "Undead" },
  type_demon: { ru: "Демон", en: "Demon" },
  type_elemental: { ru: "Элементаль", en: "Elemental" },
  type_giant: { ru: "Великан", en: "Giant" },
  type_dragon: { ru: "Дракон", en: "Dragon" },
  type_construct: { ru: "Конструкт", en: "Construct" },
  type_plant: { ru: "Растение", en: "Plant" },
  type_fiend: { ru: "Исчадие", en: "Fiend" },
  type_celestial: { ru: "Небожитель", en: "Celestial" },
  type_fey: { ru: "Фея", en: "Fey" },
  type_ooze: { ru: "Слизень", en: "Ooze" },
  type_monstrosity: { ru: "Чудовище", en: "Monstrosity" },
  type_humanoid: { ru: "Гуманоид", en: "Humanoid" },

  // ─── Стандартные мировоззрения ───
  align_lg: { ru: "Законопослушный-добрый", en: "Lawful Good" },
  align_ng: { ru: "Нейтральный-добрый", en: "Neutral Good" },
  align_cg: { ru: "Хаотичный-добрый", en: "Chaotic Good" },
  align_ln: { ru: "Законопослушный-нейтральный", en: "Lawful Neutral" },
  align_tn: { ru: "Истинно нейтральный", en: "True Neutral" },
  align_cn: { ru: "Хаотичный-нейтральный", en: "Chaotic Neutral" },
  align_le: { ru: "Законопослушный-злой", en: "Lawful Evil" },
  align_ne: { ru: "Нейтральный-злой", en: "Neutral Evil" },
  align_ce: { ru: "Хаотичный-злой", en: "Chaotic Evil" },

  // ─── Стандартные профессии / роли ───
  prof_merchant: { ru: "Торговец", en: "Merchant" },
  prof_warrior: { ru: "Воин", en: "Warrior" },
  prof_officer: { ru: "Офицер", en: "Officer" },
  prof_leader: { ru: "Глава", en: "Leader" },
  prof_boss: { ru: "Босс", en: "Boss" },
  prof_baron: { ru: "Барон", en: "Baron" },
  prof_mage: { ru: "Маг", en: "Mage" },
  prof_priest: { ru: "Жрец", en: "Priest" },
  prof_thief: { ru: "Вор", en: "Thief" },
  prof_bandit: { ru: "Разбойник", en: "Bandit" },
  prof_guard: { ru: "Стражник", en: "Guard" },
  prof_bandit2: { ru: "Бандит", en: "Thug" },
  prof_bandit_leader: { ru: "Главарь бандитов", en: "Bandit Captain" },
  prof_dragon: { ru: "Дракон", en: "Dragon" },
  prof_lich: { ru: "Лич", en: "Lich" },
  prof_vampire: { ru: "Вампир", en: "Vampire" },
  prof_werewolf: { ru: "Оборотень", en: "Werewolf" },
  prof_ghost: { ru: "Призрак", en: "Ghost" },
  prof_golem: { ru: "Голем", en: "Golem" },
  prof_elemental: { ru: "Элементаль", en: "Elemental" },
  prof_demon: { ru: "Демон", en: "Demon" },
  prof_devil: { ru: "Дьявол", en: "Devil" },
  prof_angel: { ru: "Ангел", en: "Angel" },
  prof_fey: { ru: "Фея", en: "Fey" },
  prof_druid: { ru: "Друид", en: "Druid" },
  prof_ranger: { ru: "Рейнджер", en: "Ranger" },
  prof_paladin: { ru: "Паладин", en: "Paladin" },
  prof_bard: { ru: "Бард", en: "Bard" },
  prof_cleric: { ru: "Жрец", en: "Cleric" },
  prof_monk: { ru: "Монах", en: "Monk" },
  prof_rogue: { ru: "Плут", en: "Rogue" },
  prof_wizard: { ru: "Волшебник", en: "Wizard" },
  prof_sorcerer: { ru: "Чародей", en: "Sorcerer" },
  prof_warlock: { ru: "Колдун", en: "Warlock" },
  prof_artificer: { ru: "Изобретатель", en: "Artificer" },
  prof_blood_hunter: { ru: "Кровавый охотник", en: "Blood Hunter" },

  // ─── Фильтрация ───
  filter_by_name: { ru: "Поиск по имени...", en: "Search by name..." },
  filter_by_type: { ru: "Фильтр по типу", en: "Filter by type" },
  filter_by_profession: { ru: "Фильтр по профессии", en: "Filter by profession" },
  filter_by_cr: { ru: "Фильтр по CR", en: "Filter by CR" },
  filter_all_types: { ru: "Все типы", en: "All types" },
  filter_all_professions: { ru: "Все профессии", en: "All professions" },
  filter_all_cr: { ru: "Все CR", en: "All CR" },

  // ─── Модификаторы ───
  modifier: { ru: "Мод", en: "Mod" },
  saving_throw: { ru: "Спасбросок", en: "Saving Throw" },
};

// ─── Текущий язык ───
let currentLang = localStorage.getItem("dnd_lang") || "ru";

/**
 * Получить перевод по ключу
 */
function t(key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLang] || entry["ru"] || key;
}

/**
 * Установить язык
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("dnd_lang", lang);
}

/**
 * Получить текущий язык
 */
function getLanguage() {
  return currentLang;
}

export { translations, t, setLanguage, getLanguage };
