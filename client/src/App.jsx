import { useState } from 'react';
import Navbar from './components/Navbar'
import Events from './pages/Events'
import { Box, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Route, Routes } from 'react-router-dom';
import OAuthCallback from './pages/OAuthCallback';
import LoginHome from './pages/LoginHome';
import PrivateRoutes from './PrivateRoutes';

const App = () => {

  const [colorMode, setColorMode] = useState('light')

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#08C2FF',
      },
      secondary: {
        main: '#0D92F4',
      },
      mode: colorMode
    },
  })
  
  return (
    <ThemeProvider theme={darkTheme}>
      <Routes>
        <Route element={<LoginHome />} path='/login' />
        <Route element={<OAuthCallback />} path='/oauth2callback'/>
        <Route element={<PrivateRoutes/>}>
          <Route index element={
            <Box bgcolor={'background.default'} color={'text.primary'} height={'100vh'}>
              <Navbar mode={colorMode} setMode={setColorMode}/>
              <Events />
            </Box>
          } />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App