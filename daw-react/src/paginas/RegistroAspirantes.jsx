import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

import {
    calcularEdad,
    obtenerCursos,
    obtenerDomicilio,
    registrarAspirante,
    obtenerFechaActual,
    validarPassword,
    validarDUI,
    validarNIT
} from "../utilidades_js/validaciones";

import { useEffect, useState } from "react";

function RegistroAspirantes() {
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [distritos, setDistritos] = useState([]);
    
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");
    const [distritoSeleccionado, setDistritoSeleccionado] = useState("");
    
    const [mostrarDUI, setMostrarDUI] = useState(false);
    const [mostrarNIT, setMostrarNIT] = useState(false);
    const [mostrarConsentimiento, setMostrarConsentimiento] = useState(false);
    const [errorDomicilio, setErrorDomicilio] = useState(false);
    
    const [cursos, setCursos] = useState([]);
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    obtenerDomicilio()
        .then(data => setDepartamentos(data))
        .catch(error => {
            console.error("Error al cargar departamentos:", error);
            setErrorDomicilio(true);
        });
}, []);

    useEffect(() => {
        setCursos(obtenerCursos());
    }, []);

    function manejarCambioDepartamento(e) {
    const nombreDepartamento = e.target.value;

    setDepartamentoSeleccionado(nombreDepartamento);
    setMunicipioSeleccionado("");
    setDistritoSeleccionado("");

    const departamento = departamentos.find(
        d => d.nombre === nombreDepartamento
    );

    setMunicipios(departamento ? departamento.municipios : []);
    setDistritos([]);
}

function manejarCambioMunicipio(e) {
    const nombreMunicipio = e.target.value;

    setMunicipioSeleccionado(nombreMunicipio);
    setDistritoSeleccionado("");

    const departamento = departamentos.find(
        d => d.nombre === departamentoSeleccionado
    );

    const municipio = departamento?.municipios.find(
        m => m.nombre === nombreMunicipio
    );

    setDistritos(municipio ? municipio.distritos : []);
}

function manejarCambioDistrito(e) {
    setDistritoSeleccionado(e.target.value);
}

function manejarCambioFecha(e) {
    const fecha = e.target.value;
    const edad = calcularEdad(fecha);

    setFechaNacimiento(fecha);

    setMostrarDUI(edad !== null && edad >= 18);
    setMostrarNIT(edad !== null && edad < 18);
}

async function manejarRegistro(e) {
    e.preventDefault();

    try {
    const formulario = e.currentTarget;
    const datos = new FormData(formulario);

    const nuevoUsuario = {
        curso: datos.get("curso"),
        nombreCompleto: datos.get("nombre"),
        sexo: datos.get("sexo"),
        fechaNacimiento: datos.get("nacimiento"),
        departamento: datos.get("departamento"),
        municipio: datos.get("municipio"),
        distrito: datos.get("distrito"),
        DUI: datos.get("DUI") || "",
        NIT: datos.get("NIT") || "",
        discapacidad: datos.get("discapacidad"),
        nivelEducativo: datos.get("nivel-educativo"),
        situacionActual: datos.get("situacion-actual"),
        internet: datos.get("internet"),
        computadora: datos.get("computadora"),
        dominioComputadora: datos.get("dominio-computadora"),
        vinculacionLaboral: datos.get("vinculacion"),
        medioPreferido: datos.get("medio-contacto"),
        telefono1: datos.get("telefono"),
        telefono2: datos.get("telefono2") || "",
        email: datos.get("email"),
        password: datos.get("password"),
        consentimientoInformado: datos.get("aceptarConsentimiento") === "on"
    };

    if (!validarPassword(nuevoUsuario.password)) {
    await Swal.fire({
        icon: "warning",
        title: "Contraseña no válida",
        text: "Debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número."
    });

    return;
}

    if (nuevoUsuario.DUI && !validarDUI(nuevoUsuario.DUI)) {
        await Swal.fire({
            icon: "warning",
            title: "DUI inválido",
            text: "Verificá el formato del DUI."
        });

        return;
    }

    if (nuevoUsuario.NIT && !validarNIT(nuevoUsuario.NIT)) {
        await Swal.fire({
            icon: "warning",
            title: "NIT inválido",
            text: "Verificá el formato del NIT."
        });

        return;
    }

    const resultado = registrarAspirante(nuevoUsuario);

    if (!resultado.correcto) {
        await Swal.fire({
            icon: "warning",
            title: "No se pudo completar el registro",
            text: resultado.mensaje,
            confirmButtonText: "Entendido"
        });

        return;
    }

    await Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Tu registro se ha completado correctamente.",
        confirmButtonText: "Continuar"
    });

    navigate("/Login");
}   catch (error) {
        console.error("Error al registrar aspirante:", error);

        await Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "Ocurrió un problema al procesar el registro. Intentá nuevamente."
        });
    }
}

  return (
    <>
     <main>
        <div className="container_registro">
            {/* encabezado **/}
            <div className="contenido_registro">
                <div className="encabezado_registro">
                    <Link to="/Index">
                        <img src="/recursos/logo_AIDEL.png" alt="Logo AIDEL" className="logo_registro"/>
                    </Link>
                    <div className="parrafos_registro">
                        <p className="col-md-10 mx-auto fs-5 text-muted">¡Tu talento tiene futuro!</p>
                        <p className="col-md-10 mx-auto fs-5 text-muted">Regístrate y da el primer paso hacia tu formación técnica.</p>
                    </div>
                </div>
                <section className="p-5 mb-4 bg-light rounded-3 shadow-sm border">
                    <div className="container-fluid py-3">
                        <h3 className="display-11 fw-bold text-primary">Completa tu registro de aspirante</h3>
                    </div>

                    {/*formulario de registro**/}
                    <form className="formulario-registro" id="formRegistro" name="formRegistro" onSubmit={manejarRegistro}>
                        <div className="col-completa">
                            <div className="mb-3">
                                <label htmlFor="curso" className="form-label">Curso de interés</label>
                                <select className="form-control" id="curso" name="curso" defaultValue="" required>
                                    <option value="" disabled>Selecciona el curso de formación que te interesa</option>
                                    {cursos.map((curso, index) => {
                                        const nombreCurso =
                                            typeof curso === "string"
                                                ? curso
                                                : curso.nombre;

                                        if (!nombreCurso) return null;

                                        return (
                                            <option key={curso.id || index} value={nombreCurso}>
                                                {nombreCurso}
                                            </option>
                                        );
                                    })}
                                </select>
                                {cursos.length === 0 && (
                                    <small className="text-danger">
                                        Actualmente no hay cursos disponibles.
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre completo</label>
                            <input type="text" className="form-control" id="nombre" name="nombre" placeholder="Juan Pérez" minLength="10" maxLength="100" pattern="[A-Za-zÁÉÍÓÚáéíóúÜüÑñ' -]+" title="Introduce tus nombres y apellidos" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sexo" className="form-label">Indica tu sexo</label>
                            <select className="form-control" id="sexo" name="sexo" defaultValue="" required>
                                <option value="" disabled>Selecciona tu sexo</option>
                                <option value="Mujer">Mujer</option>
                                <option value="Hombre">Hombre</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nacimiento" className="form-label">Fecha de nacimiento</label>
                            <input type="date" className="form-control" id="nacimiento" name="nacimiento" value={fechaNacimiento} max={obtenerFechaActual()} onChange={manejarCambioFecha} required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="departamento" className="form-label">Departamento de residencia</label>
                            <select className="form-control" id="departamento" name="departamento" value={departamentoSeleccionado} onChange={manejarCambioDepartamento} required>
                                <option value="">Selecciona tu departamento</option>
                                {departamentos.map(departamento => (
                                    <option key={departamento.nombre} value={departamento.nombre}>
                                        {departamento.nombre}
                                    </option>
                                ))}
                            </select>
                                {errorDomicilio && (
                                    <small className="text-danger">
                                        No fue posible cargar los departamentos. Recargá la página e intentá nuevamente.
                                    </small>
                                )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="municipio" className="form-label">Municipio de residencia</label>
                            <select className="form-control" id="municipio" name="municipio" value={municipioSeleccionado} onChange={manejarCambioMunicipio} disabled={municipios.length === 0} required>
                                <option value="">Selecciona tu municipio</option>
                                {municipios.map(municipio => (
                                    <option key={municipio.nombre} value={municipio.nombre}>
                                        {municipio.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="distrito" className="form-label">Distrito de residencia</label>
                            <select className="form-control" id="distrito" name="distrito" value={distritoSeleccionado} onChange={manejarCambioDistrito} disabled={distritos.length === 0} required>
                                <option value="">Selecciona tu distrito</option>
                                {distritos.map(distrito => (
                                    <option key={distrito.nombre} value={distrito.nombre}>
                                        {distrito.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Ocultos inicialmente para activarse dinámicamente según edad **/}
                        {mostrarDUI && (
                        <div className="mb-3" id="NDUI">
                            <label htmlFor="DUI" className="form-label">Número de DUI</label>
                            <input type="text" className="form-control" id="DUI" name="DUI" placeholder="01234567-8" maxLength="10" pattern="[0-9]{8}-[0-9]" title="Introduce un número de DUI válido (ej. 01234567-8)" autoComplete="off" required/>
                        </div>
                        )}

                        {mostrarNIT && (

                        <div className="mb-3" id="NNIT">
                            <label htmlFor="NIT" className="form-label">Número de NIT</label>
                            <input type="text" className="form-control" id="NIT" name="NIT" placeholder="0123-456789-123-4" maxLength="17" pattern="[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]" title="Introduce un número de NIT válido (ej. 0123-456789-123-4)" autoComplete="off" required/>
                        </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="discapacidad" className="form-label">¿Cuentas con alguna discapacidad?</label>
                            <select className="form-control" id="discapacidad" name="discapacidad" defaultValue="" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Física o motriz">Física o motriz</option>
                                <option value="Visual">Visual</option>
                                <option value="Auditiva">Auditiva</option>
                                <option value="Intelectual">Intelectual</option>
                                <option value="Ninguna">No poseo ninguna discapacidad</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nivel-educativo" className="form-label">Nivel educativo alcanzado</label>
                            <select className="form-control" id="nivel-educativo" name="nivel-educativo" defaultValue="" required>
                                <option value="" disabled>Selecciona tu nivel educativo</option>
                                <option value="Educación Básica">Educación Básica (Primero a noveno grado)</option>
                                <option value="Educación media">Educación media (Bachillerato)</option>
                                <option value="Técnico superior">Técnico superior (Instituto/Universidad)</option>
                                <option value="Educación superior">Educación superior (Licenciatura, Maestría, Doctorado)</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="situacion-actual" className="form-label">Situación laboral o académica actual</label>
                            <select className="form-control" id="situacion-actual" name="situacion-actual" defaultValue="" required>
                                <option value="" disabled>Selecciona tu situación actual</option>
                                <option value="Estudio">Estudio</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Trabajo y estudio">Trabajo y estudio</option>
                                <option value="Nini">No estudio ni trabajo</option>
                                <option value="Emprendedor">Emprendedor/a</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="internet" className="form-label">¿Cuentas con acceso a internet?</label>
                            <select className="form-control" id="internet" name="internet" defaultValue="" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Sí">Sí</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="computadora" className="form-label">¿Cuentas con computadora de escritorio o laptop?</label>
                            <select className="form-control" id="computadora" name="computadora" defaultValue="" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Sí">Sí</option>
                                <option value="Prestada">No, pero puedo pedir prestada</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="dominio-computadora" className="form-label">¿Cómo calificas tu dominio en el uso de la computadora?</label>
                            <select className="form-control" id="dominio-computadora" name="dominio-computadora" defaultValue="" required>
                                <option value="" disabled>Selecciona tu dominio</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                                <option value="Ninguno">No sé cómo usar una computadora</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="vinculacion" className="form-label">¿Deseas recibir apoyo para la vinculación laboral después de la formación?</label>
                            <select className="form-control" id="vinculacion" name="vinculacion" defaultValue="" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="Sí">Sí, me interesa el apoyo</option>
                                <option value="No">No, no me interesa el apoyo</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="medio-contacto" className="form-label">¿Cuál es tu medio de contacto preferido?</label>
                            <select className="form-control" id="medio-contacto" name="medio-contacto" defaultValue="" required>
                                <option value="" disabled>Selecciona una opción</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Correo electrónico">Correo electrónico</option>
                                <option value="Teléfono">Llamada telefónica</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Número de teléfono principal</label>
                            <input type="tel" className="form-control" id="telefono" name="telefono" placeholder="1234-5678" pattern="^\d{4}-\d{4}$" title="Introduce un número de teléfono válido (ej. 1234-5678)" minLength="9" maxLength="9" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="telefono2" className="form-label">Número de teléfono secundario (opcional)</label>
                            <input type="tel" className="form-control" id="telefono2" name="telefono2" placeholder="1234-5678" pattern="^\d{4}-\d{4}$" title="Introduce un número de teléfono válido (ej. 1234-5678)" minLength="9" maxLength="9"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" name="email" placeholder="tu@correo.com" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña de usuario</label>
                            <input type="password" className="form-control" id="password" name="password" placeholder="Contraseña" minLength="8" maxLength="100" required/>
                                <small className="text-muted">
                                    Mínimo 8 caracteres, incluyendo una mayúscula,
                                    una minúscula y un número.
                                </small>
                        </div>

                        <div className="col-completa">
                            <div className="mb-3">
                                <input type="checkbox" className="form-check-input" id="aceptarConsentimiento" name="aceptarConsentimiento" required/>
                                <label htmlFor="aceptarConsentimiento" className="form-check-label" > He leído y acepto el
                                    <a href="#" id="abrirConsentimiento" name="abrirConsentimiento" onClick={(e) => {e.preventDefault(); setMostrarConsentimiento(true);}}> consentimiento informado</a>
                                </label>
                            </div>
                            <div className="mb-3">
                                <p><button type="submit" className="estado btn btn-primary" disabled={cursos.length === 0}>Registrarme</button></p>
                                <p><button type="button" className="btn bg-info bg-opacity-10" onClick={() => navigate('/Login')}>¿Ya estás registrado? Iniciar sesión.</button></p>
                            </div>
                        </div>
                    </form>
                </section>

                <section className="consentimiento">
                    {mostrarConsentimiento && (
                        <div id="modalConsentimiento" className="modal" style={{display: 'flex', position: 'fixed', top: 0, left: 0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', zIndex:1000}}>
                            <div className="modal-contenido bg-white p-4 rounded shadow-lg" style={{maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto'}}>
                                <h2 style={{textAlign: 'center'}}>Consentimiento informado</h2>
                                <p>De conformidad con la <b>Ley de Protección de Datos Personales de la República de El Salvador</b>, por medio del presente formulario autorizas el tratamiento de tus datos personales solicitados en este formulario y otros que se necesiten posteriormente en el marco del proceso de selección y evaluación del Proyecto de Formación Técnica.</p>
                                <p>La información solicitada será utilizada únicamente para:</p>
                                <ul>
                                    <li>Gestionar tu registro y participación.</li>
                                    <li>Evaluar tu perfil académico y/o laboral.</li>
                                </ul>
                                <p>Tus datos serán tratados de manera confidencial y utilizados exclusivamente para los fines antes descritos.
                                No serán compartidos con terceros sin tu consentimiento, salvo obligación legal o requerimiento de autoridad competente.</p>

                                <p>La entrega de información es voluntaria; sin embargo, es necesaria para poder participar en el proceso. Asimismo, podrás solicitar la actualización, corrección o eliminación de tus datos personales conforme a la normativa vigente.</p>

                                <p>Si eres menor de 18 años, declaras que cuentas con la autorización de tu madre, padre o representante legal para proporcionar esta información y participar en el proceso del Proyecto de Formación Técnica.</p>

                                <p>Al marcar la opción de aceptación y enviar este formulario:</p>

                                <ol>
                                    <li>Confirmas que la información proporcionada es verdadera.</li>
                                    <li>Declaras que has leído y comprendido este consentimiento.</li>
                                    <li>Autorizas expresamente el uso y tratamiento de tus datos personales para los fines indicados.</li>
                                </ol>
                                <button className="btn btn-primary mt-3" type="button" id="cerrarConsentimiento" name="cerrarConsentimiento" onClick={() => setMostrarConsentimiento(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/*lateral derecho**/}
            <div className="lateral_registro">
                <p><b>"Formando al talento digital del mañana en El Salvador"</b></p>
                <p>Proyecto de Formación Técnica | AIDEL El Salvador</p>
                <img src="/recursos/joven_inicio.png" alt="Imagen de joven" className="imagen_registro"/>

                <div className="d-flex flex-column align-items-center gap-4 mt-2">
                    <div className="card border-0 shadow-sm bg-light" style={{maxWidth: '360px'}}>
                        <div className="card-body text-center p-4">
                            <div className="fs-1 text-primary mb-3"><i className="bi bi-journal-text"></i></div>
                            <h5 className="card-title fw-bold">1. Registro e Información</h5>
                            <p className="card-text text-muted">Ingresa tus datos personales y selecciona el programa de formación técnica al que deseas aplicar.</p>
                        </div>
                    </div>
                    <div className="card border-0 shadow-sm bg-light" style={{maxWidth: '360px'}}>
                        <div className="card-body text-center p-4">
                            <div className="fs-1 text-primary mb-3"><i className="bi bi-ui-checks"></i></div>
                            <h5 className="card-title fw-bold">2. Entrevista y Evaluaciones</h5>
                            <p className="card-text text-muted">Completa las fases de validación, pruebas psicométricas y entrevista virtual con el equipo evaluador.</p>
                        </div>
                    </div>
                    <div className="card border-0 shadow-sm bg-light" style={{maxWidth: '360px'}}>
                        <div className="card-body text-center p-4">
                            <div className="fs-1 text-primary mb-3"><i className="bi bi-graph-up-arrow"></i></div>
                            <h5 className="card-title fw-bold">3. Resultados y Seguimiento</h5>
                            <p className="card-text text-muted">Consulta tu avance en tiempo real desde tu portal de aspirante de forma transparente y rápida.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/*pie de página**/}
        <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
                <p className="mb-1">&copy; 2026 ProTalento Agencia Internacional de Desarrollo Local. Todos los derechos reservados.</p>
            </div>
        </footer>
    </main>
    
    </>
  );
}

export default RegistroAspirantes;