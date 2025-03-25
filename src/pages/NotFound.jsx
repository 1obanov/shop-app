import { Link } from "react-router-dom";
import { House } from "lucide-react";

function NotFound() {
  return (
    <div className="section not-found">
      <div className="breadcrumb">
        <div className="container">
          <ul>
            <li className="breadcrumb__item">
              <Link to={`/`}>
                <House strokeWidth="2" size="16" />
                Home
              </Link>
            </li>
            <li className="breadcrumb__item active">Page Not Found</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="not-found__wrapper">
          <h2>404</h2>
          <h4>Oops! That page can’t be found.</h4>
          <p>
            Sorry, but the page you are looking for is not found. Please, make
            sure you have typed the current URL.
          </p>
          <Link to="/" className="btn">
            Go to home page
          </Link>
        </div>
      </div>
    </div>
  );
}

export { NotFound };
