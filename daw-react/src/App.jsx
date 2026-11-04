import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Index from './paginas/Index';
import Login from './paginas/Login';
import PanelControl from './paginas/PanelControl';
import PortalAspirante from './paginas/PortalAspirante';
import Convocatorias from './paginas/Convocatorias';
import RegistroAspirantes from './paginas/RegistroAspirantes';
import Aspirantes from './paginas/Aspirantes';
import PerfilCandidato from './paginas/PerfilCandidato';

function App() {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/Index" element={<Index/>}/>
        <Route path="/RegistroAspirantes" element={<RegistroAspirantes/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/PanelControl" element={<PanelControl/>}/>
        <Route path="/PortalAspirante" element={<PortalAspirante/>}/>
        <Route path="/Convocatorias" element={<Convocatorias/>}/>
        <Route path="/Aspirantes" element={<Aspirantes/>}/>
        <Route path="/PerfilCandidato" element={<PerfilCandidato/>}/>
     </Routes>
    </BrowserRouter>
  );
}

export default App;
