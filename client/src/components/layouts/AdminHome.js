import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/AdminHome.css'
import Navbar from './Navbar'

const NavList = [{ name: "Home", path: "/adminHome" }, { name: "Events", path: "/adminEvents" }, { name: "Faculty", path: "/adminFaculty" }, { name: "Student", path: "/adminStudent" }];
export default function AdminHome() {
    return (
        <div><Navbar NavList={NavList} />
            <div className="adminHome">
                <div class="cards-list">

                    <Link to="/adminEvents" class="card 1">
                        <div class="card_title">
                            <p>Event</p>
                        </div>
                    </Link>
                    <Link to="/adminFaculty" class="card 2">
                        <div class="card_title">
                            <p>Faculty</p>
                        </div>
                    </Link>
                    <Link to="/adminStudent" class="card 3">
                        <div class="card_title">
                            <p>Student</p>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    )
}
