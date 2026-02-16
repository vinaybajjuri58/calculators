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
- [x] 20+ finance calculators
- [x] Searchable currency selector (INR default, 12+ currencies)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Elderly-friendly UI (large fonts, high contrast)
- [x] No login required
- [x] Dark bento-style dashboard with category sections

## What's Been Implemented (Jan 2026)

### Phase 1 - MVP Complete
- **Dashboard**: "Financial Calculators" home with dark bento-style cards organized by category
- **Theme System**: Centralized theme.js with CSS variables
- **Currency Selector**: Searchable dropdown, INR default, positioned in calculator header

### Fully Functional Calculators:
1. **Mortgage Calculator** - With donut chart breakdown
2. **EMI / Loan Calculator** - With payment breakdown
3. **Amortization Schedule** - Full payment table + early payoff calculator
4. **Compound Interest** - With SIP support and growth chart
5. **XIRR Calculator** - For Chitti finance and irregular investments
6. **Expense Ratio Impact** - Shows fee erosion over time with bar chart
7. **FIRE Calculator** - With progress ring
8. **Net Worth Calculator** - Full width with asset allocation chart

### Charts & Visualizations:
- Animated donut charts (180px)
- Animated bar charts (28px bar height)
- Progress rings (160px)
- All charts handle dynamic value changes without breaking

## Prioritized Backlog

### P0 - Next Sprint
- Investment Growth Calculator
- Credit Card Payoff Calculator
- Retirement Calculator with corpus comparison
- ROI & CAGR Calculator

### P1 - High Priority
- Debt Snowball/Avalanche with payoff timeline
- Inflation Impact Calculator
- Life Insurance Coverage Calculator
- Savings Goal Calculator

### P2 - Nice to Have
- Position Size Calculator (trading)
- Risk/Reward Calculator (trading)
- Break-even Calculator
- Opportunity Cost Calculator

## Technical Notes
- Indian number formatting (lakhs, crores)
- XIRR uses Newton-Raphson method for accurate calculation
- Charts use CSS animations for smooth transitions
- Theme colors: accent #2d8a6e, dark bg #0a0a0a, card bg #f5f0e6

## Next Tasks
1. Complete remaining calculators from P0 list
2. Add print/PDF export for results
3. Add social share functionality
4. Consider PWA for offline usage
