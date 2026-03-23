# FinCalc — Personal Finance Calculator Suite

A lightweight, responsive single-page web application with **21 personal finance calculators**. Built with React — no backend, no database, no login required. All calculations run entirely in the browser.

**Live Preview:** [https://wealth-tracker-app-4.preview.emergentagent.com](https://wealth-tracker-app-4.preview.emergentagent.com)

---

## Calculators Included

| Category | Calculators |
|---|---|
| **Loans & Mortgages** | Mortgage, EMI / Loan, Credit Card Payoff, Amortization Schedule |
| **Investments** | Compound Interest, Investment Growth, XIRR (Chitti Finance), Expense Ratio Impact, ROI & CAGR |
| **Retirement & Goals** | Retirement, FIRE, Savings Goal |
| **Debt Management** | Debt Snowball, Debt Avalanche |
| **Financial Planning** | Inflation Impact, Net Worth, Life Insurance, Opportunity Cost |
| **Trading Tools** | Position Size, Risk/Reward, Break-even |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Yarn](https://yarnpkg.com/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install dependencies
cd frontend
yarn install
```

### Run Locally

```bash
cd frontend
yarn start
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
cd frontend
yarn build
```

The optimised output will be in `frontend/build/`. You can serve it with any static file server:

```bash
# Example using npx serve
npx serve -s frontend/build
```

---

## Project Structure

```
frontend/
  src/
    App.js          # All calculator components, dashboard, sidebar, and routing
    App.css         # (minimal overrides)
    index.css       # All styles — layout, components, responsive breakpoints
    index.js        # React entry point
    theme.js        # Centralised colour/font/spacing tokens
  public/
    index.html
  package.json
```

### Key Files

| File | Purpose |
|---|---|
| `src/App.js` | Contains all 21 calculator components, the dashboard, sidebar navigation, currency selector, and chart components |
| `src/index.css` | Complete stylesheet — layout grid, calculator cards, charts, responsive rules |
| `src/theme.js` | Design tokens (colours, fonts, spacing, border-radius, shadows) used by chart components |

---

## Tech Stack

- **React 18** — UI framework (Create React App)
- **CSS3 Variables** — Theming via custom properties defined in `index.css`
- **Recharts** — (installed, available for extended chart usage)
- **Lucide React** — Icon library (installed)
- **Fonts** — DM Sans (body) + Space Mono (numbers/monospace)

No backend, no database, no authentication. Pure client-side application.

---

## Design System

The app uses a cream/teal colour scheme defined as CSS variables in `index.css` and mirrored in `theme.js`:

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#2d8a6e` | Primary teal accent |
| `--bg-dark` | `#0a0a0a` | Page background |
| `--bg-card` | `#f5f0e6` | Calculator card background |
| `--bg-card-dark` | `#111111` | Sidebar and dashboard card background |
| `--text-light` | `#f5f0e6` | Text on dark backgrounds |
| `--text-dark` | `#1a1a1a` | Text on light backgrounds |

### Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1200px` | Full sidebar + calculator + chart sidebar |
| `900–1200px` | Narrower chart sidebar, stacked calculator body |
| `768–900px` | Sidebar collapses to horizontal pill nav |
| `< 768px` | Single-column layout, mobile-friendly |

---

## Configuration

### Default Currency

The default currency is **INR (Indian Rupee)**. Users can switch currencies using the searchable dropdown on the dashboard or within any calculator. Supported currencies: INR, USD, EUR, GBP, JPY, AUD, CAD, SGD, AED, MYR, PKR, BDT.

To change the default, edit the `CURRENCIES` array order in `App.js` — the first entry is used as the default.

### Adding a New Calculator

1. Create a new calculator component function in `App.js` following the existing pattern (accepts `{ symbol, currency, setCurrency }` props).
2. Add an entry to the `CALCULATORS` object with a unique key, name, icon, and description.
3. Add the key to the appropriate category in the `CATEGORIES` array.
4. Register the component in `CALCULATOR_COMPONENTS`.

The sidebar, dashboard, and routing will pick it up automatically.

---

## Deployment

Since this is a static React app, it can be deployed anywhere that serves static files:

- **Vercel:** `cd frontend && vercel`
- **Netlify:** Connect repo, set build command to `cd frontend && yarn build`, publish directory to `frontend/build`
- **GitHub Pages:** Use `gh-pages` package — `yarn add -D gh-pages`, add `"homepage"` to `package.json`, then `yarn build && gh-pages -d build`
- **Any static host:** Upload the contents of `frontend/build/`

---

## License

This project is provided as-is for personal and educational use.
