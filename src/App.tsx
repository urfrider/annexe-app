import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import Header from "./Components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Tv from "./pages/Tv";

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
          <Route path="/tv" element={<Tv />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
