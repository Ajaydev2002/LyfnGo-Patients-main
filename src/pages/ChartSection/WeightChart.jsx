import React from "react";
import Chart from "react-apexcharts";

const WeightChart = (tabelVitalSigns) => {

    const dates = tabelVitalSigns?.tabelVitalSigns.map(item => new Date(item.date).getTime());

    const weight = tabelVitalSigns?.tabelVitalSigns
        .filter(item => parseFloat(item.weight) > 0)
        .map(item => parseFloat(item.weight));


    const chartOptions = {
        chart: {
            type: "line",
        },
        xaxis: {
            type: "datetime",
            categories: dates,
            labels: {
                format: "dd MMM",
                style: { fontSize: "11px" },
            },
        },
        yaxis: {
            labels: { style: { fontSize: "11px" } },
        },
        markers: { size: 5, colors: ["#3ab6ff"], strokeColors: "#fff" },
        stroke: { curve: "straight", width: 2,colors: ["#3ab6ff"]},
        dataLabels: { enabled: false },
        tooltip: { x: { format: "dd MMM yyyy" } },
        grid: {     
            xaxis: {
                lines: {
                    show: false  
                }
            },
            yaxis: {
                lines: {
                    show: false 
                }
            },
        },
    };

    const series = [
        {
            name: "Weight",
            data: weight,
        },
    ];

    return <Chart options={chartOptions} series={series} type="line" height={180} />;
};

export default WeightChart;
