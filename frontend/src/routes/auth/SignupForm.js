import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../common/Alert";

/** Signup form
 * on submission, redirect to homepage route
 */
function SignupForm({ signup }) {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res = await signup(formData);
      if (res.success) {
        navigate("/")
      } else {
        alert('Username/Email taken.');
      }
    } catch (err) {
      setFormErrors(err);
      alert('Username/Email taken.');
    }

    // reset
    setFormErrors([]);
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: ""
    });
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  return (
    <div className="SignupForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Sign Up</h2>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null
              }

              <button className="btn btn-primary" style={{ marginTop: '5px' }}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm;