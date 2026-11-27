// js/charts.js
function drawEnergyChart(containerId, points) {
    const x = points.map(p => p.time);
    const y = points.map(p => p.energy);
    Plotly.react(containerId, [{
        x, y,
        type: 'scatter',
        mode: 'lines',
        name: 'E(t)',
        line: { color: '#43a047' }
    }], {
        margin: { t: 30, r: 20, b: 40, l: 60 },
        xaxis: { title: 'Время, с' },
        yaxis: { title: 'Энергия, Дж' }
    }, { responsive: true });
}

function clearEnergyChart(containerId) {
    Plotly.purge(containerId);
}