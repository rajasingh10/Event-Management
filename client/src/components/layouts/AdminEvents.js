import React, { useEffect, useState, useMemo } from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'
import '../styles/AdminEvents.css'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import toast, { Toaster } from 'react-hot-toast';

const NavList = [{ name: "Home", path: "/adminHome" }, { name: "Events", path: "/adminEvents" }, { name: "Faculty", path: "/adminFaculty" }, { name: "Student", path: "/adminStudent" }];

export default function AdminEvents() {
    const [eventList, setEventList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCompleted, setFilterCompleted] = useState("");
    const [state, setState] = useState({});
    const [popUp, setPopUp] = useState(false);
    const [editType, setEditType] = useState(false);
    const [eventId, setEventId] = useState()

    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const eventPerPage = 3;


    useEffect(() => {
        HandleEventList();

    }, [])

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEvents / eventPerPage); i++) {
        pageNumbers.push(i);
    }


    function compareName(a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }
    function compareCategory(a, b) {
        if (a.category < b.category) {
            return -1;
        }
        if (a.category > b.category) {
            return 1;
        }
        return 0;
    }



    const eventData = useMemo(() => {
        let computedEvents = eventList;

        if (searchTerm) {
            computedEvents = computedEvents.filter(
                event =>
                    event.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
            );
        }

        if (filterCompleted === "name") {
            computedEvents = computedEvents.sort(compareName);
        }
        if (filterCompleted === "category") {
            computedEvents = computedEvents.sort(compareCategory);
        }

        setTotalEvents(computedEvents.length);

        //Current Page slice
        return computedEvents.slice(
            (currentPage - 1) * eventPerPage,
            (currentPage - 1) * eventPerPage + eventPerPage
        );
    }, [eventList, currentPage, searchTerm, filterCompleted]);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    const resetFilter = () => {
        setSearchTerm("");
        setFilterCompleted("");
        setCurrentPage(1);
    };

    const setEditValues = (event) => {

        setState({
            ...state,
            name: event.name,
            category: event.category,
            description: event.description,
            date: event.date,
            time: event.time,
            venue: event.venue,
            rules: event.rules,
            prize: event.prize,
            image: event.image,
            fees: event.fees,
            event_id: event._id,
        });
    };




    const HandleEventList = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/admin/event", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status == 200) {
                setEventList(data.data.events);
            }
            else {
                // alert(data.error)
            }

        }
        catch (err) {
            // alert(err);
        }

    }

    const deleteEvent = async (event_id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/event/${event_id}`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },

            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message);
                setPopUp(false)
                HandleEventList();
            }
            else {
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }



    const addEvent = async (e) => {
        e.preventDefault();
        try {
            const { name, category, description, date, time, venue, rules, prize, fees, image } = state;
            const response = await fetch(`http://localhost:3000/api/admin/event/`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, category, description, date, time, venue, rules, prize, fees, image
                })
            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)

                HandleEventList();
                setEditType(false);
                setState({
                    ...state,
                    name: "",
                    category: "",
                    description: "",
                    date: "",
                    time: "",
                    venue: "",
                    rules: [],
                    prize: "",
                    image: "",
                    fees: "",
                });

            }
            else {
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }

    const updateEvent = async (e) => {
        e.preventDefault();
        try {
            const { name, category, description, date, time, venue, rules, prize, fees, image } = state;
            const response = await fetch(`http://localhost:3000/api/admin/event/${state.event_id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, category, description, date, time, venue, rules, prize, fees, image
                })
            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)

                HandleEventList();
                setEditType(false);
                setState({
                    ...state,
                    name: "",
                    category: "",
                    description: "",
                    date: "",
                    time: "",
                    venue: "",
                    rules: [],
                    prize: "",
                    image: "",
                    fees: "",
                });

            }
            else {
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }

    const scrollDown = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }
    function scrollUp() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }



    return (
        <div><Navbar NavList={NavList} />
            <div className="adminEvents">
                <div className="searchInputWrapper">
                    <input
                        className="searchInput"
                        type="text"
                        id="search"
                        placeholder="Search Title"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                </div>
                <div className="my-3">

                    <select
                        className="form-select"
                        value={filterCompleted}
                        onChange={(e) => {
                            setFilterCompleted(e.target.value);
                            setCurrentPage(1);
                        }}
                        style={{ width: "200px", margin: "0 auto" }}
                    >
                        <option defaultValue="">Filter</option>
                        <option value="name">Event name</option>
                        <option value="category">Category</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="btn btn-danger btn-sm my-3"
                    onClick={resetFilter}
                >
                    Reset Filters
                </button>
                <div

                    style={{
                        boxShadow: "0px 10px 10px -5px rgba(0,0,0,0.5)",
                        backgroundColor: "white",

                    }}

                >



                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Poster</th>
                                <th scope="col">Event name</th>
                                <th scope="col">Overview</th>
                                <th scope="col">Category</th>
                                <th scope="col">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventData.map((event) => (
                                <tr>
                                    <td>
                                        {" "}
                                        <img
                                            src={event.image}
                                            alt=""
                                            width="100px"
                                            height="100px"
                                        />
                                    </td>
                                    <td><h6>{event.name}</h6></td>
                                    <td>{event.description.substring(0, 100)}...</td>
                                    <td>{event.category.toUpperCase()}</td>

                                    <td >

                                        <div style={{ cursor: "pointer" }} onClick={() => {
                                            setEditType(true);
                                            setEditValues(event);
                                            scrollDown();
                                        }}>
                                            <EditIcon />
                                        </div>
                                        <br />

                                        <div style={{ cursor: "pointer" }} className="delete" onClick={() => { setPopUp(true); setEventId(event._id) }}>
                                            <DeleteIcon />
                                        </div>

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>



                    <ul className="pagination">
                        {pageNumbers.map((number) => (
                            <li key={number} className="page-item">
                                <button onClick={() => { paginate(number); scrollUp() }} className="page-link">
                                    {number}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>



                <div class="wrapper">
                    <form action="" method="POST">
                        <div class="form-group">
                            <label for="name" className="col-sm-2 col-form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                value={state.name || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, name: e.target.value });
                                }}
                            />
                        </div>
                        <div class="form-group">
                            <label for="description" className="col-sm-2 col-form-label">
                                Description
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                value={state.description || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, description: e.target.value });
                                }}
                            />
                        </div>
                        <div class="form-group">
                            <label for="date" className="col-sm-2 col-form-label">
                                Date
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="date"
                                value={state.date || ""}
                                required
                                placeholder='YYYY-MM-DD'
                                onChange={(e) => {
                                    setState({ ...state, date: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="time" className="col-sm-2  text-left">
                                Time
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="time"
                                value={state.time || ""}
                                required
                                placeholder='HH:MMAM/PM'
                                onChange={(e) => {
                                    setState({ ...state, time: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="rules" className="col-sm-2 col-form-label">
                                Rules
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="rules"
                                value={state.rules || ""}
                                required
                                placeholder='Rule1,Rule2,Rule3'
                                onChange={(e) => {
                                    setState({ ...state, rules: [e.target.value] });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="venue" className="col-sm-2 col-form-label">
                                Venue
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="venue"
                                value={state.venue || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, venue: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="prize" className="col-sm-2 col-form-label">
                                Prize
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="prize"
                                value={state.prize || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, prize: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="fees" className="col-sm-2 col-form-label">
                                Fees
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="fees"
                                value={state.fees || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, fees: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="category" className="col-sm-2 col-form-label">
                                Category
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="category"
                                value={state.category || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, category: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="image" className="col-sm-2 col-form-label">
                                Image Url
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="image"
                                value={state.image || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, image: e.target.value });
                                }}
                            />


                        </div>

                        <div class="form-group my-3">
                            {editType ? (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={updateEvent}
                                >
                                    Update
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary"
                                    onClick={addEvent}
                                >
                                    ADD EVENT
                                </button>
                            )}
                        </div>
                    </form>
                </div>




            </div>
            {popUp && <div id="popup1" class="overlay" style={{ marginTop: "2rem" }}>
                <div class="popup">

                    <p class="close" onClick={() => setPopUp(false)}>&times;</p>
                    <div class="content">
                        <div className="input-box">
                            <h6>Sure,you want to Delete?</h6>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm my-3"
                                onClick={() => {
                                    deleteEvent(eventId);
                                }}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div >
    )
}
