// js/app.js
(function () {
    const form = document.getElementById('simulation-form');
    const btnCalc = document.getElementById('btn-calculate');
    const btnReset = document.getElementById('btn-reset');
    const btnRepeat = document.getElementById('btn-repeat');
    const useTestData = document.getElementById('use-test-data');
    const errorBox = document.getElementById('error-message');
    const canvas = document.getElementById('trajectory-canvas');
    const energyDiv = 'energy-chart';

    let lastResponse = null;

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.hidden = false;
    }
    function clearError() {
        errorBox.textContent = '';
        errorBox.hidden = true;
    }

    function readForm() {
        const fd = new FormData(form);
        const num = name => {
            const v = parseFloat(fd.get(name));
            if (!Number.isFinite(v)) throw new Error(`Поле "${name}" должно быть числом.`);
            return v;
        };
        const steps = parseInt(fd.get('stepsPerCharacteristicTime'), 10);
        if (!Number.isInteger(steps) || steps <= 0)
            throw new Error('"Шагов на характерное время" — целое положительное число.');

        const payload = {
            mass: num('mass'),
            q1: num('q1'),
            q2: num('q2'),
            initialX: num('initialX'),
            initialY: num('initialY'),
            initialVx: num('initialVx'),
            initialVy: num('initialVy'),
            duration: num('duration'),
            stepsPerCharacteristicTime: steps
        };

        if (payload.mass <= 0) throw new Error('Масса должна быть больше нуля.');
        if (payload.duration <= 0) throw new Error('Время моделирования должно быть больше нуля.');

        return payload;
    }

    function fillResults(data, payload) {
        document.getElementById('res-points').textContent = data.points.length;
        document.getElementById('res-duration').textContent = payload.duration;
        document.getElementById('res-timestep').textContent = data.timeStep;
        document.getElementById('res-initenergy').textContent = data.initialEnergy;
        document.getElementById('res-maxerror').textContent = data.maxRelativeEnergyError;
    }

    async function runCalculation() {
        clearError();
        btnCalc.disabled = true;
        btnRepeat.disabled = true;
        const oldText = btnCalc.textContent;
        btnCalc.textContent = 'Расчёт…';

        try {
            const payload = readForm();
            const data = useTestData.checked
                ? await loadExampleResponse()
                : await calculateSimulation(payload);

            lastResponse = data;
            drawTrajectory(canvas, data.points, { q1: payload.q1, q2: payload.q2 });
            drawEnergyChart(energyDiv, data.points);
            fillResults(data, payload);
        } catch (e) {
            showError(e.message || 'Неизвестная ошибка');
        } finally {
            btnCalc.disabled = false;
            btnRepeat.disabled = false;
            btnCalc.textContent = oldText;
        }
    }

    function resetAll() {
        form.reset();
        clearError();
        lastResponse = null;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearEnergyChart(energyDiv);
        ['res-points', 'res-duration', 'res-timestep', 'res-initenergy', 'res-maxerror']
            .forEach(id => document.getElementById(id).textContent = '—');
    }

    form.addEventListener('submit', e => { e.preventDefault(); runCalculation(); });
    btnReset.addEventListener('click', resetAll);
    btnRepeat.addEventListener('click', runCalculation);
})();