import React, { useState, useEffect } from 'react';
import "../styles/Register.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';



export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        branch: "none"
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

            const { firstName, lastName, email, password, phone, branch } = user;


            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName, lastName, email, password, phone, branch
                })
            })
            const data = await response.json();
            // console.log(response.status)
            if (response.status == 201) {
                setUserId(data.data.student._id)
                setPopUp(true)
            }
            else if (response.status == 409) {
                toast.error(data.error)

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
            // console.log(data)
            if (response.status == 201) {
                setPopUp(false);
                toast.success(data.data.message)

                navigate('/');
            }
            else {
                // alert(data.error)

            }
            setOtp("");

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="mainContainer">
            <div className="registerContainer">
                <div className="title">Sign Up</div>
                <div className="content">
                    <form>
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">First Name</span>
                                <input type="text" placeholder="Enter your first name" required name='firstName' value={user.firstName} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Last Name</span>
                                <input type="text" placeholder="Enter your last name" required name='lastName' value={user.lastName} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Email</span>
                                <input type="email" placeholder="Enter your email" required name='email' value={user.email} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Password</span>
                                <input type="password" placeholder="Enter your password" name='password' required value={user.password} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Phone Number</span>
                                <input type="text" pattern="[789][0-9]{9}" placeholder="Enter your number" name='phone' required value={user.phone} onChange={handleInputs} />
                            </div>
                            <div className="input-box">
                                <span className="details">Branch</span>
                                <select value={user.branch} name='branch' onChange={handleInputs}>
                                    <option value="none" selected disabled hidden>Select an Option</option>
                                    <option value="CSE">Computer Science Engineering</option>
                                    <option value="IS">Information Science </option>
                                    <option value="ECE">Electronics and Communications Engineering</option>
                                    <option value="ME">Mechanical Engineering</option>
                                    <option value="EEE">Electrical and Electronics Engineering</option>
                                    <option value="MCA">Master of Computer Application</option>
                                </select>
                            </div>
                        </div>

                        <div className="button">
                            <input type="submit" onClick={PostData} value="submit" />
                        </div>
                    </form>
                    <div class="footer">

                        <p>Already have an Account? <Link to="/login">SignIn</Link></p>
                    </div>
                </div>
            </div>
            {popUp && <div id="popup1" class="overlay">
                <div class="popup">

                    <p class="close" onClick={() => setPopUp(false)}>&times;</p>
                    <div class="content">
                        <h6>Please enter the one time password <br /> to verify your account</h6>
                        <div> <span>A code has been sent to</span> <small>{`${user?.email}`}</small> </div>
                        <div className="popInput">

                            <input type="text" placeholder="Enter OTP" required name='otp' value={otp} onChange={(e) => setOtp(e.target.value)} />
                            <div className="inputButton" style={{ marginTop: "4px" }}>
                                <Button variant="primary" onClick={handleOtp}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

        </div>

    )
}
