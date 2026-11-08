import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
    obtenerSesion,
    protegerVista
} from "../servicios_js/autenticaciones.js";

function RutaProtegida({ rolesPermitidos = [] }) {
    const location = useLocation();
    const sesion = obtenerSesion();

    // Si no existe una sesión activa, enviar al login
    if (!sesion) {
        return (
            <Navigate
                to="/Login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Comprobar si el rol tiene autorización
    const tienePermiso = protegerVista(rolesPermitidos);

    if (!tienePermiso) {
        // Redirigir según el tipo de usuario
        const rutaInicio = sesion.rol === "usuario"
            ? "/PortalAspirante"
            : "/PanelControl";

        return <Navigate to={rutaInicio} replace />;
    }

    // Si está autorizado, mostrar la ruta solicitada
    return <Outlet />;
}

export default RutaProtegida;