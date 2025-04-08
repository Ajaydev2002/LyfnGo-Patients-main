import React from "react";
import Chart from "react-apexcharts";

const BmiChart = (tabelVitalSigns) => {

    const dates = tabelVitalSigns?.tabelVitalSigns.map(item => new Date(item.date).getTime());

    const leanBodyMass = tabelVitalSigns?.tabelVitalSigns
        .filter(item => parseFloat(item.bmi) > 0)
        .map(item => parseFloat(item.bmi));


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
        markers: { size: 5, colors: ["rgb(255, 69, 96)"], strokeColors: "#fff" },
        stroke: { curve: "straight", width: 2 ,colors: ["rgb(255, 69, 96)"]},
        dataLabels: { enabled: false },
        tooltip: { x: { format: "dd MMM yyyy" } },
        
        grid: {
            show: false,
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
            name: "leanBodyMass",
            data: leanBodyMass,
        },
    ];

    return <Chart options={chartOptions} series={series} type="line" height={180} />;
};

export default BmiChart;
