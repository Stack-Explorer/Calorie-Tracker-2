import './App.css'
import Login from './components/Login'
import Signup from './components/Signup'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LogOut } from 'lucide-react'
import { checkUserSession, logoutUser } from './store/features/backendSlice'
import { useEffect } from 'react'
import CalorieTrackerRedux from './components/CalorieTrackerRedux'
import DateWiseData from './components/DateWiseData'
import UpdateUser from './components/UpdateUser'
import Header from './components/Header'
import WelcomeSection from './components/WelcomeSection'
import toast, { Toaster } from 'react-hot-toast'
import CaloriesBurnt from './components/CaloriesBurnt'
import CalorieBurntDatewise from './components/CalorieBurntDatewise'

function App() {

  const isAuthenticated = useSelector((state) => state.backend.isAuthenticated);
  const status = useSelector((state) => state.backend.status);
  const data = useSelector((state) => state.backend.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector((state => state.backend.message));

  console.log("Message is : " + message)

  if (isAuthenticated) {
    console.log(data);
  }

  useEffect(() => {
    dispatch(checkUserSession());
  }, []);

  return (
    <>



      <Header />
      <CaloriesBurnt />
      <br />
      Comments hata
      {/* {data && <WelcomeSection data={data} />} */}
      <Routes>
        <Route path='/calorieburnt' element={<CalorieBurntDatewise />} />
        <Route path='/' element={data && <CalorieTrackerRedux />} />
        <Route path='/datewisedata' element={data && <DateWiseData />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Toaster />
      <p>Status is : {status}</p>
    </>
  )
}

export default App;