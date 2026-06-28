import assert from "node:assert/strict";
import { calculateBudget, normalizeBudget, parseMoney } from "../budget.js";

assert.equal(parseMoney("R$ 950,50"), 950.5);
assert.equal(parseMoney("1.200,99"), 1200.99);
assert.equal(parseMoney("-30"), 0);

assert.deepEqual(
  calculateBudget(950, [
    { amount: 300, active: true },
    { amount: 60, active: true },
    { amount: 500, active: false },
  ]),
  { total: 360, remaining: 590, percent: 38, inactive: 1 },
);

assert.deepEqual(normalizeBudget().items.map(({ name, amount }) => [name, amount]), [
  ["Transporte faculdade", 300],
  ["Cartão", 60],
  ["Gasolina da moto", 200],
  ["Reserva", 150],
]);

assert.deepEqual(
  normalizeBudget({
    salary: 950,
    items: [
      { id: "transporte-faculdade", name: "Transporte faculdade", amount: 300, active: true },
      { id: "cartao", name: "Cartao", amount: 60, active: true },
      { id: "reserva", name: "Reserva", amount: 100, active: true },
    ],
  }).items.map(({ id, name, amount }) => [id, name, amount]),
  [
    ["transporte-faculdade", "Transporte faculdade", 300],
    ["cartao", "Cartão", 60],
    ["gasolina-moto", "Gasolina da moto", 200],
    ["reserva", "Reserva", 150],
  ],
);

console.log("budget ok");
