import React ,{useState}from 'react';

const StudentLogin = () => {
        const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
      const handleLogin = async () => {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
    
      const data = await response.json();
      if (data.success) {
        console.log('Login Success:', data.role);
      } else {
        alert('Invalid credentials');
      }
    };
  return (
    <div className="form-box">
      <h2>Student Login</h2>
      <form>
        <input type="email" placeholder="Student Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
};

export default StudentLogin;
