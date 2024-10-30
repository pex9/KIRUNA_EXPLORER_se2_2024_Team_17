import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function DocumentsRoute() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const fetchedDocuments = await API.getDocuments(); // Fetch all documents
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    fetchDocuments();
  }, []);

  // Function to handle row click, navigating to the document's detail view
  const handleRowClick = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  return (
    <div className="documents-route">
      <h2>All Documents</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Scale</th>
            <th>Issuance Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} onClick={() => handleRowClick(doc.id)}>
              <td>{doc.title}</td>
              <td>{doc.scale}</td>
              <td>{doc.issuanceDate}</td>
              <td>{doc.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentsRoute;
