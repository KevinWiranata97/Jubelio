import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <>
      <aside className="main-sidebar  sidebar-light-primary elevation-4">
        {/* Brand Logo */}
        <div className="d-flex justify-content-center">
          <img
            src="/jubelio.png"
            alt="AdminLTE Logo"
            style={{ opacity: "0.8", width: "90%" }}
          />
        </div>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="user"
              />
            </div>
            <div className="info">
              <a href="/" className="d-block">
                {localStorage.getItem("name")}
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}

              <li className="nav-header">Menus</li>
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </Link> 
           </li>
              <li className="nav-item">
                <Link
                  onClick={() => localStorage.clear()}
                  to="/login"
                  className="nav-link"
                >
                  <i className="nav-icon fa-solid fa-power-off" />
                  <p>Logout</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
}
