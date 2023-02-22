import { Link } from "react-router-dom";
import styles from "./Button.module.css";

const Button = (props) => {
  if (props.to) {
    return (
      <Link to={props.to} className={`${styles.button} ${props.className} ${props.leftIcon ? styles.leftIcon : ''} ${props.rightIcon ? styles.rightIcon : ''}`}>
        {props.leftIcon && <span className={`material-symbols-outlined ${styles.icon}`}>{props.leftIcon}</span>}
        {props.children}
        {props.rightIcon && <span className={`material-symbols-outlined ${styles.icon}`}>{props.rightIcon}</span>}
      </Link>
    )
  }

  return (
    <button className={`${styles.button} ${props.className} ${props.leftIcon ? styles.leftIcon : ''} ${props.rightIcon ? styles.rightIcon : ''}`} onClick={props.onClick} type={props.type}>
      {props.leftIcon && <span className={`material-symbols-outlined ${styles.icon}`}>{props.leftIcon}</span>}
      {props.children}
      {props.rightIcon && <span className={`material-symbols-outlined ${styles.icon}`}>{props.rightIcon}</span>}
    </button>
  )
}

export default Button;