import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Event from "./pages/Event";
import Login from "./pages/Login";
import Validation from "./pages/Validation";
import { Toaster } from "react-hot-toast";
import LoginModal from "./Components/LoginModal";

function App() {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={true} />
      <Router>
        <Toaster />
        <LoginModal />
        <Header />
        <Routes>
          <Route path="/annexe-app" element={<Home />}>
            <Route path="data/:dataId" element={<Home />} />
          </Route>
          <Route path="/annexe-app/story" element={<Story />} />
          <Route path="/annexe-app/event" element={<Event />} />
          <Route path="/annexe-app/validation" element={<Validation />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
