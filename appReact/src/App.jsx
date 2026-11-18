import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Index from './paginas/Index';
import Login from './paginas/Login';
import PanelControl from './paginas/PanelControl';
import PortalAspirante from './paginas/PortalAspirante';
import Convocatorias from './paginas/Convocatorias';
import RegistroAspirantes from './paginas/RegistroAspirantes';
import Aspirantes from './paginas/Aspirantes';
import PerfilCandidato from './paginas/PerfilCandidato';

import { protegerVista } from './servicios_js/autenticaciones';

// Componente para proteger rutas
function RutaProtegida({ rolesPermitidos, children }) {
  const accesoPermitido = protegerVista(rolesPermitidos);

  if (!accesoPermitido) {
    return <Navigate to="/Login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Index" element={<Index />} />

        <Route path="/RegistroAspirantes" element={<RegistroAspirantes />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/PanelControl" element={<PanelControl />} />

        {/* Portal protegido: solamente aspirantes autenticados */}
        <Route
          path="/PortalAspirante"
          element={
            <RutaProtegida rolesPermitidos={['usuario']}>
              <PortalAspirante />
            </RutaProtegida>
          }
        />

        <Route path="/Convocatorias" element={<Convocatorias />} />
        <Route path="/Aspirantes" element={<Aspirantes />} />
        <Route path="/PerfilCandidato" element={<PerfilCandidato />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;