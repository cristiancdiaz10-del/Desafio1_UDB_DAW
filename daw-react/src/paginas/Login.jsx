
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  crearUsuariosIniciales,
  iniciarSesion,
  cerrarSesion
} from "../servicios_js/autenticaciones.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Crear las cuentas administrativas iniciales
  // si todavía no existen.
  useEffect(() => {
    crearUsuariosIniciales();
  }, []);

  // Manejar el inicio de sesión
  const manejarInicioSesion = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Debes completar todos los campos.");
      return;
    }

    setCargando(true);

    try {
      const resultado = iniciarSesion(email, password);

      if (!resultado.correcto) {
        setError(resultado.mensaje);
        return;
      }

      const usuario = resultado.usuario;

      // Redirigir según el rol del usuario
      switch (usuario.rol) {
        case "usuario":
          navigate("/PortalAspirante", { replace: true });
          break;

        case "administrador":
        case "superadministrador":
          navigate("/PanelControl", { replace: true });
          break;

        default:
          cerrarSesion();
          setError("El usuario no tiene un rol autorizado para ingresar.");
          break;
      }

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Ocurrió un error inesperado. Intenta nuevamente.");

    } finally {
      setCargando(false);
    }
  };

  return (
    <main>
      <div className="container_login">

        {/* Contenido principal */}
        <div className="contenido_login">
          <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">

            <div className="container-fluid py-3">

              {/* Logo institucional */}
              <Link to="/Index" aria-label="Volver al inicio">
                <img
                  src="/recursos/logo_AIDEL.png"
                  alt="Logo de AIDEL"
                  className="logo"
                />
              </Link>

              <h1 className="display-5 fw-bold text-primary">
                Bienvenido a ProTalento
              </h1>

              <p className="col-md-10 mx-auto fs-5 text-muted">
                La plataforma oficial para la evaluación y selección de
                aspirantes a formación técnica de la Agencia Internacional
                de Desarrollo Local.
              </p>

            </div>

            {/* Formulario de inicio de sesión */}
            <form id="formLogin" onSubmit={manejarInicioSesion}>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>

                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="username"
                  required
                  disabled={cargando}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>

                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  required
                  disabled={cargando}
                />
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="sesion btn btn-primary w-100"
                disabled={cargando}
              >
                {cargando ? "Ingresando..." : "Iniciar sesión"}
              </button>

            </form>

          </section>
        </div>

        {/* Panel lateral */}
        <aside className="lateral_login">

          <p>
            <strong>
              "Formando al talento digital del mañana en El Salvador"
            </strong>
          </p>

          <p>
            Proyecto de Formación Técnica | AIDEL El Salvador
          </p>

          <img
            src="/recursos/joven_inicio.png"
            alt="Joven participante del programa de formación técnica"
            className="imagen_login"
          />

        </aside>

      </div>

      {/* Pie de página */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2026 ProTalento Agencia Internacional de Desarrollo Local.
            Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </main>
  );
}

export default Login;
