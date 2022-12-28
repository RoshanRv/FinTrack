import React, { useEffect, useRef, useState } from "react"
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
import calcMovingAvg from "../utils/calcMovingAvg"

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

const pricesWs = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin")

const Crypto = () => {
    const [coin, setCoin] = useState("bitcoin")

    const timeRef = useRef(0)
    const chartRef = useRef<HTMLDivElement>(null)

    const {
        chartDetails,
        coinDetails,
        isError,
        setMovingAvgCoords,
        isLoading,
        movingAvgCoords,
        setChartDetails,
        spikeValue,
        setSpikeValue,
        spikeChartCoords,
    } = useAxios(coin)

    const labels = !isLoading
        ? chartDetails.map((data) => moment(data.x).format("hh:mm"))
        : [""]

    pricesWs.onmessage = function (msg) {
        if (Date.now() >= timeRef.current + 60000) {
            if (!isLoading) {
                // 1 min = 600000ms
                timeRef.current = Date.now()

                const data = [
                    ...chartDetails,
                    { x: Date.now(), y: Number(JSON.parse(msg.data).bitcoin) },
                ]
                setChartDetails(data)

                console.log({
                    bitcoin: JSON.parse(msg.data).bitcoin,
                    time: moment(timeRef.current).format("hh:mm"),
                    t: Date.now(),
                })
            }
        }
    }

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
            {
                label: "Moving Average",
                data: !isLoading ? movingAvgCoords : [{}],
                borderColor: "rgb(53, 162, 25)",
                borderWidth: 2,
                pointBackgroundColor: "transparent",
                pointBorderColor: "transparent",
            },
            {
                label: "Spike Point",
                data: !isLoading ? spikeChartCoords : [{}],
                borderColor: "rgb(253, 100, 25)",
                borderWidth: 0,
                pointBackgroundColor: "rgb(253, 100, 25)",
                pointBorderColor: "rgb(253, 100, 25)",
                pointBorderWidth: 7,
            },
        ],
    }

    const options: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Past 1 Day Market Chart of ${
                    !isLoading ? coinDetails.name : " "
                }`,
            },
        },
    }

    useEffect(() => {
        chartRef.current?.scrollTo({ left: 100000000 })

        if (!isLoading) {
            const movingAvgCoords = calcMovingAvg(chartDetails)

            setMovingAvgCoords(movingAvgCoords.movingAvgDetails)
            setSpikeValue(movingAvgCoords.spike)
        }
    }, [chartDetails])

    return (
        <section className="p-6 ">
            {/*     Title     */}
            <h1 className="text-4xl font-semibold border-b-2 border-gray-500 p-2">
                Coin Tracker
            </h1>
            {!isLoading ? (
                <>
                    <div className="mt-8 text-center">
                        {/*    Select Coin      */}
                        <h1 className="text-xl">Select Coin</h1>

                        <select
                            value={coin}
                            onChange={(e) => setCoin(e.target.value)}
                            className="border-b-2 p-2 border-gray-500 outline-0"
                        >
                            <option value="bitcoin">Bitcoin</option>
                            <option value="ethereum">Ethereum</option>
                            <option value="solana">Solana</option>
                        </select>
                    </div>

                    <div className=" flex flex-col-reverse gap-x-8 p-4 items-center justify-around mt-10 gap-y-20">
                        {/* Details */}

                        <div className="p-6 rounded-lg shadow-lg shadow-black relative flex flex-col gap-y-2 w-max">
                            <div className="p-1 rounded-full absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white shadow-md shadow-black/50">
                                <img
                                    src={coinDetails.image.small}
                                    alt=""
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex items-center justify-between gap-x-4">
                                <h1>{`Name: `}</h1>
                                <h1>{`${coinDetails.name}`}</h1>
                            </div>

                            <div className="flex items-center justify-between gap-x-4">
                                <h1>{`INR Price: `}</h1>
                                <h1>{`₹ ${coinDetails.market_data.current_price.inr}`}</h1>
                            </div>

                            <div className="flex items-center justify-between gap-x-4">
                                <h1>{`USD Price: `}</h1>
                                <h1>{`$ ${coinDetails.market_data.current_price.usd}`}</h1>
                            </div>

                            <div className="flex items-center justify-between gap-x-4">
                                <h1>{`Market Cap Rank: `}</h1>
                                <h1>{` ${coinDetails.market_cap_rank}`}</h1>
                            </div>
                        </div>
                        {/*   Chart   */}
                        <div ref={chartRef} className="w-full overflow-x-auto">
                            <div className="relative h-[50vh] w-[1500vw] ">
                                <Line data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Spinner />
            )}
        </section>
    )
}

export default Crypto
