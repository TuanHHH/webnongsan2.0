from fastapi import FastAPI, HTTPException
import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

CLIENT1 = os.getenv('CLIENT1')
CLIENT2 = os.getenv('CLIENT2')
CLIENT3 = os.getenv('CLIENT3')

origins = [
    CLIENT1,
    CLIENT2,
    CLIENT3
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lưu trữ cache cho sản phẩm
cached_products = None
cached_product_count = None

def get_products_from_db():
    global cached_products, cached_product_count

    db_connection = mysql.connector.connect(
        host=DB_HOST,      
        user=DB_USER,           
        password=DB_PASSWORD,   
        database=DB_NAME  
    )
    cursor = db_connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM products")
    current_product_count = cursor.fetchone()[0]

    # Kiểm tra nếu cache là None hoặc số lượng sản phẩm đã thay đổi
    if cached_products is None or cached_product_count != current_product_count:
        # Cập nhật cache
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT p.id, p.product_name, p.price, p.unit, p.rating, p.image_url, 
                   c.name as category, p.category_id, description 
            FROM products p 
            JOIN categories c ON p.category_id = c.id
        """
        cursor.execute(query)
        cached_products = cursor.fetchall()
        cached_product_count = current_product_count
        cursor.close()

    db_connection.close()
    return cached_products

# Hàm tính khoảng cách tương tự giữa sản phẩm
def calculate_distance(product, current_product, price_weight=0.1, category_weight=0.25, description_weight=0.25, name_weight=0.4):
    if product['id'] == current_product['id']:
        return float('inf')  # Loại bỏ sản phẩm hiện tại

    # Khoảng cách giá
    price_distance = abs(product['price'] - current_product['price'])

    # Phân loại
    category_distance = 0 if product['category_id'] == current_product['category_id'] else 1

    # Mô tả và tên
    description_index = products.index(product)
    current_description_index = products.index(current_product)
    description_distance = 1 - cosine_sim_desc[description_index, current_description_index]
    print(current_description_index, description_distance)
    name_distance = 1 - cosine_sim_name[description_index, current_description_index]

    # Tổng khoảng cách, ưu tiên tên và mô tả
    return (price_weight * price_distance +
            category_weight * category_distance +
            description_weight * description_distance +
            name_weight * name_distance)

@app.get("/similar-products/{product_id}")
def get_similar_products(product_id: int):
    global products
    products = get_products_from_db()

    # Kiểm tra sản phẩm có tồn tại không
    current_product = next((product for product in products if product['id'] == product_id), None)
    if not current_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Chuẩn hóa giá trị giá
    prices = np.array([p['price'] for p in products])
    normalized_prices = (prices - prices.min()) / (prices.max() - prices.min())

    # Vector hóa tên và mô tả
    descriptions = [p['description'] if p['description'] is not None else '' for p in products]
    names = [p['product_name'] if p['product_name'] is not None else '' for p in products]

    vectorizer_desc = TfidfVectorizer()
    vectorizer_name = TfidfVectorizer()

    description_vectors = vectorizer_desc.fit_transform(descriptions)
    name_vectors = vectorizer_name.fit_transform(names)

    # Tính cosine similarity cho mô tả và tên
    global cosine_sim_desc, cosine_sim_name
    cosine_sim_desc = cosine_similarity(description_vectors)
    cosine_sim_name = cosine_similarity(name_vectors)

    # Tính toán khoảng cách và chọn 6 sản phẩm tương tự nhất
    distances = [(product, calculate_distance(product, current_product)) for product in products]
    filtered_distances = [item for item in distances if item[1] != float('inf')]
    top_6_similar_products = sorted(filtered_distances, key=lambda x: x[1])[:6]

    response_data = {
        "status_code": 200,
        "data": [{"id": product['id'], "product_name": product['product_name'], "imageUrl": product['image_url'], "distance": distance, "price": product['price'], "rating": product['rating'], "category": product['category']} for product, distance in top_6_similar_products]
    }

    return JSONResponse(status_code=200, content=response_data)
