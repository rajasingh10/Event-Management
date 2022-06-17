import React, { useState, useEffect, useMemo } from 'react'
import Navbar from './Navbar'
import { Link, useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import "../styles/AdminStudent.css"
import { Button } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';


const NavList = [{ name: "Home", path: "/facultyHome" }, { name: "Student", path: "/facultyStudent" }];

export default function FacultyStudent() {

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
        HandleStatistics();

    }, [])



    const HandleStatistics = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/faculty/statistics", {
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

    return (
        <div><Navbar NavList={NavList} />
            <div className="FacultyStudent">
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
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student) => (
                                <tr>
                                    <td>
                                        {student.firstName}
                                    </td>
                                    <td>{student.lastName}</td>
                                    <td>{student.email}</td>
                                    <td>{student.branch}</td>
                                    <td>{student.verified ? "Active" : <Button variant="primary" onClick={() => HandleAccountVerify(student._id)}>Verify</Button>}</td>
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
        </div>
    )
}
