# from fastapi import FastAPI
# import pandas as pd
# import mysql.connector
# import os
# from dotenv import load_dotenv
# from sentence_transformers import SentenceTransformer
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import redis
# import pickle


# load_dotenv()
# app = FastAPI()
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

# DB_HOST = os.getenv('DB_HOST')
# DB_USER = os.getenv('DB_USER')
# DB_PASSWORD = os.getenv('DB_PASSWORD')
# DB_NAME = os.getenv('DB_NAME')

# CLIENT1 = os.getenv('CLIENT1')
# CLIENT2 = os.getenv('CLIENT2')
# CLIENT3 = os.getenv('CLIENT3')



# origins = [
#     CLIENT1,
#     CLIENT2,
#     CLIENT3
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
# # Lưu trữ cache cho sản phẩm
# products_df = None
# cached_product_count = None
# model = None

# def get_products_from_db():
#     global products_df, cached_product_count

#     db_connection = mysql.connector.connect(
#         host=DB_HOST,      
#         user=DB_USER,           
#         password=DB_PASSWORD,   
#         database=DB_NAME  
#     )
#     cursor = db_connection.cursor()
#     cursor.execute("SELECT COUNT(*) FROM products")
#     current_product_count = cursor.fetchone()[0]

#     # Kiểm tra nếu cache là None hoặc số lượng sản phẩm đã thay đổi
#     if products_df is None or cached_product_count != current_product_count:
#         # Cập nhật cache
#         query = """
#             SELECT p.id, p.product_name, p.price, p.unit, p.rating, p.image_url, 
#                    c.name as category, p.category_id, description 
#             FROM products p 
#             JOIN categories c ON p.category_id = c.id
#         """
#         products_df = pd.read_sql(query, db_connection)

#     db_connection.close()
#     return products_df


# def compute_embbedings(products_df):
#     global model
#     model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
#     products_df['combined_features'] = products_df['product_name'] + " " + products_df['description'].fillna('')
#     embeddings = model.encode(products_df['combined_features'].tolist(), convert_to_tensor=False)
#     return embeddings


# def find_similar(input, products_df, embeddings, n = 10):
#     input_embeddings = model.encode(input, convert_to_tensor=False)
#     similar = cosine_similarity([input_embeddings], embeddings)[0]
#     top_n_indicates = np.argsort(similar)[::-1][:n]
#     similar_products = products_df.iloc[top_n_indicates]
#     similar_products['similar'] = similar[top_n_indicates]
#     return similar_products

# @app.get("/search/{product_name}")
# def search(product_name: str):
#     global products
#     products = get_products_from_db()
#     global embeddings
#     embeddings = compute_embbedings(products)
#     similar_products = find_similar(product_name, products_df, embeddings)

#     # Prepare response data
#     response_data = {
#         "status_code": 200,
#         "data": [
#             {
#                 "id": int(product['id']),
#                 "product_name": product['product_name'],
#                 "imageUrl": product['image_url'],
#                 "price": float(product['price']),
#                 "rating": float(product['rating']),
#                 "category": product['category'],
#                 "similarity": float(product['similar'])
#             }
#             for _, product in similar_products.iterrows()
#         ]
#     }

#     # Return JSON response
#     return JSONResponse(content=response_data)


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

load_dotenv()

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

# Kết nối với Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

app = FastAPI()

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
    similar = cosine_similarity([input_embeddings], embeddings)[0]
    top_n_indicates = np.argsort(similar)[::-1][:n]
    similar_products = products_df.iloc[top_n_indicates]
    similar_products['similar'] = similar[top_n_indicates]
    return similar_products

@app.on_event("startup")
def startup_event():
    precompute_embeddings()  # Tính toán embeddings khi ứng dụng khởi động

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
