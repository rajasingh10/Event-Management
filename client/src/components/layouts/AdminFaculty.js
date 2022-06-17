import React, { useEffect, useState, useMemo } from 'react'
import Navbar from './Navbar'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "../styles/AdminFaculty.css"
import toast, { Toaster } from 'react-hot-toast';

const NavList = [{ name: "Home", path: "/adminHome" }, { name: "Events", path: "/adminEvents" }, { name: "Faculty", path: "/adminFaculty" }, { name: "Student", path: "/adminStudent" }];

export default function AdminFaculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [state, setState] = useState({});
    const [editType, setEditType] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const [popUp, setPopUp] = useState(false);
    const [facultyId, setFacultyId] = useState()
    const eventPerPage = 3;

    useEffect(() => {
        HandleFacultyList();
    }, [])
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEvents / eventPerPage); i++) {
        pageNumbers.push(i);
    }

    const setEditValues = (faculty) => {

        setState({
            ...state,
            firstName: faculty.firstName,
            lastName: faculty.lastName,
            email: faculty.email,
            password: faculty.password,
            branch: faculty.branch,
            faculty_id: faculty._id
        });
    };


    const HandleFacultyList = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/admin/faculty", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                setFacultyList(data.data.faculties);
            }
        } catch (err) {
            // alert(err);
        }

    }


    const addFaculty = async (e) => {
        e.preventDefault();
        try {
            const { firstName, lastName, email, password, branch } = state;
            const response = await fetch(`http://localhost:3000/api/auth/register/faculty`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName, lastName, email, password, branch
                })
            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)

                HandleFacultyList();
                setEditType(false);
                setState({
                    ...state,
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    branch: "",

                });

            }
            else {
                if (data.error.includes("duplicate key error")) {
                    toast.error("Already,faculty has been registered for this branch")
                }
                else {

                    toast.error(data.error)
                }
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }

    const updateFaculty = async (e) => {
        e.preventDefault();
        try {
            const { firstName, lastName, email, password, branch } = state;
            const response = await fetch(`http://localhost:3000/api/admin/faculty/${state.faculty_id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName, lastName, email, password, branch
                })
            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)
                HandleFacultyList();
                setEditType(false);
                setState({
                    ...state,
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    branch: "",

                });

            }
            else {
                // if (data.error.includes("duplicate key error")) {
                //     toast.error("Already,faculty has been registered for this branch")
                // }
                // else {

                // }
                toast.error(data.error)
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }

    const deleteFaculty = async (faculty_id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/faculty/${faculty_id}`, {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },

            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)

                setPopUp(false)
                HandleFacultyList();
            }
            else {
                toast.error(data.error)
                // alert(data.error)
            }
        } catch (err) {
            // alert(err)
        }

    }


    const facultyData = useMemo(() => {
        let computedFaculty = facultyList;

        setTotalEvents(computedFaculty.length);

        //Current Page slice
        return computedFaculty.slice(
            (currentPage - 1) * eventPerPage,
            (currentPage - 1) * eventPerPage + eventPerPage
        );
    }, [facultyList, currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    const scrollDown = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }
    function scrollUp() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return (
        <div><Navbar NavList={NavList} />
            <div className="adminFacultyContainer">
                <div
                    className="facultyList mw-80"
                    style={{
                        boxShadow: "0px 10px 10px -5px rgba(0,0,0,0.5)",
                        backgroundColor: "white",
                    }}
                >
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Password</th>
                                <th scope="col">Branch</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facultyData.map((faculty) => (
                                <tr>
                                    <td>
                                        {faculty.firstName}
                                    </td>
                                    <td>{faculty.lastName}</td>
                                    <td>{faculty.email}</td>
                                    <td>{faculty.password}</td>
                                    <td>{faculty.branch}</td>
                                    <td>

                                        <div style={{ cursor: "pointer" }} onClick={() => {
                                            setEditType(true);
                                            setEditValues(faculty);
                                            scrollDown();
                                        }}>
                                            <EditIcon />
                                        </div>
                                        <br />
                                        <div style={{ cursor: "pointer" }} className="delete" onClick={() => { setPopUp(true); setFacultyId(faculty._id) }} >
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
                            <label for="firstName" className="col-sm-2 col-form-label">
                                First Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                value={state.firstName || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, firstName: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="lastName" className="col-sm-2 col-form-label">
                                Last Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                value={state.lastName || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, lastName: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="email" className="col-sm-2 col-form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={state.email || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, email: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="password" className="col-sm-2 col-form-label">
                                Password
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                id="password"
                                value={state.password || ""}
                                required
                                onChange={(e) => {
                                    setState({ ...state, password: e.target.value });
                                }}
                            />

                        </div>
                        <div class="form-group">
                            <label for="branch" className="col-sm-2 col-form-label">
                                Branch
                            </label>

                            <select value={state.branch || "none"} id="branch" onChange={(e) => {
                                setState({ ...state, branch: e.target.value });
                            }}>
                                <option value="none" disabled hidden>Select an Option</option>
                                <option value="CSE">Computer Science Engineering</option>
                                <option value="IS">Information Science </option>
                                <option value="ECE">Electronics and Communications Engineering</option>
                                <option value="ME">Mechanical Engineering</option>
                                <option value="EEE">Electrical and Electronics Engineering</option>
                                <option value="MCA">Master of Computer Application</option>
                            </select>


                        </div>
                        <div class="form-group my-3">
                            {editType ? (
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={updateFaculty}
                                >
                                    Update
                                </button>
                            ) : (
                                <button type="submit" className="btn btn-primary"
                                    onClick={addFaculty}
                                >
                                    ADD FACULTY
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
                            <h6>Sure,you want to Delete</h6>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm my-3"
                                onClick={() => {
                                    deleteFaculty(facultyId);
                                }}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
