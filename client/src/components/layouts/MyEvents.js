
import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import '../styles/MyEvent.css';
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap';
const NavList = [{ name: "Home", path: "/" }, { name: "My Events", path: "/myEvents" }, { name: "Event List", path: "/eventList" }];

export default function MyEvents() {
    const [registerEventList, setRegisterEventList] = useState([]);
    const [registrationList, setRegistrationList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            if (response.status === 200) {
                const data = await response.json();
                setRegistrationList(data.data.registration);
                setRegisterEventList(data.data.events);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <Navbar NavList={NavList} />
            {loading ? <div style={{ marginTop: "6rem" }}><Spinner animation="border" /></div> : <div className='myEvent_container'>{registerEventList.map((event, index) => <EventCard key={index} event={event} ticket={registrationList[registerEventList.length - (index + 1)].registrationCode} />)}
            </div>}

        </div>
    )
}
