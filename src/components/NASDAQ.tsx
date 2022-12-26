import React, { useEffect, useState } from "react"
import useAxios from "../hooks/useAxios"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartData,
    ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import moment from "moment"
import Spinner from "../components/Spinner"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
)
const NASDAQ = () => {
    const [stock, setStock] = useState("AAPL")

    const { chartDetails, coinDetails, isError, isLoading } = useAxios(stock)

    const labels = !isLoading
        ? chartDetails.map((data) => moment(data.x).format("M/DD"))
        : [""]

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: !isLoading ? coinDetails.name : "",
                data: chartDetails,
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    }

    const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Past 7 Days Market Chart of ${
                    !isLoading ? coinDetails.name : " "
                }`,
            },
        },
    }

    return <div>NASDAQ</div>
}

export default NASDAQ
