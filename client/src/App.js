import React, { useState, useEffect } from 'react'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/layouts/Login';
import Register from './components/layouts/Register';
import Home from './components/layouts/Home';
import Event from './components/layouts/Event';
import EventList from './components/layouts/EventList';
import MyEvents from './components/layouts/MyEvents';
import AdminHome from './components/layouts/AdminHome';
import AdminEvents from './components/layouts/AdminEvents';
import AdminFaculty from './components/layouts/AdminFaculty';
import AdminStudent from './components/layouts/AdminStudent';
import StudentProfile from './components/layouts/StudentProfile';
import FacultyHome from './components/layouts/FacultyHome';
import FacultyStudent from './components/layouts/FacultyStudent';
import FacultyStudentProfile from './components/layouts/FacultyStudentProfile';





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    handleLogin()
  }, [isLoggedIn, role])

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/isLogin", {
        method: "GET",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.status == 201) {
        const data = await response.json();
        setIsLoggedIn(true);
        setRole(data.data.role);
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (

    <Router>

      <div className="App">
        <Routes>
          {/* <Route path='/*' element={<Student />} />
          <Route path='/admin/*' element={<Admin />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route exact path='/' element={isLoggedIn ? <Home /> : <Login />} />
          <Route path='/event' element={<Event />} />
          <Route path='/eventList' element={<EventList />} />
          <Route path='/myEvents' element={<MyEvents />} />
          <Route path='/adminHome' element={<AdminHome />} />
          <Route path='/adminEvents' element={<AdminEvents />} />
          <Route path='/adminFaculty' element={<AdminFaculty />} />
          <Route path='/adminStudent' element={<AdminStudent />} />
          <Route path='/facultyHome' element={<FacultyHome />} />
          <Route path='/facultyStudent' element={<FacultyStudent />} />
          <Route exact path='/admin/studentProfile' element={<StudentProfile />} />
          <Route exact path='/faculty/studentProfile' element={<FacultyStudentProfile />} />
        </Routes>
      </div>

    </Router>


  );
}

export default App;
