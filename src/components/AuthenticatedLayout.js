import { Navigate } from "react-router-dom";
import { JobProvider } from "../contexts/JobContext";
import { useUser } from "../contexts/UserContext";
import Dashboard from "./Dashboard";

const AuthenticatedLayout = () => {
  const  { user, token } = useUser();

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <JobProvider currentUser={user}>
      <Dashboard />
    </JobProvider>
  )
}

export default AuthenticatedLayout;