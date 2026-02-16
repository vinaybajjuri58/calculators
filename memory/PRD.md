# FinCalc - Personal Finance Calculator Web App

## Original Problem Statement
Build a lightweight, responsive personal finance calculator web app with 20+ calculators including Mortgage, EMI, Credit Card Payoff, Compound Interest, Investment Growth, XIRR (Chitti Finance), Retirement, FIRE, ROI/CAGR, Savings Goal, Debt Snowball, Debt Avalanche, Inflation Impact, Net Worth, Life Insurance, Expense Ratio Impact, Amortization Schedule, and more. Features: searchable currency selector (INR default), elderly-friendly design with cream/beige and teal color scheme, dark bento-style dashboard cards.

## Architecture
- **Frontend-Only**: Pure React application with all calculations done client-side
- **No Backend Required**: Maximum performance and simplicity
- **Theme System**: Centralized theme.js for consistent styling
- **Tech Stack**: React 18, CSS3 Variables, Space Mono + DM Sans fonts

## User Personas
1. **Indian Investors** - XIRR for Chitti/irregular investments, SIP calculators
2. **Retirees/Elderly** - Large fonts, clear UI, retirement planning
3. **First-time Homebuyers** - Mortgage, EMI, amortization calculators
4. **Debt Managers** - Snowball/Avalanche strategies, credit card payoff
5. **Traders** - Position size, risk/reward calculators

## Core Requirements (Static)
- [x] 20+ finance calculators (21 implemented)
- [x] Searchable currency selector (INR default, 12+ currencies)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Elderly-friendly UI (large fonts, high contrast)
- [x] No login required
- [x] Dark bento-style dashboard with category sections

## What's Been Implemented

### Phase 1 - MVP Complete (Jan 2026)
- **Dashboard**: "Financial Calculators" home with dark bento-style cards organized by category
- **Theme System**: Centralized theme.js with CSS variables
- **Currency Selector**: Searchable dropdown, INR default, positioned in calculator header

### All 21 Calculators Implemented:
1. Mortgage Calculator - With donut chart breakdown
2. EMI / Loan Calculator - With payment breakdown
3. Credit Card Payoff Calculator - Min vs fixed payment comparison
4. Amortization Schedule - Full payment table + early payoff
5. Compound Interest - With SIP support and growth chart
6. Investment Growth - SIP/lumpsum projection
7. XIRR Calculator - For Chitti finance and irregular investments
8. Expense Ratio Impact - Fee erosion over time
9. ROI & CAGR Calculator - Return analysis with progress ring
10. Retirement Calculator - Corpus comparison
11. FIRE Calculator - With progress ring
12. Savings Goal Calculator - Monthly savings needed
13. Debt Snowball Calculator - Smallest debt first strategy
14. Debt Avalanche Calculator - Highest interest first strategy
15. Inflation Impact Calculator - Purchasing power erosion
16. Net Worth Calculator - Assets vs liabilities with allocation chart
17. Life Insurance Calculator - Coverage needs analysis
18. Opportunity Cost Calculator - Investment comparison
19. Position Size Calculator - Trading risk management
20. Risk/Reward Calculator - Trade analysis
21. Break-even Calculator - Units/revenue to cover costs

### Bug Fixes (Feb 2026)
- Fixed sidebar width bug: sidebar no longer shrinks on Net Worth calculator page (added flex-shrink: 0 and min-width: 220px)

## Prioritized Backlog

### P1 - High Priority
- SEO improvements (dynamic title/meta tags per page)
- Print/PDF export for calculator results

### P2 - Nice to Have
- PWA support for offline usage
- Social share functionality
- Download schedule feature for Amortization

### P3 - Future
- User authentication & data persistence
- Functional advertisement integration
- Split App.js into separate component files for maintainability

## Technical Notes
- Indian number formatting (lakhs, crores)
- XIRR uses Newton-Raphson method
- Charts use CSS animations
- Theme colors: accent #2d8a6e, dark bg #0a0a0a, card bg #f5f0e6
- Sidebar: fixed 220px width with flex-shrink: 0
