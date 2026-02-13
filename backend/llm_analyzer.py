from transformers import pipeline
import statistics

# Load GPT-2 model
generator = pipeline('text-generation', model='gpt2')

def analyze_stock_data(history_data):
    # Extract prices for analysis
    prices = [entry["price"] for entry in history_data]
    
    # Compute basic metrics for variety
    if len(prices) > 1:
        changes = [prices[i] - prices[i-1] for i in range(1, len(prices))]
        avg_change = statistics.mean(changes)
        volatility = statistics.stdev(changes) if len(changes) > 1 else 0
        
        # Determine trend
        if avg_change > 1:  # Positive average change
            trend = "Upward"
        elif avg_change < -1:  # Negative average change
            trend = "Downward"
        else:
            trend = "Sideways"
        
        # Determine risk level based on volatility
        if volatility < 2:
            risk_level = "Low"
        elif volatility < 5:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        # Determine suggested action based on trend and risk
        if trend == "Upward" and risk_level == "Low":
            suggested_action = "Long-term investment"
        elif trend == "Upward" and risk_level in ["Medium", "High"]:
            suggested_action = "Short-term watch"
        elif trend == "Downward":
            suggested_action = "Avoid (prices are declining)"
        else:
            suggested_action = "Short-term watch"
    else:
        # Fallback if insufficient data
        trend = "Sideways"
        risk_level = "Medium"
        suggested_action = "Short-term watch"
    
    # Use LLM to generate a natural response (optional enhancement)
    prompt = f"Based on stock data with trend {trend}, risk {risk_level}, suggest action for a beginner."
    try:
        llm_response = generator(prompt, max_length=50, num_return_sequences=1)[0]['generated_text']
        # Optionally parse or append LLM text, but prioritize computed values
    except:
        pass  # Ignore LLM errors, use computed values
    
    return {
        "trend": trend,
        "risk_level": risk_level,
        "suggested_action": suggested_action
    }