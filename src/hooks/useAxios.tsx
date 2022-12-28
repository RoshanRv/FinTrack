import axios from "axios"
import moment from "moment"
import React, { useEffect, useState } from "react"
import calcMovingAvg from "../utils/calcMovingAvg"

//https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=inr&days=20

//https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false

interface CoinDetailsProps {
    name: string
    description: {
        en: string
    }
    image: {
        thumb: string
        small: string
        large: string
    }
    market_cap_rank: number
    market_data: {
        current_price: {
            inr: number
            usd: number
        }
    }
}

export interface ChartDetailsProps {
    x: number
    y: number
}
export interface SpikeDetailsProps {
    x: number
    y: number | undefined
}

export interface ChartDataResponseProps {
    data: { priceUsd: string; time: number }[]
}

const useAxios = (coin: string) => {
    const [coinDetails, setCoinDetails] = useState({} as CoinDetailsProps)
    const [chartDetails, setChartDetails] = useState({} as ChartDetailsProps[])
    const [movingAvgCoords, setMovingAvgCoords] = useState(
        {} as ChartDetailsProps[]
    )
    const [spikeValue, setSpikeValue] = useState(0)
    const [spikeChartCoords, setSpikeChartCoords] = useState(
        {} as SpikeDetailsProps[]
    )
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const fetchData = async (coin: string) => {
        try {
            setIsLoading(true)
            const coinDetails = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
            )

            setCoinDetails(coinDetails.data)

            const chartDetails = await axios.get<ChartDataResponseProps>(
                `https://api.coincap.io/v2/assets/${coin}/history?interval=m1`
            )

            const chartCoords = chartDetails.data.data.map(
                (coinData: { priceUsd: string; time: number }) => ({
                    x: coinData.time,
                    y: Number(coinData.priceUsd),
                })
            )

            setChartDetails(chartCoords)

            const movingAvgDetails = calcMovingAvg(chartCoords)

            // const len = chartDetails.data.data.length
            // const movingAvg =
            //     chartDetails.data.data.reduce((acc: number, cur, i: number) => {
            //         if (len - 20 <= i) {
            //             return acc + Number(cur.priceUsd)
            //         } else return 0
            //     }, 0) / 20

            // const movingAvgDetails = chartDetails.data.data.map(
            //     (coinData: { priceUsd: string; time: number }) => ({
            //         x: coinData.time,
            //         y: movingAvg,
            //     })
            // )

            setMovingAvgCoords(movingAvgDetails.movingAvgDetails)
            setSpikeValue(movingAvgDetails.spike)
        } catch (e) {
            setIsError(true)
            console.log(e)
        } finally {
            setIsLoading(false)
            setIsError(false)
        }
    }

    useEffect(() => {
        fetchData(coin)
    }, [coin])

    useEffect(() => {
        if (!isLoading) {
            const spikeCoords = chartDetails.map((data) => {
                if (data.y >= movingAvgCoords[0].y + spikeValue) return data
                else return { x: data.x, y: undefined }
            })
            // console.log(
            //     spikeCoords.map((data) => ({
            //         x: moment(data.x).format("hh:mm"),
            //         y: data.y,
            //     }))
            // )

            setSpikeChartCoords(spikeCoords)
        }
    }, [spikeValue])

    return {
        isLoading,
        isError,
        coinDetails,
        chartDetails,
        setChartDetails,
        movingAvgCoords,
        setMovingAvgCoords,
        spikeValue,
        setSpikeValue,
        spikeChartCoords,
    }
}

export default useAxios
