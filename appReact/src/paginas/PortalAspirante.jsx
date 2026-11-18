import { useState, useEffect, useRef } from "react";
import { cerrarSesion } from "../servicios_js/autenticaciones.js";

function PortalAspirante() {
  const [sesion, setSesion] = useState(null);
  const [archivoCV, setArchivoCV] = useState(null);
  const [archivoVideo, setArchivoVideo] = useState(null);
  const [cvEnviado, setCvEnviado] = useState(false);
  const [videoEnviado, setVideoEnviado] = useState(false);
  const [etapaActual, setEtapaActual] = useState(2);
  const [alerta, setAlerta] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const inputCVRef = useRef(null);
  const inputVideoRef = useRef(null);

  // Cargar sesión y datos del aspirante
  useEffect(() => {
    try {
      const sesionGuardada = JSON.parse(
        localStorage.getItem("sesion")
      );

      setSesion(sesionGuardada);

      if (!sesionGuardada) return;

      const usuarios = JSON.parse(
        localStorage.getItem("usuarios") || "[]"
      );

      const perfil = usuarios.find(
        (u) =>
          u.email === sesionGuardada.email ||
          u.id === sesionGuardada.id
      );

      if (perfil) {
        setCvEnviado(Boolean(perfil.cvAdjuntado));
        setVideoEnviado(Boolean(perfil.videoAdjuntado));

        setEtapaActual(
          perfil.etapaActual ||
          (perfil.cvAdjuntado && perfil.videoAdjuntado ? 3 : 2)
        );
      }
    } catch (error) {
      console.error("Error al cargar el portal:", error);
    }
  }, []);

  // Cerrar sesión
  const handleCerrarSesion = () => {
    cerrarSesion();
    window.location.href = "/login";
  };

  // Mostrar alerta en pantalla
  const mostrarAlerta = (mensaje, tipo = "success") => {
    setAlerta({ mensaje, tipo });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Guardar archivo en IndexedDB
  const guardarArchivoIndexedDB = (almacen, email, archivo) => {
    return new Promise((resolve, reject) => {
      const solicitud = indexedDB.open("ProTalentoDB", 1);

      solicitud.onupgradeneeded = (evento) => {
        const db = evento.target.result;

        if (!db.objectStoreNames.contains("curriculums")) {
          db.createObjectStore("curriculums", {
            keyPath: "email",
          });
        }

        if (!db.objectStoreNames.contains("videos")) {
          db.createObjectStore("videos", {
            keyPath: "email",
          });
        }
      };

      solicitud.onerror = () => {
        reject(solicitud.error);
      };

      solicitud.onsuccess = () => {
        const db = solicitud.result;

        if (!db.objectStoreNames.contains(almacen)) {
          db.close();
          reject(new Error(`No existe el almacén ${almacen}.`));
          return;
        }

        try {
          const transaccion = db.transaction(
            almacen,
            "readwrite"
          );

          const store = transaccion.objectStore(almacen);

          store.put({
            email,
            nombreArchivo: archivo.name,
            tipoArchivo: archivo.type,
            tamano: archivo.size,
            fecha: new Date().toISOString(),
            archivo,
          });

          transaccion.oncomplete = () => {
            db.close();
            resolve();
          };

          transaccion.onerror = () => {
            db.close();
            reject(transaccion.error);
          };

          transaccion.onabort = () => {
            db.close();
            reject(transaccion.error);
          };
        } catch (error) {
          db.close();
          reject(error);
        }
      };
    });
  };

  // Seleccionar y validar CV
  const handleSeleccionCV = (evento) => {
    const archivo = evento.target.files[0];

    if (!archivo) {
      setArchivoCV(null);
      return;
    }

    if (
      archivo.type !== "application/pdf" &&
      !archivo.name.toLowerCase().endsWith(".pdf")
    ) {
      mostrarAlerta(
        "El currículum debe estar en formato PDF.",
        "danger"
      );

      evento.target.value = "";
      setArchivoCV(null);
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      mostrarAlerta(
        "El currículum no puede superar los 5 MB.",
        "danger"
      );

      evento.target.value = "";
      setArchivoCV(null);
      return;
    }

    setArchivoCV(archivo);

    mostrarAlerta(
      `PDF seleccionado correctamente: ${archivo.name}`,
      "info"
    );
  };

  // Seleccionar y validar video
  const handleSeleccionVideo = (evento) => {
    const archivo = evento.target.files[0];

    if (!archivo) {
      setArchivoVideo(null);
      return;
    }

    const nombre = archivo.name.toLowerCase();

    if (!nombre.endsWith(".mp4") && !nombre.endsWith(".mov")) {
      mostrarAlerta(
        "El vídeo debe estar en formato MP4 o MOV.",
        "danger"
      );

      evento.target.value = "";
      setArchivoVideo(null);
      return;
    }

    if (archivo.size > 50 * 1024 * 1024) {
      mostrarAlerta(
        "El vídeo no puede superar los 50 MB.",
        "danger"
      );

      evento.target.value = "";
      setArchivoVideo(null);
      return;
    }

    setArchivoVideo(archivo);

    mostrarAlerta(
      `Vídeo seleccionado correctamente: ${archivo.name}`,
      "info"
    );
  };

  // Actualizar información del usuario en localStorage
  const actualizarUsuario = (tipo) => {
    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]"
    );

    const indice = usuarios.findIndex(
      (u) =>
        u.email === sesion.email ||
        u.id === sesion.id
    );

    if (indice === -1) {
      throw new Error("No se encontró el perfil del aspirante.");
    }

    if (tipo === "cv") {
      usuarios[indice].cvAdjuntado = true;
    }

    if (tipo === "video") {
      usuarios[indice].videoAdjuntado = true;
    }

    const ambosAdjuntos =
      usuarios[indice].cvAdjuntado &&
      usuarios[indice].videoAdjuntado;

    if (ambosAdjuntos) {
      usuarios[indice].etapaActual = 3;
      usuarios[indice].estado = "En revisión";

      setEtapaActual(3);
    }

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuarios)
    );

    return ambosAdjuntos;
  };

  // Enviar CV
  const handleEnviarCV = async () => {
    if (!sesion) {
      mostrarAlerta(
        "No se encontró una sesión activa.",
        "danger"
      );
      return;
    }

    if (!archivoCV) {
      mostrarAlerta(
        "Primero debes seleccionar tu currículum PDF.",
        "warning"
      );
      return;
    }

    setGuardando(true);

    try {
      await guardarArchivoIndexedDB(
        "curriculums",
        sesion.email,
        archivoCV
      );

      const ambosAdjuntos = actualizarUsuario("cv");

      setCvEnviado(true);

      mostrarAlerta(
        ambosAdjuntos
          ? "¡CV enviado correctamente! Ya entregaste ambos documentos. Tu expediente pasó a revisión."
          : "¡CV enviado con éxito! Tu expediente ha sido actualizado.",
        "success"
      );
    } catch (error) {
      console.error("Error al guardar CV:", error);

      mostrarAlerta(
        "No se pudo guardar el currículum. Inténtalo nuevamente.",
        "danger"
      );
    } finally {
      setGuardando(false);
    }
  };

  // Enviar video
  const handleEnviarVideo = async () => {
    if (!sesion) {
      mostrarAlerta(
        "No se encontró una sesión activa.",
        "danger"
      );
      return;
    }

    if (!archivoVideo) {
      mostrarAlerta(
        "Primero debes seleccionar un vídeo.",
        "warning"
      );
      return;
    }

    setGuardando(true);

    try {
      await guardarArchivoIndexedDB(
        "videos",
        sesion.email,
        archivoVideo
      );

      const ambosAdjuntos = actualizarUsuario("video");

      setVideoEnviado(true);

      mostrarAlerta(
        ambosAdjuntos
          ? "¡Vídeo enviado correctamente! Ya entregaste ambos documentos. Tu expediente pasó a revisión."
          : "¡Vídeo enviado con éxito! Tu expediente ha sido actualizado.",
        "success"
      );
    } catch (error) {
      console.error("Error al guardar vídeo:", error);

      mostrarAlerta(
        "No se pudo guardar el vídeo. Inténtalo nuevamente.",
        "danger"
      );
    } finally {
      setGuardando(false);
    }
  };

  // Cancelar selección CV
  const handleCancelarCV = () => {
    setArchivoCV(null);

    if (inputCVRef.current) {
      inputCVRef.current.value = "";
    }

    setAlerta(null);
  };

  // Cancelar selección video
  const handleCancelarVideo = () => {
    setArchivoVideo(null);

    if (inputVideoRef.current) {
      inputVideoRef.current.value = "";
    }

    setAlerta(null);
  };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* ENCABEZADO */}
            <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm px-4 py-3">
                <div className="container-fluid">
                    <div className="d-flex align-items-center gap-2">
                        <img
                            src="./recursos/logo_AIDEL.png"
                            alt="Logo ProTalento"
                            className="logo_portalAspirante"
                        />

            <span className="fs-4 fw-bold text-dark mb-0">
              ProTalento
            </span>
          </div>

          {/* Usuario autenticado + botón salir */}
          <div className="d-flex align-items-center gap-3">
            <span
              id="lbl-usuario"
              className="fw-semibold text-secondary small"
            >
              Bienvenido, {sesion?.nombre || "Aspirante"}
            </span>

            <div className="topbar-user">
              <span id="lbl-admin-topbar"></span>
              <i className="bi bi-person-circle"></i>
            </div>

            <button
              type="button"
              onClick={handleCerrarSesion}
              className="btn btn-outline-danger btn-sm font-weight-bold"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container my-5 flex-grow-1">

        {/* Mensaje de motivación */}
        <div className="text-center mb-5">
          <p className="text-muted fs-5 max-w-75 mx-auto">
            ¡No te detengas ahora! Estás cada vez más cerca de tu meta.
            Completa tu proceso de selección y demuestra tu potencial.
          </p>
        </div>

        {/* Línea de tiempo */}
        <div className="mb-5 overflow-auto pb-3">
          <div className="d-flex justify-content-between align-items-center position-relative min-w-750px px-3">

            {/* Línea de fondo */}
            <div
              className="position-absolute w-100 bg-secondary-subtle"
              style={{
                height: "4px",
                top: "18px",
                zIndex: 0,
                left: "0",
              }}
            ></div>

            {/* Línea de progreso */}
            <div
              id="linea-progreso"
              className="position-absolute bg-primary"
              style={{
                height: "4px",
                top: "18px",
                zIndex: 0,
                left: "0",
                width: etapaActual >= 3 ? "20%" : "0%",
              }}
            ></div>

            {/* Paso 1 */}
            <div className="text-center z-1">
              <div className="step-badge bg-primary text-white mx-auto shadow-sm">
                ✓
              </div>

              <span className="badge bg-primary mt-2 rounded-pill px-3 py-1">
                Registro
              </span>
            </div>

            {/* Paso 2 */}
            <div className="text-center z-1">
              <div
                className={`step-badge ${
                  etapaActual >= 3
                    ? "bg-primary text-white"
                    : "bg-white border border-primary text-primary"
                } mx-auto shadow-sm`}
              >
                {etapaActual >= 3 ? "✓" : "2"}
              </div>

              <span className="badge bg-primary mt-2 rounded-pill px-3 py-1">
                Envío de CV y Vídeo
              </span>
            </div>

            {/* Paso 3 */}
            <div className="text-center z-1">
              <div
                className={`step-badge ${
                  etapaActual >= 3
                    ? "bg-primary text-white"
                    : "bg-secondary-subtle text-secondary"
                } mx-auto`}
              >
                {etapaActual >= 3 ? "✓" : "3"}
              </div>

              <span
                className={`badge mt-2 rounded-pill px-3 py-1 ${
                  etapaActual >= 3
                    ? "bg-primary text-white"
                    : "bg-secondary-subtle text-secondary"
                }`}
              >
                Validación
              </span>
            </div>

            {/* Paso 4 */}
            <div className="text-center z-1">
              <div className="step-badge bg-secondary-subtle text-secondary mx-auto">
                4
              </div>

              <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">
                Entrevista virtual
              </span>
            </div>

            {/* Paso 5 */}
            <div className="text-center z-1">
              <div className="step-badge bg-secondary-subtle text-secondary mx-auto">
                5
              </div>

              <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">
                Pruebas Psicométricas
              </span>
            </div>

            {/* Paso 6 */}
            <div className="text-center z-1">
              <div className="step-badge bg-secondary-subtle text-secondary mx-auto">
                6
              </div>

              <span className="badge bg-secondary-subtle text-secondary mt-2 rounded-pill px-3 py-1">
                Prueba Técnica
              </span>
            </div>

          </div>
        </div>

        {/* Alerta dinámica */}
        {alerta && (
          <div
            className={`alert alert-${alerta.tipo} text-center rounded-3 mb-4`}
            role="alert"
          >
            {alerta.mensaje}
          </div>
        )}

        {/* CARDS DE CARGA */}
        <div className="row g-4">

          {/* CARD CV */}
          <div className="col-md-6">
            <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 d-flex flex-column justify-content-between shadow-sm">
              <div>
                <h2 className="h5 fw-bold text-dark mb-1">
                  Adjuntar Currículum Vitae (PDF)
                </h2>

                <p className="text-muted small">
                  Por favor adjunta tu currículum en formato PDF.
                  Asegúrate de que el archivo no supere los 5 MB.
                </p>

                <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                  <div className="fs-1 text-primary mb-2">
                    ☁️
                  </div>

                  <p className="fw-bold text-dark small mb-0">
                    Arrastra tu archivo aquí o explora
                  </p>

                  <p className="text-muted text-xs mb-3">
                    Formato: .pdf &amp; Tamaño máx.: 5 MB
                  </p>

                  <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm cursor-pointer">
                    Buscar Archivo

                    <input
                      type="file"
                      id="inputCV"
                      accept=".pdf,application/pdf"
                      className="d-none"
                      ref={inputCVRef}
                      onChange={handleSeleccionCV}
                    />
                  </label>

                  {archivoCV && (
                    <div className="mt-3 text-success small fw-semibold">
                      📄 {archivoCV.name}
                    </div>
                  )}

                  {cvEnviado && !archivoCV && (
                    <div className="mt-3 text-success small fw-semibold">
                      ✓ CV enviado anteriormente
                    </div>
                  )}
                </div>
              </div>

              <div className="row g-2 mt-4">
                <div className="col-6">
                  <button
                    type="button"
                    onClick={handleCancelarCV}
                    className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="col-6">
                  <button
                    type="button"
                    onClick={handleEnviarCV}
                    disabled={guardando}
                    className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm"
                  >
                    {guardando ? "Guardando..." : "Enviar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD VIDEO */}
          <div className="col-md-6">
            <div className="card bg-custom-card border-info-subtle rounded-4 h-100 p-4 d-flex flex-column justify-content-between shadow-sm">
              <div>
                <h2 className="h5 fw-bold text-dark mb-1">
                  Vídeo de Presentación
                </h2>

                <p className="text-muted small">
                  Explica brevemente por qué deseas participar en el curso
                  de formación técnica de AIDEL.
                </p>

                <div className="border border-2 border-dashed border-info rounded-4 p-4 text-center bg-white bg-opacity-50 mt-4">
                  <div className="fs-1 text-primary mb-2">
                    ☁️
                  </div>

                  <p className="fw-bold text-dark small mb-0">
                    Arrastra tu archivo de vídeo aquí o explora
                  </p>

                  <p className="text-muted text-xs mb-3">
                    Formatos: .mp4, .mov &amp; Tamaño máx.: 50 MB
                  </p>

                  <label className="btn btn-naranja btn-sm px-4 rounded-3 shadow-sm cursor-pointer">
                    Buscar Vídeo

                    <input
                      type="file"
                      id="inputVideo"
                      accept=".mp4,.mov,video/mp4,video/quicktime"
                      className="d-none"
                      ref={inputVideoRef}
                      onChange={handleSeleccionVideo}
                    />
                  </label>

                  {archivoVideo && (
                    <div className="mt-3 text-success small fw-semibold">
                      🎥 {archivoVideo.name}
                    </div>
                  )}

                  {videoEnviado && !archivoVideo && (
                    <div className="mt-3 text-success small fw-semibold">
                      ✓ Vídeo enviado anteriormente
                    </div>
                  )}
                </div>
              </div>

              <div className="row g-2 mt-4">
                <div className="col-6">
                  <button
                    type="button"
                    onClick={handleCancelarVideo}
                    className="btn btn-light border w-100 rounded-3 text-secondary fw-bold btn-sm"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="col-6">
                  <button
                    type="button"
                    onClick={handleEnviarVideo}
                    disabled={guardando}
                    className="btn btn-primary w-100 rounded-3 fw-bold btn-sm shadow-sm"
                  >
                    {guardando ? "Guardando..." : "Enviar"}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default PortalAspirante;