import React, { Fragment } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from './routes/DashBoard';
import NotFound from './routes/NotFound';
import SignIn from './routes/SignIn';
import Settings from './routes/Settings';
import SignUp from './routes/SignUp';
import SignOut from './routes/SignOut';
import Cohort from './routes/Cohort';
import QuestionList from './components/QuestionList';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    // errorElement: <NotFound />
  },
  {
    path: "/login",
    element: <SignIn />
  },
  {
    path: "/signout",
    element: <SignOut />
  },
  {
    path: "/register",
    element: <SignUp />
  },
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/cohort",
    element: <Cohort />
  },
  {
    path: "/questions",
    element: <QuestionList />
  },
]);



export default function App() {
  return (
    <Fragment >
      <RouterProvider router={router} />
    </Fragment>
  )
}
