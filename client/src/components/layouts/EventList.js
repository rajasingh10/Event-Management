import React, { useState, useEffect } from 'react'
import "../styles/EventList.css";
import EventCard from './EventCard';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from './Navbar';
import { Spinner } from 'react-bootstrap';
const NavList = [{ name: "Home", path: "/" }, { name: "My Events", path: "/myEvents" }, { name: "Event List", path: "/eventList" }];
export default function EventList() {
    const [search, setSearch] = useState("");
    const [eventList, setEventList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        HandleEventList();
    }, [])


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
            }

        } catch (error) {
            // alert(error);
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (e.target.value !== '') {

            const results = eventList.filter((event) => {
                return event.name.toLowerCase().includes(e.target.value.trim().toLowerCase());
            });
            setEventList(results);
        }
        else {
            HandleEventList();
        }
    }

    return (
        <div>
            <Navbar NavList={NavList} />

            <div className='eventList_container'>
                {loading ? <div style={{ marginTop: "6rem" }}><Spinner animation="border" /></div> : <> <div class="searchInputWrapper">
                    <input class="searchInput" type="text" placeholder='focus here to search' value={search} onChange={handleSearch} />

                </div>

                    {eventList.map((event, index) => <EventCard key={index} event={event} />)}</>}

            </div>
        </div>
    )
}
