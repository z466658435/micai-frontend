import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet
} from "react-router-dom"
import React, { useEffect, useContext } from 'react'
import { AuthContext } from './context/authContext'
import { WebSocketProvider } from './context/webSocketContext'
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Picture from "./pages/Picture"
import SinglePic from "./pages/SinglePic"
import Article from "./pages/Article"
import SingleArt from "./pages/SingleArt"
import Back from "./pages/Back"
import "./style.scss"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/pic",
        element: <Picture />
      },
      {
        path: "/singlepic/:uuid",
        element: <SinglePic />
      },
      {
        path: "/article",
        element: <Article />
      },
      {
        path: "/singleart/:user_uuid/:id",
        element: <SingleArt />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/back",
    element: <Back />
  },
])

function App () {
  return (
    <WebSocketProvider>
      <div className="app">
        <div className="container">
          <RouterProvider router={router}></RouterProvider>
        </div>
      </div>
    </WebSocketProvider>
  )
}

export default App
