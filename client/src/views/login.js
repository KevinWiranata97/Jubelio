import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
export default function LoginViews() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const dataLogin = {
        username,
        password,
      };

      const response = await axios({
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/login`,
        data: dataLogin,
      });


   
      if (response.request.status === 200) {
        localStorage.setItem("authorization", response.data.authorization);

        localStorage.setItem("name", response.data.name);
    
        navigate("/dashboard");
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Login Error",
        html: error.response.data.message,
      });
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        {/* /.login-logo */}
        <div className="card card-outline card-primary">
          <div className=" text-center">
            <img
              src="/jubelio.png"
              alt="jubelio-logo"
              className="img-thumbnail text-center"
            ></img>
          </div>
          <div className="card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <form className="mx-auto pt-3" onSubmit={login}>
              <div className="form-group">
                <div className="input-group">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="form-control"
           
                
                    placeholder="Enter username"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Password"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                  </div>
                </div>
              </div>

               
            <div className="flex items-center justify-between mt-6 mb-3">
              
              <Link to="/register" >Dont have an account?<span className="text-red-500 ml-1 hover:text-slate-600">Register now</span></Link>
            </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                Sign in
              </button>
            </form>

            
          </div>

          
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </div>
    </div>
  );
}
