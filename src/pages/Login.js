import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { fetchData } from "../lib/helpers";
import styles from "./Login.module.css";

const Login = () => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState(null);

  const { setToken, setUser} = useUser();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchData(`${process.env.REACT_APP_API_URL}/auth/local`, loginData, 'POST')
      .then((response) => {
        if (typeof response.jwt !== 'undefined' && response.user.blocked === false) {
          console.log(response);
          setToken(response.jwt);
          setUser(response.user);
        } else if (response.error !== null) {
          console.log(response.error);
          setErrors(response.error);
        }
      });
  }

  const alertError = () => {
    if ( errors !== null && errors.details.hasOwnProperty('errors') ) {
      return (
        <ul>
          {errors.details.errors.map( (error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      )
    }
  }

  return (
    <>
      <h2>Login</h2>
      {errors && <p>{errors.message}</p>}
      {alertError()}
      <form onSubmit={handleLogin} className="w-full max-w-lg">
        <div className="flex flex-col">
          <label htmlFor="identifier">Email</label>
          <input
            type="email"
            id="identifier"
            name="identifier"
            placeholder="Email"
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login;