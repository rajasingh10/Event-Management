import React from 'react'
import "../styles/EventCard.css";
import { Link, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default function EventCard({ event, ticket }) {
    const navigate = useNavigate();

    const handleViewMore = (id) => {
        navigate("/event", { state: { id: id } });
    }

    return (
        <div class="eventCard_container">
            <div class="event_bg"><img src={event.image} /></div>
            <div class="event_info">
                <div class="event_title">
                    <h4>{event.name}</h4>
                </div>
                <div class="event_desc">
                    {ticket ? <p><h4>Ticket No.</h4> <h2>{ticket}</h2></p> : <p>{event.description}</p>}
                </div>
                <div class="event_footer">
                    <div class="event_date">
                        <p>< CalendarTodayIcon />{event.date?.substring(8, 10)} {month[parseInt(event.date?.substring(5, 7))]?.toUpperCase()}, FROM {event.time}</p>
                    </div>

                    {ticket ? <div className="topContent_right"><LocationOnIcon />{event.venue?.toUpperCase()} </div> : <div class="event_more">
                        <p class="btn_more" onClick={() => handleViewMore(event._id)}>
                            View more
                        </p>
                    </div>}

                </div>
            </div>
        </div>
    )
}
