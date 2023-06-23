import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loading";

const RoleBaseRoute = (props) => {
    //get URL
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    //get user info from redux
    const user = useSelector(state => state.account.user.user)
    //check role user
    const userRole = user.role
    if (isAdminRoute === true && userRole === 'ADMIN') {
        return (<>{props.children}</>)
    } else {
        return (<Loading />)
    }
}

const ProtectedRoute = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)

    return (
        <>
            {isAuthenticated === true
                ? <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                : <Navigate to='/login' replace />
            }
        </>
    )
}

export default ProtectedRoute;