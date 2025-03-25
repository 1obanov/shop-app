import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to={`/`} className="logo">
          Cartify
        </Link>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} All rights reserved. Created by
            <a
              className=""
              href="https://www.linkedin.com/in/ihor-lobanov/"
              target="_blank" rel="noreferrer"
            >
              Ihor Lobanov.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
