import { Link } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

export const Navbar = () => {
  let navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{
        fontFamily: "sans-serif",
        fontFamily: "Audiowide",
        fontWeight: "500",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <h3 className="mx-2">iNoteBook</h3>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home <span className="sr-only"></span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            <form className="d-flex">
              <Link className="btn btn-primary mx-2" to="/login" role="button">
                Login
              </Link>
              <Link className="btn btn-danger mx-2" to="/signup" role="button">
                SignUp
              </Link>
            </form>
          ) : (
            <Link onClick={handleLogout} className="btn btn-warning mx-2" to="/login" role="button">
              LogOut
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
