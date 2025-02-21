import { useState, useEffect, useCallback } from "react";
import { contactService } from "../services/contactService";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll(searchTerm);
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchContacts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    setContacts,
  };
};
