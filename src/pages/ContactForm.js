import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/contacts";

export default function ContactForm() {
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          console.log("Fetched contact data:", response.data.data); // Debug
          setContact(response.data.data); // Prefill form
          console.log("Contact data:", response.data.data)// Debug
        } catch (error) {
          console.error("Error fetching contact:", error);
        }
      };
      fetchContact();
    }
  }, [id]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact.email.includes("@")) {
      console.error("Invalid email format:", contact.email);
      return;
    }

    // Sanitize contact data
    const { id: _, createdAt, ...sanitizedContact } = contact;

    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, sanitizedContact);
      } else {
        await axios.post(API_URL, sanitizedContact);
      }
      navigate("/");
    } catch (error) {
      console.error(
        "Error saving contact:",
        error.response?.data || error.message
      );
    }
  };


  return (
    <div className="card p-4">
      <h4>{id ? "Edit Contact" : "Add Contact"}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Add"} Contact
        </button>
      </form>
    </div>
  );
}
