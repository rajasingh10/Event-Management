import React, { useState, useEffect } from 'react';
import "../styles/Home.css";
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import TimeLine from './TimeLine';
import Navbar from './Navbar';

const NavList = [{ name: "Home", path: "/" }, { name: "My Events", path: "/myEvents" }, { name: "Event List", path: "/eventList" }];

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);

    const [eventList, setEventList] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        handleLogin()
        HandleEventList();
    }, [])

    const handleLogin = async () => {
        try {

            const response = await fetch("http://localhost:3000/api/auth/isLogin", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                const data = await response.json();
                if (data.data.verified == false) {
                    setPending(true);
                }
                else if (data.data.verified == true) {
                    setPending(false);
                }
                setIsLoggedIn(true);

            }
            else {
                // alert("not login")
            }
        } catch (error) {
            // alert(error);
        }

    }




    const HandleEventList = async () => {
        try {

            const response = await fetch("http://localhost:3000/api/student/events", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setEventList(data.data.events);
                setLoading(false);
            } else {
                // alert("error");
            }
        } catch (error) {
            // alert(error);
        }

    }

    return (
        <div> <Navbar NavList={NavList} />
            {pending && <h2>"Your Account is in Pending, contact your faculty to verify"</h2>}
            {loading ? <div style={{ marginTop: "6rem" }}><Spinner animation="border" /></div> : <> <div id="slider">
                <figure>
                    <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" alt />
                    <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt />
                    <img src="https://images.unsplash.com/photo-1588083066783-8828e623bad7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt />
                    <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt />
                    <img src="https://images.unsplash.com/photo-1588083066783-8828e623bad7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt />

                </figure>
            </div>
                <TimeLine eventList={eventList} />
            </>}

        </div>
    )
}
