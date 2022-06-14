import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdminHome.css'
import Navbar from './Navbar'

const NavList = [{ name: "Home", path: "/facultyHome" }, { name: "Student", path: "/facultyStudent" }];

export default function FacultyHome() {
    return (
        <div><Navbar NavList={NavList} />
            <div className="adminHome">
                <div class="cards-list">

                    <Link to="/facultyStudent" class="card 3">
                        <div class="card_title">
                            <p>Student</p>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    )
}
