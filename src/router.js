import {createBrowserRouter, Navigate} from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Admin from "./pages/Admin";
import Clients from "./pages/Clients";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import AuthenticatedLayout from "./components/AuthenticatedLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/jobs" />
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/clients',
        element: <Clients />
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