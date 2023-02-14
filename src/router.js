import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PublicLayout from "./components/PublicLayout";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        path: '/',
        element: <Navigate to="/users" />
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/jobs',
        element: <Jobs />
      },
      {
        path: '/jobs/:id',
        element: <JobDetails />
      }
    ]
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound key="any" />
  },
  {
    path: '/not-found',
    element: <NotFound key="not-found" />
  }
])

export default router;