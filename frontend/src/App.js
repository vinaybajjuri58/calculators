import React, { useState, useMemo, useEffect } from 'react';

// Currency Data - INR first as default
const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", country: "Switzerland" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
];

// Calculator Categories with descriptions
const CATEGORIES = [
  { 
    id: 'loans', 
    name: 'Loans & Mortgages',
    description: 'Calculate EMIs, mortgage payments, and loan schedules',
    calculators: ['mortgage', 'emi', 'credit-card', 'amortization'] 
  },
  { 
    id: 'investments', 
    name: 'Investments',
    description: 'Track returns, compound growth, and portfolio performance',
    calculators: ['compound-interest', 'investment-growth', 'xirr', 'expense-ratio', 'roi-cagr'] 
  },
  { 
    id: 'retirement', 
    name: 'Retirement & Goals',
    description: 'Plan for retirement and achieve your financial goals',
    calculators: ['retirement', 'fire', 'savings-goal'] 
  },
  { 
    id: 'debt', 
    name: 'Debt Management',
    description: 'Strategies to pay off debt faster and save on interest',
    calculators: ['debt-snowball', 'debt-avalanche'] 
  },
  { 
    id: 'planning', 
    name: 'Financial Planning',
    description: 'Track net worth, plan insurance, and analyze costs',
    calculators: ['inflation', 'net-worth', 'life-insurance', 'opportunity-cost'] 
  },
  { 
    id: 'trading', 
    name: 'Trading Tools',
    description: 'Position sizing and risk management for traders',
    calculators: ['position-size', 'risk-reward', 'breakeven'] 
  }
];

const CALCULATORS = {
  'mortgage': { name: 'Mortgage', icon: '🏠', desc: 'Calculate home loan EMI, total interest, and payment breakdown for your dream home purchase' },
  'emi': { name: 'EMI / Loan', icon: '💳', desc: 'Calculate monthly installments for car loans, personal loans, or any other financing' },
  'credit-card': { name: 'Credit Card Payoff', icon: '💳', desc: 'See how long to pay off credit card debt and how much interest you can save' },
  'amortization': { name: 'Amortization', icon: '📋', desc: 'View detailed month-by-month loan payment schedule with principal and interest split' },
  'compound-interest': { name: 'Compound Interest', icon: '📈', desc: 'See how your money grows over time with the power of compound interest' },
  'investment-growth': { name: 'Investment Growth', icon: '💰', desc: 'Project future value of your SIP or lump sum investments' },
  'xirr': { name: 'XIRR Calculator', icon: '📊', desc: 'Calculate exact returns on irregular investments like Chitti, SIPs with varying dates' },
  'expense-ratio': { name: 'Expense Ratio Impact', icon: '📊', desc: 'See how mutual fund fees eat into your long-term returns' },
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

// Fixed Animated Donut Chart Component
const AnimatedDonutChart = ({ data, colors = ['#2d8a6e', '#3da882', '#6dd5b0'] }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) return null;

  // Filter out zero or negative values for donut chart
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
          
          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);
          const largeArc = angle > 180 ? 1 : 0;
          
          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[i % colors.length]}
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? 'scale(1)' : 'scale(0.8)',
                transformOrigin: '50px 50px',
                transition: `all 0.5s ease ${i * 0.1}s`
              }}
            />
          );
        })}
        <circle cx="50" cy="50" r="25" fill="var(--bg-card)" />
      </svg>
      <div className="chart-legend">
        {validData.map((item, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: colors[i % colors.length] }} />
            <span>{item.label}: {((item.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Bar Chart Component
const AnimatedBarChart = ({ data, colors = ['#2d8a6e'] }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) return null;

  const validData = data.filter(d => d.value !== undefined && d.value !== null && !isNaN(d.value));
  if (validData.length === 0) return null;

  const maxValue = Math.max(...validData.map(d => Math.abs(d.value)));

  return (
    <div className="chart-bar-container">
      {validData.slice(0, 8).map((item, i) => (
        <div key={i} className="chart-bar-row">
          <span className="chart-bar-label">{item.label}</span>
          <div className="chart-bar-track">
            <div 
              className="chart-bar-fill"
              style={{
                width: animated ? `${(Math.abs(item.value) / maxValue) * 100}%` : '0%',
                background: colors[i % colors.length],
                transition: `width 0.6s ease ${i * 0.05}s`
              }}
            />
          </div>
          <span className="chart-bar-value">{formatNumber(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 120, strokeWidth = 10, color = '#2d8a6e' }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(Math.min(Math.max(progress, 0), 100)), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="progress-ring-container">
      <svg width={size} height={size} className="progress-ring">
        <circle stroke="#e0dbd0" fill="transparent" strokeWidth={strokeWidth} r={radius} cx={size / 2} cy={size / 2} />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 1s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-value">{animatedProgress.toFixed(0)}%</span>
      </div>
    </div>
  );
};

// Ad Space Component
const AdSpace = ({ position = 'sidebar' }) => (
  <div className={`ad-space ad-space-${position}`} data-testid={`ad-space-${position}`}>
    <div className="ad-placeholder">
      <span className="ad-label">Advertisement</span>
      <div className="ad-content">
        <span>Your Ad Here</span>
        <small>300x250</small>
      </div>
    </div>
  </div>
);

// Currency Selector Component
const CurrencySelector = ({ currency, setCurrency, currencies, compact = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return currencies;
    const s = search.toLowerCase();
    return currencies.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.country.toLowerCase().includes(s) || 
      c.code.toLowerCase().includes(s)
    );
  }, [search, currencies]);

  return (
    <div className={`currency-selector ${compact ? 'compact' : ''}`}>
      <button className="currency-btn" onClick={() => setShowDropdown(!showDropdown)} data-testid="currency-selector-btn">
        <span className="currency-symbol">{currency.symbol}</span>
        <span className="currency-code">{currency.code}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>
      
      {showDropdown && (
        <div className="currency-dropdown" data-testid="currency-dropdown">
          <div className="currency-search">
            <input
              type="text"
              placeholder="Search country or currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              data-testid="currency-search-input"
            />
          </div>
          <div className="currency-list">
            {filtered.map((c) => (
              <div
                key={c.code}
                className={`currency-item ${currency.code === c.code ? 'active' : ''}`}
                onClick={() => { setCurrency(c); setShowDropdown(false); setSearch(''); }}
              >
                <span className="currency-item-name">{c.country} - {c.name}</span>
                <span className="currency-item-symbol">{c.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Input Components
const CurrencyInput = ({ label, value, onChange, symbol }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className="input-with-symbol">
      <span className="input-symbol">{symbol}</span>
      <input type="number" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
    </div>
  </div>
);

const PercentInput = ({ label, value, onChange }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className="input-with-symbol input-with-suffix">
      <input type="number" step="0.1" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
      <span className="input-suffix">%</span>
    </div>
  </div>
);

const NumberInput = ({ label, value, onChange, suffix = '' }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className={suffix ? "input-with-symbol input-with-suffix" : ""}>
      <input type="number" className="input-field" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  </div>
);

const ResultItem = ({ label, value, highlight, positive, negative }) => (
  <div className="result-item">
    <div className="result-label">{label}</div>
    <div className={`result-value ${highlight ? 'highlight' : ''} ${positive ? 'positive' : ''} ${negative ? 'negative' : ''}`}>{value}</div>
  </div>
);

// Dashboard - Financial Calculators Home
const Dashboard = ({ setActiveCalculator, currency, setCurrency }) => {
  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Financial Calculators</h1>
          <p className="dashboard-subtitle">Free tools to help you make smarter financial decisions</p>
        </div>
        <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} />
      </div>

      {CATEGORIES.map((category) => (
        <div key={category.id} className="category-section">
          <div className="category-header">
            <h2 className="category-title">{category.name}</h2>
            <p className="category-desc">{category.description}</p>
          </div>
          <div className="calculator-grid">
            {category.calculators.map((calcId) => {
              const calc = CALCULATORS[calcId];
              if (!calc) return null;
              return (
                <div
                  key={calcId}
                  className="calculator-card"
                  onClick={() => setActiveCalculator(calcId)}
                  data-testid={`calc-card-${calcId}`}
                >
                  <span className="calc-card-icon">{calc.icon}</span>
                  <h3 className="calc-card-name">{calc.name}</h3>
                  <p className="calc-card-desc">{calc.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// XIRR Calculator (for Chitti Finance)
const XIRRCalculator = ({ symbol, currency, setCurrency }) => {
  const [cashflows, setCashflows] = useState([
    { date: '2024-01-15', amount: -10000 },
    { date: '2024-02-15', amount: -10000 },
    { date: '2024-03-15', amount: -10000 },
    { date: '2024-04-15', amount: -10000 },
    { date: '2024-05-15', amount: -10000 },
    { date: '2024-06-15', amount: -10000 },
    { date: '2024-07-15', amount: 75000 },
  ]);

  const addCashflow = () => {
    const lastDate = cashflows.length > 0 ? new Date(cashflows[cashflows.length - 1].date) : new Date();
    lastDate.setMonth(lastDate.getMonth() + 1);
    setCashflows([...cashflows, { date: lastDate.toISOString().split('T')[0], amount: 0 }]);
  };

  const removeCashflow = (index) => {
    setCashflows(cashflows.filter((_, i) => i !== index));
  };

  const updateCashflow = (index, field, value) => {
    const newCashflows = [...cashflows];
    newCashflows[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setCashflows(newCashflows);
  };

  // XIRR calculation using Newton-Raphson method
  const calculateXIRR = (cashflows) => {
    if (cashflows.length < 2) return null;
    
    const sortedCashflows = [...cashflows].sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstDate = new Date(sortedCashflows[0].date);
    
    const xnpv = (rate, cashflows, firstDate) => {
      return cashflows.reduce((sum, cf) => {
        const days = (new Date(cf.date) - firstDate) / (1000 * 60 * 60 * 24);
        return sum + cf.amount / Math.pow(1 + rate, days / 365);
      }, 0);
    };
    
    const xnpvDerivative = (rate, cashflows, firstDate) => {
      return cashflows.reduce((sum, cf) => {
        const days = (new Date(cf.date) - firstDate) / (1000 * 60 * 60 * 24);
        return sum - (days / 365) * cf.amount / Math.pow(1 + rate, days / 365 + 1);
      }, 0);
    };
    
    let rate = 0.1;
    for (let i = 0; i < 100; i++) {
      const npv = xnpv(rate, sortedCashflows, firstDate);
      const derivative = xnpvDerivative(rate, sortedCashflows, firstDate);
      
      if (Math.abs(derivative) < 1e-10) break;
      
      const newRate = rate - npv / derivative;
      if (Math.abs(newRate - rate) < 1e-10) break;
      rate = newRate;
    }
    
    return rate;
  };

  const results = useMemo(() => {
    const totalInvested = cashflows.filter(c => c.amount < 0).reduce((sum, c) => sum + Math.abs(c.amount), 0);
    const totalReceived = cashflows.filter(c => c.amount > 0).reduce((sum, c) => sum + c.amount, 0);
    const netProfit = totalReceived - totalInvested;
    const xirr = calculateXIRR(cashflows);
    
    return {
      totalInvested,
      totalReceived,
      netProfit,
      xirr: xirr !== null ? xirr * 100 : null,
      absoluteReturn: totalInvested > 0 ? ((totalReceived - totalInvested) / totalInvested) * 100 : 0
    };
  }, [cashflows]);

  return (
    <div className="calc-layout calc-layout-wide">
      <div className="calc-main calc-main-wide">
        <div className="calc-card" data-testid="xirr-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">XIRR Calculator</h2>
              <p className="calc-subtitle">Calculate exact returns on irregular investments (Chitti, SIP, etc.)</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body calc-body-xirr">
            <div className="calc-inputs calc-inputs-wide">
              <p className="input-hint">Enter investment dates and amounts. Use negative for investments, positive for returns.</p>
              <div className="cashflow-list">
                {cashflows.map((cf, index) => (
                  <div key={index} className="cashflow-item">
                    <input
                      type="date"
                      className="input-field cashflow-date"
                      value={cf.date}
                      onChange={(e) => updateCashflow(index, 'date', e.target.value)}
                    />
                    <div className="input-with-symbol cashflow-amount">
                      <span className="input-symbol">{symbol}</span>
                      <input
                        type="number"
                        className="input-field"
                        value={cf.amount}
                        onChange={(e) => updateCashflow(index, 'amount', e.target.value)}
                        placeholder="Amount"
                      />
                    </div>
                    <span className={`cashflow-type ${cf.amount < 0 ? 'outflow' : 'inflow'}`}>
                      {cf.amount < 0 ? 'Investment' : 'Return'}
                    </span>
                    <button className="remove-btn" onClick={() => removeCashflow(index)}>✕</button>
                  </div>
                ))}
              </div>
              <button className="add-btn" onClick={addCashflow}>+ Add Cash Flow</button>
            </div>
            <div className="calc-results">
              <ResultItem 
                label="XIRR (Annualized Return)" 
                value={results.xirr !== null ? `${results.xirr.toFixed(2)}%` : 'N/A'} 
                highlight 
                positive={results.xirr > 0} 
                negative={results.xirr < 0} 
              />
              <ResultItem label="Absolute Return" value={`${results.absoluteReturn.toFixed(2)}%`} positive={results.absoluteReturn > 0} />
              <ResultItem label="Total Invested" value={formatCurrency(results.totalInvested, symbol)} />
              <ResultItem label="Total Received" value={formatCurrency(results.totalReceived, symbol)} />
              <ResultItem 
                label={results.netProfit >= 0 ? "Net Profit" : "Net Loss"} 
                value={formatCurrency(Math.abs(results.netProfit), symbol)} 
                positive={results.netProfit >= 0} 
                negative={results.netProfit < 0} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mortgage Calculator with fixed chart
const MortgageCalculator = ({ symbol, currency, setCurrency }) => {
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [term, setTerm] = useState(20);
  const [taxes, setTaxes] = useState(50000);
  const [insurance, setInsurance] = useState(25000);

  const results = useMemo(() => {
    const principal = Math.max(0, homePrice - downPayment);
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    let monthlyPI = 0;
    if (principal > 0 && numPayments > 0) {
      monthlyPI = monthlyRate === 0 ? principal / numPayments :
        principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = Math.max(0, totalPaid - principal);
    const totalTaxesInsurance = (taxes + insurance) * term;
    
    return {
      monthlyPayment: monthlyPI + taxes/12 + insurance/12,
      monthlyPI,
      totalInterest,
      totalPaid: totalPaid + totalTaxesInsurance,
      principal,
      chartData: [
        { label: 'Principal', value: principal },
        { label: 'Interest', value: totalInterest },
        { label: 'Taxes & Insurance', value: totalTaxesInsurance }
      ].filter(d => d.value > 0)
    };
  }, [homePrice, downPayment, rate, term, taxes, insurance]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="mortgage-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Mortgage Calculator</h2>
              <p className="calc-subtitle">Calculate your home loan payments and total costs</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Home Price" value={homePrice} onChange={setHomePrice} symbol={symbol} />
              <CurrencyInput label="Down Payment" value={downPayment} onChange={setDownPayment} symbol={symbol} />
              <PercentInput label="Interest Rate" value={rate} onChange={setRate} />
              <NumberInput label="Loan Term" value={term} onChange={setTerm} suffix="years" />
              <CurrencyInput label="Annual Taxes" value={taxes} onChange={setTaxes} symbol={symbol} />
              <CurrencyInput label="Annual Insurance" value={insurance} onChange={setInsurance} symbol={symbol} />
            </div>
            <div className="calc-results">
              <ResultItem label="Monthly Payment" value={formatCurrency(results.monthlyPayment, symbol)} highlight />
              <ResultItem label="Principal & Interest" value={formatCurrency(results.monthlyPI, symbol)} />
              <ResultItem label="Loan Amount" value={formatCurrency(results.principal, symbol)} />
              <ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} />
              <ResultItem label="Total Cost" value={formatCurrency(results.totalPaid, symbol)} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Cost Breakdown</h3>
          <AnimatedDonutChart data={results.chartData} colors={['#2d8a6e', '#3da882', '#6dd5b0']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// EMI Calculator
const EMICalculator = ({ symbol, currency, setCurrency }) => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [term, setTerm] = useState(36);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let emi = monthlyRate === 0 ? loanAmount / term :
      loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalPaid = emi * term;
    const totalInterest = totalPaid - loanAmount;
    
    return { 
      emi, totalPaid, totalInterest,
      chartData: [
        { label: 'Principal', value: loanAmount },
        { label: 'Interest', value: Math.max(0, totalInterest) }
      ].filter(d => d.value > 0)
    };
  }, [loanAmount, rate, term]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="emi-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">EMI / Loan Calculator</h2>
              <p className="calc-subtitle">Calculate equated monthly installments</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} symbol={symbol} />
              <PercentInput label="Interest Rate (Annual)" value={rate} onChange={setRate} />
              <NumberInput label="Loan Term" value={term} onChange={setTerm} suffix="months" />
            </div>
            <div className="calc-results">
              <ResultItem label="Monthly EMI" value={formatCurrency(results.emi, symbol)} highlight />
              <ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} />
              <ResultItem label="Total Payment" value={formatCurrency(results.totalPaid, symbol)} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Payment Breakdown</h3>
          <AnimatedDonutChart data={results.chartData} colors={['#2d8a6e', '#3da882']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Compound Interest Calculator
const CompoundInterestCalculator = ({ symbol, currency, setCurrency }) => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12);
  const [monthlyContrib, setMonthlyContrib] = useState(5000);

  const results = useMemo(() => {
    const r = rate / 100;
    const n = frequency;
    const t = years;
    const fvPrincipal = principal * Math.pow(1 + r/n, n*t);
    const totalContributions = monthlyContrib * 12 * t;
    let fvContributions = 0;
    if (monthlyContrib > 0 && r > 0) {
      const monthlyRate = r / 12;
      fvContributions = monthlyContrib * ((Math.pow(1 + monthlyRate, 12*t) - 1) / monthlyRate) * (1 + monthlyRate);
    } else if (monthlyContrib > 0) {
      fvContributions = totalContributions;
    }
    const totalValue = fvPrincipal + fvContributions;
    const totalInterest = totalValue - principal - totalContributions;
    
    const yearlyData = [];
    for (let year = 0; year <= t; year += Math.max(1, Math.ceil(t/6))) {
      const fv = principal * Math.pow(1 + r/n, n*year);
      let fvc = 0;
      if (monthlyContrib > 0 && r > 0 && year > 0) {
        fvc = monthlyContrib * ((Math.pow(1 + r/12, 12*year) - 1) / (r/12)) * (1 + r/12);
      } else if (monthlyContrib > 0) {
        fvc = monthlyContrib * 12 * year;
      }
      yearlyData.push({ label: `Year ${year}`, value: fv + fvc });
    }
    
    return { totalValue, totalInterest, totalContributions, yearlyData };
  }, [principal, rate, years, frequency, monthlyContrib]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="compound-interest-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Compound Interest Calculator</h2>
              <p className="calc-subtitle">See the power of compound growth</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Initial Investment" value={principal} onChange={setPrincipal} symbol={symbol} />
              <CurrencyInput label="Monthly Contribution (SIP)" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} />
              <PercentInput label="Annual Interest Rate" value={rate} onChange={setRate} />
              <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
              <div className="input-group">
                <label className="input-label">Compound Frequency</label>
                <select className="select-field" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))}>
                  <option value={1}>Annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
            </div>
            <div className="calc-results">
              <ResultItem label="Future Value" value={formatCurrency(results.totalValue, symbol)} highlight />
              <ResultItem label="Interest Earned" value={formatCurrency(results.totalInterest, symbol)} positive />
              <ResultItem label="Total Contributions" value={formatCurrency(results.totalContributions + principal, symbol)} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Growth Over Time</h3>
          <AnimatedBarChart data={results.yearlyData} colors={['#2d8a6e']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Net Worth Calculator - Full Width
const NetWorthCalculator = ({ symbol, currency, setCurrency }) => {
  const [assets, setAssets] = useState([
    { name: 'Savings Account', value: 200000, category: 'Cash' },
    { name: 'Fixed Deposits', value: 500000, category: 'Cash' },
    { name: 'Mutual Funds', value: 800000, category: 'Investments' },
    { name: 'Stocks', value: 300000, category: 'Investments' },
    { name: 'Property', value: 5000000, category: 'Property' },
    { name: 'Gold', value: 400000, category: 'Other' },
  ]);
  const [liabilities, setLiabilities] = useState([
    { name: 'Home Loan', value: 3500000, category: 'Property' },
    { name: 'Car Loan', value: 400000, category: 'Auto' },
    { name: 'Credit Card', value: 50000, category: 'Credit' },
  ]);

  const addAsset = () => setAssets([...assets, { name: 'New Asset', value: 0, category: 'Other' }]);
  const addLiability = () => setLiabilities([...liabilities, { name: 'New Liability', value: 0, category: 'Other' }]);
  const removeAsset = (index) => setAssets(assets.filter((_, i) => i !== index));
  const removeLiability = (index) => setLiabilities(liabilities.filter((_, i) => i !== index));
  const updateAsset = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = field === 'value' ? parseFloat(value) || 0 : value;
    setAssets(newAssets);
  };
  const updateLiability = (index, field, value) => {
    const newLiabilities = [...liabilities];
    newLiabilities[index][field] = field === 'value' ? parseFloat(value) || 0 : value;
    setLiabilities(newLiabilities);
  };

  const results = useMemo(() => {
    const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
    const netWorth = totalAssets - totalLiabilities;
    
    // Group assets by category for chart
    const assetsByCategory = {};
    assets.forEach(a => {
      assetsByCategory[a.category] = (assetsByCategory[a.category] || 0) + a.value;
    });
    const chartData = Object.entries(assetsByCategory).map(([label, value]) => ({ label, value }));
    
    return { totalAssets, totalLiabilities, netWorth, chartData };
  }, [assets, liabilities]);

  return (
    <div className="calc-layout calc-layout-wide">
      <div className="calc-main calc-main-full">
        <div className="calc-card calc-card-wide" data-testid="net-worth-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Net Worth Calculator</h2>
              <p className="calc-subtitle">Track your total assets minus liabilities</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body calc-body-networth">
            <div className="networth-section">
              <h3 className="section-title">Assets</h3>
              <div className="networth-items">
                {assets.map((asset, index) => (
                  <div key={index} className="networth-item">
                    <input type="text" className="input-field item-name" value={asset.name} onChange={(e) => updateAsset(index, 'name', e.target.value)} />
                    <div className="input-with-symbol item-value">
                      <span className="input-symbol">{symbol}</span>
                      <input type="number" className="input-field" value={asset.value} onChange={(e) => updateAsset(index, 'value', e.target.value)} />
                    </div>
                    <select className="select-field item-category" value={asset.category} onChange={(e) => updateAsset(index, 'category', e.target.value)}>
                      <option>Cash</option>
                      <option>Investments</option>
                      <option>Property</option>
                      <option>Auto</option>
                      <option>Other</option>
                    </select>
                    <button className="remove-btn" onClick={() => removeAsset(index)}>✕</button>
                  </div>
                ))}
              </div>
              <button className="add-btn" onClick={addAsset}>+ Add Asset</button>
            </div>
            
            <div className="networth-section">
              <h3 className="section-title">Liabilities</h3>
              <div className="networth-items">
                {liabilities.map((liability, index) => (
                  <div key={index} className="networth-item">
                    <input type="text" className="input-field item-name" value={liability.name} onChange={(e) => updateLiability(index, 'name', e.target.value)} />
                    <div className="input-with-symbol item-value">
                      <span className="input-symbol">{symbol}</span>
                      <input type="number" className="input-field" value={liability.value} onChange={(e) => updateLiability(index, 'value', e.target.value)} />
                    </div>
                    <select className="select-field item-category" value={liability.category} onChange={(e) => updateLiability(index, 'category', e.target.value)}>
                      <option>Property</option>
                      <option>Auto</option>
                      <option>Credit</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                    <button className="remove-btn" onClick={() => removeLiability(index)}>✕</button>
                  </div>
                ))}
              </div>
              <button className="add-btn" onClick={addLiability}>+ Add Liability</button>
            </div>
            
            <div className="networth-results">
              <div className="networth-result-card">
                <span className="networth-label">Net Worth</span>
                <span className={`networth-value ${results.netWorth >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(results.netWorth, symbol)}
                </span>
              </div>
              <div className="networth-result-row">
                <div className="networth-result-item">
                  <span className="label">Total Assets</span>
                  <span className="value positive">{formatCurrency(results.totalAssets, symbol)}</span>
                </div>
                <div className="networth-result-item">
                  <span className="label">Total Liabilities</span>
                  <span className="value negative">{formatCurrency(results.totalLiabilities, symbol)}</span>
                </div>
                <div className="networth-result-item">
                  <span className="label">Debt-to-Asset Ratio</span>
                  <span className="value">{results.totalAssets > 0 ? ((results.totalLiabilities / results.totalAssets) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
              {results.chartData.length > 0 && (
                <div className="networth-chart">
                  <h4>Asset Allocation</h4>
                  <AnimatedDonutChart data={results.chartData} colors={['#2d8a6e', '#3da882', '#4fc49a', '#6dd5b0', '#8de4c6']} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FIRE Calculator
const FIRECalculator = ({ symbol, currency, setCurrency }) => {
  const [annualExpenses, setAnnualExpenses] = useState(600000);
  const [currentNetWorth, setCurrentNetWorth] = useState(1000000);
  const [annualSavings, setAnnualSavings] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const results = useMemo(() => {
    const fireNumber = annualExpenses / (withdrawalRate / 100);
    let yearsToFire = 0;
    if (currentNetWorth < fireNumber) {
      let current = currentNetWorth;
      while (current < fireNumber && yearsToFire < 100) {
        current = current * (1 + expectedReturn / 100) + annualSavings;
        yearsToFire++;
      }
    }
    const savingsRate = (annualSavings / (annualExpenses + annualSavings)) * 100;
    const progress = Math.min((currentNetWorth / fireNumber) * 100, 100);
    
    return { fireNumber, yearsToFire, savingsRate, progress };
  }, [annualExpenses, currentNetWorth, annualSavings, expectedReturn, withdrawalRate]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="fire-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">FIRE Calculator</h2>
              <p className="calc-subtitle">Financial Independence, Retire Early</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Annual Expenses" value={annualExpenses} onChange={setAnnualExpenses} symbol={symbol} />
              <CurrencyInput label="Current Net Worth" value={currentNetWorth} onChange={setCurrentNetWorth} symbol={symbol} />
              <CurrencyInput label="Annual Savings" value={annualSavings} onChange={setAnnualSavings} symbol={symbol} />
              <PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} />
              <PercentInput label="Safe Withdrawal Rate" value={withdrawalRate} onChange={setWithdrawalRate} />
            </div>
            <div className="calc-results">
              <ResultItem label="FIRE Number" value={formatCurrency(results.fireNumber, symbol)} highlight />
              <ResultItem label="Years to FIRE" value={results.yearsToFire === 0 ? "You're FI!" : `${results.yearsToFire} years`} positive={results.yearsToFire === 0} />
              <ResultItem label="Progress" value={`${results.progress.toFixed(1)}%`} />
              <ResultItem label="Savings Rate" value={`${results.savingsRate.toFixed(1)}%`} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>FIRE Progress</h3>
          <ProgressRing progress={results.progress} size={140} strokeWidth={12} />
          <p className="chart-note">Target: {formatCurrency(results.fireNumber, symbol)}</p>
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Retirement Calculator
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
    const fvContributions = monthlyRate > 0
      ? monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : monthlyContrib * months;
    const retirementCorpus = fvSavings + fvContributions;
    const inflationAdjustedExpense = monthlyExpense * Math.pow(1 + inflation / 100, yearsToRetirement);
    const requiredCorpus = inflationAdjustedExpense * 12 * 25;
    const surplusDeficit = retirementCorpus - requiredCorpus;
    
    return { retirementCorpus, requiredCorpus, surplusDeficit, monthlyExpenseAtRetirement: inflationAdjustedExpense };
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, expectedReturn, inflation, monthlyExpense]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="retirement-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Retirement Calculator</h2>
              <p className="calc-subtitle">Plan for a comfortable retirement</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <NumberInput label="Current Age" value={currentAge} onChange={setCurrentAge} suffix="years" />
              <NumberInput label="Retirement Age" value={retirementAge} onChange={setRetirementAge} suffix="years" />
              <CurrencyInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} symbol={symbol} />
              <CurrencyInput label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} />
              <PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} />
              <PercentInput label="Inflation Rate" value={inflation} onChange={setInflation} />
              <CurrencyInput label="Monthly Expense (Today)" value={monthlyExpense} onChange={setMonthlyExpense} symbol={symbol} />
            </div>
            <div className="calc-results">
              <ResultItem label="Your Retirement Corpus" value={formatCurrency(results.retirementCorpus, symbol)} highlight />
              <ResultItem label="Required Corpus" value={formatCurrency(results.requiredCorpus, symbol)} />
              <ResultItem label={results.surplusDeficit >= 0 ? "Surplus" : "Shortfall"} 
                value={formatCurrency(Math.abs(results.surplusDeficit), symbol)} 
                positive={results.surplusDeficit >= 0} negative={results.surplusDeficit < 0} />
              <ResultItem label="Monthly Expense at Retirement" value={formatCurrency(results.monthlyExpenseAtRetirement, symbol)} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Corpus Comparison</h3>
          <AnimatedBarChart 
            data={[
              { label: 'Your Corpus', value: results.retirementCorpus },
              { label: 'Required', value: results.requiredCorpus }
            ]} 
            colors={['#2d8a6e', '#e57373']} 
          />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Generic Calculator for others (placeholder with wider layout)
const GenericCalculator = ({ id, symbol, currency, setCurrency }) => {
  const calc = CALCULATORS[id];
  
  return (
    <div className="calc-layout calc-layout-wide">
      <div className="calc-main calc-main-wide">
        <div className="calc-card" data-testid={`${id}-calculator`}>
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">{calc?.name || id} Calculator</h2>
              <p className="calc-subtitle">{calc?.desc || 'Financial calculator'}</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <p className="coming-soon">Coming Soon!</p>
              <p className="calc-desc">This calculator is being developed.</p>
            </div>
            <div className="calc-results">
              <div className="placeholder-result">
                <span className="placeholder-icon">{calc?.icon || '📊'}</span>
                <span>Enter values to calculate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calculator Component Map
const CALCULATOR_COMPONENTS = {
  'dashboard': Dashboard,
  'mortgage': MortgageCalculator,
  'emi': EMICalculator,
  'compound-interest': CompoundInterestCalculator,
  'xirr': XIRRCalculator,
  'net-worth': NetWorthCalculator,
  'fire': FIRECalculator,
  'retirement': RetirementCalculator,
};

// Main App
function App() {
  const [activeCalculator, setActiveCalculator] = useState('dashboard');
  const [currency, setCurrency] = useState(CURRENCIES[0]); // INR is now first/default

  useEffect(() => {
    if (activeCalculator === 'dashboard') {
      document.title = 'FinCalc - Free Personal Finance Calculators';
    } else {
      const calc = CALCULATORS[activeCalculator];
      if (calc) {
        document.title = `${calc.name} Calculator | FinCalc`;
      }
    }
  }, [activeCalculator]);

  const CalculatorComponent = CALCULATOR_COMPONENTS[activeCalculator] || 
    ((props) => <GenericCalculator id={activeCalculator} {...props} />);

  return (
    <div className="app" data-testid="finance-calculator-app">
      <header className="header">
        <div className="logo" onClick={() => setActiveCalculator('dashboard')} data-testid="app-logo">
          Fin<span>Calc</span>
        </div>
        <nav className="header-nav">
          <button 
            className={`header-nav-item ${activeCalculator === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveCalculator('dashboard')}
          >
            Home
          </button>
        </nav>
      </header>

      <div className="main-container">
        <nav className="sidebar" data-testid="sidebar-nav">
          <div className="nav-category">
            <div 
              className={`nav-item ${activeCalculator === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveCalculator('dashboard')}
            >
              <span>🏠</span>
              <span>Home</span>
            </div>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category.id} className="nav-category">
              <div className="nav-category-title">{category.name}</div>
              {category.calculators.map((calcId) => {
                const calc = CALCULATORS[calcId];
                if (!calc) return null;
                return (
                  <div
                    key={calcId}
                    className={`nav-item ${activeCalculator === calcId ? 'active' : ''}`}
                    onClick={() => setActiveCalculator(calcId)}
                    data-testid={`nav-item-${calcId}`}
                  >
                    <span>{calc.icon}</span>
                    <span>{calc.name}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        <main className="content">
          {activeCalculator === 'dashboard' ? (
            <Dashboard setActiveCalculator={setActiveCalculator} currency={currency} setCurrency={setCurrency} />
          ) : (
            <CalculatorComponent symbol={currency.symbol} currency={currency} setCurrency={setCurrency} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
