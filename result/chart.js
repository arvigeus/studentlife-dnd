function renderChart(result) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const chart = document.getElementById("chart");
    chart.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const barWidth = 50;
    const barSpacing = 40;
    const startX = 50;
    const maxY = canvas.height - 50; // Adjust this value as needed for padding
    const maxValue = Math.max(...Object.values(result));
    const scaleFactor = maxY / maxValue;
    
    const xAxisLabels = [' ДОМИНИРАЩ ', '    ВЛИЯНИЕ', 'УСТОЙЧИВОСТ', 'СЪВЕСТНОСТ '];

    ctx.fillStyle = '#ffffff'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const paddingY = 30; // Adjust this value as needed for padding

    // Draw bars
    Object.keys(result).forEach((key, index) => {
        const value = result[key];
        const barHeight = value * scaleFactor;
        const startY = maxY - barHeight + paddingY; // Adjusted startY calculation
        const color = getColor(key);
        ctx.fillStyle = color;
        ctx.fillRect(startX + index * (barWidth + barSpacing), startY, barWidth, barHeight);
        ctx.strokeStyle = getBorderColor(key);
        ctx.strokeRect(startX + index * (barWidth + barSpacing), startY, barWidth, barHeight);
    });

    // Draw X axis labels
    xAxisLabels.forEach((label, index) => {
        const x = startX + index * (barWidth + barSpacing) + barWidth / 2 - 30;
        const y = maxY + 45;
        ctx.fillStyle = '#000000';
        ctx.fillText(label, x, y);
    });
}

function getColor(key) {
    switch (key) {
        case 'D': return '#90bdd7';
        case 'I': return '#f6dd8a';
        case 'S': return '#bdd5a6';
        case 'C': return '#f99';
        default: return '#000000';
    }
}

function getBorderColor(key) {
    switch (key) {
        case 'D': return '#0070c0';
        case 'I': return '#ffc000';
        case 'S': return '#70ad47';
        case 'C': return '#f00';
        default: return '#000000';
    }
}