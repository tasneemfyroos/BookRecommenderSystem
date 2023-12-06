import { BrowserRouter, Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import Books from "./pages/Books";
import Update from "./pages/Update";
import RecPage from './pages/RecPage';
import ActiveUsers from './pages/ActiveUsers';



function App() {

  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/add" element={<Add />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/recommendations" element={<RecPage />} />
          <Route path="/activeUsers" element={<ActiveUsers />} />
        

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
