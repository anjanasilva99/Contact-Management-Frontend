import { useState, useEffect, useCallback } from "react";
import { contactService } from "../services/contactService";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll(searchTerm);
      setContacts(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchContacts();
      },
      searchTerm ? 300 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [fetchContacts, searchTerm]);

  return {
    contacts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    setContacts,
  };
};
