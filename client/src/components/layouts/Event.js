import React, { useState, useEffect } from 'react';
import "../styles/Event.css";
import { useLocation } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const NavList = [{ name: "Home", path: "/" }, { name: "My Events", path: "/myEvents" }, { name: "Event List", path: "/eventList" }];

export default function Event() {
    const location = useLocation();
    const [event, setEvent] = useState({});
    const [registerEventList, setRegisterEventList] = useState([]);
    const [alreadyRegistered, setAlreadyRegistered] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HandleEvent();
        registeredEvent();
    }, [])

    const registeredEvent = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/student/events/getRegisteredEvents`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            // console.log(data.data.events[0]._id);
            if (response.status === 200) {
                data.data.events.map((event) => {
                    if (event._id === location.state.id) {
                        setAlreadyRegistered(true);
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }


    const HandleEvent = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/student/events/${location.state.id}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                setEvent(data.data.event);
                setLoading(false);
            }
            // console.log(data.data.event);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRegister = async () => {
        try {

            const response = await fetch(`http://localhost:3000/api/student/events/${location.state.id}/register`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                alert("Successfully registered for the event")
                setAlreadyRegistered(true);
            }
            else {
                alert("Failed to register for the event")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Navbar NavList={NavList} />
            {loading ? <div style={{ marginTop: "6rem" }}><Spinner animation="border" /></div> : <div class="event_container">
                <div class="blog-card blog-card-blog">
                    <div class="blog-card-image">
                        <img class="img" src={event.image} />
                    </div>
                    <div class="blog-table">
                        <div className="topContent">
                            <div className="topContent_left">< CalendarTodayIcon />{event.date?.substring(8, 10)} {month[parseInt(event.date?.substring(5, 7))]?.toUpperCase()}, FROM {event.time}</div>
                            <h1 class="blog-card-caption">
                                {event.name}
                            </h1>
                            <div className="topContent_right"><LocationOnIcon />{event.venue?.toUpperCase()} </div>
                        </div>
                        <div className="middleContent">
                            <div className="middleContentTop">
                                <p>{event.description}</p>
                            </div>
                            <div className="middleContentBottom">
                                <h4>Rules</h4>
                                {event.rules?.map((rule, index) => <p>{index + 1}. {rule}</p>)}
                            </div>
                        </div>

                        <div class="bottomContent">
                            <div className="bottomContent_left"><EmojiEventsIcon />{event.prize}</div>
                            <div className="bottomContent_right">{alreadyRegistered ? <h3 style={{ border: "1px solid gray", borderRadius: "5px", padding: "5px", backgroundColor: "darkgrey" }}>Registered</h3> : <button onClick={handleRegister}>Register</button>}</div>
                        </div>
                    </div>
                </div>


            </div>}

        </div>
    )
}
