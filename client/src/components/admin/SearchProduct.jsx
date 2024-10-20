// import React, { useState, useEffect, useRef } from "react";
// import { apiGetProducts } from "@/apis/product";
// import { useNavigate } from "react-router-dom";
// import product_default from '@/assets/product_default.png';
// import { Link } from "react-router-dom";
// import { ProductMiniItem } from "@/components";


// function SearchProduct() {
//     const [searchTerm, setSearchTerm] = useState("");
//   const [products, setProducts] = useState(null);
//   const navigate = useNavigate();

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && searchTerm.trim() !== "") {
//       navigate(`/admin/product?search=${searchTerm}`);
//     }
//   };
//   useEffect(() => {
//     if (searchTerm.trim() !== "") {

//     } else {
//     }

//     return () => {

//     };
//   }, [searchTerm]);
//   return (
//     <div>
//          <div>SearchProduct</div>
//          <input
//                     type="text"
//         placeholder="Tìm kiếm sản phẩm"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={handleKeyDown}
//                 className="w-[500px] border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//          />
//     </div>
   
//   )
// }

// export default SearchProduct

// import React, { useState, useEffect } from "react";
// import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";

// function SearchProduct() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const productSearch = params.get('search');
//   const categorySearch = params.get('category');
//   const page = 1;
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && searchTerm.trim() !== "") {
//       navigate(`/admin/product?search=${searchTerm.trim()}`);
//     }
//     if (event.key === "Enter" && searchTerm.trim() === "") {
//         navigate(`/admin/product`);
//       }
//   };
//   const searchParams = {
//     page: page,
//     ...(searchTerm && searchTerm !== 'null' && { search: searchTerm }),
//     ...(categorySearch && categorySearch !== 'null' && { category: categorySearch })
//   };

//   useEffect(() => {

//     if (searchTerm.trim() === "") {

//     } else {

//     }

//     return () => {
//     };
//   }, [searchTerm]);

//   return (
//     <div>
//       <div>SearchProduct</div>
//       <input
//         type="text"
//         placeholder="Tìm kiếm sản phẩm"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={handleKeyDown}
//         className="w-[500px] border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>
//   );
// }

// export default SearchProduct;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// function SearchProduct({onSearch}) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();
//   const [params] = useSearchParams();
//   const productSearch = params.get("search");
//   const categorySearch = params.get("category");
//   const sort = params.get("sort")

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter") {
//       // If the search term is empty, navigate without search
//       onSearch()
//       if (searchTerm.trim() === "") {
//         navigate(`/admin/product`);
//       } else {
//         // Navigate to the product page with both search and category
//         navigate(
//           `/admin/product?${new URLSearchParams({
//             search: searchTerm.trim(),
//             ...(categorySearch && { category: categorySearch }), // Include category if it exists
//             ...(sort &&{ sort: sort}),
//             page: 1 
//           }).toString()}`
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     setSearchTerm(productSearch || "");
//   }, [productSearch]);

//   return (
//     <div>
//       <div>SearchProduct</div>
//       <input
//         type="text"
//         placeholder="Tìm kiếm sản phẩm"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         onKeyDown={handleKeyDown}
//         className="w-[500px] border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
//       />
//     </div>
//   );
// }

// export default SearchProduct;

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SearchProduct({onSearch}) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productSearch = params.get("search");
  const categorySearch = params.get("category");
  const sort = params.get("sort")

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch()
      if (searchTerm.trim() === "") {
        navigate(`/admin/product`);
        window.location.reload()
        
      } else {
        navigate(
          `/admin/product?${new URLSearchParams({
            search: searchTerm.trim(),
            ...(categorySearch && { category: categorySearch }), // Include category if it exists
            ...(sort &&{ sort: sort}),
            page: 1 
          }).toString()}`
        );
      }
    }
  };

  useEffect(() => {
    setSearchTerm(productSearch || "");
  }, [productSearch]);

  return (
    <div>
      <div></div>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-[500px] border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default SearchProduct;