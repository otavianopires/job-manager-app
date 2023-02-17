import { useState } from "react";
import Button from "../components/Button";
import { useUser } from "../contexts/UserContext";
import { fetchData } from "../lib/helpers";
import styles from "./Login.module.css";

const Login = () => {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState(null);

  const { setToken, setUser, login} = useUser();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(loginData);
    if (typeof response.jwt !== 'undefined' && response.user.blocked === false) {
      setToken(response.jwt);
      setUser(response.user);
    } else {
      setErrors(response.error);
    }
  }

  const alertError = () => {
    if ( errors !== null && errors.details.hasOwnProperty('errors') ) {
      return (
        <ul className={styles.alert}>
          {errors.details.errors.map( (error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      )
    }
  }

  return (
    <>
      <h3 className={styles.loginTitle}>Login</h3>
      {errors && <p className={styles.alert}>{errors.message}</p>}
      {alertError()}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formControl}>
          <label htmlFor="identifier" className={styles.label}>Email</label>
          <input
            type="email"
            id="identifier"
            name="identifier"
            placeholder="Email"
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit" className={styles.button}>Login</Button>
      </form>
    </>
  )
}

export default Login;