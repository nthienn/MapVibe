import { Link } from "react-router";

const NotFound = () => {
  return (
    <>
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2>404 Not Found</h2>
              <nav id="breadcrumbs">
                <ul>
                  <Link to="/">Home</Link>
                  <li>404 Not Found</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <section id="not-found" className="center">
              <h2>
                404 <i className="fa fa-question-circle"></i>
              </h2>
              <p>
                We're sorry, but the page you were looking for doesn't exist.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
