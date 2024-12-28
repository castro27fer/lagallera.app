import { createBrowserRouter} from "react-router-dom";
import App from './App';
import Streaming from "./pages/Streaming";
import Login from "./pages/Login.jsx";
import Home from './pages/Home.jsx';

import React from "react";
import Receptor from "./pages/Receptor.jsx";


const router = createBrowserRouter([
    {
      path    : "/",
      element : <App/>,
      children:[
        {
          path:"/",
          element: <Home />
        },
        {
          path : "/login",
          element: <Login />
        },
        {
          path  : "/streaming",
          element : <Streaming />
        },
        {
          path    : "receptor/:streamingId",
          element : <Receptor/>
        },
      ]
    },
  ]);

export default router