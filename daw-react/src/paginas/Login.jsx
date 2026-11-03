import {Link} from "react-router-dom";

function Login() {
  return (
    <>
     <main>
        <div className="container_login">
            {/** encabezado **/}
            <div className="contenido_login">
                <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
                    <div className="container-fluid py-3">
                        <Link to="/Index">
                            <img src="recursos/logo_AIDEL.png" alt="Logo AIDEL" className="logo"/>
                        </Link>
                        <h1 className="display-5 fw-bold text-primary">Bienvenido a ProTalento</h1>
                        <p className="col-md-10 mx-auto fs-5 text-muted">
                            La plataforma oficial para la evaluación y selección de aspirantes a formación técnica de la Agencia Internacional de Desarrollo Local.
                        </p>
                    </div>
                    {/** formulario de login **/}
                    <form id="formLogin">
                        <div className="mb-3">
                            <label for="email" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" placeholder="tu@email.com" required/>
                        </div>
                        <div className="mb-3">
                            <label for="password" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="password" placeholder="Contraseña" required/>
                        </div>
                        <br/>
                        <button type="submit" className="sesion btn btn-primary w-100">Iniciar sesión</button>
                    </form>
                </section>
            </div>
            {/** lateral derecho **/}
            <div className="lateral_login">
                <p><b>"Formando al talento digital del mañana en El Salvador"</b></p>
                <p>Proyecto de Formación Técnica | AIDEL El Salvador</p>
                <img src="recursos/joven_inicio.png" alt="Imagen de joven" className="imagen_login"/>
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

export default Login