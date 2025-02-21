import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "../components/ConfirmationModal";
import "./ContactList.css";

const API_URL = "http://localhost:8080/contacts";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(
          API_URL + (searchTerm ? `?search=${searchTerm}` : "")
        );
        setContacts(response.data.data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchContacts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();

      if (sortOrder === "asc") {
        return emailA.localeCompare(emailB);
      } else {
        return emailB.localeCompare(emailA);
      }
    });

    setContacts(sortedContacts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortedField("email");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      setContacts(contacts.filter((contact) => contact.id !== deleteId));
      setModalOpen(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <>
      <div className="contact-list">
        <div className="d-flex align-items-center mb-3">
          <Link to="/add" className="btn btn-primary">
            Add Contact
          </Link>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-control search-input"
            />
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                Email{" "}
                <button
                  onClick={handleSort}
                  className="btn btn-sm btn-link sort-button"
                  style={{ textDecoration: "none" }}
                >
                  {sortedField === "email"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </button>
              </th>
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
                    onClick={() => handleDeleteClick(contact.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Contact"
          message="Are you sure you want to delete this contact?"
        />
      </div>
    </>
  );
};

export default ContactList;
