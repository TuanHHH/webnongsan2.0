import pandas as pd
import mysql.connector
import os
from dotenv import load_dotenv
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
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

# Tính toán TF-IDF khi ứng dụng khởi động
@asynccontextmanager
async def lifespan(app: FastAPI):
    precompute_tfidf()
    yield

app = FastAPI(lifespan=lifespan)

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

# Cache ma trận TF-IDF vào Redis
def cache_tfidf_matrix(tfidf_matrix):
    redis_client.set('tfidf_matrix', pickle.dumps(tfidf_matrix))

def get_cached_tfidf_matrix():
    cached_tfidf_matrix = redis_client.get('tfidf_matrix')
    if cached_tfidf_matrix:
        return pickle.loads(cached_tfidf_matrix)
    return None

# Tính toán trước ma trận TF-IDF
def precompute_tfidf():
    products_df = get_products_from_db()
    tfidf_matrix = compute_tfidf_matrix(products_df)
    cache_products(products_df)  # Lưu sản phẩm vào cache
    cache_tfidf_matrix(tfidf_matrix)  # Lưu ma trận TF-IDF vào cache

# Tạo một đối tượng TfidfVectorizer toàn cục
vectorizer = TfidfVectorizer()

def compute_tfidf_matrix(products_df):
    products_df['combined_features'] = products_df['product_name'] + " " + products_df['description'].fillna('')
    tfidf_matrix = vectorizer.fit_transform(products_df['combined_features'])
    return tfidf_matrix

def find_similar(input_text, products_df, tfidf_matrix, n=10):
    # Sử dụng lại đối tượng vectorizer đã được huấn luyện để biến đổi văn bản đầu vào
    input_vector = vectorizer.transform([input_text])
    # print(input_vector)
    similarities = cosine_similarity(input_vector, tfidf_matrix)[0]
    top_n_indices = np.argsort(similarities)[::-1][:n]
    similar_products = products_df.iloc[top_n_indices]
    similar_products['similar'] = similarities[top_n_indices]
    return similar_products


@app.get('/search/{product_name}')
def search(product_name: str):
    products_df = get_cached_products()
    tfidf_matrix = get_cached_tfidf_matrix()

    if products_df is None or tfidf_matrix is None:
        raise HTTPException(status_code=500, detail="Không tìm thấy ma trận TF-IDF đã tính toán trước")

    res = find_similar(product_name, products_df, tfidf_matrix)

    response_data = {
        "status_code": 200,
        "data": [{"id": product['id'], "product_name": product['product_name'], "imageUrl": product['image_url'], "price": product['price'], "rating": product['rating'], "category": product['category']} for _, product in res.iterrows()]
    }
    
    return JSONResponse(content=response_data)
