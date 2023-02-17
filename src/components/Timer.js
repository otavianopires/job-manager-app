const Timer = (props) => {
  return (
    <span className="timer">
      <span className="digits">
        <b>{("0" + Math.floor((props.time / 3600000) % 60)).slice(-2)}</b>:
      </span>
      <span className="digits">
      <b>{("0" + Math.floor((props.time / 60000) % 60)).slice(-2)}</b>:
      </span>
      <span className="digits">
      <b>{("0" + Math.floor((props.time / 1000) % 60)).slice(-2)}</b>
      </span>
    </span>
  );
}
export default Timer;