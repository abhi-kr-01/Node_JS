import { createBrowserRouter } from "react-router";
import NotFound from "./pages/notfound.jsx"
import App from './App.jsx';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import VideoCall from "./pages/videoCall.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    errorElement: <NotFound />, // Catches 404s and crashes
    children: [
      {
        path: "", 
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "call",
        element: <VideoCall />
      }
    ],
  },
]);

export default router;