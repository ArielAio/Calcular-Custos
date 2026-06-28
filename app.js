import { calculateBudget, formatMoney, newItem, normalizeBudget, parseMoney } from "./budget.js";

const STORAGE_KEY = "calcular-custos:v1";
const salaryInput = document.querySelector("#salaryInput");
const totalAllocated = document.querySelector("#totalAllocated");
const remainingMoney = document.querySelector("#remainingMoney");
const committedPercent = document.querySelector("#committedPercent");
const budgetStatus = document.querySelector("#budgetStatus");
const progressFill = document.querySelector("#progressFill");
const itemList = document.querySelector("#itemList");
const itemTemplate = document.querySelector("#itemTemplate");
const addItemButton = document.querySelector("#addItemButton");
const installButton = document.querySelector("#installButton");

let installPrompt;
let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.items?.length) return normalizeBudget(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }

  return normalizeBudget();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  salaryInput.value = state.salary || "";
  itemList.replaceChildren(...state.items.map(renderItem));
  renderSummary();
}

function renderItem(item) {
  const node = itemTemplate.content.firstElementChild.cloneNode(true);
  const active = node.querySelector(".item-active");
  const name = node.querySelector(".item-name");
  const amount = node.querySelector(".item-amount");
  const remove = node.querySelector(".remove-button");

  active.checked = item.active;
  name.value = item.name;
  amount.value = item.amount || "";
  node.classList.toggle("inactive", !item.active);

  active.addEventListener("change", () => updateItem(item.id, { active: active.checked }));
  name.addEventListener("input", () => updateItem(item.id, { name: name.value }));
  amount.addEventListener("input", () => updateItem(item.id, { amount: parseMoney(amount.value) }));
  amount.addEventListener("blur", () => {
    amount.value = parseMoney(amount.value) || "";
  });
  remove.addEventListener("click", () => {
    state.items = state.items.filter((current) => current.id !== item.id);
    saveState();
    render();
  });

  return node;
}

function updateItem(id, patch) {
  state.items = state.items.map((item) => (item.id === id ? { ...item, ...patch } : item));
  saveState();
  renderSummary();
}

function renderSummary() {
  const result = calculateBudget(state.salary, state.items);
  const overBudget = result.remaining < 0;
  const tightBudget = !overBudget && result.percent >= 85;

  totalAllocated.textContent = formatMoney(result.total);
  remainingMoney.textContent = formatMoney(result.remaining);
  committedPercent.textContent = `${result.percent}%`;
  progressFill.style.width = `${Math.min(result.percent, 100)}%`;
  progressFill.style.background = overBudget ? "var(--danger)" : tightBudget ? "var(--warn)" : "var(--primary)";

  budgetStatus.className = `budget-status${overBudget ? " danger" : tightBudget ? " warn" : ""}`;
  budgetStatus.textContent = overBudget
    ? `Faltam ${formatMoney(Math.abs(result.remaining))}.`
    : tightBudget
      ? `${formatMoney(result.remaining)} livres.`
      : `${formatMoney(result.remaining)} livres para o mês.`;
}

salaryInput.addEventListener("input", () => {
  state.salary = parseMoney(salaryInput.value);
  saveState();
  renderSummary();
});

salaryInput.addEventListener("blur", () => {
  salaryInput.value = state.salary || "";
});

addItemButton.addEventListener("click", () => {
  state.items.push(newItem());
  saveState();
  render();
  itemList.lastElementChild?.querySelector(".item-name")?.focus();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  installPrompt = undefined;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

render();
