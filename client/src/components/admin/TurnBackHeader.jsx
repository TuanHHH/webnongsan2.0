import React from 'react'
import { GrReturn } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { useNavigate , useLocation} from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
function TurnBackHeader({ turnBackPage, header}) {
    const [searchParams] = useSearchParams();

    // Get all search parameters

    // const navigate = useNavigate()
    const navigate = useNavigate();
    // if(filter!== null){
    //     const handleTurnBack = () => {
    //         const url = new URL(turnBackPage, window.location.origin);
    //         if (filter) {
    //             url.search = new URLSearchParams(filter).toString();
    //         }
    //         navigate(url.toString());
    //     };
    // }
    // else{
    //     const handleTurnBack = () => {
    //         navigate(turnBackPage);
    //     };
    
    // }
    const handleTurnBack = () => {
        // const handleTurnBack = () => {
            // console.log(location.state)
            // navigate(-1);
        // };
        // navigate(turnBackPage)
        // if (filter !== null) {
        //     const url = new URL(turnBackPage, window.location.origin);
        //     console.log(url)
        //     if (filter) {
        //         url.search = new URLSearchParams(filter).toString();
        //         console.log(url)
        //     }
        //     navigate(url.toString());
        // } else {
        //     navigate(turnBackPage);
        // }
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(turnBackPage);
        }
    // };
    };
    return (
        <div>
            <div className="flex items-center text-3xl text-black hover:text-blue-800 mb-3">
                {/* <Link to={turnBackPage} className="flex items-center">
                    <GrReturn className="mr-2" />{" "}
                    {header}
                </Link> */}
                {/* <div className="flex items-center cursor-pointer" onClick={() => navigate(turnBackPage)}> */}
                <div className="flex items-center cursor-pointer" onClick={handleTurnBack}>
                
                    <GrReturn className="mr-2" />{" "}
                    {/* Thêm khoảng cách giữa icon và chữ */}
                    {header}
                </div>
            </div>
        </div>
    )
}

export default TurnBackHeader