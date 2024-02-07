export class PieChart {
    constructor(options) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;
        this.totalValue = [...Object.values(this.options.pieChart)].reduce((a, b) => a + b, 0);
        this.radius = Math.min(this.canvas.width / 2, this.canvas.height / 2);
        this.legend = options.legend;
        this.others = [];
    }

    drawSlices() {
        let colorIndex = 0;
        let startAngle = -Math.PI / 2;

        for (const category in this.options.pieChart) {
            const value = this.options.pieChart[category];
            const sliceAngle = (2 * Math.PI * value) / this.totalValue;
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

        for (let category of Object.keys(this.options.pieChart)) {
            const value = this.options.pieChart[category];
            const labelText = Math.round((100 * value) / this.totalValue);
            const li = document.createElement("li");
            li.style.listStyle = "none";
            li.style.borderLeft = "20px solid " + this.colors[index];
            li.style.padding = "5px";
            li.textContent = category + " (" + labelText + "%)";
            ul.append(li);
            index++;
        }

        legend.append(ul);
    }
}