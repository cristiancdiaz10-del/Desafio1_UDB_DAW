import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import {crearUsuariosIniciales, iniciarSesion} from "../servicios_js/autenticaciones.js";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Crear usuarios iniciales si no existen
    useEffect(() => {
        crearUsuariosIniciales();
    }, []);

    // Proceso de inicio de sesión
    function manejarInicioSesion(event) {
        event.preventDefault();
        setError(""); // Limpia errores previos

        const resultado = iniciarSesion(email, password);

        if (!resultado.correcto) {
            setError(resultado.mensaje);
            return;
        }
        // Redirigir según el rol del usuario
        const usuario = resultado.usuario;
        if (usuario.rol === "usuario") {
            navigate("/PortalAspirante");
        } else if (usuario.rol === "administrador" || usuario.rol === "superadministrador") {
            navigate("/PanelControl");
        } else {
            setError("El usuario no tiene un rol válido.");
        }
    }
  return (
    <>
     <main>
        <div className="container_login">
            {/** encabezado **/}
            <div className="contenido_login">
                <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
                    <div className="container-fluid py-3">
                        <Link to="/Index">
                            <img src="/recursos/logo_AIDEL.png" alt="Logo AIDEL" className="logo"/>
                        </Link>
                        <h1 className="display-5 fw-bold text-primary">Bienvenido a ProTalento</h1>
                        <p className="col-md-10 mx-auto fs-5 text-muted">
                            La plataforma oficial para la evaluación y selección de aspirantes a formación técnica de la Agencia Internacional de Desarrollo Local.
                        </p>
                    </div>

                    {/** formulario de login **/}
                    <form id="formLogin" onSubmit={manejarInicioSesion}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" autoComplete="current-password" required/>
                        </div>
                        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                        <br/>

                        <button type="submit" className="sesion btn btn-primary w-100">Iniciar sesión</button>
                    </form>
                </section>
            </div>

            {/** lateral derecho **/}
            <div className="lateral_login">
                <p><b>"Formando al talento digital del mañana en El Salvador"</b></p>
                <p>Proyecto de Formación Técnica | AIDEL El Salvador</p>
                <img src="/recursos/joven_inicio.png" alt="Imagen de joven" className="imagen_login"/>
            </div>
        </div>

        {/** pie de página **/}
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-1">&copy; 2026 ProTalento Agencia Internacional de Desarrollo Local. Todos los derechos reservados.</p>
            </div>
        </footer>
    </main>
    </>
  );
}

export default Login;