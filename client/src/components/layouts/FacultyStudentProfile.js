import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import EventCard from './EventCard';
import Navbar from './Navbar'
import "../styles/FacultyStudentProfile.css";

const NavList = [{ name: "Home", path: "/facultyHome" }, { name: "Student", path: "/facultyStudent" }];

export default function FacultyStudentProfile({ id }) {
    const [eventList, setEventList] = useState([]);
    const [registrationList, setRegistrationList] = useState([]);
    const location = useLocation();
    const { firstName, lastName } = location.state;

    useEffect(() => {
        HandleEventList();
        // console.log(location.state.id);
    }, [])


    const HandleEventList = async () => {
        try {

            const response = await fetch(`http://localhost:3000/api/faculty/student/${location.state.id}/getRegisteredEvents`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status == 200) {
                setEventList(data.data.events);
                setRegistrationList(data.data.registrations);
                // console.log(data.data.events);
            }
            else {
                console.log(data.error);
            }
        } catch (error) {
            // alert(error);
        }
    }
    return (
        <div><Navbar NavList={NavList} /><div className="facultyStudentProfile">{eventList?.map((event, index) => <EventCard key={index} event={event} ticket={registrationList[eventList.length - (index + 1)].registrationCode} />)}</div></div>
    )
}
