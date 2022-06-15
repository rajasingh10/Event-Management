import React, { useState } from 'react';
import "../styles/Login.css";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';


export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
        role: ""
    })
    const [userId, setUserId] = useState();
    const [otp, setOtp] = useState();
    const [popUp, setPopUp] = useState(false);

    const handleInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUser({ ...user, [name]: value });
    }

    const PostData = async (e) => {
        e.preventDefault();
        try {

            const { email, password, role } = user;
            // console.log(email, password, role)

            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password, role
                })
            })

            const data = await response.json();

            if (response.status == 201) {
                toast.success(data.data.message)

                if (data.data.role == "Admin") {

                    navigate("/adminHome");
                }
                else if (data.data.role == "Student") {
                    navigate("/")
                } else if (data.data.role == "Faculty") {
                    navigate("/facultyHome")
                }
                window.location.reload();
            }
            else if (response.status == 401) {
                // console.log(data.error.userId)
                toast.error(data.error.error)

                setUserId(data.error.userId);
                HandleResendOtp();
                setPopUp(true)
            }
            else {
                // alert(data.error)
            }
        } catch (error) {
            // alert(error)
        }


    }

    const HandleResendOtp = async () => {
        try {
            const { email } = user;
            const response = await fetch("http://localhost:3000/api/auth/resendOtpVerificationCode", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId, email
                })

            });
            const data = await response.json();

            if (response.status == 401) {
                // alert(data.error)
            }

        } catch (error) {
            // alert(error)
        }
    }



    const handleOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/verifyOtp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId, otp
                })
            })
            const data = await response.json();
            if (response.status == 201) {
                setPopUp(false);
                toast.success(data.data.message);
                navigate('/login');
            }
            else {
                // alert(data.error)

            }
            setOtp("");

        } catch (error) {
            // alert(error)
        }

    }

    return (
        <div className="mainContainer">
            <div className="loginContainer">
                <div className="title">Sign In</div>
                <div className="content">
                    <form>
                        <div class="role-details">
                            <input type="radio" name="role" id="dot-1" value="Student" onChange={handleInputs} />
                            <input type="radio" name="role" id="dot-2" value="Faculty" onChange={handleInputs} />
                            <input type="radio" name="role" id="dot-3" value="Admin" onChange={handleInputs} />
                            <div class="category">
                                <label for="dot-1">
                                    <span class="dot one"></span>
                                    <span class="role">Student</span>
                                </label>
                                <label for="dot-2">
                                    <span class="dot two"></span>
                                    <span class="role">Faculty</span>
                                </label>
                                <label for="dot-3">
                                    <span class="dot three"></span>
                                    <span class="role">Admin</span>
                                </label>
                            </div>
                        </div>

                        <div className="user-details">

                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="email" placeholder="Enter your email" required name='email' value={user.email} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="password" placeholder="Enter your password" name='password' required value={user.password} onChange={handleInputs} />
                            </div>
                        </div>


                        <div className="button">
                            <input type="submit" onClick={PostData} value="submit" />
                        </div>
                    </form>
                    <div class="footer">

                        <p>Don't have an Account? <Link to="/register">SignUp</Link></p>
                    </div>
                </div>
            </div >
            {popUp && <div id="popup1" class="overlay">
                <div class="popup">

                    <p class="close" onClick={() => setPopUp(false)}>&times;</p>
                    <div class="content">
                        <div className="input-box">
                            <h6>Please enter the one time password <br /> to verify your account</h6>
                            <div> <span>A code has been sent to</span> <small>{`${user.email}`}</small> </div>
                            <input type="text" placeholder="Enter OTP" required name='otp' value={otp} onChange={(e) => setOtp(e.target.value)} />
                            <button onClick={handleOtp}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>}

        </div >
    )
}
