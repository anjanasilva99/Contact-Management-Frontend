import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/contacts";

export default function ContactForm() {
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch contact data if editing
  useEffect(() => {
    if (id) {
      const fetchContact = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          setContact(response.data.data);
        } catch (error) {
          console.error("Error fetching contact:", error);
        }
      };
      fetchContact();
    }
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user starts typing
  };

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!contact.name.trim()) {
      newErrors.name = "Name is required.";
    }

    // Email validation
    if (!contact.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Phone validation (optional but must be valid if provided)
    if (contact.phone && !/^\d{10}$/.test(contact.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    // Remove unnecessary fields before sending data
    const { id: _, createdAt, phone, ...sanitizedContact } = contact;

    // Exclude phone if it's empty
    if (phone.trim()) {
      sanitizedContact.phone = phone;
    }

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

  // Show delete confirmation popup
  const handleDeleteClick = () => {
    setShowDeletePopup(true);
  };

  // Delete the contact after confirmation
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting contact:", error);
    } finally {
      setShowDeletePopup(false);
    }
  };

  return (
    <div className="card p-4">
      <h4>{id ? "Edit Contact" : "Add Contact"}</h4>
      <form onSubmit={handleSubmit} noValidate>
        {" "}
        {/* Disable browser validation */}
        {/* Name Field */}
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            className="form-control"
          />
          {errors.name && <div className="error-box">{errors.name}</div>}
        </div>
        {/* Email Field */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <div className="error-box">{errors.email}</div>}
        </div>
        {/* Phone Field */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={contact.phone}
            onChange={handleChange}
            className="form-control"
          />
          {errors.phone && <div className="error-box">{errors.phone}</div>}
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Add"} Contact
        </button>
        {id && (
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
      </form>

      {showDeletePopup && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this contact?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeletePopup(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for error messages */}
      <style>
        {`
          .error-box {
            background-color: #ffdddd;
            color: #d8000c;
            padding: 8px;
            border-radius: 5px;
            margin-top: 5px;
            font-size: 14px;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
}
