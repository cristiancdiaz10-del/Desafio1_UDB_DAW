import { useMemo } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

import {
  obtenerIndicadores,
  obtenerPostulacionesPorMesYAnio,
} from "../../servicios_js/panel-control.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const estados = [
  "Seleccionados",
  "No seleccionados",
];

function Graficas({ aspirantes = [], onFiltrarEstado }) {
  const indicadores = useMemo(
    () => obtenerIndicadores(aspirantes),
    [aspirantes]
  );

  const flujo = useMemo(
    () => obtenerPostulacionesPorMesYAnio(aspirantes),
    [aspirantes]
  );

  const datosFlujo = {
    labels: flujo.etiquetas,
    datasets: [
      {
        label: "Postulaciones",
        data: flujo.cantidades,
        borderColor: "#0d5cab",
        backgroundColor: "rgba(13, 92, 171, 0.1)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const datosEstados = {
    labels: estados,
    datasets: [
      {
        data: [
          indicadores.seleccionados,
          indicadores.rechazados,
        ],
        backgroundColor: [
          "#10b981",
          "#f59e0b",
        ],
        borderWidth: 2,
      },
    ],
  };

  const opcionesFlujo = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  const opcionesEstados = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_evento, elementos) => {
      if (elementos.length > 0) {
        onFiltrarEstado?.(estados[elementos[0].index]);
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        onClick: (_evento, item) => {
          onFiltrarEstado?.(estados[item.index]);
        },
      },
    },
  };

  return (
    <section className="charts-grid">
      <article className="chart-card">
        <h3>Flujo de solicitudes</h3>

        <div className="chart-container">
          <Line
            data={datosFlujo}
            options={opcionesFlujo}
          />
        </div>
      </article>

      <article className="chart-card">
        <h3>Distribución por estados</h3>

        <div className="chart-container">
          <Doughnut
            data={datosEstados}
            options={opcionesEstados}
          />
        </div>
      </article>
    </section>
  );
}

export default Graficas;
