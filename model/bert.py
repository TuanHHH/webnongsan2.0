import pandas as pd
import mysql.connector
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from fastapi import FastAPI, HTTPException
import redis
import pickle
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

# Kết nối với Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
# Tính toán embeddings khi ứng dụng khởi động
@asynccontextmanager
async def lifespan(app: FastAPI):
    precompute_embeddings()
    yield

app = FastAPI(lifespan=lifespan)

# Load model Sentence-BERT
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def get_products_from_db():
    db_connection = mysql.connector.connect(
        host=DB_HOST,      
        user=DB_USER,           
        password=DB_PASSWORD,   
        database=DB_NAME  
    )
    query = """
        SELECT p.id, p.product_name, p.price, p.unit, p.rating, p.image_url, 
               c.name as category, p.category_id, description 
        FROM products p 
        JOIN categories c ON p.category_id = c.id
    """
    products_df = pd.read_sql(query, db_connection)
    db_connection.close()
    return products_df

# Cache sản phẩm vào Redis
def cache_products(products_df):
    redis_client.set('products', pickle.dumps(products_df))

def get_cached_products():
    cached_products = redis_client.get('products')
    if cached_products:
        return pickle.loads(cached_products)
    return None

# Cache embeddings vào Redis
def cache_embeddings(embeddings):
    redis_client.set('product_embeddings', pickle.dumps(embeddings))

def get_cached_embeddings():
    cached_embeddings = redis_client.get('product_embeddings')
    if cached_embeddings:
        return pickle.loads(cached_embeddings)
    return None

# Precompute embeddings
def precompute_embeddings():
    products_df = get_products_from_db()
    embeddings = compute_embeddings(products_df)
    cache_products(products_df)  # Lưu sản phẩm vào cache
    cache_embeddings(embeddings)  # Lưu embeddings vào cache

def compute_embeddings(products_df):
    products_df['combined_features'] = products_df['product_name'] + " " + products_df['description'].fillna('')
    embeddings = model.encode(products_df['combined_features'].tolist(), convert_to_tensor=False)
    return embeddings

def find_similar(input, products_df, embeddings, n=10):
    input_embeddings = model.encode(input, convert_to_tensor=False)
    print(input_embeddings)
    similar = cosine_similarity([input_embeddings], embeddings)[0]
    top_n_indicates = np.argsort(similar)[::-1][:n]
    similar_products = products_df.iloc[top_n_indicates]
    similar_products['similar'] = similar[top_n_indicates]
    return similar_products


# @app.on_event("startup")
# async def startup_event():
#     precompute_embeddings()

@app.get('/search/{product_name}')
def search(product_name: str):
    products_df = get_cached_products()
    embeddings = get_cached_embeddings()

    if products_df is None or embeddings is None:
        raise HTTPException(status_code=500, detail="Precomputed embeddings not found")

    res = find_similar(product_name, products_df, embeddings)

    response_data = {
        "status_code": 200,
        "data": [{"id": product['id'], "product_name": product['product_name'], "imageUrl": product['image_url'], "price": product['price'], "rating": product['rating'], "category": product['category']} for _, product in res.iterrows()]
    }
    
    return JSONResponse(content=response_data)

