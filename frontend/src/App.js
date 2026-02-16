import React, { useState, useMemo, useEffect } from 'react';

// Currency Data
const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "United States" },
  { code: "EUR", symbol: "€", name: "Euro", country: "European Union" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "United Kingdom" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "India" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "Japan" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "China" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "Australia" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "Canada" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", country: "Switzerland" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", country: "Hong Kong" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "Singapore" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "Sweden" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "South Korea" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "Norway" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "New Zealand" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "Mexico" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "Brazil" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "South Africa" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
];

// Calculator Categories
const CATEGORIES = [
  { id: 'loans', name: 'Loans & Mortgages', calculators: ['mortgage', 'emi', 'credit-card', 'amortization'] },
  { id: 'investments', name: 'Investments', calculators: ['compound-interest', 'investment-growth', 'expense-ratio', 'roi-cagr'] },
  { id: 'retirement', name: 'Retirement & Goals', calculators: ['retirement', 'fire', 'savings-goal'] },
  { id: 'debt', name: 'Debt Management', calculators: ['debt-snowball', 'debt-avalanche'] },
  { id: 'planning', name: 'Financial Planning', calculators: ['inflation', 'net-worth', 'life-insurance', 'opportunity-cost'] },
  { id: 'trading', name: 'Trading Tools', calculators: ['position-size', 'risk-reward', 'breakeven'] }
];

const CALCULATORS = {
  'mortgage': { name: 'Mortgage', icon: '🏠', desc: 'Calculate home loan payments', seoTitle: 'Mortgage Calculator - Calculate Monthly Home Loan Payments' },
  'emi': { name: 'EMI / Loan', icon: '💳', desc: 'Equated monthly installments', seoTitle: 'EMI Calculator - Calculate Loan EMI Online' },
  'credit-card': { name: 'Credit Card Payoff', icon: '💳', desc: 'Debt payoff timeline', seoTitle: 'Credit Card Payoff Calculator - Pay Off Debt Faster' },
  'amortization': { name: 'Amortization', icon: '📋', desc: 'Loan payment schedule', seoTitle: 'Amortization Schedule Calculator - Loan Payment Breakdown' },
  'compound-interest': { name: 'Compound Interest', icon: '📈', desc: 'Growth with compounding', seoTitle: 'Compound Interest Calculator - Calculate Investment Growth' },
  'investment-growth': { name: 'Investment Growth', icon: '💰', desc: 'Track investment returns', seoTitle: 'Investment Growth Calculator - Project Future Returns' },
  'expense-ratio': { name: 'Expense Ratio Impact', icon: '📊', desc: 'Fee impact on returns', seoTitle: 'Expense Ratio Calculator - See How Fees Affect Returns' },
  'roi-cagr': { name: 'ROI & CAGR', icon: '📊', desc: 'Return calculations', seoTitle: 'ROI & CAGR Calculator - Calculate Investment Returns' },
  'retirement': { name: 'Retirement', icon: '👴', desc: 'Plan your retirement', seoTitle: 'Retirement Calculator - Plan Your Financial Future' },
  'fire': { name: 'FIRE', icon: '🔥', desc: 'Financial independence', seoTitle: 'FIRE Calculator - Financial Independence Retire Early' },
  'savings-goal': { name: 'Savings Goal', icon: '🎯', desc: 'Reach your target', seoTitle: 'Savings Goal Calculator - Reach Your Financial Goals' },
  'debt-snowball': { name: 'Debt Snowball', icon: '❄️', desc: 'Smallest balance first', seoTitle: 'Debt Snowball Calculator - Pay Off Debt Strategically' },
  'debt-avalanche': { name: 'Debt Avalanche', icon: '🏔️', desc: 'Highest rate first', seoTitle: 'Debt Avalanche Calculator - Save on Interest Payments' },
  'inflation': { name: 'Inflation Impact', icon: '📉', desc: 'Future purchasing power', seoTitle: 'Inflation Calculator - Calculate Future Purchasing Power' },
  'net-worth': { name: 'Net Worth', icon: '💎', desc: 'Assets minus liabilities', seoTitle: 'Net Worth Calculator - Track Your Financial Health' },
  'life-insurance': { name: 'Life Insurance', icon: '🛡️', desc: 'Coverage calculator', seoTitle: 'Life Insurance Calculator - Determine Coverage Needs' },
  'opportunity-cost': { name: 'Opportunity Cost', icon: '⚖️', desc: 'Compare options', seoTitle: 'Opportunity Cost Calculator - Compare Investment Options' },
  'position-size': { name: 'Position Size', icon: '📏', desc: 'Risk-based sizing', seoTitle: 'Position Size Calculator - Calculate Trade Size' },
  'risk-reward': { name: 'Risk/Reward', icon: '🎯', desc: 'R:R ratio calculator', seoTitle: 'Risk Reward Calculator - Analyze Trade Potential' },
  'breakeven': { name: 'Break-even', icon: '⚡', desc: 'Find break-even point', seoTitle: 'Break-even Calculator - Find Your Break-even Point' }
};

// Format utilities
const formatCurrency = (num, symbol) => {
  if (num === undefined || num === null || isNaN(num)) return `${symbol}0`;
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

// Animated Chart Component
const AnimatedChart = ({ data, type = 'bar', colors = ['#2d8a6e', '#3da882'] }) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value || d.total || 0));

  if (type === 'donut') {
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
    let currentAngle = 0;
    
    return (
      <div className="chart-donut-container">
        <svg viewBox="0 0 100 100" className="chart-donut">
          {data.map((item, i) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((startAngle + angle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((startAngle + angle - 90) * Math.PI / 180);
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
          {data.map((item, i) => (
            <div key={i} className="legend-item">
              <span className="legend-dot" style={{ background: colors[i % colors.length] }} />
              <span>{item.label}: {((item.value / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-bar-container">
      {data.slice(0, 10).map((item, i) => (
        <div key={i} className="chart-bar-row">
          <span className="chart-bar-label">{item.label || `Year ${item.year}`}</span>
          <div className="chart-bar-track">
            <div 
              className="chart-bar-fill"
              style={{
                width: animated ? `${((item.value || item.total || 0) / maxValue) * 100}%` : '0%',
                background: colors[i % colors.length],
                transition: `width 0.6s ease ${i * 0.05}s`
              }}
            />
          </div>
          <span className="chart-bar-value">{formatNumber(item.value || item.total || 0)}</span>
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
    const timer = setTimeout(() => setAnimatedProgress(Math.min(progress, 100)), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="progress-ring-container">
      <svg width={size} height={size} className="progress-ring">
        <circle
          className="progress-ring-bg"
          stroke="#e0dbd0"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-progress"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
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

// Currency Selector Component (Compact for Calculator)
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
      <button 
        className="currency-btn" 
        onClick={() => setShowDropdown(!showDropdown)}
        data-testid="currency-selector-btn"
      >
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
                data-testid={`currency-item-${c.code}`}
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
      <input
        type="number"
        className="input-field"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  </div>
);

const PercentInput = ({ label, value, onChange }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className="input-with-symbol input-with-suffix">
      <input type="number" step="0.1" className="input-field" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
      <span className="input-suffix">%</span>
    </div>
  </div>
);

const NumberInput = ({ label, value, onChange, suffix = '' }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <div className={suffix ? "input-with-symbol input-with-suffix" : ""}>
      <input type="number" className="input-field" value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        data-testid={`input-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  </div>
);

const ResultItem = ({ label, value, highlight, positive, negative }) => (
  <div className="result-item">
    <div className="result-label">{label}</div>
    <div className={`result-value ${highlight ? 'highlight' : ''} ${positive ? 'positive' : ''} ${negative ? 'negative' : ''}`}>
      {value}
    </div>
  </div>
);

// Dashboard Component
const Dashboard = ({ symbol, currency, setCurrency }) => {
  const [netWorth] = useState(165000);
  const [monthlyIncome] = useState(8500);
  const [monthlyExpenses] = useState(5200);
  const [savingsRate] = useState(38.8);
  const [debtTotal] = useState(192000);

  const quickStats = [
    { label: 'Net Worth', value: formatCurrency(netWorth, symbol), change: '+12.5%', positive: true },
    { label: 'Monthly Savings', value: formatCurrency(monthlyIncome - monthlyExpenses, symbol), change: '+5.2%', positive: true },
    { label: 'Savings Rate', value: `${savingsRate}%`, change: '+2.1%', positive: true },
    { label: 'Total Debt', value: formatCurrency(debtTotal, symbol), change: '-3.4%', positive: true },
  ];

  const portfolioData = [
    { label: 'Stocks', value: 45000 },
    { label: 'Bonds', value: 25000 },
    { label: 'Real Estate', value: 100000 },
    { label: 'Cash', value: 15000 },
  ];

  return (
    <div className="dashboard" data-testid="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Financial Dashboard</h1>
          <p className="dashboard-subtitle">Your personal finance overview</p>
        </div>
        <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} />
      </div>

      <div className="dashboard-grid">
        {quickStats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card">
          <h3>Portfolio Allocation</h3>
          <AnimatedChart data={portfolioData} type="donut" colors={['#2d8a6e', '#3da882', '#4fc49a', '#6dd5b0']} />
        </div>
        
        <div className="dashboard-card">
          <h3>Financial Health Score</h3>
          <div className="health-score-container">
            <ProgressRing progress={78} size={160} strokeWidth={14} />
            <div className="health-score-details">
              <div className="health-item">
                <span>Emergency Fund</span>
                <span className="positive">✓ 6 months</span>
              </div>
              <div className="health-item">
                <span>Debt-to-Income</span>
                <span className="positive">✓ 28%</span>
              </div>
              <div className="health-item">
                <span>Savings Rate</span>
                <span className="positive">✓ 38.8%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card ad-card">
          <AdSpace position="dashboard" />
        </div>
      </div>

      <div className="dashboard-calculators">
        <h3>Quick Calculators</h3>
        <div className="quick-calc-grid">
          {['mortgage', 'compound-interest', 'retirement', 'fire'].map(id => (
            <div key={id} className="quick-calc-card" data-testid={`quick-calc-${id}`}>
              <span className="quick-calc-icon">{CALCULATORS[id].icon}</span>
              <span className="quick-calc-name">{CALCULATORS[id].name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mortgage Calculator
const MortgageCalculator = ({ symbol, currency, setCurrency }) => {
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(30);
  const [taxes, setTaxes] = useState(3000);
  const [insurance, setInsurance] = useState(1200);

  const results = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    let monthlyPI = monthlyRate === 0 ? principal / numPayments :
      principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - principal;
    
    return {
      monthlyPayment: monthlyPI + taxes/12 + insurance/12,
      monthlyPI,
      totalInterest,
      totalPaid: totalPaid + taxes * term + insurance * term,
      principal,
      chartData: [
        { label: 'Principal', value: principal },
        { label: 'Interest', value: totalInterest },
        { label: 'Taxes & Insurance', value: (taxes + insurance) * term }
      ]
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
          <AnimatedChart data={results.chartData} type="donut" colors={['#2d8a6e', '#3da882', '#6dd5b0']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// EMI Calculator
const EMICalculator = ({ symbol, currency, setCurrency }) => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [rate, setRate] = useState(8);
  const [term, setTerm] = useState(60);

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
        { label: 'Interest', value: totalInterest }
      ]
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
          <AnimatedChart data={results.chartData} type="donut" colors={['#2d8a6e', '#3da882']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Compound Interest Calculator
const CompoundInterestCalculator = ({ symbol, currency, setCurrency }) => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12);
  const [monthlyContrib, setMonthlyContrib] = useState(500);

  const results = useMemo(() => {
    const r = rate / 100;
    const n = frequency;
    const t = years;
    const fvPrincipal = principal * Math.pow(1 + r/n, n*t);
    const totalContributions = monthlyContrib * 12 * t;
    let fvContributions = 0;
    if (monthlyContrib > 0) {
      const monthlyRate = r / 12;
      fvContributions = monthlyContrib * ((Math.pow(1 + monthlyRate, 12*t) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    const totalValue = fvPrincipal + fvContributions;
    const totalInterest = totalValue - principal - totalContributions;
    
    const yearlyData = [];
    for (let year = 0; year <= t; year += Math.ceil(t/8)) {
      const fv = principal * Math.pow(1 + r/n, n*year);
      const contrib = monthlyContrib * 12 * year;
      let fvc = 0;
      if (monthlyContrib > 0 && year > 0) {
        fvc = monthlyContrib * ((Math.pow(1 + r/12, 12*year) - 1) / (r/12)) * (1 + r/12);
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
              <CurrencyInput label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} />
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
              <ResultItem label="Total Contributions" value={formatCurrency(results.totalContributions, symbol)} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Growth Over Time</h3>
          <AnimatedChart data={results.yearlyData} type="bar" colors={['#2d8a6e']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// FIRE Calculator
const FIRECalculator = ({ symbol, currency, setCurrency }) => {
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [annualSavings, setAnnualSavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(7);
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
    const progress = (currentNetWorth / fireNumber) * 100;
    
    const projectionData = [];
    let current = currentNetWorth;
    for (let year = 0; year <= Math.min(yearsToFire + 2, 30); year += Math.max(1, Math.floor(yearsToFire/6))) {
      projectionData.push({ label: `Year ${year}`, value: current });
      current = current * (1 + expectedReturn / 100) + annualSavings;
    }
    
    return { fireNumber, yearsToFire, savingsRate, progress, projectionData };
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
              <ResultItem label="Years to FIRE" value={results.yearsToFire === 0 ? "You're there!" : `${results.yearsToFire} years`} positive={results.yearsToFire === 0} />
              <ResultItem label="Progress" value={`${Math.min(results.progress, 100).toFixed(1)}%`} />
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
        <div className="chart-card">
          <h3>Wealth Projection</h3>
          <AnimatedChart data={results.projectionData} type="bar" colors={['#2d8a6e']} />
        </div>
      </div>
    </div>
  );
};

// Retirement Calculator
const RetirementCalculator = ({ symbol, currency, setCurrency }) => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContrib, setMonthlyContrib] = useState(1000);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [inflation, setInflation] = useState(3);
  const [monthlyExpense, setMonthlyExpense] = useState(4000);

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
    
    return {
      retirementCorpus, requiredCorpus, surplusDeficit,
      monthlyExpenseAtRetirement: inflationAdjustedExpense,
      chartData: [
        { label: 'Your Corpus', value: retirementCorpus },
        { label: 'Required', value: requiredCorpus }
      ]
    };
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
          <AnimatedChart data={results.chartData} type="bar" colors={['#2d8a6e', '#e57373']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Credit Card Calculator  
const CreditCardCalculator = ({ symbol, currency, setCurrency }) => {
  const [balance, setBalance] = useState(5000);
  const [rate, setRate] = useState(19.99);
  const [minPaymentPercent, setMinPaymentPercent] = useState(2);
  const [fixedPayment, setFixedPayment] = useState(200);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let balanceMin = balance, monthsMin = 0, totalPaidMin = 0;
    while (balanceMin > 0.01 && monthsMin < 600) {
      const minPayment = Math.max(balanceMin * minPaymentPercent / 100, 25);
      const interest = balanceMin * monthlyRate;
      const principal = Math.min(minPayment - interest, balanceMin);
      if (principal <= 0) break;
      balanceMin -= principal;
      totalPaidMin += minPayment;
      monthsMin++;
    }
    
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
    
    return {
      minPayment: { months: monthsMin, totalPaid: totalPaidMin, totalInterest: totalPaidMin - balance },
      fixedPayment: fixedPayment > balance * monthlyRate ? { months: monthsFixed, totalPaid: totalPaidFixed, totalInterest: totalPaidFixed - balance } : null,
      timeSaved: monthsMin - monthsFixed,
      interestSaved: totalPaidMin - totalPaidFixed,
      chartData: [
        { label: 'Min Payment Interest', value: totalPaidMin - balance },
        { label: 'Fixed Payment Interest', value: totalPaidFixed - balance }
      ]
    };
  }, [balance, rate, minPaymentPercent, fixedPayment]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="credit-card-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Credit Card Payoff</h2>
              <p className="calc-subtitle">See how faster payments save money</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Credit Card Balance" value={balance} onChange={setBalance} symbol={symbol} />
              <PercentInput label="Interest Rate (APR)" value={rate} onChange={setRate} />
              <PercentInput label="Minimum Payment %" value={minPaymentPercent} onChange={setMinPaymentPercent} />
              <CurrencyInput label="Your Fixed Payment" value={fixedPayment} onChange={setFixedPayment} symbol={symbol} />
            </div>
            <div className="calc-results">
              <ResultItem label="Min Payment Time" value={`${results.minPayment.months} months`} negative />
              <ResultItem label="Min Payment Interest" value={formatCurrency(results.minPayment.totalInterest, symbol)} negative />
              {results.fixedPayment && (
                <>
                  <ResultItem label="Fixed Payment Time" value={`${results.fixedPayment.months} months`} positive />
                  <ResultItem label="Time Saved" value={`${results.timeSaved} months`} positive />
                  <ResultItem label="Interest Saved" value={formatCurrency(results.interestSaved, symbol)} highlight />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Interest Comparison</h3>
          <AnimatedChart data={results.chartData} type="bar" colors={['#e57373', '#2d8a6e']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Investment Growth Calculator
const InvestmentGrowthCalculator = ({ symbol, currency, setCurrency }) => {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const fvLumpsum = initial * Math.pow(1 + monthlyRate, months);
    const fvContributions = monthlyRate > 0 
      ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : monthly * months;
    const totalValue = fvLumpsum + fvContributions;
    const totalInvested = initial + (monthly * months);
    const totalGains = totalValue - totalInvested;
    
    const yearlyData = [];
    for (let y = 0; y <= years; y += Math.max(1, Math.floor(years/8))) {
      const m = y * 12;
      const fvl = initial * Math.pow(1 + monthlyRate, m);
      const fvc = monthlyRate > 0 && m > 0 ? monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate) : monthly * m;
      yearlyData.push({ label: `Year ${y}`, value: fvl + fvc });
    }
    
    return { totalValue, totalInvested, totalGains, yearlyData };
  }, [initial, monthly, rate, years]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="investment-growth-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">Investment Growth</h2>
              <p className="calc-subtitle">Project your investment returns</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Initial Investment" value={initial} onChange={setInitial} symbol={symbol} />
              <CurrencyInput label="Monthly Contribution" value={monthly} onChange={setMonthly} symbol={symbol} />
              <PercentInput label="Expected Annual Return" value={rate} onChange={setRate} />
              <NumberInput label="Investment Period" value={years} onChange={setYears} suffix="years" />
            </div>
            <div className="calc-results">
              <ResultItem label="Future Value" value={formatCurrency(results.totalValue, symbol)} highlight />
              <ResultItem label="Total Gains" value={formatCurrency(results.totalGains, symbol)} positive />
              <ResultItem label="Total Invested" value={formatCurrency(results.totalInvested, symbol)} />
              <ResultItem label="ROI" value={`${((results.totalGains / results.totalInvested) * 100).toFixed(1)}%`} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Growth Projection</h3>
          <AnimatedChart data={results.yearlyData} type="bar" colors={['#2d8a6e']} />
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Simplified versions of remaining calculators
const ROICAGRCalculator = ({ symbol, currency, setCurrency }) => {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const roi = ((finalValue - initialValue) / initialValue) * 100;
    const cagr = years > 0 ? (Math.pow(finalValue / initialValue, 1/years) - 1) * 100 : 0;
    return { roi, cagr, profitLoss: finalValue - initialValue };
  }, [initialValue, finalValue, years]);

  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid="roi-cagr-calculator">
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">ROI & CAGR Calculator</h2>
              <p className="calc-subtitle">Calculate investment returns</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <CurrencyInput label="Initial Value" value={initialValue} onChange={setInitialValue} symbol={symbol} />
              <CurrencyInput label="Final Value" value={finalValue} onChange={setFinalValue} symbol={symbol} />
              <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
            </div>
            <div className="calc-results">
              <ResultItem label="Total ROI" value={`${results.roi.toFixed(2)}%`} highlight positive={results.roi > 0} />
              <ResultItem label="CAGR" value={`${results.cagr.toFixed(2)}%`} positive={results.cagr > 0} />
              <ResultItem label={results.profitLoss >= 0 ? "Profit" : "Loss"} value={formatCurrency(Math.abs(results.profitLoss), symbol)} positive={results.profitLoss >= 0} negative={results.profitLoss < 0} />
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Return Analysis</h3>
          <ProgressRing progress={Math.min(results.roi, 200) / 2} size={140} color={results.roi > 0 ? '#2d8a6e' : '#e57373'} />
          <p className="chart-note">{results.roi.toFixed(1)}% Total Return</p>
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Generic Calculator Wrapper for simpler calculators
const GenericCalculator = ({ id, symbol, currency, setCurrency }) => {
  const calc = CALCULATORS[id];
  
  return (
    <div className="calc-layout">
      <div className="calc-main">
        <div className="calc-card" data-testid={`${id}-calculator`}>
          <div className="calc-header">
            <div className="calc-header-left">
              <h2 className="calc-title">{calc.name} Calculator</h2>
              <p className="calc-subtitle">{calc.desc}</p>
            </div>
            <CurrencySelector currency={currency} setCurrency={setCurrency} currencies={CURRENCIES} compact />
          </div>
          <div className="calc-body">
            <div className="calc-inputs">
              <p className="coming-soon">Full calculator coming soon!</p>
              <p className="calc-desc">This calculator will help you {calc.desc.toLowerCase()}.</p>
            </div>
            <div className="calc-results">
              <div className="placeholder-result">
                <span className="placeholder-icon">{calc.icon}</span>
                <span>Enter values to calculate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="calc-sidebar">
        <div className="chart-card">
          <h3>Visualization</h3>
          <div className="chart-placeholder">Chart will appear here</div>
        </div>
        <AdSpace position="sidebar" />
      </div>
    </div>
  );
};

// Calculator Map
const CALCULATOR_COMPONENTS = {
  'dashboard': Dashboard,
  'mortgage': MortgageCalculator,
  'emi': EMICalculator,
  'credit-card': CreditCardCalculator,
  'compound-interest': CompoundInterestCalculator,
  'investment-growth': InvestmentGrowthCalculator,
  'roi-cagr': ROICAGRCalculator,
  'retirement': RetirementCalculator,
  'fire': FIRECalculator,
};

// Main App
function App() {
  const [activeCalculator, setActiveCalculator] = useState('dashboard');
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  // Update page title for SEO
  useEffect(() => {
    if (activeCalculator === 'dashboard') {
      document.title = 'FinCalc - Free Personal Finance Calculators';
    } else {
      const calc = CALCULATORS[activeCalculator];
      if (calc) {
        document.title = `${calc.seoTitle} | FinCalc`;
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
            data-testid="nav-dashboard"
          >
            Dashboard
          </button>
          <button 
            className={`header-nav-item ${activeCalculator !== 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveCalculator('mortgage')}
            data-testid="nav-calculators"
          >
            Calculators
          </button>
        </nav>
      </header>

      <div className="main-container">
        <nav className="sidebar" data-testid="sidebar-nav">
          <div className="nav-category">
            <div 
              className={`nav-item ${activeCalculator === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveCalculator('dashboard')}
              data-testid="nav-item-dashboard"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </div>
          </div>
          {CATEGORIES.map((category) => (
            <div key={category.id} className="nav-category">
              <div className="nav-category-title">{category.name}</div>
              {category.calculators.map((calcId) => {
                const calc = CALCULATORS[calcId];
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
          <CalculatorComponent symbol={currency.symbol} currency={currency} setCurrency={setCurrency} />
        </main>
      </div>
    </div>
  );
}

export default App;
