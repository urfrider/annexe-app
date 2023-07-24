import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Event from "./pages/Event";

function App() {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={true} />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="movies/:movieId" element={<Home />} />
          </Route>
          <Route path="/story" element={<Story />} />
          <Route path="/event" element={<Event />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
