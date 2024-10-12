import React from 'react'
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { NavLink } from 'react-router-dom';
import icons from '@/utils/icons'

const { GrNext } = icons
const Breadcrumb = ({ title, category }) => {
    const routes = [
        { path: "/", breadcrumb: "Home" },
        { path: "/products", breadcrumb: "Sản phẩm" },
        { path: "/products/:category", breadcrumb: category },
        { path: "/:category/:pid/:title", breadcrumb: title }
    ];
    const breadcrumb = useBreadcrumbs(routes);
    return (
        <div className='flex items-center text-sm gap-1'>
            {breadcrumb?.filter(e => !e.match.route === false).map(({
                match,
                breadcrumb
            }, idx, self) => (
                <span key={match.pathname}>
                    <NavLink to={match.pathname} className='gap-1 flex items-center hover:text-main'>
                        <span> {breadcrumb}</span>
                        {idx !== self.length - 1 && <GrNext size={10} />}
                    </NavLink>
                </span>
            ))}
        </div>
    )
}

export default Breadcrumb