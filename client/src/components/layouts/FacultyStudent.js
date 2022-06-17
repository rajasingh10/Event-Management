import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
import "../styles/FacultyStudent.css";
import "../styles/AdminStudent.css"
import { Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';


const NavList = [{ name: "Home", path: "/facultyHome" }, { name: "Student", path: "/facultyStudent" }];

export default function FacultyStudent() {
    const [state, setState] = useState({});
    const [studentList, setStudentList] = useState([]);
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalEvents, setTotalEvents] = useState(0);
    const eventPerPage = 3;

    const handleViewEvent = (id, firstName, lastName) => {
        navigate("/faculty/studentProfile", { state: { id: id, firstName: firstName, lastName: lastName } });
    }

    useEffect(() => {
        HandleStudentList();
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
            HandleStatistics(data.data.branch)

        }

    }



    const HandleStatistics = async (branch) => {
        try {
            const response = await fetch(`http://localhost:3000/api/faculty/statistics/${branch}`, {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                setStats(data.data.stats)

                // console.log(data.data.stats);
            }
        } catch (error) {
            // alert(error);
        }
    }

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalEvents / eventPerPage); i++) {
        pageNumbers.push(i);
    }

    const studentData = useMemo(() => {
        let computedStudent = studentList;

        setTotalEvents(computedStudent.length);

        //Current Page slice
        return computedStudent.slice(
            (currentPage - 1) * eventPerPage,
            (currentPage - 1) * eventPerPage + eventPerPage
        );
    }, [studentList, currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function scrollUp() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    const HandleStudentList = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/faculty/students", {
                method: "GET",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                const data = await response.json();
                setStudentList(data.data.students);
            }
        } catch (err) {
            // alert(err);
        }

    }

    const HandleAccountVerify = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/faculty/student/${id}/verifyStudent`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            if (response.status == 201) {
                toast.success(data.data.message)

                // alert(data.data.message);
                HandleStudentList();
            }
            else {
                // alert(data.error);
            }
        } catch (error) {
            // alert(error);
        }
    }

    function generateRandomColor() {
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal;
        randomNumber = Math.floor(randomNumber);
        randomNumber = randomNumber.toString(16);
        let randColor = randomNumber.padStart(6, 0);
        return `#${randColor.toUpperCase()}`
    }

    const scrollDown = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const setEditValues = (student) => {
        setState({
            ...state,
            firstName: student.firstName,
            lastName: student.lastName,
            branch: student.branch,
            student_id: student._id
        });
    };

    const updateStudent = async (e) => {
        e.preventDefault();
        try {
            const { firstName, lastName, branch } = state;
            const response = await fetch(`http://localhost:3000/api/faculty/student/${state.student_id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName, lastName, branch
                })
            })

            const data = await response.json();
            // console.log(data);

            if (response.status == 201) {
                toast.success(data.data.message)
                HandleStudentList();
                setState({
                    ...state,
                    firstName: "",
                    lastName: "",
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



    return (
        <div><Navbar NavList={NavList} />
            <div className="facultyStudent">
                <div
                    className="studentList mw-80"
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
                                <th scope="col">Branch</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student, index) => (
                                <tr key={index}>
                                    <td>
                                        {student.firstName}
                                    </td>
                                    <td>{student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.branch}</td>
                                    <td>{student.verified ? "Active" : <Button variant="primary" onClick={() => HandleAccountVerify(student._id)}>Verify</Button>}</td>
                                    <td>

                                        <div style={{ cursor: "pointer" }} onClick={() => {
                                            setEditValues(student);
                                            scrollDown();
                                        }}>
                                            <EditIcon />
                                        </div>


                                    </td>
                                    <td style={{ cursor: "pointer" }} onClick={() => handleViewEvent(student._id, student.firstName, student.lastName)}>View Events <ChevronRightIcon /></td>
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
                <div className="chart">
                    <Pie data={{
                        labels: stats.map(stat => stat.name),
                        datasets: [{
                            label: 'No of Registrations',
                            data: stats.map(stat => stat.count),
                            backgroundColor: stats.map(stat => generateRandomColor()),
                        }]
                    }} />
                </div>
            </div>
            <div class="wrapper m-auto">
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
                        <label for="branch" className="col-sm-2 col-form-label">
                            Branch
                        </label>

                        <select value={state.branch || "none"} id="branch" onChange={(e) => {
                            setState({ ...state, branch: e.target.value });
                        }}>
                            <option value="none" selected disabled hidden>Select an Option</option>
                            <option value="CSE">Computer Science Engineering</option>
                            <option value="IS">Information Science </option>
                            <option value="ECE">Electronics and Communications Engineering</option>
                            <option value="ME">Mechanical Engineering</option>
                            <option value="EEE">Electrical and Electronics Engineering</option>
                            <option value="MCA">Master of Computer Application</option>
                        </select>


                    </div>
                    <div class="form-group my-3">

                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={updateStudent}
                        >
                            Update
                        </button>

                    </div>
                </form>
            </div>
        </div>
    )
}
