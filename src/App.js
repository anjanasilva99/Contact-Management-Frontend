import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContactList from "./pages/ContactList";
import ContactForm from "./pages/ContactForm";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <div className="app-container">
          <h2 className="text-center mb-4">Contact Management</h2>
          <Routes>
            <Route path="/" element={<ContactList />} />
            <Route path="/add" element={<ContactForm />} />
            <Route path="/edit/:id" element={<ContactForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

