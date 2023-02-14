import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../contexts/UserContext";

const PublicLayout = () => {
  const { token } = useUser();
  if (token) {
    return <Navigate to="/admin" />
  }
  return (
    <div>
      <div>
        <h1>Public Users</h1>
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout;