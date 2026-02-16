from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math

app = FastAPI(title="Finance Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Currency data
CURRENCIES = [
    {"code": "USD", "symbol": "$", "name": "United States Dollar", "country": "United States"},
    {"code": "EUR", "symbol": "€", "name": "Euro", "country": "European Union"},
    {"code": "GBP", "symbol": "£", "name": "British Pound", "country": "United Kingdom"},
    {"code": "INR", "symbol": "₹", "name": "Indian Rupee", "country": "India"},
    {"code": "JPY", "symbol": "¥", "name": "Japanese Yen", "country": "Japan"},
    {"code": "CNY", "symbol": "¥", "name": "Chinese Yuan", "country": "China"},
    {"code": "AUD", "symbol": "A$", "name": "Australian Dollar", "country": "Australia"},
    {"code": "CAD", "symbol": "C$", "name": "Canadian Dollar", "country": "Canada"},
    {"code": "CHF", "symbol": "Fr", "name": "Swiss Franc", "country": "Switzerland"},
    {"code": "HKD", "symbol": "HK$", "name": "Hong Kong Dollar", "country": "Hong Kong"},
    {"code": "SGD", "symbol": "S$", "name": "Singapore Dollar", "country": "Singapore"},
    {"code": "SEK", "symbol": "kr", "name": "Swedish Krona", "country": "Sweden"},
    {"code": "KRW", "symbol": "₩", "name": "South Korean Won", "country": "South Korea"},
    {"code": "NOK", "symbol": "kr", "name": "Norwegian Krone", "country": "Norway"},
    {"code": "NZD", "symbol": "NZ$", "name": "New Zealand Dollar", "country": "New Zealand"},
    {"code": "MXN", "symbol": "$", "name": "Mexican Peso", "country": "Mexico"},
    {"code": "BRL", "symbol": "R$", "name": "Brazilian Real", "country": "Brazil"},
    {"code": "ZAR", "symbol": "R", "name": "South African Rand", "country": "South Africa"},
    {"code": "RUB", "symbol": "₽", "name": "Russian Ruble", "country": "Russia"},
    {"code": "AED", "symbol": "د.إ", "name": "UAE Dirham", "country": "United Arab Emirates"},
    {"code": "SAR", "symbol": "﷼", "name": "Saudi Riyal", "country": "Saudi Arabia"},
    {"code": "THB", "symbol": "฿", "name": "Thai Baht", "country": "Thailand"},
    {"code": "MYR", "symbol": "RM", "name": "Malaysian Ringgit", "country": "Malaysia"},
    {"code": "IDR", "symbol": "Rp", "name": "Indonesian Rupiah", "country": "Indonesia"},
    {"code": "PHP", "symbol": "₱", "name": "Philippine Peso", "country": "Philippines"},
    {"code": "PLN", "symbol": "zł", "name": "Polish Zloty", "country": "Poland"},
    {"code": "TRY", "symbol": "₺", "name": "Turkish Lira", "country": "Turkey"},
    {"code": "VND", "symbol": "₫", "name": "Vietnamese Dong", "country": "Vietnam"},
    {"code": "PKR", "symbol": "₨", "name": "Pakistani Rupee", "country": "Pakistan"},
    {"code": "BDT", "symbol": "৳", "name": "Bangladeshi Taka", "country": "Bangladesh"},
]

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Finance Calculator API"}

@app.get("/api/currencies")
def get_currencies(search: Optional[str] = None):
    if search:
        search_lower = search.lower()
        filtered = [c for c in CURRENCIES if search_lower in c["name"].lower() or search_lower in c["country"].lower() or search_lower in c["code"].lower()]
        return filtered
    return CURRENCIES


# Mortgage Calculator
class MortgageInput(BaseModel):
    home_price: float
    down_payment: float
    interest_rate: float
    term_years: int
    annual_taxes: Optional[float] = 0
    annual_insurance: Optional[float] = 0

@app.post("/api/calculate/mortgage")
def calculate_mortgage(data: MortgageInput):
    principal = data.home_price - data.down_payment
    monthly_rate = data.interest_rate / 100 / 12
    num_payments = data.term_years * 12
    
    if monthly_rate == 0:
        monthly_principal_interest = principal / num_payments
    else:
        monthly_principal_interest = principal * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)
    
    monthly_taxes = data.annual_taxes / 12
    monthly_insurance = data.annual_insurance / 12
    total_monthly = monthly_principal_interest + monthly_taxes + monthly_insurance
    
    total_paid = monthly_principal_interest * num_payments
    total_interest = total_paid - principal
    
    # Generate amortization schedule
    schedule = []
    balance = principal
    for month in range(1, num_payments + 1):
        interest_payment = balance * monthly_rate
        principal_payment = monthly_principal_interest - interest_payment
        balance -= principal_payment
        if month <= 12 or month > num_payments - 12 or month % 12 == 0:
            schedule.append({
                "month": month,
                "payment": round(monthly_principal_interest, 2),
                "principal": round(principal_payment, 2),
                "interest": round(interest_payment, 2),
                "balance": round(max(0, balance), 2)
            })
    
    return {
        "monthly_payment": round(total_monthly, 2),
        "monthly_principal_interest": round(monthly_principal_interest, 2),
        "monthly_taxes": round(monthly_taxes, 2),
        "monthly_insurance": round(monthly_insurance, 2),
        "total_interest": round(total_interest, 2),
        "total_paid": round(total_paid + data.annual_taxes * data.term_years + data.annual_insurance * data.term_years, 2),
        "loan_amount": round(principal, 2),
        "schedule": schedule
    }


# EMI Calculator
class EMIInput(BaseModel):
    loan_amount: float
    interest_rate: float
    term_months: int

@app.post("/api/calculate/emi")
def calculate_emi(data: EMIInput):
    monthly_rate = data.interest_rate / 100 / 12
    
    if monthly_rate == 0:
        emi = data.loan_amount / data.term_months
    else:
        emi = data.loan_amount * monthly_rate * (1 + monthly_rate)**data.term_months / ((1 + monthly_rate)**data.term_months - 1)
    
    total_paid = emi * data.term_months
    total_interest = total_paid - data.loan_amount
    
    return {
        "emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_paid": round(total_paid, 2),
        "principal": round(data.loan_amount, 2)
    }


# Credit Card Payoff
class CreditCardInput(BaseModel):
    balance: float
    interest_rate: float
    minimum_payment_percent: float
    fixed_payment: Optional[float] = None

@app.post("/api/calculate/credit-card")
def calculate_credit_card(data: CreditCardInput):
    monthly_rate = data.interest_rate / 100 / 12
    
    # Minimum payment scenario
    balance_min = data.balance
    months_min = 0
    total_paid_min = 0
    
    while balance_min > 0.01 and months_min < 600:
        min_payment = max(balance_min * data.minimum_payment_percent / 100, 25)
        interest = balance_min * monthly_rate
        principal = min(min_payment - interest, balance_min)
        if principal <= 0:
            break
        balance_min -= principal
        total_paid_min += min_payment
        months_min += 1
    
    # Fixed payment scenario
    if data.fixed_payment and data.fixed_payment > data.balance * monthly_rate:
        balance_fixed = data.balance
        months_fixed = 0
        total_paid_fixed = 0
        
        while balance_fixed > 0.01 and months_fixed < 600:
            interest = balance_fixed * monthly_rate
            principal = min(data.fixed_payment - interest, balance_fixed)
            balance_fixed -= principal
            total_paid_fixed += data.fixed_payment if balance_fixed > 0 else principal + interest
            months_fixed += 1
        
        time_saved = months_min - months_fixed
        interest_saved = total_paid_min - total_paid_fixed
    else:
        months_fixed = 0
        total_paid_fixed = 0
        time_saved = 0
        interest_saved = 0
    
    return {
        "minimum_payment": {
            "months": months_min,
            "years": round(months_min / 12, 1),
            "total_paid": round(total_paid_min, 2),
            "total_interest": round(total_paid_min - data.balance, 2)
        },
        "fixed_payment": {
            "months": months_fixed,
            "years": round(months_fixed / 12, 1),
            "total_paid": round(total_paid_fixed, 2),
            "total_interest": round(total_paid_fixed - data.balance, 2)
        } if data.fixed_payment else None,
        "time_saved_months": time_saved,
        "interest_saved": round(interest_saved, 2)
    }


# Compound Interest
class CompoundInterestInput(BaseModel):
    principal: float
    interest_rate: float
    years: int
    compound_frequency: int  # times per year
    monthly_contribution: Optional[float] = 0

@app.post("/api/calculate/compound-interest")
def calculate_compound_interest(data: CompoundInterestInput):
    r = data.interest_rate / 100
    n = data.compound_frequency
    t = data.years
    
    # Future value of principal
    fv_principal = data.principal * (1 + r/n)**(n*t)
    
    # Future value of contributions (if monthly)
    total_contributions = data.monthly_contribution * 12 * t
    if data.monthly_contribution > 0:
        monthly_rate = r / 12
        fv_contributions = data.monthly_contribution * (((1 + monthly_rate)**(12*t) - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        fv_contributions = 0
    
    total_value = fv_principal + fv_contributions
    total_interest = total_value - data.principal - total_contributions
    
    # Generate yearly data for chart
    yearly_data = []
    for year in range(t + 1):
        if year == 0:
            yearly_data.append({"year": year, "principal": data.principal, "interest": 0, "contributions": 0, "total": data.principal})
        else:
            fv_p = data.principal * (1 + r/n)**(n*year)
            contrib = data.monthly_contribution * 12 * year
            if data.monthly_contribution > 0:
                fv_c = data.monthly_contribution * (((1 + monthly_rate)**(12*year) - 1) / monthly_rate) * (1 + monthly_rate)
            else:
                fv_c = 0
            total = fv_p + fv_c
            yearly_data.append({
                "year": year,
                "principal": round(data.principal, 2),
                "contributions": round(contrib, 2),
                "interest": round(total - data.principal - contrib, 2),
                "total": round(total, 2)
            })
    
    return {
        "future_value": round(total_value, 2),
        "total_interest": round(total_interest, 2),
        "total_contributions": round(total_contributions, 2),
        "principal": round(data.principal, 2),
        "yearly_data": yearly_data
    }


# Investment Growth
class InvestmentGrowthInput(BaseModel):
    initial_investment: float
    monthly_contribution: float
    annual_return: float
    years: int

@app.post("/api/calculate/investment-growth")
def calculate_investment_growth(data: InvestmentGrowthInput):
    monthly_rate = data.annual_return / 100 / 12
    months = data.years * 12
    
    # Future value
    fv_lumpsum = data.initial_investment * (1 + monthly_rate)**months
    if monthly_rate > 0:
        fv_contributions = data.monthly_contribution * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        fv_contributions = data.monthly_contribution * months
    
    total_value = fv_lumpsum + fv_contributions
    total_invested = data.initial_investment + (data.monthly_contribution * months)
    total_gains = total_value - total_invested
    
    yearly_data = []
    for year in range(data.years + 1):
        m = year * 12
        if year == 0:
            yearly_data.append({"year": year, "invested": data.initial_investment, "value": data.initial_investment})
        else:
            fv_l = data.initial_investment * (1 + monthly_rate)**m
            if monthly_rate > 0:
                fv_c = data.monthly_contribution * (((1 + monthly_rate)**m - 1) / monthly_rate) * (1 + monthly_rate)
            else:
                fv_c = data.monthly_contribution * m
            invested = data.initial_investment + (data.monthly_contribution * m)
            yearly_data.append({"year": year, "invested": round(invested, 2), "value": round(fv_l + fv_c, 2)})
    
    return {
        "future_value": round(total_value, 2),
        "total_invested": round(total_invested, 2),
        "total_gains": round(total_gains, 2),
        "yearly_data": yearly_data
    }


# Retirement Calculator
class RetirementInput(BaseModel):
    current_age: int
    retirement_age: int
    current_savings: float
    monthly_contribution: float
    expected_return: float
    inflation_rate: float
    monthly_retirement_expense: float

@app.post("/api/calculate/retirement")
def calculate_retirement(data: RetirementInput):
    years_to_retirement = data.retirement_age - data.current_age
    monthly_rate = data.expected_return / 100 / 12
    months = years_to_retirement * 12
    
    # Future value at retirement
    fv_savings = data.current_savings * (1 + monthly_rate)**months
    if monthly_rate > 0:
        fv_contributions = data.monthly_contribution * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        fv_contributions = data.monthly_contribution * months
    
    retirement_corpus = fv_savings + fv_contributions
    
    # Inflation adjusted expense at retirement
    inflation_adjusted_expense = data.monthly_retirement_expense * ((1 + data.inflation_rate/100)**years_to_retirement)
    annual_expense_at_retirement = inflation_adjusted_expense * 12
    
    # Required corpus (assuming 25 years post retirement with 4% withdrawal rate)
    required_corpus = annual_expense_at_retirement * 25
    
    surplus_deficit = retirement_corpus - required_corpus
    
    return {
        "retirement_corpus": round(retirement_corpus, 2),
        "required_corpus": round(required_corpus, 2),
        "surplus_deficit": round(surplus_deficit, 2),
        "monthly_expense_at_retirement": round(inflation_adjusted_expense, 2),
        "years_to_retirement": years_to_retirement,
        "total_contributions": round(data.monthly_contribution * months, 2)
    }


# FIRE Calculator
class FIREInput(BaseModel):
    annual_expenses: float
    current_net_worth: float
    annual_savings: float
    expected_return: float
    withdrawal_rate: float

@app.post("/api/calculate/fire")
def calculate_fire(data: FIREInput):
    fire_number = data.annual_expenses / (data.withdrawal_rate / 100)
    
    if data.current_net_worth >= fire_number:
        years_to_fire = 0
    else:
        annual_rate = data.expected_return / 100
        target = fire_number
        current = data.current_net_worth
        years = 0
        
        while current < target and years < 100:
            current = current * (1 + annual_rate) + data.annual_savings
            years += 1
        
        years_to_fire = years
    
    savings_rate = (data.annual_savings / (data.annual_expenses + data.annual_savings)) * 100 if (data.annual_expenses + data.annual_savings) > 0 else 0
    
    yearly_projection = []
    current = data.current_net_worth
    for year in range(min(years_to_fire + 5, 50)):
        yearly_projection.append({"year": year, "net_worth": round(current, 2), "fire_target": round(fire_number, 2)})
        current = current * (1 + data.expected_return / 100) + data.annual_savings
    
    return {
        "fire_number": round(fire_number, 2),
        "years_to_fire": years_to_fire,
        "savings_rate": round(savings_rate, 1),
        "current_progress": round((data.current_net_worth / fire_number) * 100, 1),
        "yearly_projection": yearly_projection
    }


# ROI & CAGR
class ROICAGRInput(BaseModel):
    initial_value: float
    final_value: float
    years: float

@app.post("/api/calculate/roi-cagr")
def calculate_roi_cagr(data: ROICAGRInput):
    roi = ((data.final_value - data.initial_value) / data.initial_value) * 100
    
    if data.years > 0 and data.initial_value > 0:
        cagr = ((data.final_value / data.initial_value)**(1/data.years) - 1) * 100
    else:
        cagr = 0
    
    profit_loss = data.final_value - data.initial_value
    
    return {
        "roi": round(roi, 2),
        "cagr": round(cagr, 2),
        "profit_loss": round(profit_loss, 2),
        "initial_value": round(data.initial_value, 2),
        "final_value": round(data.final_value, 2)
    }


# Debt Snowball
class Debt(BaseModel):
    name: str
    balance: float
    interest_rate: float
    minimum_payment: float

class DebtSnowballInput(BaseModel):
    debts: List[Debt]
    monthly_budget: float

@app.post("/api/calculate/debt-snowball")
def calculate_debt_snowball(data: DebtSnowballInput):
    # Sort by balance (smallest first)
    debts = sorted([d.model_dump() for d in data.debts], key=lambda x: x["balance"])
    
    total_debt = sum(d["balance"] for d in debts)
    total_interest_paid = 0
    months = 0
    payoff_order = []
    
    active_debts = [{**d, "remaining": d["balance"]} for d in debts]
    
    while any(d["remaining"] > 0.01 for d in active_debts) and months < 600:
        months += 1
        extra_payment = data.monthly_budget - sum(d["minimum_payment"] for d in active_debts if d["remaining"] > 0)
        
        for debt in active_debts:
            if debt["remaining"] <= 0.01:
                continue
            
            interest = debt["remaining"] * (debt["interest_rate"] / 100 / 12)
            total_interest_paid += interest
            
            payment = debt["minimum_payment"]
            if debt == next((d for d in active_debts if d["remaining"] > 0.01), None):
                payment += max(0, extra_payment)
            
            debt["remaining"] = max(0, debt["remaining"] + interest - payment)
            
            if debt["remaining"] <= 0.01 and debt["name"] not in [p["name"] for p in payoff_order]:
                payoff_order.append({"name": debt["name"], "month": months})
    
    return {
        "total_months": months,
        "total_years": round(months / 12, 1),
        "total_interest_paid": round(total_interest_paid, 2),
        "total_paid": round(total_debt + total_interest_paid, 2),
        "payoff_order": payoff_order
    }


# Debt Avalanche
@app.post("/api/calculate/debt-avalanche")
def calculate_debt_avalanche(data: DebtSnowballInput):
    # Sort by interest rate (highest first)
    debts = sorted([d.model_dump() for d in data.debts], key=lambda x: -x["interest_rate"])
    
    total_debt = sum(d["balance"] for d in debts)
    total_interest_paid = 0
    months = 0
    payoff_order = []
    
    active_debts = [{**d, "remaining": d["balance"]} for d in debts]
    
    while any(d["remaining"] > 0.01 for d in active_debts) and months < 600:
        months += 1
        extra_payment = data.monthly_budget - sum(d["minimum_payment"] for d in active_debts if d["remaining"] > 0)
        
        for debt in active_debts:
            if debt["remaining"] <= 0.01:
                continue
            
            interest = debt["remaining"] * (debt["interest_rate"] / 100 / 12)
            total_interest_paid += interest
            
            payment = debt["minimum_payment"]
            if debt == next((d for d in active_debts if d["remaining"] > 0.01), None):
                payment += max(0, extra_payment)
            
            debt["remaining"] = max(0, debt["remaining"] + interest - payment)
            
            if debt["remaining"] <= 0.01 and debt["name"] not in [p["name"] for p in payoff_order]:
                payoff_order.append({"name": debt["name"], "month": months})
    
    return {
        "total_months": months,
        "total_years": round(months / 12, 1),
        "total_interest_paid": round(total_interest_paid, 2),
        "total_paid": round(total_debt + total_interest_paid, 2),
        "payoff_order": payoff_order
    }


# Inflation Impact
class InflationInput(BaseModel):
    current_amount: float
    inflation_rate: float
    years: int

@app.post("/api/calculate/inflation")
def calculate_inflation(data: InflationInput):
    future_cost = data.current_amount * ((1 + data.inflation_rate / 100)**data.years)
    purchasing_power = data.current_amount / ((1 + data.inflation_rate / 100)**data.years)
    purchasing_power_loss = data.current_amount - purchasing_power
    
    yearly_data = []
    for year in range(data.years + 1):
        cost = data.current_amount * ((1 + data.inflation_rate / 100)**year)
        power = data.current_amount / ((1 + data.inflation_rate / 100)**year)
        yearly_data.append({"year": year, "future_cost": round(cost, 2), "purchasing_power": round(power, 2)})
    
    return {
        "future_cost": round(future_cost, 2),
        "purchasing_power": round(purchasing_power, 2),
        "purchasing_power_loss": round(purchasing_power_loss, 2),
        "yearly_data": yearly_data
    }


# Net Worth
class Asset(BaseModel):
    name: str
    value: float
    category: str

class Liability(BaseModel):
    name: str
    value: float
    category: str

class NetWorthInput(BaseModel):
    assets: List[Asset]
    liabilities: List[Liability]

@app.post("/api/calculate/net-worth")
def calculate_net_worth(data: NetWorthInput):
    total_assets = sum(a.value for a in data.assets)
    total_liabilities = sum(l.value for l in data.liabilities)
    net_worth = total_assets - total_liabilities
    
    # Group by category
    asset_categories = {}
    for a in data.assets:
        if a.category not in asset_categories:
            asset_categories[a.category] = 0
        asset_categories[a.category] += a.value
    
    liability_categories = {}
    for l in data.liabilities:
        if l.category not in liability_categories:
            liability_categories[l.category] = 0
        liability_categories[l.category] += l.value
    
    return {
        "net_worth": round(net_worth, 2),
        "total_assets": round(total_assets, 2),
        "total_liabilities": round(total_liabilities, 2),
        "asset_breakdown": [{"category": k, "value": round(v, 2)} for k, v in asset_categories.items()],
        "liability_breakdown": [{"category": k, "value": round(v, 2)} for k, v in liability_categories.items()]
    }


# Life Insurance Coverage
class LifeInsuranceInput(BaseModel):
    annual_income: float
    years_of_support: int
    total_liabilities: float
    existing_savings: float
    future_expenses: float  # education, wedding etc

@app.post("/api/calculate/life-insurance")
def calculate_life_insurance(data: LifeInsuranceInput):
    income_replacement = data.annual_income * data.years_of_support
    total_needs = income_replacement + data.total_liabilities + data.future_expenses
    coverage_needed = total_needs - data.existing_savings
    
    return {
        "income_replacement": round(income_replacement, 2),
        "total_needs": round(total_needs, 2),
        "coverage_needed": round(max(0, coverage_needed), 2),
        "existing_coverage_gap": round(max(0, coverage_needed), 2)
    }


# Expense Ratio Impact
class ExpenseRatioInput(BaseModel):
    investment_amount: float
    gross_return: float
    expense_ratio: float
    years: int

@app.post("/api/calculate/expense-ratio")
def calculate_expense_ratio(data: ExpenseRatioInput):
    net_return = data.gross_return - data.expense_ratio
    
    fv_gross = data.investment_amount * ((1 + data.gross_return / 100)**data.years)
    fv_net = data.investment_amount * ((1 + net_return / 100)**data.years)
    
    wealth_lost = fv_gross - fv_net
    
    yearly_data = []
    for year in range(data.years + 1):
        gross = data.investment_amount * ((1 + data.gross_return / 100)**year)
        net = data.investment_amount * ((1 + net_return / 100)**year)
        yearly_data.append({"year": year, "gross": round(gross, 2), "net": round(net, 2), "lost": round(gross - net, 2)})
    
    return {
        "future_value_gross": round(fv_gross, 2),
        "future_value_net": round(fv_net, 2),
        "wealth_lost_to_fees": round(wealth_lost, 2),
        "percentage_lost": round((wealth_lost / fv_gross) * 100, 2),
        "yearly_data": yearly_data
    }


# Break-even Calculator
class BreakevenInput(BaseModel):
    fixed_costs: float
    variable_cost_per_unit: float
    selling_price_per_unit: float

@app.post("/api/calculate/breakeven")
def calculate_breakeven(data: BreakevenInput):
    if data.selling_price_per_unit <= data.variable_cost_per_unit:
        return {"error": "Selling price must be greater than variable cost"}
    
    contribution_margin = data.selling_price_per_unit - data.variable_cost_per_unit
    breakeven_units = data.fixed_costs / contribution_margin
    breakeven_revenue = breakeven_units * data.selling_price_per_unit
    
    return {
        "breakeven_units": round(breakeven_units, 2),
        "breakeven_revenue": round(breakeven_revenue, 2),
        "contribution_margin": round(contribution_margin, 2),
        "margin_percentage": round((contribution_margin / data.selling_price_per_unit) * 100, 2)
    }


# Position Size Calculator
class PositionSizeInput(BaseModel):
    capital: float
    risk_percent: float
    stop_loss_percent: float

@app.post("/api/calculate/position-size")
def calculate_position_size(data: PositionSizeInput):
    risk_amount = data.capital * (data.risk_percent / 100)
    position_size = risk_amount / (data.stop_loss_percent / 100)
    
    return {
        "position_size": round(position_size, 2),
        "risk_amount": round(risk_amount, 2),
        "max_loss": round(risk_amount, 2),
        "percentage_of_capital": round((position_size / data.capital) * 100, 2)
    }


# Risk-Reward Calculator
class RiskRewardInput(BaseModel):
    entry_price: float
    stop_loss: float
    target_price: float
    position_size: float

@app.post("/api/calculate/risk-reward")
def calculate_risk_reward(data: RiskRewardInput):
    risk = abs(data.entry_price - data.stop_loss)
    reward = abs(data.target_price - data.entry_price)
    
    if risk == 0:
        return {"error": "Risk cannot be zero"}
    
    rr_ratio = reward / risk
    
    potential_loss = risk * data.position_size
    potential_profit = reward * data.position_size
    
    return {
        "risk_reward_ratio": round(rr_ratio, 2),
        "risk_per_unit": round(risk, 2),
        "reward_per_unit": round(reward, 2),
        "potential_loss": round(potential_loss, 2),
        "potential_profit": round(potential_profit, 2)
    }


# Opportunity Cost Calculator
class OpportunityCostInput(BaseModel):
    amount: float
    option_a_return: float
    option_b_return: float
    years: int

@app.post("/api/calculate/opportunity-cost")
def calculate_opportunity_cost(data: OpportunityCostInput):
    fv_a = data.amount * ((1 + data.option_a_return / 100)**data.years)
    fv_b = data.amount * ((1 + data.option_b_return / 100)**data.years)
    
    opportunity_cost = abs(fv_a - fv_b)
    better_option = "A" if fv_a > fv_b else "B" if fv_b > fv_a else "Equal"
    
    yearly_data = []
    for year in range(data.years + 1):
        val_a = data.amount * ((1 + data.option_a_return / 100)**year)
        val_b = data.amount * ((1 + data.option_b_return / 100)**year)
        yearly_data.append({"year": year, "option_a": round(val_a, 2), "option_b": round(val_b, 2)})
    
    return {
        "future_value_a": round(fv_a, 2),
        "future_value_b": round(fv_b, 2),
        "opportunity_cost": round(opportunity_cost, 2),
        "better_option": better_option,
        "yearly_data": yearly_data
    }


# Savings Goal Calculator
class SavingsGoalInput(BaseModel):
    target_amount: float
    time_months: int
    expected_return: float
    current_savings: float

@app.post("/api/calculate/savings-goal")
def calculate_savings_goal(data: SavingsGoalInput):
    monthly_rate = data.expected_return / 100 / 12
    
    # Future value of current savings
    fv_current = data.current_savings * ((1 + monthly_rate)**data.time_months)
    remaining_target = data.target_amount - fv_current
    
    if remaining_target <= 0:
        monthly_savings_needed = 0
    elif monthly_rate == 0:
        monthly_savings_needed = remaining_target / data.time_months
    else:
        monthly_savings_needed = remaining_target * monthly_rate / (((1 + monthly_rate)**data.time_months - 1) * (1 + monthly_rate))
    
    total_savings = monthly_savings_needed * data.time_months
    total_interest = data.target_amount - data.current_savings - total_savings
    
    return {
        "monthly_savings_needed": round(max(0, monthly_savings_needed), 2),
        "total_savings": round(total_savings, 2),
        "total_interest_earned": round(max(0, total_interest), 2),
        "current_savings_future_value": round(fv_current, 2)
    }


# Amortization Schedule (standalone)
class AmortizationInput(BaseModel):
    loan_amount: float
    interest_rate: float
    term_months: int
    extra_payment: Optional[float] = 0

@app.post("/api/calculate/amortization")
def calculate_amortization(data: AmortizationInput):
    monthly_rate = data.interest_rate / 100 / 12
    
    if monthly_rate == 0:
        base_payment = data.loan_amount / data.term_months
    else:
        base_payment = data.loan_amount * (monthly_rate * (1 + monthly_rate)**data.term_months) / ((1 + monthly_rate)**data.term_months - 1)
    
    # Standard schedule
    schedule = []
    balance = data.loan_amount
    total_interest = 0
    
    for month in range(1, data.term_months + 1):
        interest = balance * monthly_rate
        principal = base_payment - interest
        balance -= principal
        total_interest += interest
        
        schedule.append({
            "month": month,
            "payment": round(base_payment, 2),
            "principal": round(principal, 2),
            "interest": round(interest, 2),
            "balance": round(max(0, balance), 2)
        })
    
    # With extra payment
    early_schedule = []
    balance_early = data.loan_amount
    total_interest_early = 0
    month = 0
    
    while balance_early > 0.01 and month < data.term_months:
        month += 1
        interest = balance_early * monthly_rate
        payment = base_payment + data.extra_payment
        principal = min(payment - interest, balance_early)
        balance_early -= principal
        total_interest_early += interest
        
        early_schedule.append({
            "month": month,
            "payment": round(payment, 2),
            "principal": round(principal, 2),
            "interest": round(interest, 2),
            "balance": round(max(0, balance_early), 2)
        })
    
    return {
        "monthly_payment": round(base_payment, 2),
        "total_interest": round(total_interest, 2),
        "total_paid": round(data.loan_amount + total_interest, 2),
        "schedule": schedule[:24],  # First 2 years
        "with_extra_payment": {
            "months_saved": data.term_months - len(early_schedule),
            "interest_saved": round(total_interest - total_interest_early, 2),
            "total_interest": round(total_interest_early, 2),
            "payoff_months": len(early_schedule)
        } if data.extra_payment > 0 else None
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
