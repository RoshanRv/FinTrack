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

const Home = () => {
    const [coin, setCoin] = useState("bitcoin")

    const { chartDetails, coinDetails, isError, isLoading } = useAxios(coin)

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

    return (
        <main className="p-6">
            <section>
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

                        <div className="lg:flex gap-x-8 p-4 items-center justify-around mt-10">
                            {/* Details */}

                            <div className="p-6 rounded-lg shadow-lg shadow-black relative flex flex-col gap-y-2 ">
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
                                    <h1>{`$ ${coinDetails.market_data.current_price.inr}`}</h1>
                                </div>

                                <div className="flex items-center justify-between gap-x-4">
                                    <h1>{`USD Price: `}</h1>
                                    <h1>{`₹ ${coinDetails.market_data.current_price.usd}`}</h1>
                                </div>

                                <div className="flex items-center justify-between gap-x-4">
                                    <h1>{`Market Cap Rank: `}</h1>
                                    <h1>{` ${coinDetails.market_cap_rank}`}</h1>
                                </div>
                            </div>
                            {/*   Chart   */}
                            <div className="relative h-[50vh] w-1/2">
                                <Line data={data} options={options} />
                            </div>
                        </div>
                    </>
                ) : (
                    <Spinner />
                )}
            </section>
        </main>
    )
}

export default Home
