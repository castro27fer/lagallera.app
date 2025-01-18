import { createBrowserRouter} from "react-router-dom";
import App from './App';
import Streaming, { loader as streaming_loader } from "./pages/Streaming";
import Login from "./pages/Login.jsx";
import Home,{loader as homeLoader } from './pages/Home.jsx';

import React from "react";
import Receptor,{ loader as receptorLoader } from "./pages/Receptor.jsx";


const router = createBrowserRouter([
    {
      path    : "/",
      element : <App/>,
      children:[
        {
          path:"/",
          loader: homeLoader,
          element: <Home />
        },
        {
          path : "/login",
          element: <Login />
        },
        {
          loader : streaming_loader,
          path  : "/streaming/:streamingId",
          element : <Streaming />
        },
        {

          loader: receptorLoader,
          path    : "receptor/:streamingId",
          element : <Receptor/>
        },
      ]
    },
  ],
  // {
  //   future: {
  //     v7_fetcherPersist: true,
  //     v7_normalizeFormMethod: true,
  //     v7_partialHydration: true,
  //     v7_relativeSplatPath: true,
  //     v7_skipActionErrorRevalidation: true,
  //     v7_startTransition:true
  //   },
  // }
);

export default router