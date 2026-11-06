import {Link, useNavigate} from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  return (
    <>
     <main>
        <div className="container_index">
            {/** encabezado **/}
            <div className="contenido_index">
                <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
                    <div className="container-fluid py-3">
                        {/** logo **/}
                        <Link to="/">
                            <img src="/recursos/logo_AIDEL.png" alt="Logo AIDEL" className="logo"/>
                        </Link>
                        <h1 className="display-5 fw-bold text-primary">Bienvenido a ProTalento</h1>
                        <p className="col-md-10 mx-auto fs-5 text-muted">
                            La plataforma oficial para la evaluación y selección de aspirantes a formación técnica de la
                            Agencia Internacional de Desarrollo Local.
                        </p>
                    </div>
                    {/** botones **/}
                    <p>
                        <button className="btn btn-primary" onClick={() => navigate('/RegistroAspirantes')}>
                            Soy aspirante a curso técnico
                        </button>
                    </p>
                    <p>
                        <button className="btn btn-primary" onClick={() => navigate('/Login')}>
                            Acceso a personal evaluador
                        </button>
                    </p>
                    <br/>
                    <p>
                        <button className="estado btn btn-outline-secondary" onClick={() => navigate('/Login')}>
                            ¿Ya estás registrado? Consultar mi estado.
                        </button>
                    </p>
                </section>
            </div>

            {/*lateral derecho**/}
            <div className="lateral_index">
                <p><b>"Formando al talento digital del mañana en El Salvador"</b></p>
                <p>Proyecto de Formación Técnica | AIDEL El Salvador</p>
                <img src="/recursos/joven_inicio.png" alt="Imagen de joven" className="imagen_inicio"/>
            </div>
        </div>

        {/**pie de página**/}
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-0">&copy; 2026 ProTalento Agencia Internacional de Desarrollo Local. Todos los derechos reservados.</p>
            </div>
        </footer>
    </main>
    </>
  );
}

export default Index