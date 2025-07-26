import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserSession, logoutUser } from './store/features/backendSlice'
import { useEffect } from 'react'
import CalorieTrackerRedux from './components/CalorieTrackerRedux'
import DateWiseData from './components/DateWiseData'
import Header from './components/Header'
import WelcomeSection from './components/WelcomeSection'
import { Toaster } from 'react-hot-toast'
import CalorieBurntDatewise from './components/CalorieBurntDatewise'
import NotFound from './components/NotFound'
import { useState } from 'react'
import ParagraphComponent from './components/ParagraphComponent'

function App() {

  const isAuthenticated = useSelector((state) => state.backend.isAuthenticated);
  const status = useSelector((state) => state.backend.status);
  const data = useSelector((state) => state.backend.data);
  const dispatch = useDispatch();

  const [isNotFoundActive, setIsNotFoundActive] = useState(false);

  

  useEffect(() => {
    dispatch(checkUserSession());
  }, []);

  return (
    <>
      {!isNotFoundActive && <Header />}
      <br />
      <Routes>
        <Route path='/calorieburnt' element={<CalorieBurntDatewise />} />
        <Route path='/' element={data && <CalorieTrackerRedux />} />
        <Route path='/datewisedata' element={data && <DateWiseData />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="*" element={<NotFound setIsNotFoundActive={setIsNotFoundActive} />} />
        <Route path='/calorieburntdata' element={<CalorieBurntDatewise />} />
      </Routes>
      <Toaster />
      <p>Status is : {status}</p>
    </>
  )
}

export default App;