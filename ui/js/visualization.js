// js/visualization.js
function drawTrajectory(canvas, points, charges) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (!points || points.length === 0) return;

    // 1. Границы с учётом точки (0,0), где стоит q1
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
    }
    const rangeX = (maxX - minX) || 1;
    const rangeY = (maxY - minY) || 1;
    const padding = 40;
    const scale = Math.min((W - 2 * padding) / rangeX, (H - 2 * padding) / rangeY);

    const toPx = (x, y) => [
        padding + (x - minX) * scale,
        H - padding - (y - minY) * scale
    ];

    // 2. Оси
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    const [ox, oy] = toPx(0, 0);
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

    // 3. Траектория
    ctx.strokeStyle = '#1e88e5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, i) => {
        const [px, py] = toPx(p.x, p.y);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // 4. Неподвижный заряд q1 в (0,0)
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath();
    ctx.arc(ox, oy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '14px sans-serif';
    ctx.fillText('q1', ox + 10, oy - 10);

    // 5. Начальное положение q2
    const [sx, sy] = toPx(points[0].x, points[0].y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, 8, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Текущее (конечное) положение q2 — цвет по знаку произведения зарядов
    const [ex, ey] = toPx(points[points.length - 1].x, points[points.length - 1].y);
    const attract = charges && (charges.q1 * charges.q2 < 0);
    ctx.fillStyle = attract ? '#1565c0' : '#ef6c00';
    ctx.beginPath();
    ctx.arc(ex, ey, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillText('q2', ex + 10, ey - 10);
}