import { createBrowserRouter} from "react-router-dom";
import App from './App';
import Streaming from "./pages/Streaming"

import React from "react";
import Receptor from "./pages/Receptor.jsx";


const router = createBrowserRouter([
    {
      path    : "/",
      element : <App/>,
      children:[
        // {
        //   path    : "/",
        //   element : <Home/>,
        //   loader  : home_loader
        // },
        {
          path  : "/",
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