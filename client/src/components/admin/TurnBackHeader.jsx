import React from 'react'
import { GrReturn } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function TurnBackHeader({ turnBackPage, header }) {
    const navigate = useNavigate()
    return (
        <div>
            <div className="flex items-center text-3xl text-black hover:text-blue-800 mb-3">
                {/* <Link to={turnBackPage} className="flex items-center">
                    <GrReturn className="mr-2" />{" "}
                    {header}
                </Link> */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate(turnBackPage)}>
                    <GrReturn className="mr-2" />{" "}
                    {/* Thêm khoảng cách giữa icon và chữ */}
                    {header}
                </div>
            </div>
        </div>
    )
}

export default TurnBackHeader