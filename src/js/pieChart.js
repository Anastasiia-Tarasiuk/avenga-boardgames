export class PieChart {
    constructor(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.totalPlays = [...Object.values(this.options.pieChart)].reduce((a, b) => a + b, 0);
        this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        this.legend = options.legend;
    }

    drawSlices() {
        let colorIndex = 0;
        let startAngle = -Math.PI / 2;

        for (const gameName in this.options.pieChart) {
            const numberOfPlays = this.options.pieChart[gameName];
            const sliceAngle = (2 * Math.PI * numberOfPlays) / this.totalPlays;
            this.drawPieSlice(this.ctx, this.canvas.width / 2, this.canvas.height / 2, this.radius, startAngle, startAngle + sliceAngle, this.colors[colorIndex]);
            startAngle += sliceAngle;
            colorIndex += 1;
        }
    }

    drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, fillColor) {
        ctx.save();
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    drawLegend() {
        let index = 0;
        let legend = this.legend;
        let ul = document.createElement("ul");

        for (let gameName of Object.keys(this.options.pieChart)) {
            const numberOfPlays = this.options.pieChart[gameName];
            const labelText = Math.round((100 * numberOfPlays) / this.totalPlays);
            const li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid " + this.colors[index];
            li.style.padding = "5px";
            li.textContent = `${gameName} (${labelText}%)`;
            ul.append(li);
            index++;
        }

        legend.append(ul);
    }
}