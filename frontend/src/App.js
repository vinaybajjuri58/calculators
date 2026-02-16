import React, { useState, useMemo } from 'react';

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
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "Russia" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "United Arab Emirates" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "Saudi Arabia" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "Thailand" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "Malaysia" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "Indonesia" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "Philippines" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "Poland" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "Turkey" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", country: "Vietnam" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", country: "Pakistan" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", country: "Bangladesh" },
];

// Calculator Categories
const CATEGORIES = [
  {
    id: 'loans',
    name: 'Loans & Mortgages',
    calculators: ['mortgage', 'emi', 'credit-card', 'amortization']
  },
  {
    id: 'investments',
    name: 'Investments',
    calculators: ['compound-interest', 'investment-growth', 'expense-ratio', 'roi-cagr']
  },
  {
    id: 'retirement',
    name: 'Retirement & Goals',
    calculators: ['retirement', 'fire', 'savings-goal']
  },
  {
    id: 'debt',
    name: 'Debt Management',
    calculators: ['debt-snowball', 'debt-avalanche']
  },
  {
    id: 'planning',
    name: 'Financial Planning',
    calculators: ['inflation', 'net-worth', 'life-insurance', 'opportunity-cost']
  },
  {
    id: 'trading',
    name: 'Trading Tools',
    calculators: ['position-size', 'risk-reward', 'breakeven']
  }
];

const CALCULATORS = {
  'mortgage': { name: 'Mortgage', icon: '🏠', desc: 'Calculate home loan payments' },
  'emi': { name: 'EMI / Loan', icon: '💳', desc: 'Equated monthly installments' },
  'credit-card': { name: 'Credit Card Payoff', icon: '💳', desc: 'Debt payoff timeline' },
  'amortization': { name: 'Amortization', icon: '📋', desc: 'Loan payment schedule' },
  'compound-interest': { name: 'Compound Interest', icon: '📈', desc: 'Growth with compounding' },
  'investment-growth': { name: 'Investment Growth', icon: '💰', desc: 'Track investment returns' },
  'expense-ratio': { name: 'Expense Ratio Impact', icon: '📊', desc: 'Fee impact on returns' },
  'roi-cagr': { name: 'ROI & CAGR', icon: '📊', desc: 'Return calculations' },
  'retirement': { name: 'Retirement', icon: '👴', desc: 'Plan your retirement' },
  'fire': { name: 'FIRE', icon: '🔥', desc: 'Financial independence' },
  'savings-goal': { name: 'Savings Goal', icon: '🎯', desc: 'Reach your target' },
  'debt-snowball': { name: 'Debt Snowball', icon: '❄️', desc: 'Smallest balance first' },
  'debt-avalanche': { name: 'Debt Avalanche', icon: '🏔️', desc: 'Highest rate first' },
  'inflation': { name: 'Inflation Impact', icon: '📉', desc: 'Future purchasing power' },
  'net-worth': { name: 'Net Worth', icon: '💎', desc: 'Assets minus liabilities' },
  'life-insurance': { name: 'Life Insurance', icon: '🛡️', desc: 'Coverage calculator' },
  'opportunity-cost': { name: 'Opportunity Cost', icon: '⚖️', desc: 'Compare options' },
  'position-size': { name: 'Position Size', icon: '📏', desc: 'Risk-based sizing' },
  'risk-reward': { name: 'Risk/Reward', icon: '🎯', desc: 'R:R ratio calculator' },
  'breakeven': { name: 'Break-even', icon: '⚡', desc: 'Find break-even point' }
};

// Format number with currency
const formatCurrency = (num, symbol) => {
  if (num === undefined || num === null || isNaN(num)) return `${symbol}0`;
  return `${symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatNumber = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
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
      <input
        type="number"
        step="0.1"
        className="input-field"
        value={value}
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
      <input
        type="number"
        className="input-field"
        value={value}
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

// Calculator Components
const MortgageCalculator = ({ symbol }) => {
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
    
    let monthlyPI;
    if (monthlyRate === 0) {
      monthlyPI = principal / numPayments;
    } else {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    const monthlyTaxes = taxes / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthly = monthlyPI + monthlyTaxes + monthlyInsurance;
    const totalPaid = monthlyPI * numPayments;
    const totalInterest = totalPaid - principal;
    
    return {
      monthlyPayment: totalMonthly,
      monthlyPI,
      totalInterest,
      totalPaid: totalPaid + taxes * term + insurance * term,
      principal,
      principalPercent: (principal / (principal + totalInterest)) * 100,
      interestPercent: (totalInterest / (principal + totalInterest)) * 100
    };
  }, [homePrice, downPayment, rate, term, taxes, insurance]);

  return (
    <div className="calc-card" data-testid="mortgage-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Mortgage Calculator</h2>
        <p className="calc-subtitle">Calculate your home loan payments and total costs</p>
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
          
          <div className="breakdown-bar">
            <div className="breakdown-segment principal" style={{ width: `${results.principalPercent}%` }} />
            <div className="breakdown-segment interest" style={{ width: `${results.interestPercent}%` }} />
          </div>
          <div className="breakdown-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--accent)' }} />
              <span>Principal ({results.principalPercent.toFixed(1)}%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--accent-light)', opacity: 0.5 }} />
              <span>Interest ({results.interestPercent.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EMICalculator = ({ symbol }) => {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [rate, setRate] = useState(8);
  const [term, setTerm] = useState(60);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let emi;
    if (monthlyRate === 0) {
      emi = loanAmount / term;
    } else {
      emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1);
    }
    const totalPaid = emi * term;
    const totalInterest = totalPaid - loanAmount;
    
    return { emi, totalPaid, totalInterest };
  }, [loanAmount, rate, term]);

  return (
    <div className="calc-card" data-testid="emi-calculator">
      <div className="calc-header">
        <h2 className="calc-title">EMI / Loan Calculator</h2>
        <p className="calc-subtitle">Calculate equated monthly installments for any loan</p>
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
          <ResultItem label="Principal" value={formatCurrency(loanAmount, symbol)} />
        </div>
      </div>
    </div>
  );
};

const CreditCardCalculator = ({ symbol }) => {
  const [balance, setBalance] = useState(5000);
  const [rate, setRate] = useState(19.99);
  const [minPaymentPercent, setMinPaymentPercent] = useState(2);
  const [fixedPayment, setFixedPayment] = useState(200);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    
    // Minimum payment scenario
    let balanceMin = balance;
    let monthsMin = 0;
    let totalPaidMin = 0;
    
    while (balanceMin > 0.01 && monthsMin < 600) {
      const minPayment = Math.max(balanceMin * minPaymentPercent / 100, 25);
      const interest = balanceMin * monthlyRate;
      const principal = Math.min(minPayment - interest, balanceMin);
      if (principal <= 0) break;
      balanceMin -= principal;
      totalPaidMin += minPayment;
      monthsMin++;
    }
    
    // Fixed payment scenario
    let balanceFixed = balance;
    let monthsFixed = 0;
    let totalPaidFixed = 0;
    
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
      minPayment: { months: monthsMin, years: monthsMin / 12, totalPaid: totalPaidMin, totalInterest: totalPaidMin - balance },
      fixedPayment: fixedPayment > balance * monthlyRate ? { months: monthsFixed, years: monthsFixed / 12, totalPaid: totalPaidFixed, totalInterest: totalPaidFixed - balance } : null,
      timeSaved: monthsMin - monthsFixed,
      interestSaved: totalPaidMin - totalPaidFixed
    };
  }, [balance, rate, minPaymentPercent, fixedPayment]);

  return (
    <div className="calc-card" data-testid="credit-card-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Credit Card Payoff Calculator</h2>
        <p className="calc-subtitle">See how faster payments save you money</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Credit Card Balance" value={balance} onChange={setBalance} symbol={symbol} />
          <PercentInput label="Interest Rate (APR)" value={rate} onChange={setRate} />
          <PercentInput label="Minimum Payment %" value={minPaymentPercent} onChange={setMinPaymentPercent} />
          <CurrencyInput label="Your Fixed Payment" value={fixedPayment} onChange={setFixedPayment} symbol={symbol} />
        </div>
        <div className="calc-results">
          <div className="result-item">
            <div className="result-label">With Minimum Payments</div>
            <div className="result-value negative">{results.minPayment.months} months ({results.minPayment.years.toFixed(1)} yrs)</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Total interest: {formatCurrency(results.minPayment.totalInterest, symbol)}
            </div>
          </div>
          {results.fixedPayment && (
            <>
              <div className="result-item">
                <div className="result-label">With Fixed Payment</div>
                <div className="result-value positive">{results.fixedPayment.months} months ({results.fixedPayment.years.toFixed(1)} yrs)</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Total interest: {formatCurrency(results.fixedPayment.totalInterest, symbol)}
                </div>
              </div>
              <ResultItem label="Time Saved" value={`${results.timeSaved} months`} positive />
              <ResultItem label="Interest Saved" value={formatCurrency(results.interestSaved, symbol)} highlight />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CompoundInterestCalculator = ({ symbol }) => {
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
    
    return { totalValue, totalInterest, totalContributions, fvPrincipal };
  }, [principal, rate, years, frequency, monthlyContrib]);

  return (
    <div className="calc-card" data-testid="compound-interest-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Compound Interest Calculator</h2>
        <p className="calc-subtitle">See the power of compound growth over time</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Initial Investment" value={principal} onChange={setPrincipal} symbol={symbol} />
          <CurrencyInput label="Monthly Contribution" value={monthlyContrib} onChange={setMonthlyContrib} symbol={symbol} />
          <PercentInput label="Annual Interest Rate" value={rate} onChange={setRate} />
          <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
          <div className="input-group">
            <label className="input-label">Compound Frequency</label>
            <select className="select-field" value={frequency} onChange={(e) => setFrequency(parseInt(e.target.value))} data-testid="select-compound-frequency">
              <option value={1}>Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>
        <div className="calc-results">
          <ResultItem label="Future Value" value={formatCurrency(results.totalValue, symbol)} highlight />
          <ResultItem label="Total Interest Earned" value={formatCurrency(results.totalInterest, symbol)} positive />
          <ResultItem label="Initial Investment" value={formatCurrency(principal, symbol)} />
          <ResultItem label="Total Contributions" value={formatCurrency(results.totalContributions, symbol)} />
        </div>
      </div>
    </div>
  );
};

const InvestmentGrowthCalculator = ({ symbol }) => {
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
    
    return { totalValue, totalInvested, totalGains };
  }, [initial, monthly, rate, years]);

  return (
    <div className="calc-card" data-testid="investment-growth-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Investment Growth Calculator</h2>
        <p className="calc-subtitle">Project your investment returns over time</p>
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
          <ResultItem label="Return on Investment" value={`${((results.totalGains / results.totalInvested) * 100).toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
};

const RetirementCalculator = ({ symbol }) => {
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
    const annualExpenseAtRetirement = inflationAdjustedExpense * 12;
    const requiredCorpus = annualExpenseAtRetirement * 25; // 4% rule
    const surplusDeficit = retirementCorpus - requiredCorpus;
    
    return {
      retirementCorpus,
      requiredCorpus,
      surplusDeficit,
      monthlyExpenseAtRetirement: inflationAdjustedExpense,
      yearsToRetirement,
      totalContributions: monthlyContrib * months
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContrib, expectedReturn, inflation, monthlyExpense]);

  return (
    <div className="calc-card" data-testid="retirement-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Retirement Calculator</h2>
        <p className="calc-subtitle">Plan for a comfortable retirement</p>
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
          <ResultItem 
            label={results.surplusDeficit >= 0 ? "Surplus" : "Shortfall"} 
            value={formatCurrency(Math.abs(results.surplusDeficit), symbol)} 
            positive={results.surplusDeficit >= 0}
            negative={results.surplusDeficit < 0}
          />
          <ResultItem label="Monthly Expense at Retirement" value={formatCurrency(results.monthlyExpenseAtRetirement, symbol)} />
          <ResultItem label="Years to Retirement" value={`${results.yearsToRetirement} years`} />
        </div>
      </div>
    </div>
  );
};

const FIRECalculator = ({ symbol }) => {
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [currentNetWorth, setCurrentNetWorth] = useState(100000);
  const [annualSavings, setAnnualSavings] = useState(30000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [withdrawalRate, setWithdrawalRate] = useState(4);

  const results = useMemo(() => {
    const fireNumber = annualExpenses / (withdrawalRate / 100);
    
    let yearsToFire = 0;
    if (currentNetWorth >= fireNumber) {
      yearsToFire = 0;
    } else {
      const annualRate = expectedReturn / 100;
      let current = currentNetWorth;
      while (current < fireNumber && yearsToFire < 100) {
        current = current * (1 + annualRate) + annualSavings;
        yearsToFire++;
      }
    }
    
    const savingsRate = (annualSavings / (annualExpenses + annualSavings)) * 100;
    const progress = (currentNetWorth / fireNumber) * 100;
    
    return { fireNumber, yearsToFire, savingsRate, progress };
  }, [annualExpenses, currentNetWorth, annualSavings, expectedReturn, withdrawalRate]);

  return (
    <div className="calc-card" data-testid="fire-calculator">
      <div className="calc-header">
        <h2 className="calc-title">FIRE Calculator</h2>
        <p className="calc-subtitle">Financial Independence, Retire Early</p>
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
          <ResultItem label="Current Progress" value={`${Math.min(results.progress, 100).toFixed(1)}%`} />
          <ResultItem label="Savings Rate" value={`${results.savingsRate.toFixed(1)}%`} />
          
          <div style={{ marginTop: '1rem' }}>
            <div className="result-label">Progress to FIRE</div>
            <div style={{ background: 'white', borderRadius: '4px', height: '20px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--accent)', height: '100%', width: `${Math.min(results.progress, 100)}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ROICAGRCalculator = ({ symbol }) => {
  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const roi = ((finalValue - initialValue) / initialValue) * 100;
    const cagr = years > 0 && initialValue > 0 
      ? (Math.pow(finalValue / initialValue, 1/years) - 1) * 100 
      : 0;
    const profitLoss = finalValue - initialValue;
    
    return { roi, cagr, profitLoss };
  }, [initialValue, finalValue, years]);

  return (
    <div className="calc-card" data-testid="roi-cagr-calculator">
      <div className="calc-header">
        <h2 className="calc-title">ROI & CAGR Calculator</h2>
        <p className="calc-subtitle">Calculate return on investment and compound annual growth rate</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Initial Value" value={initialValue} onChange={setInitialValue} symbol={symbol} />
          <CurrencyInput label="Final Value" value={finalValue} onChange={setFinalValue} symbol={symbol} />
          <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
        </div>
        <div className="calc-results">
          <ResultItem label="Total ROI" value={`${results.roi.toFixed(2)}%`} highlight positive={results.roi > 0} negative={results.roi < 0} />
          <ResultItem label="CAGR" value={`${results.cagr.toFixed(2)}%`} positive={results.cagr > 0} />
          <ResultItem 
            label={results.profitLoss >= 0 ? "Profit" : "Loss"} 
            value={formatCurrency(Math.abs(results.profitLoss), symbol)} 
            positive={results.profitLoss >= 0}
            negative={results.profitLoss < 0}
          />
        </div>
      </div>
    </div>
  );
};

const SavingsGoalCalculator = ({ symbol }) => {
  const [targetAmount, setTargetAmount] = useState(50000);
  const [timeMonths, setTimeMonths] = useState(36);
  const [expectedReturn, setExpectedReturn] = useState(6);
  const [currentSavings, setCurrentSavings] = useState(5000);

  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, timeMonths);
    const remainingTarget = targetAmount - fvCurrent;
    
    let monthlySavingsNeeded;
    if (remainingTarget <= 0) {
      monthlySavingsNeeded = 0;
    } else if (monthlyRate === 0) {
      monthlySavingsNeeded = remainingTarget / timeMonths;
    } else {
      monthlySavingsNeeded = remainingTarget * monthlyRate / ((Math.pow(1 + monthlyRate, timeMonths) - 1) * (1 + monthlyRate));
    }
    
    const totalSavings = monthlySavingsNeeded * timeMonths;
    const totalInterest = targetAmount - currentSavings - totalSavings;
    
    return {
      monthlySavingsNeeded: Math.max(0, monthlySavingsNeeded),
      totalSavings,
      totalInterest: Math.max(0, totalInterest),
      fvCurrent
    };
  }, [targetAmount, timeMonths, expectedReturn, currentSavings]);

  return (
    <div className="calc-card" data-testid="savings-goal-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Savings Goal Calculator</h2>
        <p className="calc-subtitle">Find out how much to save monthly to reach your goal</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Target Amount" value={targetAmount} onChange={setTargetAmount} symbol={symbol} />
          <NumberInput label="Time to Goal" value={timeMonths} onChange={setTimeMonths} suffix="months" />
          <PercentInput label="Expected Return" value={expectedReturn} onChange={setExpectedReturn} />
          <CurrencyInput label="Current Savings" value={currentSavings} onChange={setCurrentSavings} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Monthly Savings Needed" value={formatCurrency(results.monthlySavingsNeeded, symbol)} highlight />
          <ResultItem label="Total You'll Save" value={formatCurrency(results.totalSavings, symbol)} />
          <ResultItem label="Interest Earned" value={formatCurrency(results.totalInterest, symbol)} positive />
          <ResultItem label="Current Savings Future Value" value={formatCurrency(results.fvCurrent, symbol)} />
        </div>
      </div>
    </div>
  );
};

const DebtSnowballCalculator = ({ symbol }) => {
  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: 5000, rate: 19.99, minPayment: 150 },
    { name: 'Car Loan', balance: 15000, rate: 6.5, minPayment: 350 },
    { name: 'Personal Loan', balance: 8000, rate: 12, minPayment: 200 }
  ]);
  const [monthlyBudget, setMonthlyBudget] = useState(1000);

  const addDebt = () => {
    setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 1000, rate: 10, minPayment: 50 }]);
  };

  const removeDebt = (index) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const updateDebt = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setDebts(newDebts);
  };

  const results = useMemo(() => {
    if (debts.length === 0) return { totalMonths: 0, totalInterest: 0, payoffOrder: [] };
    
    // Sort by balance (smallest first) - Snowball method
    const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
    const totalDebt = sortedDebts.reduce((sum, d) => sum + d.balance, 0);
    let totalInterestPaid = 0;
    let months = 0;
    const payoffOrder = [];
    
    const activeDebts = sortedDebts.map(d => ({ ...d, remaining: d.balance }));
    
    while (activeDebts.some(d => d.remaining > 0.01) && months < 600) {
      months++;
      const totalMinPayments = activeDebts.filter(d => d.remaining > 0).reduce((sum, d) => sum + d.minPayment, 0);
      let extraPayment = monthlyBudget - totalMinPayments;
      
      for (const debt of activeDebts) {
        if (debt.remaining <= 0.01) continue;
        
        const interest = debt.remaining * (debt.rate / 100 / 12);
        totalInterestPaid += interest;
        
        let payment = debt.minPayment;
        if (debt === activeDebts.find(d => d.remaining > 0.01)) {
          payment += Math.max(0, extraPayment);
        }
        
        debt.remaining = Math.max(0, debt.remaining + interest - payment);
        
        if (debt.remaining <= 0.01 && !payoffOrder.find(p => p.name === debt.name)) {
          payoffOrder.push({ name: debt.name, month: months });
        }
      }
    }
    
    return {
      totalMonths: months,
      totalYears: months / 12,
      totalInterest: totalInterestPaid,
      totalPaid: totalDebt + totalInterestPaid,
      payoffOrder
    };
  }, [debts, monthlyBudget]);

  return (
    <div className="calc-card" data-testid="debt-snowball-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Debt Snowball Calculator</h2>
        <p className="calc-subtitle">Pay off smallest balances first for quick wins</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          {debts.map((debt, index) => (
            <div key={index} className="debt-item">
              <div className="debt-item-header">
                <input
                  type="text"
                  className="debt-item-name"
                  value={debt.name}
                  onChange={(e) => updateDebt(index, 'name', e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 600 }}
                />
                <button className="remove-debt-btn" onClick={() => removeDebt(index)}>✕</button>
              </div>
              <div className="debt-inputs">
                <div className="input-group">
                  <label className="input-label">Balance</label>
                  <input type="number" className="input-field" value={debt.balance} onChange={(e) => updateDebt(index, 'balance', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Rate %</label>
                  <input type="number" className="input-field" value={debt.rate} onChange={(e) => updateDebt(index, 'rate', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Min Pay</label>
                  <input type="number" className="input-field" value={debt.minPayment} onChange={(e) => updateDebt(index, 'minPayment', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-debt-btn" onClick={addDebt}>+ Add Debt</button>
          <CurrencyInput label="Monthly Budget for Debt" value={monthlyBudget} onChange={setMonthlyBudget} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Debt-Free In" value={`${results.totalMonths} months (${results.totalYears?.toFixed(1)} yrs)`} highlight />
          <ResultItem label="Total Interest Paid" value={formatCurrency(results.totalInterest, symbol)} />
          <ResultItem label="Total Paid" value={formatCurrency(results.totalPaid, symbol)} />
          
          {results.payoffOrder.length > 0 && (
            <div className="payoff-timeline">
              <div className="result-label" style={{ marginBottom: '0.5rem' }}>Payoff Order</div>
              {results.payoffOrder.map((item, index) => (
                <div key={index} className="payoff-item">
                  <div className="payoff-number">{index + 1}</div>
                  <div className="payoff-name">{item.name}</div>
                  <div className="payoff-month">Month {item.month}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DebtAvalancheCalculator = ({ symbol }) => {
  const [debts, setDebts] = useState([
    { name: 'Credit Card', balance: 5000, rate: 19.99, minPayment: 150 },
    { name: 'Car Loan', balance: 15000, rate: 6.5, minPayment: 350 },
    { name: 'Personal Loan', balance: 8000, rate: 12, minPayment: 200 }
  ]);
  const [monthlyBudget, setMonthlyBudget] = useState(1000);

  const addDebt = () => {
    setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 1000, rate: 10, minPayment: 50 }]);
  };

  const removeDebt = (index) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const updateDebt = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setDebts(newDebts);
  };

  const results = useMemo(() => {
    if (debts.length === 0) return { totalMonths: 0, totalInterest: 0, payoffOrder: [] };
    
    // Sort by interest rate (highest first) - Avalanche method
    const sortedDebts = [...debts].sort((a, b) => b.rate - a.rate);
    const totalDebt = sortedDebts.reduce((sum, d) => sum + d.balance, 0);
    let totalInterestPaid = 0;
    let months = 0;
    const payoffOrder = [];
    
    const activeDebts = sortedDebts.map(d => ({ ...d, remaining: d.balance }));
    
    while (activeDebts.some(d => d.remaining > 0.01) && months < 600) {
      months++;
      const totalMinPayments = activeDebts.filter(d => d.remaining > 0).reduce((sum, d) => sum + d.minPayment, 0);
      let extraPayment = monthlyBudget - totalMinPayments;
      
      for (const debt of activeDebts) {
        if (debt.remaining <= 0.01) continue;
        
        const interest = debt.remaining * (debt.rate / 100 / 12);
        totalInterestPaid += interest;
        
        let payment = debt.minPayment;
        if (debt === activeDebts.find(d => d.remaining > 0.01)) {
          payment += Math.max(0, extraPayment);
        }
        
        debt.remaining = Math.max(0, debt.remaining + interest - payment);
        
        if (debt.remaining <= 0.01 && !payoffOrder.find(p => p.name === debt.name)) {
          payoffOrder.push({ name: debt.name, month: months });
        }
      }
    }
    
    return {
      totalMonths: months,
      totalYears: months / 12,
      totalInterest: totalInterestPaid,
      totalPaid: totalDebt + totalInterestPaid,
      payoffOrder
    };
  }, [debts, monthlyBudget]);

  return (
    <div className="calc-card" data-testid="debt-avalanche-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Debt Avalanche Calculator</h2>
        <p className="calc-subtitle">Pay off highest interest rates first to save money</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          {debts.map((debt, index) => (
            <div key={index} className="debt-item">
              <div className="debt-item-header">
                <input
                  type="text"
                  className="debt-item-name"
                  value={debt.name}
                  onChange={(e) => updateDebt(index, 'name', e.target.value)}
                  style={{ border: 'none', background: 'transparent', fontWeight: 600 }}
                />
                <button className="remove-debt-btn" onClick={() => removeDebt(index)}>✕</button>
              </div>
              <div className="debt-inputs">
                <div className="input-group">
                  <label className="input-label">Balance</label>
                  <input type="number" className="input-field" value={debt.balance} onChange={(e) => updateDebt(index, 'balance', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Rate %</label>
                  <input type="number" className="input-field" value={debt.rate} onChange={(e) => updateDebt(index, 'rate', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Min Pay</label>
                  <input type="number" className="input-field" value={debt.minPayment} onChange={(e) => updateDebt(index, 'minPayment', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
          <button className="add-debt-btn" onClick={addDebt}>+ Add Debt</button>
          <CurrencyInput label="Monthly Budget for Debt" value={monthlyBudget} onChange={setMonthlyBudget} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Debt-Free In" value={`${results.totalMonths} months (${results.totalYears?.toFixed(1)} yrs)`} highlight />
          <ResultItem label="Total Interest Paid" value={formatCurrency(results.totalInterest, symbol)} />
          <ResultItem label="Total Paid" value={formatCurrency(results.totalPaid, symbol)} />
          
          {results.payoffOrder.length > 0 && (
            <div className="payoff-timeline">
              <div className="result-label" style={{ marginBottom: '0.5rem' }}>Payoff Order</div>
              {results.payoffOrder.map((item, index) => (
                <div key={index} className="payoff-item">
                  <div className="payoff-number">{index + 1}</div>
                  <div className="payoff-name">{item.name}</div>
                  <div className="payoff-month">Month {item.month}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InflationCalculator = ({ symbol }) => {
  const [currentAmount, setCurrentAmount] = useState(1000);
  const [inflationRate, setInflationRate] = useState(3);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const futureCost = currentAmount * Math.pow(1 + inflationRate / 100, years);
    const purchasingPower = currentAmount / Math.pow(1 + inflationRate / 100, years);
    const purchasingPowerLoss = currentAmount - purchasingPower;
    
    return { futureCost, purchasingPower, purchasingPowerLoss };
  }, [currentAmount, inflationRate, years]);

  return (
    <div className="calc-card" data-testid="inflation-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Inflation Impact Calculator</h2>
        <p className="calc-subtitle">See how inflation erodes your purchasing power</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Current Amount" value={currentAmount} onChange={setCurrentAmount} symbol={symbol} />
          <PercentInput label="Inflation Rate" value={inflationRate} onChange={setInflationRate} />
          <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
        </div>
        <div className="calc-results">
          <ResultItem label="Future Cost (Same Item)" value={formatCurrency(results.futureCost, symbol)} highlight />
          <ResultItem label="Future Purchasing Power" value={formatCurrency(results.purchasingPower, symbol)} negative />
          <ResultItem label="Purchasing Power Lost" value={formatCurrency(results.purchasingPowerLoss, symbol)} negative />
          <ResultItem label="Inflation Multiple" value={`${(results.futureCost / currentAmount).toFixed(2)}x`} />
        </div>
      </div>
    </div>
  );
};

const NetWorthCalculator = ({ symbol }) => {
  const [assets, setAssets] = useState([
    { name: 'Savings Account', value: 15000, category: 'Cash' },
    { name: 'Investments', value: 50000, category: 'Investments' },
    { name: 'Home Equity', value: 100000, category: 'Property' }
  ]);
  const [liabilities, setLiabilities] = useState([
    { name: 'Mortgage', value: 180000, category: 'Property' },
    { name: 'Car Loan', value: 12000, category: 'Auto' }
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
    
    return { totalAssets, totalLiabilities, netWorth };
  }, [assets, liabilities]);

  return (
    <div className="calc-card" data-testid="net-worth-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Net Worth Calculator</h2>
        <p className="calc-subtitle">Track your financial health</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <div style={{ marginBottom: '1rem' }}>
            <div className="result-label" style={{ marginBottom: '0.5rem' }}>Assets</div>
            {assets.map((asset, index) => (
              <div key={index} className="asset-item">
                <div className="input-group">
                  <input type="text" className="input-field" value={asset.name} onChange={(e) => updateAsset(index, 'name', e.target.value)} placeholder="Name" />
                </div>
                <div className="input-group">
                  <input type="number" className="input-field" value={asset.value} onChange={(e) => updateAsset(index, 'value', e.target.value)} placeholder="Value" />
                </div>
                <div className="input-group">
                  <select className="input-field" value={asset.category} onChange={(e) => updateAsset(index, 'category', e.target.value)}>
                    <option>Cash</option>
                    <option>Investments</option>
                    <option>Property</option>
                    <option>Auto</option>
                    <option>Other</option>
                  </select>
                </div>
                <button className="remove-asset-btn" onClick={() => removeAsset(index)}>✕</button>
              </div>
            ))}
            <button className="add-debt-btn" onClick={addAsset}>+ Add Asset</button>
          </div>
          
          <div>
            <div className="result-label" style={{ marginBottom: '0.5rem' }}>Liabilities</div>
            {liabilities.map((liability, index) => (
              <div key={index} className="asset-item">
                <div className="input-group">
                  <input type="text" className="input-field" value={liability.name} onChange={(e) => updateLiability(index, 'name', e.target.value)} placeholder="Name" />
                </div>
                <div className="input-group">
                  <input type="number" className="input-field" value={liability.value} onChange={(e) => updateLiability(index, 'value', e.target.value)} placeholder="Value" />
                </div>
                <div className="input-group">
                  <select className="input-field" value={liability.category} onChange={(e) => updateLiability(index, 'category', e.target.value)}>
                    <option>Property</option>
                    <option>Auto</option>
                    <option>Credit</option>
                    <option>Student</option>
                    <option>Other</option>
                  </select>
                </div>
                <button className="remove-asset-btn" onClick={() => removeLiability(index)}>✕</button>
              </div>
            ))}
            <button className="add-debt-btn" onClick={addLiability}>+ Add Liability</button>
          </div>
        </div>
        <div className="calc-results">
          <ResultItem 
            label="Net Worth" 
            value={formatCurrency(results.netWorth, symbol)} 
            highlight 
            positive={results.netWorth >= 0}
            negative={results.netWorth < 0}
          />
          <ResultItem label="Total Assets" value={formatCurrency(results.totalAssets, symbol)} positive />
          <ResultItem label="Total Liabilities" value={formatCurrency(results.totalLiabilities, symbol)} negative />
          <ResultItem label="Debt-to-Asset Ratio" value={`${results.totalAssets > 0 ? ((results.totalLiabilities / results.totalAssets) * 100).toFixed(1) : 0}%`} />
        </div>
      </div>
    </div>
  );
};

const LifeInsuranceCalculator = ({ symbol }) => {
  const [annualIncome, setAnnualIncome] = useState(60000);
  const [yearsOfSupport, setYearsOfSupport] = useState(20);
  const [totalLiabilities, setTotalLiabilities] = useState(200000);
  const [existingSavings, setExistingSavings] = useState(50000);
  const [futureExpenses, setFutureExpenses] = useState(100000);

  const results = useMemo(() => {
    const incomeReplacement = annualIncome * yearsOfSupport;
    const totalNeeds = incomeReplacement + totalLiabilities + futureExpenses;
    const coverageNeeded = totalNeeds - existingSavings;
    
    return { incomeReplacement, totalNeeds, coverageNeeded: Math.max(0, coverageNeeded) };
  }, [annualIncome, yearsOfSupport, totalLiabilities, existingSavings, futureExpenses]);

  return (
    <div className="calc-card" data-testid="life-insurance-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Life Insurance Coverage Calculator</h2>
        <p className="calc-subtitle">Determine how much coverage your family needs</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Annual Income" value={annualIncome} onChange={setAnnualIncome} symbol={symbol} />
          <NumberInput label="Years of Income Support" value={yearsOfSupport} onChange={setYearsOfSupport} suffix="years" />
          <CurrencyInput label="Total Liabilities (Debts)" value={totalLiabilities} onChange={setTotalLiabilities} symbol={symbol} />
          <CurrencyInput label="Future Expenses (Education, etc.)" value={futureExpenses} onChange={setFutureExpenses} symbol={symbol} />
          <CurrencyInput label="Existing Savings/Assets" value={existingSavings} onChange={setExistingSavings} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Recommended Coverage" value={formatCurrency(results.coverageNeeded, symbol)} highlight />
          <ResultItem label="Income Replacement" value={formatCurrency(results.incomeReplacement, symbol)} />
          <ResultItem label="Total Family Needs" value={formatCurrency(results.totalNeeds, symbol)} />
          <ResultItem label="Already Covered" value={formatCurrency(existingSavings, symbol)} />
        </div>
      </div>
    </div>
  );
};

const ExpenseRatioCalculator = ({ symbol }) => {
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [grossReturn, setGrossReturn] = useState(10);
  const [expenseRatio, setExpenseRatio] = useState(1);
  const [years, setYears] = useState(20);

  const results = useMemo(() => {
    const netReturn = grossReturn - expenseRatio;
    const fvGross = investmentAmount * Math.pow(1 + grossReturn / 100, years);
    const fvNet = investmentAmount * Math.pow(1 + netReturn / 100, years);
    const wealthLost = fvGross - fvNet;
    
    return { fvGross, fvNet, wealthLost, percentLost: (wealthLost / fvGross) * 100 };
  }, [investmentAmount, grossReturn, expenseRatio, years]);

  return (
    <div className="calc-card" data-testid="expense-ratio-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Expense Ratio Impact Calculator</h2>
        <p className="calc-subtitle">See how fund fees impact your long-term returns</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Investment Amount" value={investmentAmount} onChange={setInvestmentAmount} symbol={symbol} />
          <PercentInput label="Gross Return (Before Fees)" value={grossReturn} onChange={setGrossReturn} />
          <PercentInput label="Expense Ratio" value={expenseRatio} onChange={setExpenseRatio} />
          <NumberInput label="Investment Period" value={years} onChange={setYears} suffix="years" />
        </div>
        <div className="calc-results">
          <ResultItem label="Value Before Fees" value={formatCurrency(results.fvGross, symbol)} />
          <ResultItem label="Value After Fees" value={formatCurrency(results.fvNet, symbol)} highlight />
          <ResultItem label="Wealth Lost to Fees" value={formatCurrency(results.wealthLost, symbol)} negative />
          <ResultItem label="Percentage Lost" value={`${results.percentLost.toFixed(1)}%`} negative />
        </div>
      </div>
    </div>
  );
};

const OpportunityCostCalculator = ({ symbol }) => {
  const [amount, setAmount] = useState(50000);
  const [optionAReturn, setOptionAReturn] = useState(8);
  const [optionBReturn, setOptionBReturn] = useState(5);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    const fvA = amount * Math.pow(1 + optionAReturn / 100, years);
    const fvB = amount * Math.pow(1 + optionBReturn / 100, years);
    const opportunityCost = Math.abs(fvA - fvB);
    const betterOption = fvA > fvB ? 'A' : fvB > fvA ? 'B' : 'Equal';
    
    return { fvA, fvB, opportunityCost, betterOption };
  }, [amount, optionAReturn, optionBReturn, years]);

  return (
    <div className="calc-card" data-testid="opportunity-cost-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Opportunity Cost Calculator</h2>
        <p className="calc-subtitle">Compare two investment options over time</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Investment Amount" value={amount} onChange={setAmount} symbol={symbol} />
          <PercentInput label="Option A Return" value={optionAReturn} onChange={setOptionAReturn} />
          <PercentInput label="Option B Return" value={optionBReturn} onChange={setOptionBReturn} />
          <NumberInput label="Time Period" value={years} onChange={setYears} suffix="years" />
        </div>
        <div className="calc-results">
          <ResultItem label="Option A Future Value" value={formatCurrency(results.fvA, symbol)} positive={results.betterOption === 'A'} />
          <ResultItem label="Option B Future Value" value={formatCurrency(results.fvB, symbol)} positive={results.betterOption === 'B'} />
          <ResultItem label="Opportunity Cost" value={formatCurrency(results.opportunityCost, symbol)} highlight />
          <ResultItem label="Better Option" value={results.betterOption === 'Equal' ? 'Both Equal' : `Option ${results.betterOption}`} />
        </div>
      </div>
    </div>
  );
};

const PositionSizeCalculator = ({ symbol }) => {
  const [capital, setCapital] = useState(50000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [stopLossPercent, setStopLossPercent] = useState(5);

  const results = useMemo(() => {
    const riskAmount = capital * (riskPercent / 100);
    const positionSize = stopLossPercent > 0 ? riskAmount / (stopLossPercent / 100) : 0;
    const percentOfCapital = capital > 0 ? (positionSize / capital) * 100 : 0;
    
    return { positionSize, riskAmount, percentOfCapital };
  }, [capital, riskPercent, stopLossPercent]);

  return (
    <div className="calc-card" data-testid="position-size-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Position Size Calculator</h2>
        <p className="calc-subtitle">Calculate optimal position size based on risk</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Total Capital" value={capital} onChange={setCapital} symbol={symbol} />
          <PercentInput label="Risk Per Trade" value={riskPercent} onChange={setRiskPercent} />
          <PercentInput label="Stop Loss Distance" value={stopLossPercent} onChange={setStopLossPercent} />
        </div>
        <div className="calc-results">
          <ResultItem label="Position Size" value={formatCurrency(results.positionSize, symbol)} highlight />
          <ResultItem label="Risk Amount" value={formatCurrency(results.riskAmount, symbol)} />
          <ResultItem label="% of Capital" value={`${results.percentOfCapital.toFixed(1)}%`} />
          <ResultItem label="Max Loss" value={formatCurrency(results.riskAmount, symbol)} negative />
        </div>
      </div>
    </div>
  );
};

const RiskRewardCalculator = ({ symbol }) => {
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLoss, setStopLoss] = useState(95);
  const [targetPrice, setTargetPrice] = useState(115);
  const [positionSize, setPositionSize] = useState(100);

  const results = useMemo(() => {
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(targetPrice - entryPrice);
    const rrRatio = risk > 0 ? reward / risk : 0;
    const potentialLoss = risk * positionSize;
    const potentialProfit = reward * positionSize;
    
    return { rrRatio, risk, reward, potentialLoss, potentialProfit };
  }, [entryPrice, stopLoss, targetPrice, positionSize]);

  return (
    <div className="calc-card" data-testid="risk-reward-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Risk/Reward Calculator</h2>
        <p className="calc-subtitle">Calculate your trade's risk-reward ratio</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Entry Price" value={entryPrice} onChange={setEntryPrice} symbol={symbol} />
          <CurrencyInput label="Stop Loss Price" value={stopLoss} onChange={setStopLoss} symbol={symbol} />
          <CurrencyInput label="Target Price" value={targetPrice} onChange={setTargetPrice} symbol={symbol} />
          <NumberInput label="Position Size (Units)" value={positionSize} onChange={setPositionSize} suffix="units" />
        </div>
        <div className="calc-results">
          <ResultItem label="Risk:Reward Ratio" value={`1:${results.rrRatio.toFixed(2)}`} highlight />
          <ResultItem label="Risk Per Unit" value={formatCurrency(results.risk, symbol)} />
          <ResultItem label="Reward Per Unit" value={formatCurrency(results.reward, symbol)} />
          <ResultItem label="Potential Loss" value={formatCurrency(results.potentialLoss, symbol)} negative />
          <ResultItem label="Potential Profit" value={formatCurrency(results.potentialProfit, symbol)} positive />
        </div>
      </div>
    </div>
  );
};

const BreakevenCalculator = ({ symbol }) => {
  const [fixedCosts, setFixedCosts] = useState(10000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(20);
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState(50);

  const results = useMemo(() => {
    const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
    const breakevenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakevenRevenue = breakevenUnits * sellingPricePerUnit;
    const marginPercentage = sellingPricePerUnit > 0 ? (contributionMargin / sellingPricePerUnit) * 100 : 0;
    
    return { breakevenUnits, breakevenRevenue, contributionMargin, marginPercentage };
  }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);

  return (
    <div className="calc-card" data-testid="breakeven-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Break-even Calculator</h2>
        <p className="calc-subtitle">Find your break-even point for business or trades</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Fixed Costs" value={fixedCosts} onChange={setFixedCosts} symbol={symbol} />
          <CurrencyInput label="Variable Cost Per Unit" value={variableCostPerUnit} onChange={setVariableCostPerUnit} symbol={symbol} />
          <CurrencyInput label="Selling Price Per Unit" value={sellingPricePerUnit} onChange={setSellingPricePerUnit} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Break-even Units" value={formatNumber(results.breakevenUnits)} highlight />
          <ResultItem label="Break-even Revenue" value={formatCurrency(results.breakevenRevenue, symbol)} />
          <ResultItem label="Contribution Margin" value={formatCurrency(results.contributionMargin, symbol)} />
          <ResultItem label="Margin Percentage" value={`${results.marginPercentage.toFixed(1)}%`} />
        </div>
      </div>
    </div>
  );
};

const AmortizationCalculator = ({ symbol }) => {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [rate, setRate] = useState(6);
  const [termMonths, setTermMonths] = useState(360);
  const [extraPayment, setExtraPayment] = useState(200);

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    let basePayment;
    if (monthlyRate === 0) {
      basePayment = loanAmount / termMonths;
    } else {
      basePayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
    
    // Standard calculation
    let totalInterest = 0;
    let balance = loanAmount;
    for (let i = 0; i < termMonths && balance > 0; i++) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance -= (basePayment - interest);
    }
    
    // With extra payment
    let totalInterestEarly = 0;
    let balanceEarly = loanAmount;
    let monthsEarly = 0;
    while (balanceEarly > 0.01 && monthsEarly < termMonths) {
      const interest = balanceEarly * monthlyRate;
      totalInterestEarly += interest;
      const payment = basePayment + extraPayment;
      balanceEarly = Math.max(0, balanceEarly + interest - payment);
      monthsEarly++;
    }
    
    return {
      monthlyPayment: basePayment,
      totalInterest,
      totalPaid: loanAmount + totalInterest,
      monthsSaved: termMonths - monthsEarly,
      interestSaved: totalInterest - totalInterestEarly,
      earlyPayoffMonths: monthsEarly
    };
  }, [loanAmount, rate, termMonths, extraPayment]);

  return (
    <div className="calc-card" data-testid="amortization-calculator">
      <div className="calc-header">
        <h2 className="calc-title">Amortization Schedule Calculator</h2>
        <p className="calc-subtitle">See your loan payoff schedule and early payoff savings</p>
      </div>
      <div className="calc-body">
        <div className="calc-inputs">
          <CurrencyInput label="Loan Amount" value={loanAmount} onChange={setLoanAmount} symbol={symbol} />
          <PercentInput label="Interest Rate" value={rate} onChange={setRate} />
          <NumberInput label="Loan Term" value={termMonths} onChange={setTermMonths} suffix="months" />
          <CurrencyInput label="Extra Monthly Payment" value={extraPayment} onChange={setExtraPayment} symbol={symbol} />
        </div>
        <div className="calc-results">
          <ResultItem label="Monthly Payment" value={formatCurrency(results.monthlyPayment, symbol)} highlight />
          <ResultItem label="Total Interest" value={formatCurrency(results.totalInterest, symbol)} />
          <ResultItem label="Total Cost" value={formatCurrency(results.totalPaid, symbol)} />
          
          {extraPayment > 0 && (
            <>
              <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0', paddingTop: '1rem' }}>
                <div className="result-label" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>With Extra Payment</div>
              </div>
              <ResultItem label="Months Saved" value={`${results.monthsSaved} months`} positive />
              <ResultItem label="Interest Saved" value={formatCurrency(results.interestSaved, symbol)} positive />
              <ResultItem label="Payoff In" value={`${results.earlyPayoffMonths} months (${(results.earlyPayoffMonths / 12).toFixed(1)} yrs)`} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Calculator Map
const CALCULATOR_COMPONENTS = {
  'mortgage': MortgageCalculator,
  'emi': EMICalculator,
  'credit-card': CreditCardCalculator,
  'amortization': AmortizationCalculator,
  'compound-interest': CompoundInterestCalculator,
  'investment-growth': InvestmentGrowthCalculator,
  'expense-ratio': ExpenseRatioCalculator,
  'roi-cagr': ROICAGRCalculator,
  'retirement': RetirementCalculator,
  'fire': FIRECalculator,
  'savings-goal': SavingsGoalCalculator,
  'debt-snowball': DebtSnowballCalculator,
  'debt-avalanche': DebtAvalancheCalculator,
  'inflation': InflationCalculator,
  'net-worth': NetWorthCalculator,
  'life-insurance': LifeInsuranceCalculator,
  'opportunity-cost': OpportunityCostCalculator,
  'position-size': PositionSizeCalculator,
  'risk-reward': RiskRewardCalculator,
  'breakeven': BreakevenCalculator
};

// Main App
function App() {
  const [activeCalculator, setActiveCalculator] = useState('mortgage');
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');

  const filteredCurrencies = useMemo(() => {
    if (!currencySearch) return CURRENCIES;
    const search = currencySearch.toLowerCase();
    return CURRENCIES.filter(c => 
      c.name.toLowerCase().includes(search) || 
      c.country.toLowerCase().includes(search) || 
      c.code.toLowerCase().includes(search)
    );
  }, [currencySearch]);

  const CalculatorComponent = CALCULATOR_COMPONENTS[activeCalculator];

  return (
    <div className="app" data-testid="finance-calculator-app">
      <header className="header">
        <div className="logo" data-testid="app-logo">Fin<span>Calc</span></div>
        
        <div className="currency-selector">
          <button 
            className="currency-btn" 
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            data-testid="currency-selector-btn"
          >
            <span>{currency.symbol}</span>
            <span>{currency.code}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>
          
          {showCurrencyDropdown && (
            <div className="currency-dropdown" data-testid="currency-dropdown">
              <div className="currency-search">
                <input
                  type="text"
                  placeholder="Search country or currency..."
                  value={currencySearch}
                  onChange={(e) => setCurrencySearch(e.target.value)}
                  autoFocus
                  data-testid="currency-search-input"
                />
              </div>
              <div className="currency-list">
                {filteredCurrencies.map((c) => (
                  <div
                    key={c.code}
                    className={`currency-item ${currency.code === c.code ? 'active' : ''}`}
                    onClick={() => {
                      setCurrency(c);
                      setShowCurrencyDropdown(false);
                      setCurrencySearch('');
                    }}
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
      </header>

      <div className="main-container">
        <nav className="sidebar" data-testid="sidebar-nav">
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
          {CalculatorComponent && <CalculatorComponent symbol={currency.symbol} />}
        </main>
      </div>
    </div>
  );
}

export default App;
