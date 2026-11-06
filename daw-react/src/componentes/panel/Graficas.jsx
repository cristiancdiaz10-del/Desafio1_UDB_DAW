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

function Graficas({ aspirantes, onFiltrarEstado }) {
  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  const conteoPorMes = Array(12).fill(0);

  aspirantes.forEach((aspirante) => {
    const fecha = aspirante.fechaRegistro
      ? new Date(aspirante.fechaRegistro)
      : new Date();

    if (!Number.isNaN(fecha.getTime())) {
      conteoPorMes[fecha.getMonth()]++;
    }
  });

  const contar = (opciones) =>
    aspirantes.filter((aspirante) =>
      opciones.includes(
        (aspirante.estado || "Postulado").trim().toLowerCase()
      )
    ).length;

  const revision = contar(["en revisión", "en revision"]);
  const entrevistados = contar(["entrevistado", "en entrevista"]);
  const seleccionados = contar([
    "aprobado",
    "seleccionado",
    "seleccionado/a",
  ]);
  const rechazados = contar([
    "rechazado",
    "no seleccionado",
    "no seleccionado/a",
  ]);

  const postulados = aspirantes.filter((aspirante) => {
  const estado = (aspirante.estado || "Postulado")
    .trim()
    .toLowerCase();

  return estado === "postulado";
}).length;

  const datosFlujo = {
    labels: meses,
    datasets: [
      {
        label: "Postulaciones",
        data: conteoPorMes,
        borderColor: "#0d5cab",
        backgroundColor: "rgba(13, 92, 171, 0.1)",
        tension: 0.35,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const estados = [
  "Postulado",
  "En revisión",
  "Entrevistados",
  "Seleccionados",
  "No seleccionados",
 ];

  const datosEstados = {
  labels: estados,
  datasets: [
    {
      data: [
        postulados,
        revision,
        entrevistados,
        seleccionados,
        rechazados,
      ],
      backgroundColor: [
        "#8b5cf6",
        "#6b7280",
        "#f59e0b",
        "#3b82f6",
        "#10b981",
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
        ticks: { stepSize: 1 },
      },
    },
  };

  const opcionesEstados = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_evento, elementos) => {
      if (elementos.length > 0) {
        onFiltrarEstado(estados[elementos[0].index]);
      }
    },
    plugins: {
      legend: {
        position: "bottom",
        onClick: (_evento, item) => {
          onFiltrarEstado(estados[item.index]);
        },
      },
    },
  };

  return (
    <section className="charts-grid">
      <article className="chart-card">
        <h3>Flujo de solicitudes</h3>

        <div className="chart-container">
          <Line data={datosFlujo} options={opcionesFlujo} />
        </div>
      </article>

      <article className="chart-card">
        <h3>Estados</h3>

        <div className="chart-container">
          <Doughnut data={datosEstados} options={opcionesEstados} />
        </div>
      </article>
    </section>
  );
}

export default Graficas;