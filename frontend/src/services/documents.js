import api from './api';

export const documentService = {
  // Document Management
  uploadDocument: (documentData) => {
    const formData = new FormData();
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key]);
    });
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getDocuments: () => api.get('/documents'),
  getDocumentById: (documentId) => api.get(`/documents/${documentId}`),
  deleteDocument: (documentId) => api.delete(`/documents/${documentId}`),
  
  // KYC Documents
  uploadKYCDocument: (documentData) => {
    const formData = new FormData();
    Object.keys(documentData).forEach(key => {
      formData.append(key, documentData[key]);
    });
    return api.post('/documents/kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getKYCDocuments: () => api.get('/documents/kyc'),
  verifyKYCDocument: (documentId, status) => 
    api.put(`/documents/kyc/${documentId}/verify`, { status }),
  
  // Templates
  getDocumentTemplates: () => api.get('/documents/templates'),
  downloadTemplate: (templateId) => 
    api.get(`/documents/templates/${templateId}/download`),
};