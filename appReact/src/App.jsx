
import { Routes, Route, Navigate } from 'react-router-dom';

import Index from './paginas/Index';
import Login from './paginas/Login';
import PanelControl from './paginas/PanelControl';
import PortalAspirante from './paginas/PortalAspirante';
import Convocatorias from './paginas/Convocatorias';
import RegistroAspirantes from './paginas/RegistroAspirantes';
import Aspirantes from './paginas/Aspirantes';
import PerfilCandidato from './paginas/PerfilCandidato';

import RutaProtegida from './componentes/RutaProtegida';

const ROLES_ADMINISTRATIVOS = [
  'administrador',
  'superadministrador',
];

const ROLES_GESTION = [
  'administrador',
  'superadministrador'
];

function App() {
  return (
    <Routes>

      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<Index />} />
      <Route path="/Index" element={<Index />} />
      <Route path="/RegistroAspirantes" element={<RegistroAspirantes />} />
      <Route path="/Login" element={<Login />} />

      {/* RUTA EXCLUSIVA PARA ASPIRANTES */}
      <Route element={<RutaProtegida rolesPermitidos={['usuario']} />}>
        <Route
          path="/PortalAspirante"
          element={<PortalAspirante />}
        />
      </Route>

      {/* RUTAS PARA ADMINISTRADORES Y EVALUADORES */}
      <Route element={<RutaProtegida rolesPermitidos={ROLES_ADMINISTRATIVOS} />}>
        <Route path="/PanelControl" element={<PanelControl />} />
        <Route path="/Aspirantes" element={<Aspirantes />} />
        <Route path="/PerfilCandidato" element={<PerfilCandidato />} />
      </Route>

      {/* RUTAS EXCLUSIVAS PARA ADMINISTRADORES */}
      <Route element={<RutaProtegida rolesPermitidos={ROLES_GESTION} />}>
        <Route path="/Convocatorias" element={<Convocatorias />} />
      </Route>

      {/* RUTA PARA DIRECCIONES NO EXISTENTES */}
      <Route path="*" element={<Navigate to="/Index" replace />} />

    </Routes>
  );
}

export default App;
