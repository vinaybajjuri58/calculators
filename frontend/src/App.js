import React, { useState, useMemo, useEffect } from 'react';
import theme from './theme';

// Currency Data - INR first as default
const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
];

// Calculator Categories
const CATEGORIES = [
  { id: 'loans', name: 'Loans & Mortgages', description: 'Calculate EMIs, mortgage payments, and loan schedules', calculators: ['mortgage', 'emi', 'credit-card', 'amortization'] },
  { id: 'investments', name: 'Investments', description: 'Track returns, compound growth, and portfolio performance', calculators: ['compound-interest', 'investment-growth', 'xirr', 'expense-ratio', 'roi-cagr'] },
  { id: 'retirement', name: 'Retirement & Goals', description: 'Plan for retirement and achieve your financial goals', calculators: ['retirement', 'fire', 'savings-goal'] },
  { id: 'debt', name: 'Debt Management', description: 'Strategies to pay off debt faster and save on interest', calculators: ['debt-snowball', 'debt-avalanche'] },
  { id: 'planning', name: 'Financial Planning', description: 'Track net worth, plan insurance, and analyze costs', calculators: ['inflation', 'net-worth', 'life-insurance', 'opportunity-cost'] },
  { id: 'trading', name: 'Trading Tools', description: 'Position sizing and risk management for traders', calculators: ['position-size', 'risk-reward', 'breakeven'] }
];

const CALCULATORS = {
  'mortgage': { name: 'Mortgage', icon: '🏠', desc: 'Calculate home loan EMI, total interest, and payment breakdown for your dream home purchase' },
  'emi': { name: 'EMI / Loan', icon: '💳', desc: 'Calculate monthly installments for car loans, personal loans, or any other financing' },
  'credit-card': { name: 'Credit Card Payoff', icon: '💳', desc: 'See how long to pay off credit card debt and how much interest you can save' },
  'amortization': { name: 'Amortization', icon: '📋', desc: 'View detailed month-by-month loan payment schedule with principal and interest split' },
  'compound-interest': { name: 'Compound Interest', icon: '📈', desc: 'See how your money grows over time with the power of compound interest' },
  'investment-growth': { name: 'Investment Growth', icon: '💰', desc: 'Project future value of your SIP or lump sum investments' },
  'xirr': { name: 'XIRR Calculator', icon: '📊', desc: 'Calculate exact returns on irregular investments like Chitti, SIPs with varying dates' },
  'expense-ratio': { name: 'Expense Ratio', icon: '📉', desc: 'See how mutual fund fees eat into your long-term returns over time' },
  'roi-cagr': { name: 'ROI & CAGR', icon: '📊', desc: 'Calculate total return and annualized growth rate on any investment' },
  'retirement': { name: 'Retirement', icon: '👴', desc: 'Plan how much you need to save for a comfortable retirement' },
  'fire': { name: 'FIRE', icon: '🔥', desc: 'Calculate your Financial Independence number and years to early retirement' },
  'savings-goal': { name: 'Savings Goal', icon: '🎯', desc: 'Find out how much to save monthly to reach your financial target' },
  'debt-snowball': { name: 'Debt Snowball', icon: '❄️', desc: 'Pay smallest debts first for quick wins and motivation' },
  'debt-avalanche': { name: 'Debt Avalanche', icon: '🏔️', desc: 'Pay highest interest debts first to minimize total interest paid' },
  'inflation': { name: 'Inflation Impact', icon: '📉', desc: 'See how inflation erodes your purchasing power over time' },
  'net-worth': { name: 'Net Worth', icon: '💎', desc: 'Track your total assets minus liabilities to measure financial health' },
  'life-insurance': { name: 'Life Insurance', icon: '🛡️', desc: 'Calculate how much life insurance coverage your family needs' },
  'opportunity-cost': { name: 'Opportunity Cost', icon: '⚖️', desc: 'Compare two investment options to make better financial decisions' },
  'position-size': { name: 'Position Size', icon: '📏', desc: 'Calculate optimal trade size based on your risk tolerance' },
  'risk-reward': { name: 'Risk/Reward', icon: '🎯', desc: 'Analyze potential profit vs loss ratio before entering a trade' },
  'breakeven': { name: 'Break-even', icon: '⚡', desc: 'Find how many units or sales needed to cover your costs' }
};

// Format utilities
const formatCurrency = (num, symbol) => {
  if (num === undefined || num === null || isNaN(num)) return `${symbol}0`;
  const formatted = Math.abs(num).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  return num < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
};

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// Chart Components
const AnimatedDonutChart = ({ data, colors = [theme.colors.accent, theme.colors.accentLight, '#6dd5b0'] }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(false); setTimeout(() => setAnimated(true), 100); }, [data]);
  if (!data || data.length === 0) return null;
  const validData = data.filter(d => d.value > 0);
  if (validData.length === 0) return <div className="chart-placeholder">No data to display</div>;
  const total = validData.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;
  
  return (
    <div className="chart-donut-container">
      <svg viewBox="0 0 100 100" className="chart-donut">
        {validData.map((item, i) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (startAngle + angle - 90) * Math.PI / 180;
          const x1 = 50 + 40 * Math.cos(startRad), y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad), y2 = 50 + 40 * Math.sin(endRad);
          return <path key={i} d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={colors[i % colors.length]} style={{ opacity: animated ? 1 : 0, transform: animated ? 'scale(1)' : 'scale(0.8)', transformOrigin: '50px 50px', transition: `all 0.5s ease ${i * 0.1}s` }} />;
        })}
        <circle cx="50" cy="50" r="25" fill="var(--bg-card)" />
      </svg>
      <div className="chart-legend">{validData.map((item, i) => (<div key={i} className="legend-item"><span className="legend-dot" style={{ background: colors[i % colors.length] }} /><span>{item.label}: {((item.value / total) * 100).toFixed(1)}%</span></div>))}</div>
    </div>
  );
};

const AnimatedBarChart = ({ data, colors = [theme.colors.accent] }) => {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(false); setTimeout(() => setAnimated(true), 100); }, [data]);
  if (!data || data.length === 0) return null;
  const validData = data.filter(d => d.value !== undefined && !isNaN(d.value));
  if (validData.length === 0) return null;
  const maxValue = Math.max(...validData.map(d => Math.abs(d.value)));
  return (
    <div className="chart-bar-container">
      {validData.slice(0, 8).map((item, i) => (
        <div key={i} className="chart-bar-row">
          <span className="chart-bar-label">{item.label}</span>
          <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: animated ? `${(Math.abs(item.value) / maxValue) * 100}%` : '0%', background: colors[i % colors.length], transition: `width 0.6s ease ${i * 0.05}s` }} /></div>
          <span className="chart-bar-value">{formatNumber(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

const ProgressRing = ({ progress, size = 160, strokeWidth = 12, color = theme.colors.accent }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;
  useEffect(() => { setTimeout(() => setAnimatedProgress(Math.min(Math.max(progress, 0), 100)), 100); }, [progress]);
  return (
    <div className="progress-ring-container">
      <svg width={size} height={size}><circle stroke="#e0dbd0" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} /><circle stroke={color} fill="transparent" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} r={radius} cx={size / 2} cy={size / 2} style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} /></svg>
      <div className="progress-ring-text"><span className="progress-ring-value">{animatedProgress.toFixed(0)}%</span></div>
    </div>
  );
};

const AdSpace = () => (<div className="ad-space"><div className="ad-placeholder"><span className="ad-label">Advertisement</span><div className="ad-content"><span>Your Ad Here</span><small>300x250</small></div></div></div>);

// Currency Selector
const CurrencySelector = ({ currency, setCurrency, currencies, compact = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => !search ? currencies : currencies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())), [search, currencies]);
  return (
    <div className={`currency-selector ${compact ? 'compact' : ''}`}>
      <button className="currency-btn" onClick={() => setShowDropdown(!showDropdown)}><span className="currency-symbol">{currency.symbol}</span><span className="currency-code">{currency.code}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6,9 12,15 18,9" /></svg></button>
      {showDropdown && (<div className="currency-dropdown"><div className="currency-search"><input type="text" placeholder="Search country..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus /></div><div className="currency-list">{filtered.map((c) => (<div key={c.code} className={`currency-item ${currency.code === c.code ? 'active' : ''}`} onClick={() => { setCurrency(c); setShowDropdown(false); setSearch(''); }}><span className="currency-item-name">{c.country} - {c.name}</span><span className="currency-item-symbol">{c.symbol}</span></div>))}</div></div>)}
    </div>
  );
};

// Input Components
const CurrencyInput = ({ label, value, onChange, symbol }) => (<div className="input-group"><label className="input-label">{label}</label><div className="input-with-symbol"><span className="input-symbol">{symbol}</span><input type="number" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} /></div></div>);
const PercentInput = ({ label, value, onChange }) => (<div className="input-group"><label className="input-label">{label}</label><div className="input-with-symbol input-with-suffix"><input type="number" step="0.1" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} /><span className="input-suffix">%</span></div></div>);
const NumberInput = ({ label, value, onChange, suffix = '' }) => (<div className="input-group"><label className="input-label">{label}</label><div className={suffix ? "input-with-symbol input-with-suffix" : ""}><input type="number" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />{suffix && <span className="input-suffix">{suffix}</span>}</div></div>);
const ResultItem = ({ label, value, highlight, positive, negative }) => (<div className="result-item"><div className="result-label">{label}</div><div className={`result-value ${highlight ? 'highlight' : ''} ${positive ? 'positive' : ''} ${negative ? 'negative' : ''}`}>{value}</div></div>);

// Dashboard
const Dashboard = ({ setActiveCalculator, currency, setCurrency }) => (
  <div className="dashboard">
    <div className="dashboard-header"><div><h1 className="dashboard-title">Financial Calculators</h1><p className="dashboard-subtitle">Free tools to help you make smarter financial decisions</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} /></div>
    {CATEGORIES.map((category) => (<div key={category.id} className="category-section"><div className="category-header"><h2 className="category-title">{category.name}</h2><p className="category-desc">{category.description}</p></div><div className="calculator-grid">{category.calculators.map((calcId) => { const calc = CALCULATORS[calcId]; if (!calc) return null; return (<div key={calcId} className="calculator-card" onClick={() => setActiveCalculator(calcId)}><div className="calc-card-icon">{calc.icon}</div><h3 className="calc-card-name">{calc.name}</h3><p className="calc-card-desc">{calc.desc}</p></div>); })}</div></div>))}
  </div>
);

// 1. Mortgage Calculator
const MortgageCalculator = ({ symbol, currency, setCurrency }) => {
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const results = useMemo(() => {
    const principal = Math.max(0, homePrice - downPayment);
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    let monthlyPI = principal > 0 && numPayments > 0 ? (monthlyRate === 0 ? principal / numPayments : principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)) : 0;
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = Math.max(0, totalPaid - principal);
    return { monthlyPayment: monthlyPI, totalInterest, totalPaid, principal, chartData: [{ label: 'Principal', value: principal }, { label: 'Interest', value: totalInterest }].filter(d => d.value > 0) };
  }, [homePrice, downPayment, rate, term]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Mortgage Calculator</h2><p className="calc-subtitle">Calculate your home loan payments</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Home Price" value={homePrice} onChange={setHomePrice} symbol={symbol} /><CurrencyInput label="Down Payment" value={downPayment} onChange={setDownPayment} symbol={symbol} /><PercentInput label="Interest Rate" value={rate} onChange={setRate} /><NumberInput label="Loan Term" value={term} onChange={setTerm} suffix="years" /></div><div className="calc-results"><ResultItem label="Monthly Payment" value={formatCurrency(results.monthlyPayment, symbol)} highlight /><ResultItem label="Loan Amount" value={formatCurrency(results.principal, symbol)} /><ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} /><ResultItem label="Total Cost" value={formatCurrency(results.totalPaid, symbol)} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Cost Breakdown</h3><AnimatedDonutChart data={results.chartData} /></div><AdSpace /></div></div>
  );
};

// 2. EMI Calculator
const EMICalculator = ({ symbol, currency, setCurrency }) => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [term, setTerm] = useState(36);
  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let emi = monthlyRate === 0 ? loanAmount / term : loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPaid = emi * term;
    return { emi, totalPaid, totalInterest: totalPaid - loanAmount, chartData: [{ label: 'Principal', value: loanAmount }, { label: 'Interest', value: Math.max(0, totalPaid - loanAmount) }].filter(d => d.value > 0) };
  }, [loanAmount, rate, term]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">EMI / Loan Calculator</h2><p className="calc-subtitle">Calculate equated monthly installments</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} symbol={symbol} /><PercentInput label="Interest Rate (Annual)" value={rate} onChange={setRate} /><NumberInput label="Loan Term" value={term} onChange={setTerm} suffix="months" /></div><div className="calc-results"><ResultItem label="Monthly EMI" value={formatCurrency(results.emi, symbol)} highlight /><ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} /><ResultItem label="Total Payment" value={formatCurrency(results.totalPaid, symbol)} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Payment Breakdown</h3><AnimatedDonutChart data={results.chartData} /></div><AdSpace /></div></div>
  );
};

// 3. Credit Card Payoff Calculator
const CreditCardCalculator = ({ symbol, currency, setCurrency }) => {
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(36);
  const [minPaymentPercent, setMinPaymentPercent] = useState(5);
  const [fixedPayment, setFixedPayment] = useState(5000);
  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    // Minimum payment scenario
    let balanceMin = balance, monthsMin = 0, totalPaidMin = 0;
    while (balanceMin > 0.01 && monthsMin < 600) {
      const minPay = Math.max(balanceMin * minPaymentPercent / 100, 100);
      const interest = balanceMin * monthlyRate;
      const principal = Math.min(minPay - interest, balanceMin);
      if (principal <= 0) break;
      balanceMin -= principal;
      totalPaidMin += minPay;
      monthsMin++;
    }
    // Fixed payment scenario
    let balanceFixed = balance, monthsFixed = 0, totalPaidFixed = 0;
    if (fixedPayment > balance * monthlyRate) {
      while (balanceFixed > 0.01 && monthsFixed < 600) {
        const interest = balanceFixed * monthlyRate;
        const principal = Math.min(fixedPayment - interest, balanceFixed);
        balanceFixed -= principal;
        totalPaidFixed += balanceFixed > 0 ? fixedPayment : principal + interest;
        monthsFixed++;
      }
    }
    return { minMonths: monthsMin, minTotalPaid: totalPaidMin, minInterest: totalPaidMin - balance, fixedMonths: monthsFixed, fixedTotalPaid: totalPaidFixed, fixedInterest: totalPaidFixed - balance, timeSaved: monthsMin - monthsFixed, interestSaved: totalPaidMin - totalPaidFixed };
  }, [balance, rate, minPaymentPercent, fixedPayment]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Credit Card Payoff Calculator</h2><p className="calc-subtitle">See how faster payments save money</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Credit Card Balance" value={balance} onChange={setBalance} symbol={symbol} /><PercentInput label="Interest Rate (APR)" value={rate} onChange={setRate} /><PercentInput label="Minimum Payment %" value={minPaymentPercent} onChange={setMinPaymentPercent} /><CurrencyInput label="Your Fixed Payment" value={fixedPayment} onChange={setFixedPayment} symbol={symbol} /></div><div className="calc-results"><ResultItem label="With Minimum Payments" value={`${results.minMonths} months`} negative /><ResultItem label="Interest (Min Pay)" value={formatCurrency(results.minInterest, symbol)} negative /><ResultItem label="With Fixed Payment" value={`${results.fixedMonths} months`} positive /><ResultItem label="Interest (Fixed)" value={formatCurrency(results.fixedInterest, symbol)} /><ResultItem label="Time Saved" value={`${results.timeSaved} months`} positive /><ResultItem label="Interest Saved" value={formatCurrency(results.interestSaved, symbol)} highlight /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Interest Comparison</h3><AnimatedBarChart data={[{ label: 'Min Payment', value: results.minInterest }, { label: 'Fixed Payment', value: results.fixedInterest }]} colors={['#e57373', theme.colors.accent]} /></div><AdSpace /></div></div>
  );
};

// 4. Amortization Calculator
const AmortizationCalculator = ({ symbol, currency, setCurrency }) => {
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [rate, setRate] = useState(9);
  const [term, setTerm] = useState(120);
  const [extraPayment, setExtraPayment] = useState(5000);
  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let emi = monthlyRate === 0 ? loanAmount / term : loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    let balance = loanAmount, totalInterest = 0;
    const schedule = [];
    for (let month = 1; month <= term && balance > 0; month++) {
      const interest = balance * monthlyRate;
      const principal = Math.min(emi - interest, balance);
      balance = Math.max(0, balance - principal);
      totalInterest += interest;
      if (month <= 12 || month % 12 === 0 || month === term) schedule.push({ month, emi, principal, interest, balance });
    }
    let balanceExtra = loanAmount, totalInterestExtra = 0, monthsExtra = 0;
    while (balanceExtra > 0.01 && monthsExtra < term) {
      monthsExtra++;
      const interest = balanceExtra * monthlyRate;
      balanceExtra = Math.max(0, balanceExtra + interest - emi - extraPayment);
      totalInterestExtra += interest;
    }
    return { emi, totalInterest, totalPaid: loanAmount + totalInterest, schedule, monthsSaved: term - monthsExtra, interestSaved: totalInterest - totalInterestExtra, earlyPayoffMonths: monthsExtra };
  }, [loanAmount, rate, term, extraPayment]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Amortization Schedule</h2><p className="calc-subtitle">Detailed loan payment breakdown</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} symbol={symbol} /><PercentInput label="Interest Rate (Annual)" value={rate} onChange={setRate} /><NumberInput label="Loan Term" value={term} onChange={setTerm} suffix="months" /><CurrencyInput label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} symbol={symbol} /><table className="amort-table"><thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{results.schedule.map(row => (<tr key={row.month}><td>Month {row.month}</td><td>{formatCurrency(row.emi, symbol)}</td><td>{formatCurrency(row.principal, symbol)}</td><td>{formatCurrency(row.interest, symbol)}</td><td>{formatCurrency(row.balance, symbol)}</td></tr>))}</tbody></table></div><div className="calc-results"><ResultItem label="Monthly EMI" value={formatCurrency(results.emi, symbol)} highlight /><ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} /><ResultItem label="Total Payment" value={formatCurrency(results.totalPaid, symbol)} />{extraPayment > 0 && (<><div className="result-divider"><strong>With Extra Payment</strong></div><ResultItem label="Months Saved" value={`${results.monthsSaved} months`} positive /><ResultItem label="Interest Saved" value={formatCurrency(results.interestSaved, symbol)} positive /></>)}</div></div></div></div></div>
  );
};

// 5. Compound Interest Calculator
const CompoundInterestCalculator = ({ symbol, currency, setCurrency }) => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [monthlyContrib, setMonthlyContrib] = useState(5000);
  const results = useMemo(() => {
    const r = rate / 100, t = years;
    const fvPrincipal = principal * Math.pow(1 + r/12, 12*t);
    const totalContributions = monthlyContrib * 12 * t;
    let fvContributions = monthlyContrib > 0 && r > 0 ? monthlyContrib * ((Math.pow(1 + r/12, 12*t) - 1) / (r/12)) * (1 + r/12) : totalContributions;
    const totalValue = fvPrincipal + fvContributions;
    const yearlyData = [];
    for (let y = 0; y <= t; y += Math.max(1, Math.ceil(t/6))) {
      const fv = principal * Math.pow(1 + r/12, 12*y);
      let fvc = monthlyContrib > 0 && r > 0 && y > 0 ? monthlyContrib * ((Math.pow(1 + r/12, 12*y) - 1) / (r/12)) * (1 + r/12) : monthlyContrib * 12 * y;
      yearlyData.push({ label: `Year ${y}`, value: fv + fvc });
    }
    return { totalValue, totalInterest: totalValue - principal - totalContributions, totalContributions, yearlyData };
  }, [principal, rate, years, monthlyContrib]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Compound Interest Calculator</h2><p className="calc-subtitle">See the power of compound growth</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Initial Investment" value={principal} onChange={setPrincipal} symbol={symbol} /><CurrencyInput label="Monthly SIP" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} /><PercentInput label="Annual Interest Rate" value={rate} onChange={setRate} /><NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Future Value" value={formatCurrency(results.totalValue, symbol)} highlight /><ResultItem label="Interest Earned" value={formatCurrency(results.totalInterest, symbol)} positive /><ResultItem label="Total Contributions" value={formatCurrency(results.totalContributions + principal, symbol)} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Growth Over Time</h3><AnimatedBarChart data={results.yearlyData} /></div><AdSpace /></div></div>
  );
};

// 6. Investment Growth Calculator
const InvestmentGrowthCalculator = ({ symbol, currency, setCurrency }) => {
  const [initial, setInitial] = useState(100000);
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const fvLumpsum = initial * Math.pow(1 + monthlyRate, months);
    const fvContributions = monthlyRate > 0 ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate) : monthly * months;
    const totalValue = fvLumpsum + fvContributions;
    const totalInvested = initial + (monthly * months);
    const yearlyData = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.ceil(years/6))) {
      const m = y * 12;
      const fvl = initial * Math.pow(1 + monthlyRate, m);
      const fvc = monthlyRate > 0 && m > 0 ? monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate) : monthly * m;
      yearlyData.push({ label: `Year ${y}`, value: fvl + fvc });
    }
    return { totalValue, totalInvested, totalGains: totalValue - totalInvested, yearlyData };
  }, [initial, monthly, rate, years]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Investment Growth Calculator</h2><p className="calc-subtitle">Project future value of your investments</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Initial Investment" value={initial} onChange={setInitial} symbol={symbol} /><CurrencyInput label="Monthly SIP" value={monthly} onChange={setMonthly} symbol={symbol} /><PercentInput label="Expected Annual Return" value={rate} onChange={setRate} /><NumberInput label="Investment Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Future Value" value={formatCurrency(results.totalValue, symbol)} highlight /><ResultItem label="Total Invested" value={formatCurrency(results.totalInvested, symbol)} /><ResultItem label="Total Gains" value={formatCurrency(results.totalGains, symbol)} positive /><ResultItem label="ROI" value={`${((results.totalGains / results.totalInvested) * 100).toFixed(1)}%`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Growth Projection</h3><AnimatedBarChart data={results.yearlyData} /></div><AdSpace /></div></div>
  );
};

// 7. XIRR Calculator
const XIRRCalculator = ({ symbol, currency, setCurrency }) => {
  const [cashflows, setCashflows] = useState([{ date: '2024-01-15', amount: -10000 }, { date: '2024-02-15', amount: -10000 }, { date: '2024-03-15', amount: -10000 }, { date: '2024-04-15', amount: -10000 }, { date: '2024-05-15', amount: -10000 }, { date: '2024-06-15', amount: -10000 }, { date: '2024-07-15', amount: 75000 }]);
  const addCashflow = () => { const lastDate = cashflows.length > 0 ? new Date(cashflows[cashflows.length - 1].date) : new Date(); lastDate.setMonth(lastDate.getMonth() + 1); setCashflows([...cashflows, { date: lastDate.toISOString().split('T')[0], amount: 0 }]); };
  const removeCashflow = (index) => setCashflows(cashflows.filter((_, i) => i !== index));
  const updateCashflow = (index, field, value) => { const n = [...cashflows]; n[index][field] = field === 'amount' ? parseFloat(value) || 0 : value; setCashflows(n); };
  const calculateXIRR = (cfs) => { if (cfs.length < 2) return null; const sorted = [...cfs].sort((a, b) => new Date(a.date) - new Date(b.date)); const fd = new Date(sorted[0].date); const xnpv = (r, c, f) => c.reduce((s, cf) => s + cf.amount / Math.pow(1 + r, (new Date(cf.date) - f) / (1000 * 60 * 60 * 24 * 365)), 0); const xnpvD = (r, c, f) => c.reduce((s, cf) => { const d = (new Date(cf.date) - f) / (1000 * 60 * 60 * 24); return s - (d / 365) * cf.amount / Math.pow(1 + r, d / 365 + 1); }, 0); let rate = 0.1; for (let i = 0; i < 100; i++) { const npv = xnpv(rate, sorted, fd); const deriv = xnpvD(rate, sorted, fd); if (Math.abs(deriv) < 1e-10) break; const newR = rate - npv / deriv; if (Math.abs(newR - rate) < 1e-10) break; rate = newR; } return rate; };
  const results = useMemo(() => { const totalInvested = cashflows.filter(c => c.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0); const totalReceived = cashflows.filter(c => c.amount > 0).reduce((s, c) => s + c.amount, 0); const xirr = calculateXIRR(cashflows); return { totalInvested, totalReceived, netProfit: totalReceived - totalInvested, xirr: xirr !== null ? xirr * 100 : null, absoluteReturn: totalInvested > 0 ? ((totalReceived - totalInvested) / totalInvested) * 100 : 0 }; }, [cashflows]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">XIRR Calculator</h2><p className="calc-subtitle">Calculate returns on irregular investments (Chitti, SIP)</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body calc-body-xirr"><div className="calc-inputs calc-inputs-wide"><p className="input-hint">Enter dates and amounts. Negative for investments, positive for returns.</p><div className="cashflow-list">{cashflows.map((cf, i) => (<div key={i} className="cashflow-item"><input type="date" className="input-field cashflow-date" value={cf.date} onChange={(e) => updateCashflow(i, 'date', e.target.value)} /><div className="input-with-symbol cashflow-amount"><span className="input-symbol">{symbol}</span><input type="number" className="input-field" value={cf.amount} onChange={(e) => updateCashflow(i, 'amount', e.target.value)} /></div><span className={`cashflow-type ${cf.amount < 0 ? 'outflow' : 'inflow'}`}>{cf.amount < 0 ? 'Investment' : 'Return'}</span><button className="remove-btn" onClick={() => removeCashflow(i)}>✕</button></div>))}</div><button className="add-btn" onClick={addCashflow}>+ Add Cash Flow</button></div><div className="calc-results"><ResultItem label="XIRR (Annualized)" value={results.xirr !== null ? `${results.xirr.toFixed(2)}%` : 'N/A'} highlight positive={results.xirr > 0} negative={results.xirr < 0} /><ResultItem label="Absolute Return" value={`${results.absoluteReturn.toFixed(2)}%`} positive={results.absoluteReturn > 0} /><ResultItem label="Total Invested" value={formatCurrency(results.totalInvested, symbol)} /><ResultItem label="Total Received" value={formatCurrency(results.totalReceived, symbol)} /><ResultItem label={results.netProfit >= 0 ? "Net Profit" : "Net Loss"} value={formatCurrency(Math.abs(results.netProfit), symbol)} positive={results.netProfit >= 0} negative={results.netProfit < 0} /></div></div></div></div></div>
  );
};

// 8. Expense Ratio Calculator
const ExpenseRatioCalculator = ({ symbol, currency, setCurrency }) => {
  const [investmentAmount, setInvestmentAmount] = useState(1000000);
  const [grossReturn, setGrossReturn] = useState(12);
  const [expenseRatio, setExpenseRatio] = useState(1.5);
  const [years, setYears] = useState(20);
  const results = useMemo(() => {
    const fvGross = investmentAmount * Math.pow(1 + grossReturn / 100, years);
    const fvNet = investmentAmount * Math.pow(1 + (grossReturn - expenseRatio) / 100, years);
    const wealthLost = fvGross - fvNet;
    const yearlyData = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.floor(years / 6))) { yearlyData.push({ label: `Year ${y}`, value: investmentAmount * Math.pow(1 + grossReturn / 100, y) - investmentAmount * Math.pow(1 + (grossReturn - expenseRatio) / 100, y) }); }
    return { fvGross, fvNet, wealthLost, percentLost: (wealthLost / fvGross) * 100, yearlyData };
  }, [investmentAmount, grossReturn, expenseRatio, years]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Expense Ratio Impact</h2><p className="calc-subtitle">See how fund fees eat into your returns</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Investment Amount" value={investmentAmount} onChange={setInvestmentAmount} symbol={symbol} /><PercentInput label="Gross Return (Before Fees)" value={grossReturn} onChange={setGrossReturn} /><PercentInput label="Expense Ratio" value={expenseRatio} onChange={setExpenseRatio} /><NumberInput label="Investment Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Value Without Fees" value={formatCurrency(results.fvGross, symbol)} /><ResultItem label="Value After Fees" value={formatCurrency(results.fvNet, symbol)} highlight /><ResultItem label="Wealth Lost to Fees" value={formatCurrency(results.wealthLost, symbol)} negative /><ResultItem label="Percentage Lost" value={`${results.percentLost.toFixed(1)}%`} negative /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Fee Impact Over Time</h3><AnimatedBarChart data={results.yearlyData} colors={['#e57373']} /></div><AdSpace /></div></div>
  );
};

// 9. ROI & CAGR Calculator
const ROICAGRCalculator = ({ symbol, currency, setCurrency }) => {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(250000);
  const [years, setYears] = useState(5);
  const results = useMemo(() => {
    const roi = ((finalValue - initialValue) / initialValue) * 100;
    const cagr = years > 0 && initialValue > 0 ? (Math.pow(finalValue / initialValue, 1/years) - 1) * 100 : 0;
    return { roi, cagr, profitLoss: finalValue - initialValue };
  }, [initialValue, finalValue, years]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">ROI & CAGR Calculator</h2><p className="calc-subtitle">Calculate return on investment</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Initial Value" value={initialValue} onChange={setInitialValue} symbol={symbol} /><CurrencyInput label="Final Value" value={finalValue} onChange={setFinalValue} symbol={symbol} /><NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Total ROI" value={`${results.roi.toFixed(2)}%`} highlight positive={results.roi > 0} negative={results.roi < 0} /><ResultItem label="CAGR" value={`${results.cagr.toFixed(2)}%`} positive={results.cagr > 0} /><ResultItem label={results.profitLoss >= 0 ? "Profit" : "Loss"} value={formatCurrency(Math.abs(results.profitLoss), symbol)} positive={results.profitLoss >= 0} negative={results.profitLoss < 0} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Return Analysis</h3><ProgressRing progress={Math.min(Math.abs(results.roi) / 2, 100)} color={results.roi > 0 ? theme.colors.accent : '#e57373'} /><p className="chart-note">{results.roi.toFixed(1)}% Total Return</p></div><AdSpace /></div></div>
  );
};

// 10. Retirement Calculator
const RetirementCalculator = ({ symbol, currency, setCurrency }) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(55);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlyContrib, setMonthlyContrib] = useState(20000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [inflation, setInflation] = useState(6);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const results = useMemo(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    const fvSavings = currentSavings * Math.pow(1 + monthlyRate, months);
    const fvContributions = monthlyRate > 0 ? monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate) : monthlyContrib * months;
    const retirementCorpus = fvSavings + fvContributions;
    const inflationAdjustedExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const requiredCorpus = inflationAdjustedExpense * 12 * 25;
    return { retirementCorpus, requiredCorpus, surplusDeficit: retirementCorpus - requiredCorpus, monthlyExpenseAtRetirement: inflationAdjustedExpense, yearsToRetirement };
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, expectedReturn, inflation, monthlyExpense]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Retirement Calculator</h2><p className="calc-subtitle">Plan for a comfortable retirement</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} suffix="years" /><NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="years" /><CurrencyInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} symbol={symbol} /><CurrencyInput label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} /><PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} /><PercentInput label="Inflation Rate" value={inflation} onChange={setInflation} /><CurrencyInput label="Monthly Expense (Today)" value={monthlyExpense} onChange={setMonthlyExpense} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Your Retirement Corpus" value={formatCurrency(results.retirementCorpus, symbol)} highlight /><ResultItem label="Required Corpus" value={formatCurrency(results.requiredCorpus, symbol)} /><ResultItem label={results.surplusDeficit >= 0 ? "Surplus" : "Shortfall"} value={formatCurrency(Math.abs(results.surplusDeficit), symbol)} positive={results.surplusDeficit >= 0} negative={results.surplusDeficit < 0} /><ResultItem label="Monthly Expense at Retirement" value={formatCurrency(results.monthlyExpenseAtRetirement, symbol)} /><ResultItem label="Years to Retirement" value={`${results.yearsToRetirement} years`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Corpus Comparison</h3><AnimatedBarChart data={[{ label: 'Your Corpus', value: results.retirementCorpus }, { label: 'Required', value: results.requiredCorpus }]} colors={[theme.colors.accent, '#e57373']} /></div><AdSpace /></div></div>
  );
};

// 11. FIRE Calculator
const FIRECalculator = ({ symbol, currency, setCurrency }) => {
  const [annualExpenses, setAnnualExpenses] = useState(600000);
  const [currentNetWorth, setCurrentNetWorth] = useState(1000000);
  const [annualSavings, setAnnualSavings] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const results = useMemo(() => {
    const fireNumber = annualExpenses / (withdrawalRate / 100);
    let yearsToFire = 0, current = currentNetWorth;
    if (current < fireNumber) { while (current < fireNumber && yearsToFire < 100) { current = current * (1 + expectedReturn / 100) + annualSavings; yearsToFire++; } }
    return { fireNumber, yearsToFire, savingsRate: (annualSavings / (annualExpenses + annualSavings)) * 100, progress: Math.min((currentNetWorth / fireNumber) * 100, 100) };
  }, [annualExpenses, currentNetWorth, annualSavings, expectedReturn, withdrawalRate]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">FIRE Calculator</h2><p className="calc-subtitle">Financial Independence, Retire Early</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} symbol={symbol} /><CurrencyInput label="Current Net Worth" value={currentNetWorth} onChange={setCurrentNetWorth} symbol={symbol} /><CurrencyInput label="Annual Savings" value={annualSavings} onChange={setAnnualSavings} symbol={symbol} /><PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} /><PercentInput label="Safe Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} /></div><div className="calc-results"><ResultItem label="FIRE Number" value={formatCurrency(results.fireNumber, symbol)} highlight /><ResultItem label="Years to FIRE" value={results.yearsToFire === 0 ? "You're FI!" : `${results.yearsToFire} years`} positive={results.yearsToFire === 0} /><ResultItem label="Progress" value={`${results.progress.toFixed(1)}%`} /><ResultItem label="Savings Rate" value={`${results.savingsRate.toFixed(1)}%`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>FIRE Progress</h3><ProgressRing progress={results.progress} /><p className="chart-note">Target: {formatCurrency(results.fireNumber, symbol)}</p></div><AdSpace /></div></div>
  );
};

// 12. Savings Goal Calculator
const SavingsGoalCalculator = ({ symbol, currency, setCurrency }) => {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [timeMonths, setTimeMonths] = useState(36);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, timeMonths);
    const remainingTarget = targetAmount - fvCurrent;
    let monthlySavingsNeeded = 0;
    if (remainingTarget > 0) { monthlySavingsNeeded = monthlyRate === 0 ? remainingTarget / timeMonths : remainingTarget * monthlyRate / ((Math.pow(1 + monthlyRate, timeMonths) - 1) * (1 + monthlyRate)); }
    const totalSavings = monthlySavingsNeeded * timeMonths;
    return { monthlySavingsNeeded: Math.max(0, monthlySavingsNeeded), totalSavings, totalInterest: Math.max(0, targetAmount - currentSavings - totalSavings), fvCurrent, progress: Math.min((currentSavings / targetAmount) * 100, 100) };
  }, [targetAmount, timeMonths, expectedReturn, currentSavings]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Savings Goal Calculator</h2><p className="calc-subtitle">Find out how much to save monthly</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Target Amount" value={targetAmount} onChange={setTargetAmount} symbol={symbol} /><NumberInput label="Time to Goal" value={timeMonths} onChange={setTimeMonths} suffix="months" /><PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} /><CurrencyInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Monthly Savings Needed" value={formatCurrency(results.monthlySavingsNeeded, symbol)} highlight /><ResultItem label="Total You'll Save" value={formatCurrency(results.totalSavings, symbol)} /><ResultItem label="Interest Earned" value={formatCurrency(results.totalInterest, symbol)} positive /><ResultItem label="Current Progress" value={`${results.progress.toFixed(1)}%`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Goal Progress</h3><ProgressRing progress={results.progress} /><p className="chart-note">Target: {formatCurrency(targetAmount, symbol)}</p></div><AdSpace /></div></div>
  );
};

// 13. Debt Snowball Calculator
const DebtSnowballCalculator = ({ symbol, currency, setCurrency }) => {
  const [debts, setDebts] = useState([{ name: 'Credit Card', balance: 50000, rate: 36, minPayment: 2500 }, { name: 'Personal Loan', balance: 200000, rate: 14, minPayment: 8000 }, { name: 'Car Loan', balance: 300000, rate: 9, minPayment: 12000 }]);
  const [monthlyBudget, setMonthlyBudget] = useState(30000);
  const addDebt = () => setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 10000, rate: 12, minPayment: 500 }]);
  const removeDebt = (i) => setDebts(debts.filter((_, idx) => idx !== i));
  const updateDebt = (i, f, v) => { const n = [...debts]; n[i][f] = f === 'name' ? v : parseFloat(v) || 0; setDebts(n); };
  const results = useMemo(() => {
    if (debts.length === 0) return { totalMonths: 0, totalInterest: 0, payoffOrder: [] };
    const sorted = [...debts].sort((a, b) => a.balance - b.balance);
    let totalInterestPaid = 0, months = 0;
    const payoffOrder = [];
    const active = sorted.map(d => ({ ...d, remaining: d.balance }));
    while (active.some(d => d.remaining > 0.01) && months < 600) {
      months++;
      const totalMin = active.filter(d => d.remaining > 0).reduce((s, d) => s + d.minPayment, 0);
      let extra = monthlyBudget - totalMin;
      for (const debt of active) {
        if (debt.remaining <= 0.01) continue;
        const interest = debt.remaining * (debt.rate / 100 / 12);
        totalInterestPaid += interest;
        let payment = debt.minPayment;
        if (debt === active.find(d => d.remaining > 0.01)) payment += Math.max(0, extra);
        debt.remaining = Math.max(0, debt.remaining + interest - payment);
        if (debt.remaining <= 0.01 && !payoffOrder.find(p => p.name === debt.name)) payoffOrder.push({ name: debt.name, month: months });
      }
    }
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
    return { totalMonths: months, totalYears: months / 12, totalInterest: totalInterestPaid, totalPaid: totalDebt + totalInterestPaid, payoffOrder };
  }, [debts, monthlyBudget]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Debt Snowball Calculator</h2><p className="calc-subtitle">Pay smallest debts first for quick wins</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs">{debts.map((d, i) => (<div key={i} className="debt-item"><div className="debt-header"><input type="text" className="debt-name-input" value={d.name} onChange={(e) => updateDebt(i, 'name', e.target.value)} /><button className="remove-btn" onClick={() => removeDebt(i)}>✕</button></div><div className="debt-fields"><div className="input-group"><label className="input-label">Balance</label><input type="number" className="input-field" value={d.balance} onChange={(e) => updateDebt(i, 'balance', e.target.value)} /></div><div className="input-group"><label className="input-label">Rate %</label><input type="number" className="input-field" value={d.rate} onChange={(e) => updateDebt(i, 'rate', e.target.value)} /></div><div className="input-group"><label className="input-label">Min Pay</label><input type="number" className="input-field" value={d.minPayment} onChange={(e) => updateDebt(i, 'minPayment', e.target.value)} /></div></div></div>))}<button className="add-btn" onClick={addDebt}>+ Add Debt</button><CurrencyInput label="Monthly Budget for Debt" value={monthlyBudget} onChange={setMonthlyBudget} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Debt-Free In" value={`${results.totalMonths} months (${results.totalYears?.toFixed(1)} yrs)`} highlight /><ResultItem label="Total Interest Paid" value={formatCurrency(results.totalInterest, symbol)} /><ResultItem label="Total Paid" value={formatCurrency(results.totalPaid, symbol)} />{results.payoffOrder.length > 0 && (<div className="payoff-timeline"><div className="result-label">Payoff Order</div>{results.payoffOrder.map((p, i) => (<div key={i} className="payoff-item"><span className="payoff-num">{i + 1}</span><span className="payoff-name">{p.name}</span><span className="payoff-month">Month {p.month}</span></div>))}</div>)}</div></div></div></div></div>
  );
};

// 14. Debt Avalanche Calculator
const DebtAvalancheCalculator = ({ symbol, currency, setCurrency }) => {
  const [debts, setDebts] = useState([{ name: 'Credit Card', balance: 50000, rate: 36, minPayment: 2500 }, { name: 'Personal Loan', balance: 200000, rate: 14, minPayment: 8000 }, { name: 'Car Loan', balance: 300000, rate: 9, minPayment: 12000 }]);
  const [monthlyBudget, setMonthlyBudget] = useState(30000);
  const addDebt = () => setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 10000, rate: 12, minPayment: 500 }]);
  const removeDebt = (i) => setDebts(debts.filter((_, idx) => idx !== i));
  const updateDebt = (i, f, v) => { const n = [...debts]; n[i][f] = f === 'name' ? v : parseFloat(v) || 0; setDebts(n); };
  const results = useMemo(() => {
    if (debts.length === 0) return { totalMonths: 0, totalInterest: 0, payoffOrder: [] };
    const sorted = [...debts].sort((a, b) => b.rate - a.rate); // Highest rate first
    let totalInterestPaid = 0, months = 0;
    const payoffOrder = [];
    const active = sorted.map(d => ({ ...d, remaining: d.balance }));
    while (active.some(d => d.remaining > 0.01) && months < 600) {
      months++;
      const totalMin = active.filter(d => d.remaining > 0).reduce((s, d) => s + d.minPayment, 0);
      let extra = monthlyBudget - totalMin;
      for (const debt of active) {
        if (debt.remaining <= 0.01) continue;
        const interest = debt.remaining * (debt.rate / 100 / 12);
        totalInterestPaid += interest;
        let payment = debt.minPayment;
        if (debt === active.find(d => d.remaining > 0.01)) payment += Math.max(0, extra);
        debt.remaining = Math.max(0, debt.remaining + interest - payment);
        if (debt.remaining <= 0.01 && !payoffOrder.find(p => p.name === debt.name)) payoffOrder.push({ name: debt.name, month: months });
      }
    }
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
    return { totalMonths: months, totalYears: months / 12, totalInterest: totalInterestPaid, totalPaid: totalDebt + totalInterestPaid, payoffOrder };
  }, [debts, monthlyBudget]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Debt Avalanche Calculator</h2><p className="calc-subtitle">Pay highest interest first to save money</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs">{debts.map((d, i) => (<div key={i} className="debt-item"><div className="debt-header"><input type="text" className="debt-name-input" value={d.name} onChange={(e) => updateDebt(i, 'name', e.target.value)} /><button className="remove-btn" onClick={() => removeDebt(i)}>✕</button></div><div className="debt-fields"><div className="input-group"><label className="input-label">Balance</label><input type="number" className="input-field" value={d.balance} onChange={(e) => updateDebt(i, 'balance', e.target.value)} /></div><div className="input-group"><label className="input-label">Rate %</label><input type="number" className="input-field" value={d.rate} onChange={(e) => updateDebt(i, 'rate', e.target.value)} /></div><div className="input-group"><label className="input-label">Min Pay</label><input type="number" className="input-field" value={d.minPayment} onChange={(e) => updateDebt(i, 'minPayment', e.target.value)} /></div></div></div>))}<button className="add-btn" onClick={addDebt}>+ Add Debt</button><CurrencyInput label="Monthly Budget for Debt" value={monthlyBudget} onChange={setMonthlyBudget} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Debt-Free In" value={`${results.totalMonths} months (${results.totalYears?.toFixed(1)} yrs)`} highlight /><ResultItem label="Total Interest Paid" value={formatCurrency(results.totalInterest, symbol)} /><ResultItem label="Total Paid" value={formatCurrency(results.totalPaid, symbol)} />{results.payoffOrder.length > 0 && (<div className="payoff-timeline"><div className="result-label">Payoff Order (by Rate)</div>{results.payoffOrder.map((p, i) => (<div key={i} className="payoff-item"><span className="payoff-num">{i + 1}</span><span className="payoff-name">{p.name}</span><span className="payoff-month">Month {p.month}</span></div>))}</div>)}</div></div></div></div></div>
  );
};

// 15. Inflation Calculator
const InflationCalculator = ({ symbol, currency, setCurrency }) => {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);
  const results = useMemo(() => {
    const futureCost = currentAmount * Math.pow(1 + inflationRate / 100, years);
    const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
    const yearlyData = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.ceil(years / 6))) { yearlyData.push({ label: `Year ${y}`, value: currentAmount * Math.pow(1 + inflationRate / 100, y) }); }
    return { futureCost, purchasingPower, purchasingPowerLoss: currentAmount - purchasingPower, yearlyData };
  }, [currentAmount, inflationRate, years]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Inflation Impact Calculator</h2><p className="calc-subtitle">See how inflation erodes purchasing power</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Current Amount" value={currentAmount} onChange={setCurrentAmount} symbol={symbol} /><PercentInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} /><NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Future Cost (Same Item)" value={formatCurrency(results.futureCost, symbol)} highlight /><ResultItem label="Future Purchasing Power" value={formatCurrency(results.purchasingPower, symbol)} negative /><ResultItem label="Purchasing Power Lost" value={formatCurrency(results.purchasingPowerLoss, symbol)} negative /><ResultItem label="Inflation Multiple" value={`${(results.futureCost / currentAmount).toFixed(2)}x`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Cost Increase Over Time</h3><AnimatedBarChart data={results.yearlyData} colors={['#e57373']} /></div><AdSpace /></div></div>
  );
};

// 16. Net Worth Calculator
const NetWorthCalculator = ({ symbol, currency, setCurrency }) => {
  const [assets, setAssets] = useState([{ name: 'Savings', value: 200000, category: 'Cash' }, { name: 'FD', value: 500000, category: 'Cash' }, { name: 'Mutual Funds', value: 800000, category: 'Investments' }, { name: 'Property', value: 5000000, category: 'Property' }]);
  const [liabilities, setLiabilities] = useState([{ name: 'Home Loan', value: 3500000, category: 'Property' }, { name: 'Car Loan', value: 400000, category: 'Auto' }]);
  const addAsset = () => setAssets([...assets, { name: 'New Asset', value: 0, category: 'Other' }]);
  const addLiability = () => setLiabilities([...liabilities, { name: 'New Liability', value: 0, category: 'Other' }]);
  const removeAsset = (i) => setAssets(assets.filter((_, idx) => idx !== i));
  const removeLiability = (i) => setLiabilities(liabilities.filter((_, idx) => idx !== i));
  const updateAsset = (i, f, v) => { const n = [...assets]; n[i][f] = f === 'value' ? parseFloat(v) || 0 : v; setAssets(n); };
  const updateLiability = (i, f, v) => { const n = [...liabilities]; n[i][f] = f === 'value' ? parseFloat(v) || 0 : v; setLiabilities(n); };
  const results = useMemo(() => {
    const totalAssets = assets.reduce((s, a) => s + a.value, 0);
    const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
    const byCategory = {};
    assets.forEach(a => { byCategory[a.category] = (byCategory[a.category] || 0) + a.value; });
    return { totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities, chartData: Object.entries(byCategory).map(([label, value]) => ({ label, value })) };
  }, [assets, liabilities]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Net Worth Calculator</h2><p className="calc-subtitle">Track your financial health</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body calc-body-networth"><div className="networth-section"><h3 className="section-title">Assets</h3><div className="networth-items">{assets.map((a, i) => (<div key={i} className="networth-item"><input type="text" className="input-field item-name" value={a.name} onChange={(e) => updateAsset(i, 'name', e.target.value)} /><div className="input-with-symbol item-value"><span className="input-symbol">{symbol}</span><input type="number" className="input-field" value={a.value} onChange={(e) => updateAsset(i, 'value', e.target.value)} /></div><select className="select-field item-category" value={a.category} onChange={(e) => updateAsset(i, 'category', e.target.value)}><option>Cash</option><option>Investments</option><option>Property</option><option>Other</option></select><button className="remove-btn" onClick={() => removeAsset(i)}>✕</button></div>))}</div><button className="add-btn" onClick={addAsset}>+ Add Asset</button></div><div className="networth-section"><h3 className="section-title">Liabilities</h3><div className="networth-items">{liabilities.map((l, i) => (<div key={i} className="networth-item"><input type="text" className="input-field item-name" value={l.name} onChange={(e) => updateLiability(i, 'name', e.target.value)} /><div className="input-with-symbol item-value"><span className="input-symbol">{symbol}</span><input type="number" className="input-field" value={l.value} onChange={(e) => updateLiability(i, 'value', e.target.value)} /></div><select className="select-field item-category" value={l.category} onChange={(e) => updateLiability(i, 'category', e.target.value)}><option>Property</option><option>Auto</option><option>Credit</option><option>Other</option></select><button className="remove-btn" onClick={() => removeLiability(i)}>✕</button></div>))}</div><button className="add-btn" onClick={addLiability}>+ Add Liability</button></div><div className="networth-results"><div className="networth-result-card"><span className="networth-label">Net Worth</span><span className={`networth-value ${results.netWorth >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(results.netWorth, symbol)}</span></div><div className="networth-result-row"><div className="networth-result-item"><span className="label">Total Assets</span><span className="value positive">{formatCurrency(results.totalAssets, symbol)}</span></div><div className="networth-result-item"><span className="label">Total Liabilities</span><span className="value negative">{formatCurrency(results.totalLiabilities, symbol)}</span></div></div>{results.chartData.length > 0 && <div className="networth-chart"><h4>Asset Allocation</h4><AnimatedDonutChart data={results.chartData} colors={[theme.colors.accent, theme.colors.accentLight, '#4fc49a', '#6dd5b0']} /></div>}</div></div></div></div></div>
  );
};

// 17. Life Insurance Calculator
const LifeInsuranceCalculator = ({ symbol, currency, setCurrency }) => {
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [yearsOfSupport, setYearsOfSupport] = useState(15);
  const [totalLiabilities, setTotalLiabilities] = useState(3000000);
  const [existingSavings, setExistingSavings] = useState(500000);
  const [futureExpenses, setFutureExpenses] = useState(2000000);
  const results = useMemo(() => {
    const incomeReplacement = annualIncome * yearsOfSupport;
    const totalNeeds = incomeReplacement + totalLiabilities + futureExpenses;
    const coverageNeeded = Math.max(0, totalNeeds - existingSavings);
    return { incomeReplacement, totalNeeds, coverageNeeded, chartData: [{ label: 'Income Replace', value: incomeReplacement }, { label: 'Liabilities', value: totalLiabilities }, { label: 'Future Expenses', value: futureExpenses }] };
  }, [annualIncome, yearsOfSupport, totalLiabilities, existingSavings, futureExpenses]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Life Insurance Calculator</h2><p className="calc-subtitle">Calculate coverage your family needs</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Annual Income" value={annualIncome} onChange={setAnnualIncome} symbol={symbol} /><NumberInput label="Years of Income Support" value={yearsOfSupport} onChange={setYearsOfSupport} suffix="years" /><CurrencyInput label="Total Liabilities (Debts)" value={totalLiabilities} onChange={setTotalLiabilities} symbol={symbol} /><CurrencyInput label="Future Expenses (Education)" value={futureExpenses} onChange={setFutureExpenses} symbol={symbol} /><CurrencyInput label="Existing Savings/Assets" value={existingSavings} onChange={setExistingSavings} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Recommended Coverage" value={formatCurrency(results.coverageNeeded, symbol)} highlight /><ResultItem label="Income Replacement" value={formatCurrency(results.incomeReplacement, symbol)} /><ResultItem label="Total Family Needs" value={formatCurrency(results.totalNeeds, symbol)} /><ResultItem label="Already Covered" value={formatCurrency(existingSavings, symbol)} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Coverage Breakdown</h3><AnimatedDonutChart data={results.chartData} /></div><AdSpace /></div></div>
  );
};

// 18. Opportunity Cost Calculator
const OpportunityCostCalculator = ({ symbol, currency, setCurrency }) => {
  const [amount, setAmount] = useState(500000);
  const [optionAReturn, setOptionAReturn] = useState(12);
  const [optionBReturn, setOptionBReturn] = useState(8);
  const [years, setYears] = useState(10);
  const results = useMemo(() => {
    const fvA = amount * Math.pow(1 + optionAReturn / 100, years);
    const fvB = amount * Math.pow(1 + optionBReturn / 100, years);
    const opportunityCost = Math.abs(fvA - fvB);
    return { fvA, fvB, opportunityCost, betterOption: fvA > fvB ? 'A' : fvB > fvA ? 'B' : 'Equal' };
  }, [amount, optionAReturn, optionBReturn, years]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Opportunity Cost Calculator</h2><p className="calc-subtitle">Compare two investment options</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Investment Amount" value={amount} onChange={setAmount} symbol={symbol} /><PercentInput label="Option A Return" value={optionAReturn} onChange={setOptionAReturn} /><PercentInput label="Option B Return" value={optionBReturn} onChange={setOptionBReturn} /><NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" /></div><div className="calc-results"><ResultItem label="Option A Future Value" value={formatCurrency(results.fvA, symbol)} positive={results.betterOption === 'A'} /><ResultItem label="Option B Future Value" value={formatCurrency(results.fvB, symbol)} positive={results.betterOption === 'B'} /><ResultItem label="Opportunity Cost" value={formatCurrency(results.opportunityCost, symbol)} highlight /><ResultItem label="Better Option" value={results.betterOption === 'Equal' ? 'Both Equal' : `Option ${results.betterOption}`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Comparison</h3><AnimatedBarChart data={[{ label: 'Option A', value: results.fvA }, { label: 'Option B', value: results.fvB }]} colors={[theme.colors.accent, theme.colors.accentLight]} /></div><AdSpace /></div></div>
  );
};

// 19. Position Size Calculator
const PositionSizeCalculator = ({ symbol, currency, setCurrency }) => {
  const [capital, setCapital] = useState(500000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const results = useMemo(() => {
    const riskAmount = capital * (riskPercent / 100);
    const positionSize = stopLossPercent > 0 ? riskAmount / (stopLossPercent / 100) : 0;
    return { positionSize, riskAmount, percentOfCapital: capital > 0 ? (positionSize / capital) * 100 : 0 };
  }, [capital, riskPercent, stopLossPercent]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Position Size Calculator</h2><p className="calc-subtitle">Calculate optimal position size</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Total Capital" value={capital} onChange={setCapital} symbol={symbol} /><PercentInput label="Risk Per Trade" value={riskPercent} onChange={setRiskPercent} /><PercentInput label="Stop Loss Distance" value={stopLossPercent} onChange={setStopLossPercent} /></div><div className="calc-results"><ResultItem label="Position Size" value={formatCurrency(results.positionSize, symbol)} highlight /><ResultItem label="Risk Amount" value={formatCurrency(results.riskAmount, symbol)} /><ResultItem label="% of Capital" value={`${results.percentOfCapital.toFixed(1)}%`} /><ResultItem label="Max Loss" value={formatCurrency(results.riskAmount, symbol)} negative /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Position Analysis</h3><ProgressRing progress={Math.min(results.percentOfCapital, 100)} /><p className="chart-note">{results.percentOfCapital.toFixed(1)}% of Capital</p></div><AdSpace /></div></div>
  );
};

// 20. Risk/Reward Calculator
const RiskRewardCalculator = ({ symbol, currency, setCurrency }) => {
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);
  const [targetPrice, setTargetPrice] = useState(115);
  const [positionSize, setPositionSize] = useState(100);
  const results = useMemo(() => {
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(targetPrice - entryPrice);
    const rrRatio = risk > 0 ? reward / risk : 0;
    return { rrRatio, risk, reward, potentialLoss: risk * positionSize, potentialProfit: reward * positionSize };
  }, [entryPrice, stopLoss, targetPrice, positionSize]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Risk/Reward Calculator</h2><p className="calc-subtitle">Analyze trade potential</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Entry Price" value={entryPrice} onChange={setEntryPrice} symbol={symbol} /><CurrencyInput label="Stop Loss Price" value={stopLoss} onChange={setStopLoss} symbol={symbol} /><CurrencyInput label="Target Price" value={targetPrice} onChange={setTargetPrice} symbol={symbol} /><NumberInput label="Position Size (Units)" value={positionSize} onChange={setPositionSize} suffix="units" /></div><div className="calc-results"><ResultItem label="Risk:Reward Ratio" value={`1:${results.rrRatio.toFixed(2)}`} highlight /><ResultItem label="Risk Per Unit" value={formatCurrency(results.risk, symbol)} /><ResultItem label="Reward Per Unit" value={formatCurrency(results.reward, symbol)} /><ResultItem label="Potential Loss" value={formatCurrency(results.potentialLoss, symbol)} negative /><ResultItem label="Potential Profit" value={formatCurrency(results.potentialProfit, symbol)} positive /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Risk vs Reward</h3><AnimatedBarChart data={[{ label: 'Risk', value: results.potentialLoss }, { label: 'Reward', value: results.potentialProfit }]} colors={['#e57373', theme.colors.accent]} /></div><AdSpace /></div></div>
  );
};

// 21. Break-even Calculator
const BreakevenCalculator = ({ symbol, currency, setCurrency }) => {
  const [fixedCosts, setFixedCosts] = useState(100000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(50);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(100);
  const results = useMemo(() => {
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
    const breakevenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakevenRevenue = breakevenUnits * sellingPricePerUnit;
    return { breakevenUnits, breakevenRevenue, contributionMargin, marginPercentage: sellingPricePerUnit > 0 ? (contributionMargin / sellingPricePerUnit) * 100 : 0 };
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);
  return (
    <div className="calc-layout"><div className="calc-main"><div className="calc-card"><div className="calc-header"><div className="calc-header-left"><h2 className="calc-title">Break-even Calculator</h2><p className="calc-subtitle">Find your break-even point</p></div><CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact /></div><div className="calc-body"><div className="calc-inputs"><CurrencyInput label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} symbol={symbol} /><CurrencyInput label="Variable Cost Per Unit" value={variableCostPerUnit} onChange={setVariableCostPerUnit} symbol={symbol} /><CurrencyInput label="Selling Price Per Unit" value={sellingPricePerUnit} onChange={setSellingPricePerUnit} symbol={symbol} /></div><div className="calc-results"><ResultItem label="Break-even Units" value={formatNumber(results.breakevenUnits)} highlight /><ResultItem label="Break-even Revenue" value={formatCurrency(results.breakevenRevenue, symbol)} /><ResultItem label="Contribution Margin" value={formatCurrency(results.contributionMargin, symbol)} /><ResultItem label="Margin Percentage" value={`${results.marginPercentage.toFixed(1)}%`} /></div></div></div></div><div className="calc-sidebar"><div className="chart-card"><h3>Break-even Analysis</h3><ProgressRing progress={Math.min(results.marginPercentage, 100)} /><p className="chart-note">{results.marginPercentage.toFixed(1)}% Margin</p></div><AdSpace /></div></div>
  );
};

// Calculator Map
const CALCULATOR_COMPONENTS = { 'dashboard': Dashboard, 'mortgage': MortgageCalculator, 'emi': EMICalculator, 'credit-card': CreditCardCalculator, 'amortization': AmortizationCalculator, 'compound-interest': CompoundInterestCalculator, 'investment-growth': InvestmentGrowthCalculator, 'xirr': XIRRCalculator, 'expense-ratio': ExpenseRatioCalculator, 'roi-cagr': ROICAGRCalculator, 'retirement': RetirementCalculator, 'fire': FIRECalculator, 'savings-goal': SavingsGoalCalculator, 'debt-snowball': DebtSnowballCalculator, 'debt-avalanche': DebtAvalancheCalculator, 'inflation': InflationCalculator, 'net-worth': NetWorthCalculator, 'life-insurance': LifeInsuranceCalculator, 'opportunity-cost': OpportunityCostCalculator, 'position-size': PositionSizeCalculator, 'risk-reward': RiskRewardCalculator, 'breakeven': BreakevenCalculator };

// Main App
function App() {
  const [activeCalculator, setActiveCalculator] = useState('dashboard');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  useEffect(() => { document.title = activeCalculator === 'dashboard' ? 'FinCalc - Free Personal Finance Calculators' : `${CALCULATORS[activeCalculator]?.name || ''} Calculator | FinCalc`; }, [activeCalculator]);
  const CalculatorComponent = CALCULATOR_COMPONENTS[activeCalculator];
  return (
    <div className="app">
      <header className="header"><div className="logo" onClick={() => setActiveCalculator('dashboard')}>Fin<span>Calc</span></div><nav className="header-nav"><button className={`header-nav-item ${activeCalculator === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveCalculator('dashboard')}>Home</button></nav></header>
      <div className="main-container">
        <nav className="sidebar"><div className="nav-category"><div className={`nav-item ${activeCalculator === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveCalculator('dashboard')}><span>🏠</span><span>Home</span></div></div>{CATEGORIES.map((cat) => (<div key={cat.id} className="nav-category"><div className="nav-category-title">{cat.name}</div>{cat.calculators.map((calcId) => { const calc = CALCULATORS[calcId]; if (!calc) return null; return <div key={calcId} className={`nav-item ${activeCalculator === calcId ? 'active' : ''}`} onClick={() => setActiveCalculator(calcId)}><span>{calc.icon}</span><span>{calc.name}</span></div>; })}</div>))}</nav>
        <main className="content">{activeCalculator === 'dashboard' ? <Dashboard setActiveCalculator={setActiveCalculator} currency={currency} setCurrency={setCurrency} /> : <CalculatorComponent symbol={currency.symbol} currency={currency} setCurrency={setCurrency} />}</main>
      </div>
    </div>
  );
}

export default App;
