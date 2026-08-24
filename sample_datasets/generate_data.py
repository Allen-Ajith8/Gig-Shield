import random
import csv
from datetime import datetime, timedelta

def generate_customer_churn():
    with open("customer_churn.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["customer_id", "age", "tenure_months", "balance", "num_products", "is_active", "churn"])
        
        for i in range(1, 2501):
            age = random.randint(18, 80)
            tenure = random.randint(1, 72)
            balance = round(random.uniform(0.0, 250000.0), 2) if random.random() > 0.3 else 0.0
            num_products = random.choices([1, 2, 3, 4], weights=[50, 40, 8, 2])[0]
            is_active = 1 if random.random() > 0.4 else 0
            
            # Simple synthetic churn logic
            churn_prob = 0.1
            if age > 60: churn_prob += 0.2
            if balance == 0.0: churn_prob += 0.15
            if not is_active: churn_prob += 0.3
            if num_products > 2: churn_prob -= 0.2
            
            churn = 1 if random.random() < churn_prob else 0
            
            writer.writerow([f"CUST_{i:05d}", age, tenure, balance, num_products, is_active, churn])
            
def generate_sales_data():
    with open("retail_sales.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["date", "store_id", "product_category", "units_sold", "revenue", "promotion_active"])
        
        categories = ["Electronics", "Clothing", "Home", "Toys", "Food"]
        start_date = datetime(2025, 1, 1)
        
        for i in range(3500):
            current_date = start_date + timedelta(days=random.randint(0, 365))
            store_id = f"STR_{random.randint(1, 20):03d}"
            category = random.choice(categories)
            promo = 1 if random.random() > 0.8 else 0
            
            base_units = random.randint(10, 100)
            units_sold = base_units * 2 if promo else base_units
            
            price_multiplier = {"Electronics": 150.0, "Clothing": 45.0, "Home": 80.0, "Toys": 25.0, "Food": 8.5}
            revenue = round(units_sold * price_multiplier[category] * random.uniform(0.9, 1.1), 2)
            
            writer.writerow([current_date.strftime("%Y-%m-%d"), store_id, category, units_sold, revenue, promo])

print("Generating customer_churn.csv (2500 rows)...")
generate_customer_churn()
print("Generating retail_sales.csv (3500 rows)...")
generate_sales_data()
print("Done!")
