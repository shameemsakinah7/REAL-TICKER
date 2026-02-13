from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mock_data import TOP_STOCKS, STOCK_HISTORY
from llm_analyzer import analyze_stock_data
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class AnalyzeRequest(BaseModel):
    history: list

@app.get("/api/stocks/top10")
def get_top_stocks():
    return TOP_STOCKS

@app.get("/api/stocks/{ticker}/history")
def get_stock_history(ticker: str):
    if ticker not in STOCK_HISTORY:
        raise HTTPException(status_code=404, detail="Stock not found")
    return STOCK_HISTORY[ticker]

@app.post("/api/stocks/{ticker}/analyze")
def analyze_stock(ticker: str, request: AnalyzeRequest):
    if ticker not in STOCK_HISTORY:
        raise HTTPException(status_code=404, detail="Stock not found")
    analysis = analyze_stock_data(request.history)
    return {
        "analysis": analysis,
        "disclaimer": "This is AI-generated analysis and not financial advice."
    }