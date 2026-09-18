// DATOS DE PRUEBA /DASHBOARD

const datosDashboard = {
    postulados: 100,
    revision: 52,
    entrevistados: 22,
    seleccionados: 15,
    rechazados: 11
};

//GRAFICA 1 -- FLUJO DE SOLICITUDES

const graficaFlujo = document.getElementById("flujoSolicitudes");

if (graficaFlujo) {

    new Chart(graficaFlujo, {
        type: "line",

        data: {
            labels: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio"
            ],

            datasets: [{
                label: "Solicitudes",
                data: [35, 48, 42, 65, 78, 100],

                borderWidth: 2,
                tension: 0.3,

                fill: false
            }]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// GRAFICA 2 -- ESTADOS DE ASPIRANTES

const graficaEstados = document.getElementById("estadosAspirantes");

if (graficaEstados) {

    new Chart(graficaEstados, {
        type: "doughnut",

        data: {
            labels: [
                "Postulados",
                "En revisión",
                "Entrevistados",
                "Seleccionados",
                "Rechazados"
            ],

            datasets: [{
                data: [
                    datosDashboard.postulados,
                    datosDashboard.revision,
                    datosDashboard.entrevistados,
                    datosDashboard.seleccionados,
                    datosDashboard.rechazados
                ],

                borderWidth: 1
            }]
        },

        options: {
            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}
