import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'
import '../styles/Navbar.css'


export default function Navbar({ NavList }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        handleLogin()
    }, [])

    const handleLogin = async () => {
        const response = await fetch("http://localhost:3000/api/auth/isLogin", {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 201) {
            const data = await response.json();
            setIsLoggedIn(true);
        }

    }

    const handleLogOut = async () => {
        const response = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        }
        );

        const data = await response.json();

        if (response.status == 201) {
            // console.log("Logout Successful");
            setIsLoggedIn(false);
            navigate("/login");
        }
        else {
            console.log("Logout Failed");
        }
    }
    return (
        <nav class="navbar">
            <div class="navbar-container nav-container">
                <input type="checkbox" name="" id="" />
                <div class="hamburger-lines">
                    <span class="line line1"></span>
                    <span class="line line2"></span>
                    <span class="line line3"></span>
                </div>
                <ul class="menu-items">
                    {isLoggedIn && NavList.map((item, index) => <li key={index}><Link to={item.path}>{item.name}</Link></li>)}
                    <li> <Link
                        to='#'
                        onClick={(e) => {
                            window.location.href = "mailto:rajasingh8889@gmail.com";
                            e.preventDefault();
                        }}
                    >
                        Support
                    </Link></li>
                    {isLoggedIn ? <li onClick={handleLogOut}>Logout</li> : <Link to="/login"><li>Login</li></Link>}
                    {/* <li onClick={handleLogOut}>LogOut</li>
                    <li onClick={handleLogOut}>LogIn</li> */}
                </ul>
                <h1 class="logo">EM</h1>
            </div>
        </nav>
    )
}
