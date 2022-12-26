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

const Crypto = () => {
    const [coin, setCoin] = useState("bitcoin")

    const { chartDetails, coinDetails, isError, isLoading } = useAxios(coin)

    const labels = !isLoading
        ? chartDetails.map((data) => moment(data.x).format("D/ hh:mm"))
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
            {
                label: "Moving Average",
                data: !isLoading
                    ? chartDetails.map((data) => ({
                          x: data.x,
                          y: chartDetails
                              ? chartDetails.reduce(
                                    (acc, curr) => Number(curr.y) + Number(acc),
                                    0
                                ) / chartDetails.length
                              : "",
                      }))
                    : [{}],
                borderColor: "rgb(53, 162, 25)",
                borderWidth: 2,
                pointBackgroundColor: "transparent",
                pointBorderColor: "transparent",
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
                        <div className="w-full overflow-x-auto">
                            <div className="relative h-[50vh] w-[400vw] ">
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
