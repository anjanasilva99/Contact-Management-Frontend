import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './ContactForm.css';
import config from "../config/config";
import { validateContact } from "../utils/validationUtils";

const { API_URL } = config;

export default function ContactForm() {
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
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
    const { isValid, errors: newErrors } = validateContact(contact);
    setErrors(newErrors);
    return isValid;
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

  return (
    <div className="contact-form">
    <div className="card p-4">
      <h4>{id ? "Edit Contact" : "Add Contact"}</h4>
      <form onSubmit={handleSubmit} noValidate>
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

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            {id ? "Update" : "Add"} Contact
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
