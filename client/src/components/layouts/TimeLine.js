import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/TimeLine.css";
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default function TimeLine({ eventList }) {
    const navigate = useNavigate();

    const handleViewMore = (id) => {
        navigate("/event", { state: { id: id } });
    }


    return (
        <div><div class="timeline-container">
            <div class="timeline">
                <ul>
                    {eventList.map((event, index) => <li key={index}>
                        <div class="timeline-content">
                            <h2 class="date">{event.date.substring(8, 10)} {month[parseInt(event.date.substring(5, 7))]}</h2>
                            <h2>{event.name}</h2>
                            <p>{event.description}</p>
                            <button className='View_button' onClick={() => handleViewMore(event._id)}>View More</button>
                        </div>
                    </li>)}

                </ul>
            </div>
        </div></div>
    )
}
