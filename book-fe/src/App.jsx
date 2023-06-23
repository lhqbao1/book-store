import React, { useEffect, useState } from 'react';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from './pages/book';
import AdminPage from './pages/admin';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/Home';
import { callFetchUser } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import OrderPage from './components/Order/OrderPage';
import OrderHistory from './components/Order/OrderHistory';

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

const LayoutAdmin = () => {
  //get user info from redux
  const user = useSelector(state => state.account.user)
  //get role user
  const userRole = user.role
  return (
    <div>
      {window.location.pathname === '/admin' && userRole === 'ADMIN' && ''
      }
      <Outlet />
      {window.location.pathname === '/admin' && userRole === 'ADMIN' && ''
      }

    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccountInfo = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
      // || window.location.pathname === '/'
    ) return;

    const res = await callFetchUser();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }



  useEffect(() => {
    getAccountInfo();
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Loading />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: "book",
          element: <BookPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element: <OrderPage />,
        },
        {
          path: "history",
          element: <OrderHistory />,
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <Loading />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },

      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },



  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'

        ? <RouterProvider router={router} />
        : <Loading />
      }
    </>
  )
}
