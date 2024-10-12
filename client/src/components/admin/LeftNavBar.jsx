import React from 'react'
import { NavLink } from 'react-router-dom';
import  AdminNavigationPath  from './AdminNavigationPath';

const LeftNavBar = () => {
    return (
        <div className="flex">
        < div >
        <aside className="w-64 h-full bg-gray-100 p-4 min-h-screen">
        {/* <aside className="w-64 bg-gray-100 p-4 flex-shrink-0"> */}
            <nav>
                <ul className="space-y-4">
                    <li className="text-lg font-semibold text-main">Overview</li>
                    {AdminNavigationPath.map((e) => (
                            <NavLink
                                to={e.path}
                                key={e.id}
                                className={({ isActive }) =>
                                    `block ${isActive
                                        ? "text-main-hover font-bold"
                                        // ? "text-main font-bold"
                                        : "hover:text-main-hover"
                                        // : "hover:text-black-500"
                                    }`
                                }
                            >
                                {e.value}
                            </NavLink>
                        // </li>
                    ))}
                </ul>
            </nav>
        </aside>
        </div>
        </div >
    )
};

export default LeftNavBar