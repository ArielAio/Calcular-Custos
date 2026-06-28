# Calcular Custos

Calcular Custos é um PWA simples para organizar o salário do mês.

O objetivo do projeto é permitir que o usuário informe quanto recebeu e veja automaticamente quanto precisa separar para cada gasto importante, como transporte, cartão, gasolina da moto e reserva. Cada item pode ser editado, ativado ou desativado conforme a necessidade do mês.

## Funcionalidades

- Cálculo automático do total separado, saldo restante e percentual comprometido.
- Edição de salário, nome dos gastos e valores.
- Ativação ou desativação de gastos do mês.
- Dados salvos no próprio navegador com `localStorage`.
- Manifest e service worker para uso como PWA.

## Tecnologias

- HTML
- CSS
- JavaScript
- Service Worker

## Como executar

Não é necessário instalar dependências. Basta servir os arquivos estáticos:

```sh
python3 -m http.server 4173
```

Depois acesse:

```text
http://localhost:4173/
```

## Como testar

```sh
node test/budget.test.mjs
```

## Estrutura

```text
.
├── app.js
├── budget.js
├── index.html
├── manifest.webmanifest
├── styles.css
├── sw.js
├── icons/
└── test/
```

## Deploy

O projeto é estático e pode ser hospedado na Vercel, GitHub Pages ou qualquer serviço que sirva HTML, CSS e JavaScript.

Na Vercel, basta importar o repositório e publicar sem comando de build.

## Licença

Este projeto ainda não possui uma licença definida.
