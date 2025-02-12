
import './App.css';
import { Container } from "react-bootstrap"
import { Outlet } from 'react-router-dom';

function App() {
  return (
   <Container fluid className='bg-light'>
      <Outlet />
   </Container>
  );
}

export default App;
