
import { Link } from "react-router-dom";

function Index() {
  return (
    <main>
      <div className="container_index">

        {/* Contenido principal */}
        <div className="contenido_index">
          <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">

            <div className="container-fluid py-3">

              {/* Logo institucional */}
              <Link to="/" aria-label="Ir al inicio de ProTalento">
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

            {/* Opciones de acceso */}
            <div className="d-flex flex-column align-items-center gap-3">

              <Link
                to="/RegistroAspirantes"
                className="btn btn-primary"
              >
                Soy aspirante a curso técnico
              </Link>

              <Link
                to="/Login"
                className="btn btn-primary"
              >
                Acceso a personal evaluador
              </Link>

              <Link
                to="/Login"
                className="estado btn btn-outline-secondary"
              >
                ¿Ya estás registrado? Consultar mi estado.
              </Link>

            </div>

          </section>
        </div>

        {/* Panel lateral derecho */}
        <aside className="lateral_index">

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
            className="imagen_inicio"
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

export default Index;
