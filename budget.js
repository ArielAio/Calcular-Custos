export const DEFAULT_BUDGET = {
  salary: 950,
  items: [
    { id: "transporte-faculdade", name: "Transporte faculdade", amount: 300, active: true },
    { id: "cartao", name: "Cartão", amount: 60, active: true },
    { id: "gasolina-moto", name: "Gasolina da moto", amount: 200, active: true },
    { id: "reserva", name: "Reserva", amount: 150, active: true },
  ],
};

export function parseMoney(value) {
  const raw = String(value ?? "").trim().replace(/[^\d,.-]/g, "");
  if (!raw) return 0;

  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  const number = Number(normalized);

  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : 0;
}

export function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

export function calculateBudget(salary, items) {
  const activeItems = items.filter((item) => item.active);
  const total = activeItems.reduce((sum, item) => sum + parseMoney(item.amount), 0);
  const remaining = parseMoney(salary) - total;
  const percent = parseMoney(salary) ? Math.round((total / parseMoney(salary)) * 100) : 0;

  return {
    total: Math.round(total * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    percent,
    inactive: items.length - activeItems.length,
  };
}

export function normalizeBudget(saved) {
  if (!saved?.items?.length) return structuredClone(DEFAULT_BUDGET);

  const savedById = new Map(saved.items.map((item) => [item.id, item]));
  const defaultIds = new Set(DEFAULT_BUDGET.items.map((item) => item.id));
  const migratedItems = DEFAULT_BUDGET.items.map((defaultItem) => migrateItem(savedById.get(defaultItem.id) || defaultItem));
  const customItems = saved.items.filter((item) => !defaultIds.has(item.id));

  return {
    salary: saved.salary ?? DEFAULT_BUDGET.salary,
    items: [...migratedItems, ...customItems],
  };
}

export function newItem() {
  return {
    id: crypto.randomUUID(),
    name: "Novo gasto",
    amount: 0,
    active: true,
  };
}

function migrateItem(item) {
  const migrated = { ...item };

  if (migrated.id === "cartao" && migrated.name === "Cartao") migrated.name = "Cartão";
  if (migrated.id === "reserva" && parseMoney(migrated.amount) === 100) migrated.amount = 150;

  return migrated;
}
