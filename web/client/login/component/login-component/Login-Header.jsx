import logo from "../../img/logo.jpg";

export default function Header(props) {
  return (
    <header className="header">
      <img className="sign-in-logo" src={logo} alt="Logo" width="100px" />
      <h1>{props.title}</h1>
    </header>
  );
}
