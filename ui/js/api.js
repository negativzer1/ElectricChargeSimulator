// js/api.js
const API_URL = '/api/simulation/calculate';
const TEST_DATA_URL = 'data/example-response.json';

async function calculateSimulation(payload) {
    let response;
    try {
        response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        throw new Error('Сервер недоступен. Проверьте подключение.');
    }

    let data = null;
    try {
        data = await response.json();
    } catch {
        throw new Error('Сервер вернул некорректный ответ (не JSON).');
    }

    if (!response.ok) {
        const msg = (data && data.error) ? data.error : `Ошибка ${response.status}`;
        throw new Error(msg);
    }

    validateResponse(data);
    return data;
}

async function loadExampleResponse() {
    const response = await fetch(TEST_DATA_URL);
    if (!response.ok) throw new Error('Не удалось загрузить тестовый JSON.');
    const data = await response.json();
    validateResponse(data);
    // имитация задержки сети
    await new Promise(r => setTimeout(r, 300));
    return data;
}

function validateResponse(data) {
    if (!data || data.success !== true) {
        throw new Error((data && data.error) || 'Некорректный ответ сервера.');
    }
    if (!Array.isArray(data.points) || data.points.length === 0) {
        throw new Error('Ответ сервера не содержит точек траектории.');
    }
    for (const p of data.points) {
        if (![p.time, p.x, p.y, p.vx, p.vy, p.energy].every(Number.isFinite)) {
            throw new Error('В ответе сервера есть некорректные числовые значения.');
        }
    }
}