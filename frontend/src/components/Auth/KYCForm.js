import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Calendar, FileText } from 'lucide-react';
import Button from '../Common/Button';
import Input from '../Common/Input';
import './Auth.css';

const KYCForm = () => {
  const [formData, setFormData] = useState({
    panNumber: '',
    aadharNumber: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    annualIncome: '',
  });
  const [documents, setDocuments] = useState({
    panCard: null,
    aadharFront: null,
    aadharBack: null,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    setDocuments({
      ...documents,
      [docType]: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate KYC submission
    setTimeout(() => {
      alert('KYC submitted successfully! Your account will be activated within 24-48 hours.');
      navigate('/dashboard');
      setLoading(false);
    }, 2000);
  };

  const documentTypes = [
    {
      key: 'panCard',
      label: 'PAN Card',
      acceptedTypes: 'image/*,.pdf',
      required: true,
    },
    {
      key: 'aadharFront',
      label: 'Aadhar Card (Front)',
      acceptedTypes: 'image/*,.pdf',
      required: true,
    },
    {
      key: 'aadharBack',
      label: 'Aadhar Card (Back)',
      acceptedTypes: 'image/*,.pdf',
      required: true,
    },
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Complete KYC</h2>
          <p>Complete your KYC to start investing</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="kyc-section">
            <h3 className="section-title">Personal Details</h3>
            
            <Input
              label="PAN Number"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="Enter PAN Number"
              required
              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
              helperText="Format: ABCDE1234F"
            />
            
            <Input
              label="Aadhar Number"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleChange}
              placeholder="Enter 12-digit Aadhar"
              required
              pattern="[0-9]{12}"
              maxLength="12"
            />
            
            <Input
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              icon={<Calendar size={18} />}
            />
          </div>

          <div className="kyc-section">
            <h3 className="section-title">Address Details</h3>
            
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
              multiline
            />
            
            <div className="form-row">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
              <Input
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
                pattern="[0-9]{6}"
                maxLength="6"
              />
            </div>
          </div>

          <div className="kyc-section">
            <h3 className="section-title">Financial Details</h3>
            
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter your occupation"
              required
            />
            
            <Input
              label="Annual Income (₹)"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              placeholder="Enter annual income"
              required
              type="number"
              helperText="Select your income range"
            />
          </div>

          <div className="kyc-section">
            <h3 className="section-title">Upload Documents</h3>
            
            {documentTypes.map((doc) => (
              <div key={doc.key} className="file-upload">
                <label className="file-label">
                  <Upload size={18} />
                  <span>{doc.label} {doc.required && '*'}</span>
                </label>
                <input
                  type="file"
                  accept={doc.acceptedTypes}
                  onChange={(e) => handleFileChange(e, doc.key)}
                  required={doc.required}
                  className="file-input"
                />
                {documents[doc.key] && (
                  <div className="file-preview">
                    <FileText size={16} />
                    <span>{documents[doc.key].name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="kyc-terms" required />
            <label htmlFor="kyc-terms">
              I declare that the information provided is true and correct to the best of my knowledge
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Submit KYC
          </Button>
        </form>
      </div>
    </div>
  );
};

export default KYCForm;