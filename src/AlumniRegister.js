import React, { useState } from 'react';
import './AlumniRegister.css'; // Using the new stylesheet
import backendUrl from './config';

const AlumniRegister = () => {
    // All existing state and form logic is preserved
    const [formData, setFormData] = useState({
        photo: null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        graduationYear: '',
        linkedin: '',
        github: '',
        currentWorkplace: { institution: '', designation: '' },
        experiences: [{ institution: '', years: '', designation: '' }],
        pgCertificate: null,
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    const handleCurrentWorkplaceChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, currentWorkplace: { ...formData.currentWorkplace, [name]: value } });
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const newExperiences = [...formData.experiences];
        newExperiences[index][name] = value;
        setFormData({ ...formData, experiences: newExperiences });
    };

    const addExperience = () => {
        setFormData({ ...formData, experiences: [...formData.experiences, { institution: '', years: '', designation: '' }] });
    };

    const removeExperience = (index) => {
        const newExperiences = formData.experiences.filter((_, i) => i !== index);
        setFormData({ ...formData, experiences: newExperiences });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (formData.password !== formData.confirmPassword) {
            setMessage("Passwords do not match. Please try again.");
            return;
        }
        setIsSubmitting(true);
        const submissionData = new FormData();
        // Append all form data (no changes to this logic)
        Object.keys(formData).forEach(key => {
            if (key === 'currentWorkplace' || key === 'experiences') {
                submissionData.append(key, JSON.stringify(formData[key]));
            } else {
                submissionData.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${backendUrl}/alumni/register`, {
                method: 'POST',
                body: submissionData,
            });
            const result = await response.json();
            setMessage(result.message || (response.ok ? 'Registration successful!' : 'An error occurred.'));
        } catch (error) {
            console.error('Submission Error:', error);
            setMessage('A network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    // The JSX is updated for new styling but maintains all functionality
    return (
        <div className="alumni-register-container">
            <div className="alumni-form-wrapper">
                <div className="alumni-form-header">
                    <h1>Alumni Registration</h1>
                    <p>Join the network by filling out the form below.</p>
                </div>
                <form onSubmit={handleSubmit} className="alumni-form">
                    {/* --- Personal Information --- */}
                    <div className="form-section">
                        <h2 className="section-title">Personal Information</h2>
                        <div className="form-group photo-upload">
                            <label htmlFor="photo">Profile Photo</label>
                            <input type="file" id="photo" name="photo" accept="image/*" onChange={handleFileChange} />
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
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                            </div>
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
                    </div>

                    {/* --- Professional Details --- */}
                    <div className="form-section">
                        <h2 className="section-title">Professional Details</h2>
                        <div className="experience-block">
                            <h4>Current Workplace</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Institution/Company</label>
                                    <input type="text" name="institution" value={formData.currentWorkplace.institution} onChange={handleCurrentWorkplaceChange} />
                                </div>
                                <div className="form-group">
                                    <label>Current Designation</label>
                                    <input type="text" name="designation" value={formData.currentWorkplace.designation} onChange={handleCurrentWorkplaceChange} />
                                </div>
                            </div>
                        </div>
                        <h4>Past Work Experience</h4>
                        {formData.experiences.map((exp, index) => (
                            <div key={index} className="experience-block">
                                {formData.experiences.length > 1 && (
                                    <button type="button" className="remove-experience-btn" onClick={() => removeExperience(index)}>&times;</button>
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
                                <div className="form-group">
                                    <label>Designation</label>
                                    <input type="text" name="designation" value={exp.designation} onChange={(e) => handleExperienceChange(index, e)} />
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-experience-btn" onClick={addExperience}>+ Add Past Experience</button>
                    </div>

                    {/* --- Verification --- */}
                    <div className="form-section">
                        <h2 className="section-title">Verification</h2>
                        <div className="form-group certificate-upload">
                            <label htmlFor="pgCertificate">MCA PG Certificate </label>
                            <input type="file" id="pgCertificate" name="pgCertificate" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
                            <small>Please upload your degree certificate. PDF or image formats are accepted.</small>
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                {message && <p className="form-message">{message}</p>}
            </div>
        </div>
    );
};

export default AlumniRegister;
