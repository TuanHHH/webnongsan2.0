import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumb, ProductCard, SearchItem } from '../../components'
import { apiGetProducts } from '../../apis';
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  default: 5,
  1100: 4,
  700: 3,
  500: 2
};


const Product = () => {
  const [products, setProducts] = useState(null)
  const [activeClick, setActiveClick] = useState(null)
  const { category } = useParams();
  // console.log(category)
  const fetchProducts = async (queries) => {
    const response = await apiGetProducts(queries)
    // console.log(response)
    setProducts(response.data.result)
  }

  useEffect(() => {
    if (category || category !== 'products') {
      const queries = {
        page: 1, 
        size: 10, 
        filter: `category.name~'${category}'`
      };
      fetchProducts(queries);
    }
  }, [category]);

  const changeActiveFilter = useCallback((name)=>{
    if (activeClick === name)
      setActiveClick(null)
    else
      setActiveClick(name)
  }, [activeClick])
  return (
    <div className='w-full'>
      <div className='h-20 flex justify-center items-center bg-gray-100 '>
        <div className='w-main'>
          <h3 className='font-semibold uppercase'>{category}</h3>
          <Breadcrumb category={category} />
        </div>
      </div>
      <div className='w-main border p-4 flex justify-between mt-8 m-auto'>
        <div className='w-4/5 flex-auto flex items-center gap-4' >
        <span className='font-semibold text-sm'>Filter</span>
          <SearchItem name='price' activeClick={activeClick} changeActiveFilter={changeActiveFilter}/>
          <SearchItem name='rating'activeClick={activeClick} changeActiveFilter={changeActiveFilter}/>
        </div>
        <div className='w-1/5 flex-auto' >Sort</div>
      </div>
      <div className='mt-8 w-main m-auto'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mx-0"
          columnClassName="my-masonry-grid_column mb-[-20px]">
           {products?.map((e) => (
            <ProductCard key={e.id} productData={e} />
          ))}
        </Masonry>
      </div>
      <div className='w-full h-[400px]'></div>
    </div>
  )
}

export default Product