import React, { useState } from 'react';
import './AlumniRegister.css';

const AlumniRegister = () => {
  const [formData, setFormData] = useState({
    photo: null,
    firstName: '',
    lastName: '',
    email: '',
    graduationYear: '',
    linkedin: '',
    github: '',
    experiences: [{ institution: '', years: '', designation: '', role: '' }],
    pgCertificate: null,
  });

  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperiences = [...formData.experiences];
    newExperiences[index][name] = value;
    setFormData({ ...formData, experiences: newExperiences });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [...formData.experiences, { institution: '', years: '', designation: '', role: '' }],
    });
  };

  const removeExperience = (index) => {
    const newExperiences = formData.experiences.filter((_, i) => i !== index);
    setFormData({ ...formData, experiences: newExperiences });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // --- Form submission logic will go here ---
    // You'll likely use FormData to send the files and data to your backend
    console.log('Form Data:', formData);
    setMessage('Registration submitted successfully! (This is a placeholder)');
  };

  // Generate years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="alumni-register-container">
      <div className="alumni-form-wrapper">
        <div className="alumni-form-header">
          <img src="/university-logo.png" alt="University Logo" className="university-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <h1>Alumni Registration Form</h1>
        </div>
        <form onSubmit={handleSubmit} className="alumni-form">
          <div className="form-group photo-upload">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="graduationYear">Year of Graduation</label>
            <select id="graduationYear" name="graduationYear" value={formData.graduationYear} onChange={handleInputChange} required>
              <option value="" disabled>Select Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn Profile URL</label>
              <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourname" />
            </div>
            <div className="form-group">
              <label htmlFor="github">GitHub Profile URL</label>
              <input type="url" id="github" name="github" value={formData.github} onChange={handleInputChange} placeholder="https://github.com/yourusername" />
            </div>
          </div>
          
          <h2 className="section-title">Work Experience</h2>
          {formData.experiences.map((exp, index) => (
            <div key={index} className="experience-block">
               {formData.experiences.length > 1 && (
                 <button type="button" className="remove-experience-btn" onClick={() => removeExperience(index)}>
                   &times;
                 </button>
               )}
              <div className="form-row">
                <div className="form-group">
                  <label>Institution/Company</label>
                  <input type="text" name="institution" value={exp.institution} onChange={(e) => handleExperienceChange(index, e)} />
                </div>
                 <div className="form-group">
                  <label>Years</label>
                  <input type="text" name="years" value={exp.years} onChange={(e) => handleExperienceChange(index, e)} placeholder="e.g., 2020-2022" />
                </div>
              </div>
              <div className="form-row">
                 <div className="form-group">
                  <label>Designation</label>
                  <input type="text" name="designation" value={exp.designation} onChange={(e) => handleExperienceChange(index, e)} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input type="text" name="role" value={exp.role} onChange={(e) => handleExperienceChange(index, e)} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="add-experience-btn" onClick={addExperience}>
            + Add Another Experience
          </button>

          <div className="form-group certificate-upload">
            <label htmlFor="pgCertificate">MCA PG Certificate (Mandatory)</label>
            <input
              type="file"
              id="pgCertificate"
              name="pgCertificate"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            <small>Please upload your degree certificate. PDF or image formats are accepted.</small>
          </div>

          <button type="submit" className="submit-btn">Register</button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default AlumniRegister;

