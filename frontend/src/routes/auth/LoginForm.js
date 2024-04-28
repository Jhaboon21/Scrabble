import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../../common/Alert";

/** Login form that shows, manages, and update state of user */
function LoginForm({ login }) {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res = await login(formData);
      if (res.success) {
        navigate("/")
      } else {
        alert('Username/Password was incorrect.');
      }
    } catch (err) {
      setFormErrors(err);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3">Log In</h3>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              {formErrors.length
                ? <Alert type="danger" messages={formErrors} />
                : null}

              <button
                className="btn btn-primary"
                style={{ marginTop: '5px' }}
                onSubmit={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm;