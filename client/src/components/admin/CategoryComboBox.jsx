// import React, { useState } from 'react'
// import { useSelector } from 'react-redux'
// const CategoryComboBox = ({ onSelectCategory }) => {
//     const { categories } = useSelector((state) => {
//         return state.app;
//     },
// );

// // console.log(categories)
// const handleChange = (event) => {
//     const selectedId = event.target.value;
//     // setSelectedCategory(event.target.value);
//     // console.log(selectedCategory)
//     setSelectedCategory(selectedId);

//     // Tìm category theo id đã chọn và gửi nó cho cha
//     const selectedCategory = categories.find(category => category.id === selectedId);
//     onSelectCategory(selectedCategory);
//   };
// const [selectedCategory, setSelectedCategory] = useState('');
//   return (
//     <div className='w-full'>
//         <select 
//         value={selectedCategory} 
//         onChange={(event) => {
//             handleChange(event);
//         }}
//         className="border p-2 w-full rounded-md" // Thêm các lớp CSS để định dạng
//         >
//         <option value="">Select a category</option>
//         {categories?.map((category) => (
//           <option key={category?.id} value={category?.id}>
//             {category?.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   )
// }

// export default CategoryComboBox
import React, { useState } from 'react'
import { useSelector } from 'react-redux'


const CategoryComboBox = ({ onSelectCategory}) => {
    const { categories } = useSelector((state) => state.app);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleChange = (event) => {
        const selectedId = event.target.value;
        setSelectedCategory(selectedId);

        // Tìm category theo id đã chọn và gửi nó cho cha
        const selectedCategory = categories.find(category => category.id === parseInt(selectedId));
        onSelectCategory(selectedCategory);
    };

    return (
        <div className='w-full'>
            <select 
                value={selectedCategory} 
                onChange={handleChange}
                className="border p-2 w-full rounded-md"
            >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryComboBox;