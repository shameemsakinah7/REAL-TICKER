import random
from datetime import datetime, timedelta

# Mock top 10 stocks (sorted by volume descending)
TOP_STOCKS = [
    {"ticker": "AAPL", "company": "Apple Inc", "price": 185.40, "change_percent": 1.2, "volume": 78000000},
    {"ticker": "MSFT", "company": "Microsoft", "price": 412.30, "change_percent": 0.8, "volume": 45000000},
    {"ticker": "GOOGL", "company": "Alphabet Inc", "price": 142.50, "change_percent": -0.5, "volume": 35000000},
    {"ticker": "AMZN", "company": "Amazon.com", "price": 155.20, "change_percent": 2.1, "volume": 32000000},
    {"ticker": "TSLA", "company": "Tesla Inc", "price": 248.90, "change_percent": -1.3, "volume": 28000000},
    {"ticker": "NVDA", "company": "NVIDIA", "price": 875.30, "change_percent": 3.5, "volume": 25000000},
    {"ticker": "META", "company": "Meta Platforms", "price": 485.60, "change_percent": 0.2, "volume": 22000000},
    {"ticker": "NFLX", "company": "Netflix", "price": 620.40, "change_percent": -0.9, "volume": 18000000},
    {"ticker": "BABA", "company": "Alibaba", "price": 88.70, "change_percent": 1.8, "volume": 15000000},
    {"ticker": "ORCL", "company": "Oracle Corp", "price": 132.10, "change_percent": 0.6, "volume": 12000000},
]

# Generate 6 months of mock historical prices (daily, ~180 days)
def generate_history(ticker, base_price):
    history = []
    start_date = datetime.now() - timedelta(days=180)
    for i in range(180):
        date = start_date + timedelta(days=i)
        price = base_price + random.uniform(-20, 20)  # Simulate volatility
        history.append({"date": date.strftime("%Y-%m-%d"), "price": round(price, 2)})
    return history

STOCK_HISTORY = {stock["ticker"]: generate_history(stock["ticker"], stock["price"]) for stock in TOP_STOCKS}