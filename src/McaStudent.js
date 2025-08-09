import React from 'react';

const McaStudent = () => {
  return (
    <div className="form-box">
      <h2>MCA Students</h2>
      <form>
        <input type="email" placeholder="MCA Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
};

export default McaStudent;
