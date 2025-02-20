import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/contacts"; // Update with your backend URL

export default function ContactList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setContacts(response.data.data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setContacts(contacts.filter((contact) => contact.id !== id));
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <div>
      <Link to="/add" className="btn btn-primary mb-3">
        Add Contact
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <Link
                  to={`/edit/${contact.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
