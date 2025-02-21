import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/contacts";

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedField, setSortedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <>
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
      <style>
        {`
           .btn-link {
            padding: 2px 6px;
            vertical-align: baseline;
            color: #666;
            font-weight: bold;
          }
          .btn-link:hover {
            color: #333;
          }
          .sort-button {
            font-size: 1.2rem;
            margin-left: 5px;
            transition: transform 0.2s;
          }
          .sort-button:hover {
            transform: scale(1.2);
          }
          th {
            vertical-align: middle;
          }
          .search-container {
            width: 400px;
            margin-left: 15px;
          }
          .search-input {
            padding-right: 30px;
            border-radius: 10px;
            border: 1px solid #ddd;
            transition: all 0.3s ease;
          }
          .search-input:focus {
            border-color: #80bdff;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
            outline: none;
          }
          .d-flex {
            display: flex;
            align-items: center;
          }
        `}
      </style>
    </>
  );
};

export default ContactList;