import React from "react";
import Chart from "react-apexcharts";


const BodyFat = (tabelVitalSigns) => {

    const dates = tabelVitalSigns?.tabelVitalSigns.map(item => new Date(item.date).getTime());

    const bodyFat = tabelVitalSigns?.tabelVitalSigns
        .filter(item => parseFloat(item.bodyFat) > 0)
        .map(item => parseFloat(item.bodyFat));


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
        markers: { size: 5, colors: ["#ff4560"], strokeColors: "#ff4560" },
        stroke: { curve: "straight", width: 2,colors: ["#ff4560"] },
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
            name: "BodyFat",
            data: bodyFat,
        },
    ];

    return <Chart options={chartOptions} series={series} type="line" height={180} />;
};

export default BodyFat;
