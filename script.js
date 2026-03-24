/* ===================================================================
   ADARSH BARNAWAL — PORTFOLIO JAVASCRIPT
   Hand-drawn sketch-style data analytics background
   Whiteboard aesthetic with wobbly lines, hatched fills,
   charts, Venn diagrams, formulas, geometric shapes
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----- Initialize AOS (Animate on Scroll) -----
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
    });

    // =================================================================
    //  SKETCH-STYLE DATA-VIZ CANVAS BACKGROUND
    // =================================================================
    const canvas = document.getElementById('dataVizCanvas');
    const ctx = canvas.getContext('2d');
    let cw, ch;
    let elements = [];

    function resizeCanvas() {
        cw = canvas.width = window.innerWidth;
        ch = canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight * 4);
        generateElements();
        drawAll();
    }

    // Pencil-sketch color palette
    const sketchColors = [
        'rgba(100, 90, 120, ',   // Graphite
        'rgba(108, 99, 255, ',   // Indigo
        'rgba(50, 130, 180, ',   // Blue
        'rgba(70, 145, 110, ',   // Green
        'rgba(185, 85, 85, ',    // Rose
        'rgba(170, 130, 50, ',   // Amber
        'rgba(130, 110, 150, ',  // Lavender
        'rgba(90, 120, 160, ',   // Steel
    ];

    function rc() { return sketchColors[Math.floor(Math.random() * sketchColors.length)]; }

    // ---- Core sketch helpers ----

    // Subtly wobbly hand-drawn line — clean but not perfect
    function sketchLine(x1, y1, x2, y2, color, lineW) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineW || 0.9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const dist = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(Math.floor(dist / 8), 3);
        const wobble = 0.35;

        ctx.beginPath();
        ctx.moveTo(x1 + (Math.random() - 0.5) * wobble, y1 + (Math.random() - 0.5) * wobble);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const mx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * wobble;
            const my = y1 + (y2 - y1) * t + (Math.random() - 0.5) * wobble;
            ctx.lineTo(mx, my);
        }
        ctx.stroke();
        ctx.restore();
    }

    // Sketchy rectangle with wobbly edges
    function sketchRect(x, y, w, h, color, lineW) {
        sketchLine(x, y, x + w, y, color, lineW);
        sketchLine(x + w, y, x + w, y + h, color, lineW);
        sketchLine(x + w, y + h, x, y + h, color, lineW);
        sketchLine(x, y + h, x, y, color, lineW);
    }

    // Wobbly circle — intentionally imperfect
    function sketchCircle(cx, cy, r, color, lineW) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineW || 0.9;
        ctx.lineCap = 'round';
        const wobble = r * 0.02;

        ctx.beginPath();
        const startR = r + (Math.random() - 0.5) * wobble;
        ctx.moveTo(cx + startR, cy);
        for (let i = 1; i <= 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const wr = r + (Math.random() - 0.5) * wobble * 2;
            ctx.lineTo(cx + Math.cos(angle) * wr, cy + Math.sin(angle) * wr);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    // Hatched fill (hand-drawn fill instead of solid)
    function hatchFill(x, y, w, h, color, spacing, angle) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.4;
        ctx.lineCap = 'round';
        const sp = spacing || 4;
        const a = angle || Math.PI / 4;
        const cos = Math.cos(a);
        const sin = Math.sin(a);

        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        const maxDim = Math.max(w, h) * 2;
        for (let d = -maxDim; d < maxDim; d += sp) {
            const sx = x + w / 2 + d * cos - maxDim * sin;
            const sy = y + h / 2 + d * sin + maxDim * cos;
            const ex = x + w / 2 + d * cos + maxDim * sin;
            const ey = y + h / 2 + d * sin - maxDim * cos;
            // Wobbly hatch line
            ctx.moveTo(sx + (Math.random() - 0.5) * 0.3, sy + (Math.random() - 0.5) * 0.3);
            ctx.lineTo(ex + (Math.random() - 0.5) * 0.3, ey + (Math.random() - 0.5) * 0.3);
        }
        ctx.stroke();
        ctx.restore();
    }

    // Hand-drawn text
    function sketchText(text, x, y, color, size, font) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${size || 11}px ${font || "'Courier New', monospace"}`;
        const rot = (Math.random() - 0.5) * 0.012;
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillText(text, 0, 0);
        ctx.restore();
    }

    // ---- Element drawing functions ----

    function drawBarChart(el) {
        const { x, y, alpha, col1, col2 } = el;
        const w = el.w, h = el.h;
        const cAxis = col1 + (alpha * 0.45) + ')';
        const cText = col1 + (alpha * 0.5) + ')';

        // Axes with slight overshoot (human style)
        sketchLine(x - 3, y + 2, x - 3, y - h - 8, cAxis, 0.9);
        sketchLine(x - 5, y + 2, x + w + 5, y + 2, cAxis, 0.9);

        // Bars with hatched fill (incomplete, sketchy)
        const barCount = el.bars.length;
        const barW = (w - 10) / (barCount * 1.5);
        const gap = barW * 0.5;
        el.bars.forEach((bh, i) => {
            const bx = x + 5 + i * (barW + gap);
            const barH = bh * h * 0.85;
            const c = i % 3 === 0 ? col1 : i % 3 === 1 ? col2 : sketchColors[3];

            // Hatched fill — intentionally doesn't cover full bar
            const fillH = barH * (0.7 + Math.random() * 0.25); // Incomplete fill
            hatchFill(bx + 1, y - fillH + 2, barW - 2, fillH - 2,
                c + (alpha * 0.25) + ')', 3 + Math.random() * 2, Math.PI / 4 + (Math.random() - 0.5) * 0.3);

            // Bar outline — deliberately not perfectly closed
            sketchLine(bx, y, bx, y - barH, c + (alpha * 0.55) + ')', 0.8);
            sketchLine(bx, y - barH, bx + barW, y - barH, c + (alpha * 0.55) + ')', 0.8);
            sketchLine(bx + barW, y - barH, bx + barW, y + 1, c + (alpha * 0.55) + ')', 0.8);
            // Bottom line intentionally missing — human style
        });

        // Axis tick marks
        for (let i = 0; i < barCount; i++) {
            const tx = x + 5 + i * (barW + gap) + barW / 2;
            sketchLine(tx, y + 2, tx, y + 6, cAxis, 0.5);
        }

        // Y-axis labels
        for (let i = 1; i <= 3; i++) {
            const ly = y - (i / 3) * h * 0.85;
            sketchText(Math.round(i * 33) + '', x - 22, ly + 3, cText, 7);
            ctx.setLineDash([2, 4]);
            ctx.strokeStyle = col1 + (alpha * 0.1) + ')';
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.moveTo(x, ly);
            ctx.lineTo(x + w - 5, ly);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Title
        sketchText(el.title, x + 2, y - h - 10, cText, 9, "'Georgia', serif");
    }

    function drawLineChart(el) {
        const { x, y, alpha, col1, col2 } = el;
        const w = el.w, h = el.h;
        const cAxis = col1 + (alpha * 0.35) + ')';
        const cText = col1 + (alpha * 0.45) + ')';

        // Axes
        sketchLine(x, y + 2, x, y - h - 5, cAxis, 0.8);
        sketchLine(x - 3, y, x + w + 5, y, cAxis, 0.8);

        // Line — wobbly, hand-drawn
        const pts = el.linePoints;
        const spacing = (w - 8) / (pts.length - 1);

        ctx.save();
        ctx.beginPath();
        pts.forEach((v, i) => {
            const px = x + 4 + i * spacing + (Math.random() - 0.5) * 1.5;
            const py = y - v * h * 0.8 - 4 + (Math.random() - 0.5) * 1.5;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.strokeStyle = col1 + (alpha * 0.6) + ')';
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Incomplete area fill — stops partway
        const fillPts = pts.slice(0, Math.floor(pts.length * (0.6 + Math.random() * 0.3)));
        if (fillPts.length > 1) {
            ctx.beginPath();
            ctx.moveTo(x + 4, y);
            fillPts.forEach((v, i) => {
                ctx.lineTo(x + 4 + i * spacing, y - v * h * 0.8 - 4);
            });
            ctx.lineTo(x + 4 + (fillPts.length - 1) * spacing, y);
            ctx.closePath();
            ctx.fillStyle = col1 + (alpha * 0.06) + ')';
            ctx.fill();
        }
        ctx.restore();

        // Data points — little circles
        pts.forEach((v, i) => {
            const px = x + 4 + i * spacing;
            const py = y - v * h * 0.8 - 4;
            sketchCircle(px, py, 2, col1 + (alpha * 0.5) + ')', 0.6);
        });

        sketchText(el.title, x + 4, y - h - 8, cText, 9, "'Georgia', serif");
    }

    function drawPieChart(el) {
        const { x, y, alpha, col1 } = el;
        const r = el.r;
        const cx = x + r + 5;
        const cy = y - r - 5;

        let angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.1;

        el.slices.forEach((slice, i) => {
            const sliceAngle = slice * Math.PI * 2;
            const c = sketchColors[(i + 2) % sketchColors.length];

            // Hatched fill per slice
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r - 1, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.clip();

            // Hatch with varying angle per slice
            const hatchAngle = (i * 0.6) + Math.random() * 0.3;
            const hatchSp = 3 + Math.random() * 2;
            ctx.strokeStyle = c + (alpha * 0.22) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let d = -r * 3; d < r * 3; d += hatchSp) {
                const ha = hatchAngle;
                const sx = cx + d * Math.cos(ha) - r * 2 * Math.sin(ha);
                const sy = cy + d * Math.sin(ha) + r * 2 * Math.cos(ha);
                const ex = cx + d * Math.cos(ha) + r * 2 * Math.sin(ha);
                const ey = cy + d * Math.sin(ha) - r * 2 * Math.cos(ha);
                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
            }
            ctx.stroke();
            ctx.restore();

            // Slice dividers
            const sx = cx + Math.cos(angle) * r;
            const sy = cy + Math.sin(angle) * r;
            sketchLine(cx, cy, sx, sy, col1 + (alpha * 0.4) + ')', 0.7);

            // Percentage label
            const midAngle = angle + sliceAngle / 2;
            const lx = cx + Math.cos(midAngle) * r * 0.55;
            const ly = cy + Math.sin(midAngle) * r * 0.55;
            sketchText(Math.round(slice * 100) + '%', lx - 6, ly + 3, col1 + (alpha * 0.6) + ')', 7);

            angle += sliceAngle;
        });

        // Last divider line
        const lastSx = cx + Math.cos(angle) * r;
        const lastSy = cy + Math.sin(angle) * r;
        sketchLine(cx, cy, lastSx, lastSy, col1 + (alpha * 0.4) + ')', 0.7);

        // Outer circle
        sketchCircle(cx, cy, r, col1 + (alpha * 0.4) + ')', 0.9);

        sketchText(el.title, cx - r, cy + r + 15, col1 + (alpha * 0.4) + ')', 8, "'Georgia', serif");
    }

    function drawFormula(el) {
        const { x, y, alpha, col1 } = el;
        const cText = col1 + (alpha * 0.55) + ')';
        const cLine = col1 + (alpha * 0.3) + ')';

        sketchText(el.formula, x, y, cText, el.fontSize || 12, "'Georgia', serif");

        const textW = ctx.measureText(el.formula).width || (el.formula.length * 7);
        if (el.underline) {
            sketchLine(x - 2, y + 4, x + textW + 2, y + 4, cLine, 0.5);
        }
        if (el.boxed) {
            sketchRect(x - 6, y - el.fontSize - 3, textW + 12, el.fontSize + 12, cLine, 0.5);
        }
        if (el.circled) {
            sketchCircle(x + textW / 2, y - el.fontSize / 2 + 2,
                Math.max(textW, el.fontSize) / 2 + 8, cLine, 0.5);
        }
    }

    function drawVennDiagram(el) {
        const { x, y, alpha, col1, col2 } = el;
        const r = el.r;
        const cx = x + r + 5;
        const cy = y;
        const overlap = r * 0.6;
        const c3 = sketchColors[3];

        // Three overlapping circles
        sketchCircle(cx - overlap * 0.5, cy - overlap * 0.3, r, col1 + (alpha * 0.35) + ')', 0.9);
        sketchCircle(cx + overlap * 0.5, cy - overlap * 0.3, r, col2 + (alpha * 0.35) + ')', 0.9);
        sketchCircle(cx, cy + overlap * 0.4, r, c3 + (alpha * 0.3) + ')', 0.9);

        // Labels
        sketchText(el.labels[0], cx - overlap * 0.5 - 6, cy - overlap * 0.3 - r - 6,
            col1 + (alpha * 0.45) + ')', 7);
        sketchText(el.labels[1], cx + overlap * 0.5 - 4, cy - overlap * 0.3 - r - 6,
            col2 + (alpha * 0.45) + ')', 7);
        sketchText(el.labels[2], cx - 4, cy + overlap * 0.4 + r + 12,
            c3 + (alpha * 0.4) + ')', 7);

        // Center hatching for intersection
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
        ctx.clip();
        ctx.strokeStyle = col1 + (alpha * 0.15) + ')';
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        for (let d = -r; d < r; d += 3) {
            ctx.moveTo(cx + d, cy - r);
            ctx.lineTo(cx + d, cy + r);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawTriangle(el) {
        const { x, y, alpha, col1 } = el;
        const s = el.size;
        const cLine = col1 + (alpha * 0.4) + ')';
        const cText = col1 + (alpha * 0.45) + ')';

        // Triangle vertices
        const ax = x, ay = y;
        const bx = x + s, by = y;
        const cx2 = x + s * 0.4, cy2 = y - s * 0.85;

        // Edges
        sketchLine(ax, ay, bx, by, cLine, 0.9);
        sketchLine(bx, by, cx2, cy2, cLine, 0.9);
        sketchLine(cx2, cy2, ax, ay, cLine, 0.9);

        // Right angle mark
        const markS = 8;
        sketchLine(ax + markS, ay, ax + markS, ay - markS, col1 + (alpha * 0.25) + ')', 0.5);
        sketchLine(ax + markS, ay - markS, ax, ay - markS, col1 + (alpha * 0.25) + ')', 0.5);

        // Side labels
        sketchText('a', x + s * 0.5, y + 14, cText, 9, "'Georgia', serif");
        sketchText('b', x - 12, y - s * 0.35, cText, 9, "'Georgia', serif");
        sketchText('c', x + s * 0.75, y - s * 0.5, cText, 9, "'Georgia', serif");

        // Angle arc
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx2, cy2, 10, Math.PI * 0.35, Math.PI * 0.8);
        ctx.strokeStyle = col1 + (alpha * 0.3) + ')';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();

        // Formula below
        if (el.formula) {
            sketchText(el.formula, x - 5, y + 26, col1 + (alpha * 0.4) + ')', 8, "'Georgia', serif");
        }
    }

    function drawCoordinateSystem(el) {
        const { x, y, alpha, col1, col2 } = el;
        const s = el.size;
        const cAxis = col1 + (alpha * 0.4) + ')';
        const cText = col1 + (alpha * 0.45) + ')';
        const cCurve = col2 + (alpha * 0.5) + ')';

        // X and Y axes
        sketchLine(x, y - s * 0.1, x, y - s, cAxis, 0.9);
        sketchLine(x - s * 0.1, y, x + s, y, cAxis, 0.9);

        // Arrow heads
        sketchLine(x, y - s, x - 3, y - s + 6, cAxis, 0.7);
        sketchLine(x, y - s, x + 3, y - s + 6, cAxis, 0.7);
        sketchLine(x + s, y, x + s - 6, y - 3, cAxis, 0.7);
        sketchLine(x + s, y, x + s - 6, y + 3, cAxis, 0.7);

        // Labels
        sketchText('x', x + s + 5, y + 3, cText, 10, "'Georgia', serif");
        sketchText('y', x - 3, y - s - 8, cText, 10, "'Georgia', serif");
        sketchText('O', x - 12, y + 12, cText, 8, "'Georgia', serif");

        // Tick marks
        for (let i = 1; i <= 4; i++) {
            const tx = x + i * s * 0.2;
            sketchLine(tx, y - 3, tx, y + 3, cAxis, 0.4);
            const ty = y - i * s * 0.2;
            sketchLine(x - 3, ty, x + 3, ty, cAxis, 0.4);
        }

        // Plot a curve
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < 30; i++) {
            const t = i / 29;
            const px = x + t * s * 0.85;
            const py = y - Math.pow(t, el.curveExp || 2) * s * 0.8;
            const wobX = (Math.random() - 0.5) * 1.2;
            const wobY = (Math.random() - 0.5) * 1.2;
            if (i === 0) ctx.moveTo(px + wobX, py + wobY);
            else ctx.lineTo(px + wobX, py + wobY);
        }
        ctx.strokeStyle = cCurve;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // Label on curve
        if (el.curveLabel) {
            sketchText(el.curveLabel, x + s * 0.6, y - s * 0.6, col2 + (alpha * 0.4) + ')', 8, "'Georgia', serif");
        }
    }

    function drawTrendLine(el) {
        const { x, y, alpha, col1, col2 } = el;
        const w = el.w, h = el.h;
        const cAxis = col1 + (alpha * 0.3) + ')';
        const cText = col1 + (alpha * 0.45) + ')';

        sketchLine(x, y + 2, x, y - h - 5, cAxis, 0.7);
        sketchLine(x - 3, y, x + w + 3, y, cAxis, 0.7);

        // Wobbly trend curve
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < 25; i++) {
            const t = i / 24;
            const px = x + 3 + t * (w - 6) + (Math.random() - 0.5) * 1.5;
            const py = y - 3 - Math.pow(t, 0.7) * h * 0.8 + (Math.random() - 0.5) * 2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = col1 + (alpha * 0.55) + ')';
        ctx.lineWidth = 1.1;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // Arrow at end
        const ax = x + w - 5, ay = y - h * 0.85;
        sketchLine(ax, ay, ax - 5, ay + 4, col1 + (alpha * 0.5) + ')', 0.8);
        sketchLine(ax, ay, ax - 6, ay - 2, col1 + (alpha * 0.5) + ')', 0.8);

        sketchText(el.label, x + w - 35, y - h - 5, cText, 8);
    }

    function drawDataTable(el) {
        const { x, y, alpha, col1 } = el;
        const cLine = col1 + (alpha * 0.3) + ')';
        const cHead = col1 + (alpha * 0.1) + ')';
        const cText = col1 + (alpha * 0.45) + ')';
        const { rows, cols, cellW, cellH } = el;
        const w = cols * cellW;
        const h = rows * cellH;

        // Header fill with hatching
        hatchFill(x, y - h, w, cellH, col1 + (alpha * 0.12) + ')', 4);

        // Grid lines
        for (let r = 0; r <= rows; r++) {
            const ry = y - h + r * cellH;
            sketchLine(x, ry, x + w, ry, cLine, r <= 1 ? 0.8 : 0.4);
        }
        for (let c = 0; c <= cols; c++) {
            const cxx = x + c * cellW;
            sketchLine(cxx, y - h, cxx, y, cLine, c === 0 || c === cols ? 0.8 : 0.4);
        }

        // Header & data text
        el.headers.forEach((hdr, c) => {
            sketchText(hdr, x + c * cellW + 3, y - h + cellH - 3, cText, 7, "'Arial', sans-serif");
        });
        el.data.forEach((row, r) => {
            row.forEach((val, c) => {
                sketchText(val, x + c * cellW + 3, y - h + (r + 2) * cellH - 3, cText, 7);
            });
        });
    }

    function drawScatterPlot(el) {
        const { x, y, alpha, col1, col2 } = el;
        const w = el.w, h = el.h;

        sketchLine(x, y + 2, x, y - h - 3, col1 + (alpha * 0.3) + ')', 0.7);
        sketchLine(x - 3, y, x + w + 3, y, col1 + (alpha * 0.3) + ')', 0.7);

        el.points.forEach((pt, i) => {
            const px = x + 3 + pt.x * (w - 6);
            const py = y - 3 - pt.y * (h - 6);
            const c = i % 2 === 0 ? col1 : col2;

            // Some as dots, some as crosses, some as small circles
            if (i % 4 === 0) {
                // Cross marker
                const cs = 3;
                sketchLine(px - cs, py - cs, px + cs, py + cs, c + (alpha * 0.4) + ')', 0.6);
                sketchLine(px + cs, py - cs, px - cs, py + cs, c + (alpha * 0.4) + ')', 0.6);
            } else if (i % 4 === 1) {
                // Small circle
                sketchCircle(px, py, 2.5, c + (alpha * 0.45) + ')', 0.5);
            } else {
                // Filled dot
                ctx.beginPath();
                ctx.arc(px, py, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = c + (alpha * 0.4) + ')';
                ctx.fill();
            }
        });

        // Dashed trend line
        ctx.save();
        ctx.setLineDash([3, 4]);
        sketchLine(x + 5, y - h * 0.1, x + w - 5, y - h * 0.85,
            col2 + (alpha * 0.25) + ')', 0.7);
        ctx.setLineDash([]);
        ctx.restore();

        // R² label
        sketchText('R²=0.' + Math.floor(70 + Math.random() * 25), x + w - 32, y - h + 8,
            col1 + (alpha * 0.4) + ')', 7);
    }

    function drawGauge(el) {
        const { x, y, alpha, col1 } = el;
        const r = el.r;
        const cx = x + r, cy = y;

        // Background arc
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 0);
        ctx.strokeStyle = col1 + (alpha * 0.15) + ')';
        ctx.lineWidth = r * 0.18;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Filled arc with hatching
        const fill = el.value;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * fill);
        ctx.strokeStyle = col1 + (alpha * 0.4) + ')';
        ctx.lineWidth = r * 0.18;
        ctx.stroke();
        ctx.restore();

        // Tick marks
        for (let i = 0; i <= 5; i++) {
            const ta = Math.PI + (i / 5) * Math.PI;
            const ix = cx + Math.cos(ta) * (r + 4);
            const iy = cy + Math.sin(ta) * (r + 4);
            const ox = cx + Math.cos(ta) * (r + 8);
            const oy = cy + Math.sin(ta) * (r + 8);
            sketchLine(ix, iy, ox, oy, col1 + (alpha * 0.3) + ')', 0.4);
        }

        // Needle
        const needleAngle = Math.PI + Math.PI * fill;
        const nx = cx + Math.cos(needleAngle) * r * 0.65;
        const ny = cy + Math.sin(needleAngle) * r * 0.65;
        sketchLine(cx, cy, nx, ny, col1 + (alpha * 0.5) + ')', 1);

        ctx.beginPath();
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = col1 + (alpha * 0.5) + ')';
        ctx.fill();

        sketchText(Math.round(fill * 100) + '%', cx - 10, cy + 14, col1 + (alpha * 0.5) + ')', 9);
    }

    function drawMathSymbol(el) {
        const { x, y, alpha, col1 } = el;
        const cText = col1 + (alpha * 0.5) + ')';
        sketchText(el.symbol, x, y, cText, el.fontSize, "'Georgia', serif");
    }

    function drawAnnotation(el) {
        const { x, y, alpha, col1 } = el;
        const cText = col1 + (alpha * 0.45) + ')';
        const cLine = col1 + (alpha * 0.25) + ')';

        // Callout line with arrow
        sketchLine(x, y, x + 12, y - 10, cLine, 0.5);
        sketchLine(x + 12, y - 10, x + 55, y - 10, cLine, 0.5);
        sketchText(el.text, x + 14, y - 14, cText, 8);
    }

    // ---- Data pools ----
    const formulaPool = [
        'MC = ΔTC / ΔQ', 'E = (Q₂-Q₁) / Q₁', 'AFC = TFC / Q',
        'TC = FC + VC', 'σ = √(Σ(x-μ)² / N)', 'R² = 1 - SSᵣₑₛ/SSₜₒₜ',
        'ŷ = β₀ + β₁x', 'P(A|B) = P(B|A)·P(A)/P(B)',
        'μ = Σxᵢ / n', 'CV = σ/μ × 100%',
        'ROI = (Gain-Cost)/Cost', 'z = (x-μ) / σ',
        'f(x) = ax² + bx + c', '(a+b)² = a² + 2ab + b²',
        'E = mc²', 'H₂O', '∫f(x)dx',
        'Σxᵢ² / (n-1)', 'cos²θ + sin²θ = 1',
        'log₂(n)', 'n! = n·(n-1)!', 'lim x→∞',
    ];

    const bigSymbols = ['π', '∑', '∫', '∞', '√', 'Δ', 'θ', 'λ', 'Ω', 'φ', '∂', '≈'];

    const chartTitles = ['Revenue', 'Sales', 'Growth', 'Users', 'Profit',
        'Traffic', 'Conversion', 'Retention', 'Orders', 'Margin'];

    const vennLabels = [
        ['SQL', 'Python', 'Excel'], ['Data', 'Code', 'Viz'],
        ['Stats', 'ML', 'BI'], ['Clean', 'Model', 'Report'],
    ];

    const annotationTexts = ['+23.5%', '78% of total', 'peak sales',
        'avg: 4,235', 'Δ = 12.3', 'n = 8,500+', '300K+ records',
        'Q3 results', 'outlier!', 'KPI target'];

    const tableHeaders = [
        ['Q', 'Sales', 'Δ%'], ['Month', 'Rev', 'Cost'],
        ['Item', 'Qty', 'Avg'], ['Year', 'Users', 'Rate'],
    ];

    const curveLabels = ['y = x²', 'y = log(x)', 'y = eˣ', 'f(x)', 'growth'];
    const triangleFormulas = ['a² + b² = c²', 'A = ½bh', 'sin(θ) = a/c', 'tan(θ) = a/b'];

    // Generate all elements — randomly scattered across the page
    function generateElements() {
        elements = [];
        // Calculate count based on page area — balanced density
        const area = cw * ch;
        const count = Math.floor(area / 68500);

        for (let i = 0; i < count; i++) {
            const baseX = Math.random() * (cw - 120) + 20;
            const baseY = Math.random() * (ch - 120) + 40;
            const alpha = 0.3 + Math.random() * 0.35;
            const col1 = rc();
            const col2 = rc();
            const type = Math.random();

            if (type < 0.11) {
                // Bar chart — 30% larger
                const bars = [];
                for (let j = 0; j < 4 + Math.floor(Math.random() * 4); j++)
                    bars.push(0.15 + Math.random() * 0.8);
                elements.push({
                    draw: drawBarChart, x: baseX, y: baseY + 85,
                    alpha, col1, col2, w: 85 + Math.random() * 58, h: 58 + Math.random() * 33,
                    bars, title: chartTitles[Math.floor(Math.random() * chartTitles.length)]
                });
            } else if (type < 0.20) {
                // Line chart — 30% larger
                const linePoints = [];
                for (let j = 0; j < 6 + Math.floor(Math.random() * 4); j++)
                    linePoints.push(0.1 + Math.random() * 0.8);
                elements.push({
                    draw: drawLineChart, x: baseX, y: baseY + 72,
                    alpha, col1, col2, w: 98 + Math.random() * 58, h: 52 + Math.random() * 33,
                    linePoints, title: chartTitles[Math.floor(Math.random() * chartTitles.length)]
                });
            } else if (type < 0.28) {
                // Pie chart — 30% larger
                const slices = [];
                let rem = 1;
                for (let j = 0; j < 3 + Math.floor(Math.random() * 2); j++) {
                    const s = j === 0 ? 0.25 + Math.random() * 0.25 : 0.05 + Math.random() * rem * 0.5;
                    slices.push(s); rem -= s;
                }
                slices.push(Math.max(0.05, rem));
                elements.push({
                    draw: drawPieChart, x: baseX, y: baseY + 72,
                    alpha, col1, col2, r: 29 + Math.random() * 18, slices,
                    title: chartTitles[Math.floor(Math.random() * chartTitles.length)]
                });
            } else if (type < 0.42) {
                // Formula — 30% larger font
                elements.push({
                    draw: drawFormula, x: baseX, y: baseY,
                    alpha, col1, col2,
                    formula: formulaPool[Math.floor(Math.random() * formulaPool.length)],
                    fontSize: 13 + Math.floor(Math.random() * 7),
                    underline: Math.random() > 0.65,
                    boxed: Math.random() > 0.8,
                    circled: Math.random() > 0.85,
                });
            } else if (type < 0.50) {
                // Venn diagram — 30% larger
                const lbls = vennLabels[Math.floor(Math.random() * vennLabels.length)];
                elements.push({
                    draw: drawVennDiagram, x: baseX, y: baseY + 20,
                    alpha, col1, col2, r: 23 + Math.random() * 13, labels: lbls,
                });
            } else if (type < 0.57) {
                // Triangle — 30% larger
                elements.push({
                    draw: drawTriangle, x: baseX, y: baseY + 65,
                    alpha, col1, col2, size: 52 + Math.random() * 33,
                    formula: triangleFormulas[Math.floor(Math.random() * triangleFormulas.length)],
                });
            } else if (type < 0.64) {
                // Coordinate system — 30% larger
                elements.push({
                    draw: drawCoordinateSystem, x: baseX + 10, y: baseY + 72,
                    alpha, col1, col2, size: 65 + Math.random() * 33,
                    curveExp: [0.5, 1.5, 2, 2.5][Math.floor(Math.random() * 4)],
                    curveLabel: curveLabels[Math.floor(Math.random() * curveLabels.length)],
                });
            } else if (type < 0.71) {
                // Trend line — 30% larger
                elements.push({
                    draw: drawTrendLine, x: baseX, y: baseY + 65,
                    alpha, col1, col2,
                    w: 72 + Math.random() * 46, h: 46 + Math.random() * 26,
                    label: '↑' + Math.round(10 + Math.random() * 45) + '%'
                });
            } else if (type < 0.77) {
                // Data table — 30% larger cells
                const hdrSet = tableHeaders[Math.floor(Math.random() * tableHeaders.length)];
                const dataRows = [];
                for (let r = 0; r < 2 + Math.floor(Math.random() * 2); r++) {
                    const row = [];
                    for (let c = 0; c < hdrSet.length; c++)
                        row.push(c === 0
                            ? ['Q1','Q2','Q3','Q4','Jan','Feb','Mar'][Math.floor(Math.random()*7)]
                            : String(Math.round(Math.random()*9000+1000)));
                    dataRows.push(row);
                }
                elements.push({
                    draw: drawDataTable, x: baseX, y: baseY + 72,
                    alpha, col1, col2,
                    rows: dataRows.length + 1, cols: hdrSet.length,
                    cellW: 42, cellH: 18, headers: hdrSet, data: dataRows,
                });
            } else if (type < 0.84) {
                // Scatter plot — 30% larger
                const points = [];
                for (let j = 0; j < 10 + Math.floor(Math.random() * 8); j++)
                    points.push({ x: 0.05 + Math.random() * 0.9, y: 0.05 + Math.random() * 0.9 });
                elements.push({
                    draw: drawScatterPlot, x: baseX, y: baseY + 72,
                    alpha, col1, col2,
                    w: 78 + Math.random() * 46, h: 58 + Math.random() * 26, points,
                });
            } else if (type < 0.90) {
                // Big math symbol — 30% larger
                elements.push({
                    draw: drawMathSymbol, x: baseX, y: baseY + 20,
                    alpha: alpha * 0.7, col1, col2,
                    symbol: bigSymbols[Math.floor(Math.random() * bigSymbols.length)],
                    fontSize: 36 + Math.floor(Math.random() * 26),
                });
            } else if (type < 0.95) {
                // Gauge — 30% larger
                elements.push({
                    draw: drawGauge, x: baseX, y: baseY + 40,
                    alpha, col1, col2,
                    r: 23 + Math.random() * 16, value: 0.25 + Math.random() * 0.55,
                });
            } else {
                // Annotation
                elements.push({
                    draw: drawAnnotation, x: baseX, y: baseY,
                    alpha, col1, col2,
                    text: annotationTexts[Math.floor(Math.random() * annotationTexts.length)],
                });
            }
        }
    }

    function drawAll() {
        ctx.clearRect(0, 0, cw, ch);
        elements.forEach(el => el.draw(el));
    }

    // Initialize
    resizeCanvas();

    // Redraw on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 250);
    });

    // Update canvas height as page content loads (AOS, images, etc.)
    function updateCanvasHeight() {
        const pageH = document.documentElement.scrollHeight;
        if (Math.abs(ch - pageH) > 300) {
            ch = canvas.height = pageH;
            generateElements();
            drawAll();
        }
    }
    setInterval(updateCanvasHeight, 2000);

    // =================================================================
    //  CURSOR GLOW EFFECT
    // =================================================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('active');
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    if ('ontouchstart' in window) {
        cursorGlow.style.display = 'none';
    }

    // =================================================================
    //  NAVBAR — Scroll & Mobile Toggle
    // =================================================================
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');

    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
        if (scrollY > 500) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
        highlightNavLink();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function highlightNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
    }

    // =================================================================
    //  TYPEWRITER EFFECT
    // =================================================================
    const typewriterEl = document.getElementById('typewriter');
    const phrases = ['Data Analyst', 'Python Developer', 'SQL Specialist', 'Power BI Expert', 'Problem Solver'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typewrite() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        let speed = isDeleting ? 40 : 80;
        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2000; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }
        setTimeout(typewrite, speed);
    }
    typewrite();

    // =================================================================
    //  ANIMATED COUNTERS
    // =================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const startTime = performance.now();
            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                stat.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(updateCount);
            }
            requestAnimationFrame(updateCount);
        });
        countersAnimated = true;
    }

    const heroStatsEl = document.querySelector('.hero-stats');
    if (heroStatsEl) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStatsEl);
    }

    // =================================================================
    //  TABS (Experience & Education)
    // =================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            AOS.refresh();
        });
    });

    // =================================================================
    //  SMOOTH SCROLL
    // =================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetEl = document.querySelector(this.getAttribute('href'));
            if (targetEl) {
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
                window.scrollTo({ top: targetEl.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });

    // =================================================================
    //  PROJECT CARDS — Tilt Effect
    // =================================================================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 20;
            const rotateY = (rect.width / 2 - x) / 20;
            card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // =================================================================
    //  CONSOLE EASTER EGG
    // =================================================================
    console.log('%c📊 Data meets design.', 'color: #6c63ff; font-size: 20px; font-weight: bold;');
    console.log('%cAdarsh Barnawal — Data Analyst & Developer Portfolio', 'color: #94a3b8; font-size: 14px;');
});
