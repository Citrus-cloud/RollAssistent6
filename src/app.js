// ============================================================
// app.js — Главный модуль приложения Roll Assistant
// ============================================================

import { t, setLanguage, getLanguage } from "./utils/lang.js";
import { renderNPCList } from "./components/npcList.js";
import { renderNPCForm } from "./components/npcForm.js";
import { renderNPCSheet } from "./components/npcSheet.js";

// ─── Состояние приложения ───
let currentScreen = "menu"; // menu, bestiary, npc-form, npc-sheet

const app = document.getElementById("app");

// ─── Навигация ───
function navigate(screen, params = {}) {
  currentScreen = screen;
  switch (screen) {
    case "menu":
      renderMainMenu();
      break;
    case "bestiary":
      renderBestiary();
      break;
    case "npc-form":
      renderNPCFormScreen(params.npcId);
      break;
    case "npc-sheet":
      renderNPCSheetScreen(params.npcId);
      break;
    default:
      renderMainMenu();
  }
}

// ─── Главное меню ───
function renderMainMenu() {
  app.innerHTML = `
    <div class="main-menu">
      <div class="menu-header">
        <h1>${t("app_title")}</h1>
        <p class="subtitle">D&D 5e Tool</p>
      </div>
      <div class="menu-buttons">
        <button class="menu-btn" id="btnCharacters">${t("menu_characters")}</button>
        <button class="menu-btn" id="btnBestiary">${t("menu_bestiary")}</button>
      </div>
      <div class="menu-footer">
        <button class="btn btn-sm btn-secondary" id="btnLang">${t("menu_language")}: ${getLanguage().toUpperCase()}</button>
      </div>
    </div>
  `;

  document.getElementById("btnBestiary").addEventListener("click", () => navigate("bestiary"));
  document.getElementById("btnCharacters").addEventListener("click", () => {
    // Заглушка — здесь будет переход к системе персонажей
    alert("Character system - coming soon!");
  });
  document.getElementById("btnLang").addEventListener("click", () => {
    const newLang = getLanguage() === "ru" ? "en" : "ru";
    setLanguage(newLang);
    renderMainMenu();
  });
}

// ─── Бестиарий (список NPC) ───
function renderBestiary() {
  app.innerHTML = `
    <div class="screen-container">
      <div class="screen-nav">
        <button class="btn btn-secondary btn-back-menu" id="backToMenu">${t("back")}</button>
        <button class="btn btn-sm btn-secondary" id="btnLangBestiary">${t("menu_language")}: ${getLanguage().toUpperCase()}</button>
      </div>
      <div id="bestiaryContent"></div>
    </div>
  `;

  document.getElementById("backToMenu").addEventListener("click", () => navigate("menu"));
  document.getElementById("btnLangBestiary").addEventListener("click", () => {
    const newLang = getLanguage() === "ru" ? "en" : "ru";
    setLanguage(newLang);
    renderBestiary();
  });

  renderNPCList(document.getElementById("bestiaryContent"), {
    onCreate: () => navigate("npc-form"),
    onView: (id) => navigate("npc-sheet", { npcId: id }),
    onEdit: (id) => navigate("npc-form", { npcId: id }),
  });
}

// ─── Форма создания / редактирования NPC ───
function renderNPCFormScreen(npcId) {
  app.innerHTML = `<div id="npcFormContent" class="screen-container"></div>`;
  
  renderNPCForm(document.getElementById("npcFormContent"), {
    npcId,
    onSave: (npc) => {
      navigate("npc-sheet", { npcId: npc.id });
    },
    onCancel: () => {
      navigate("bestiary");
    }
  });
}

// ─── Карточка NPC ───
function renderNPCSheetScreen(npcId) {
  app.innerHTML = `<div id="npcSheetContent" class="screen-container"></div>`;
  
  renderNPCSheet(document.getElementById("npcSheetContent"), {
    npcId,
    onBack: () => navigate("bestiary"),
    onEdit: (id) => navigate("npc-form", { npcId: id }),
    onDelete: () => navigate("bestiary"),
  });
}

// ─── Инициализация ───
document.addEventListener("DOMContentLoaded", () => {
  navigate("menu");
});
