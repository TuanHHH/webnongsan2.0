// import React from 'react'

// function AddScreenButton({buttonName,buttonClassName}) {
//   return (
//     <div className="fixed bottom-16 right-16">
//         <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
//           + Thêm nhân viên
//         </button>
//     </div>
//   )
// }

// export default AddScreenButton
import React from 'react';
import { useNavigate } from 'react-router-dom';


function AddScreenButton({ buttonName = "+ Thêm", buttonClassName ,toLink}) {
  // Class mặc định
  const navigate = useNavigate();
  const defaultClassName = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full";
  const handleClick=()=>{
    if (toLink) {
      navigate(toLink); // Chuyển đến toLink
    }
  }
  // Kết hợp class mặc định với class được cung cấp (nếu có)
  const combinedClassName = buttonClassName ? `${defaultClassName} ${buttonClassName}` : defaultClassName;

  return (
    <div className="fixed bottom-16 right-16">
      <button className={combinedClassName} onClick={()=>handleClick()}>
        {buttonName}
      </button>
    </div>
  );
}

export default AddScreenButton;