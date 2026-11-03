import {Link, useNavigate} from "react-router-dom";

function RegistroAspirantes() {
  const navigate = useNavigate();

  return (
    <>
     <main>
        <div className="container_registro">
            {/* encabezado **/}
            <div className="contenido_registro">
                <div className="encabezado_registro">
                    <Link to="/Index">
                        <img src="recursos/logo_AIDEL.png" alt="Logo AIDEL" className="logo_registro"/>
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
                    <form className="formulario-registro" id="formRegistro">
                        <div className="col-completa">
                            <div className="mb-3">
                                <label htmlFor="curso" className="form-label">Curso de interés</label>
                                <select className="form-control" id="curso" required>
                                    <option value="" disabled defaultValue>Selecciona el curso de formación que te interesa</option>
                                    <option value="Análisis de datos con herramientas de IA">Análisis de datos con herramientas de IA</option>
                                    <option value="Logística portuaria y cadena de suministros">Logística portuaria y cadena de suministros</option>
                                    <option value="Lenguajes de programación: JavaScript y C#">Lenguajes de programación: JavaScript y C#</option>
                                    <option value="Asistente Administrativo y Manejo de Caja">Asistente Administrativo y Manejo de Caja</option>
                                    <option value="Redes informáticas">Redes informáticas</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre completo</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Juan Pérez" minLenght="20" maxLenght="100" pattern="[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+" title="Introduce tus nombres y apellidos" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="sexo" className="form-label">Indica tu sexo</label>
                            <select className="form-control" id="sexo" required>
                                <option value="" disabled defaultValue>Selecciona tu sexo</option>
                                <option value="Mujer">Mujer</option>
                                <option value="Hombre">Hombre</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nacimiento" className="form-label">Fecha de nacimiento</label>
                            <input type="date" className="form-control" id="nacimiento" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="departamento" className="form-label">Departamento de residencia</label>
                            <select className="form-control" id="departamento" required>
                                <option value="">Selecciona tu departamento</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="municipio" className="form-label">Municipio de residencia</label>
                            <select className="form-control" id="municipio" required disabled>
                                <option value="">Selecciona tu municipio</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="distrito" className="form-label">Distrito de residencia</label>
                            <select className="form-control" id="distrito" required disabled>
                                <option value="">Selecciona tu distrito</option>
                            </select>
                        </div>

                        {/* Ocultos inicialmente para activarse dinámicamente según edad **/}
                        <div className="mb-3 d-none" id="NDUI">
                            <label htmlFor="DUI" className="form-label">Número de DUI</label>
                            <input type="text" className="form-control" id="DUI" placeholder="01234567-8" maxLenght="10" pattern="[0-9]{8}-[0-9]" title="Introduce un número de DUI válido (ej. 01234567-8)" autoComplete="off"/>
                        </div>

                        <div className="mb-3 d-none" id="NNIT">
                            <label htmlFor="NIT" className="form-label">Número de NIT</label>
                            <input type="text" className="form-control" id="NIT" placeholder="0123-456789-123-4" maxLenght="17" pattern="[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]" title="Introduce un número de NIT válido (ej. 0123-456789-123-4)" autoComplete="off"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="discapacidad" className="form-label">¿Cuentas con alguna discapacidad?</label>
                            <select className="form-control" id="discapacidad" required>
                                <option value="" disabled defaultValue>Selecciona una opción</option>
                                <option value="Física o motriz">Física o motriz</option>
                                <option value="Visual">Visual</option>
                                <option value="Auditiva">Auditiva</option>
                                <option value="Intelectual">Intelectual</option>
                                <option value="Ninguna">No poseo ninguna discapacidad</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="nivel-educativo" className="form-label">Nivel educativo alcanzado</label>
                            <select className="form-control" id="nivel-educativo" required>
                                <option value="" disabled defaultValue>Selecciona tu nivel educativo</option>
                                <option value="Educación Básica">Educación Básica (Primero a noveno grado)</option>
                                <option value="Educación media">Educación media (Bachillerato)</option>
                                <option value="Técnico superior">Técnico superior (Instituto/Universidad)</option>
                                <option value="Educación superior">Educación superior (Licenciatura, Maestría, Doctorado)</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="situacion-actual" className="form-label">Situación laboral o académica actual</label>
                            <select className="form-control" id="situacion-actual" required>
                                <option value="" disabled defaultValue>Selecciona tu situación actual</option>
                                <option value="Estudio">Estudio</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Trabajo y estudio">Trabajo y estudio</option>
                                <option value="Nini">No estudio ni trabajo</option>
                                <option value="Emprendedor">Emprendedor/a</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="internet" className="form-label">¿Cuentas con acceso a internet?</label>
                            <select className="form-control" id="internet" required>
                                <option value="" disabled defaultValue>Selecciona una opción</option>
                                <option value="Sí">Sí</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="computadora" className="form-label">¿Cuentas con computadora de escritorio o laptop?</label>
                            <select className="form-control" id="computadora" required>
                                <option value="" disabled defaultValue>Selecciona una opción</option>
                                <option value="Sí">Sí</option>
                                <option value="Prestada">No, pero puedo pedir prestada</option>
                                <option value="No">No</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="dominio-computadora" className="form-label">¿Cómo calificas tu dominio en el uso de la computadora?</label>
                            <select className="form-control" id="dominio-computadora" required>
                                <option value="" disabled defaultValue>Selecciona tu dominio</option>
                                <option value="Básico">Básico</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                                <option value="Ninguno">No sé cómo usar una computadora</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="vinculacion" className="form-label">¿Deseas recibir apoyo para la vinculación laboral después de la formación?</label>
                            <select className="form-control" id="vinculacion" required>
                                <option value="" disabled defaultValue>Selecciona una opción</option>
                                <option value="Sí">Sí, me interesa el apoyo</option>
                                <option value="No">No, no me interesa el apoyo</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="medio-contacto" className="form-label">¿Cuál es tu medio de contacto preferido?</label>
                            <select className="form-control" id="medio-contacto" required>
                                <option value="" disabled defaultValue>Selecciona una opción</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Correo electrónico">Correo electrónico</option>
                                <option value="Teléfono">Llamada telefónica</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="telefono" className="form-label">Número de teléfono principal</label>
                            <input type="tel" className="form-control" id="telefono" placeholder="1234-5678" pattern="^\d{4}-\d{4}$" title="Introduce un número de teléfono válido (ej. 1234-5678)" minLenght="8" maxLenght="13" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="telefono2" className="form-label">Número de teléfono secundario (opcional)</label>
                            <input type="tel" className="form-control" id="telefono2" placeholder="1234-5678" pattern="^\d{4}-\d{4}$" title="Introduce un número de teléfono válido (ej. 1234-5678)" minLenght="8" maxLenght="13"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo electrónico</label>
                            <input type="email" className="form-control" id="email" placeholder="tu@correo.com" required/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña de usuario</label>
                            <input type="password" className="form-control" id="password" placeholder="Contraseña" minLenght="8" maxLenght="100" required/>
                        </div>

                        <div className="col-completa">
                            <div className="mb-3">
                                <input type="checkbox" id="aceptarConsentimiento" required/>
                                <label htmlFor="aceptarConsentimiento">
                                    He leído y acepto el
                                    <a href="#" id="abrirConsentimiento">consentimiento informado</a>
                                </label>
                            </div>
                            <div className="mb-3">
                                <p><button type="submit" className="estado btn btn-primary">Registrarme</button></p>
                                <p><button type="button" className="btn bg-info bg-opacity-10" onClick={() => navigate('/Login')}>¿Ya estás registrado? Iniciar sesión.</button></p>
                            </div>
                        </div>
                    </form>
                </section>

                <section className="consentimiento">
                    <div id="modalConsentimiento" className="modal" style={{display: 'none', position: 'fixed', top: 0, left: 0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', zIndex:1000}}>
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
                            <button className="btn btn-primary mt-3" type="button" id="cerrarConsentimiento">Cerrar</button>
                        </div>
                    </div>
                </section>
            </div>

            {/*lateral derecho**/}
            <div className="lateral_registro">
                <p><b>"Formando al talento digital del mañana en El Salvador"</b></p>
                <p>Proyecto de Formación Técnica | AIDEL El Salvador</p>
                <img src="recursos/joven_inicio.png" alt="Imagen de joven" className="imagen_registro"/>

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

export default RegistroAspirantes