import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    
    // Check if currentUser is null or undefined before accessing its properties
    return currentUser && currentUser?.isAdmin ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default OnlyAdminPrivateRoute;
