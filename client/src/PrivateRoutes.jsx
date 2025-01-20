import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
  let auth = window.sessionStorage.getItem('tokens');
return (
    auth ? <Outlet/> : <Navigate to='/login'/>
  )
}

export default PrivateRoutes;