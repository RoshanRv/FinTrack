import axios from "axios"
import React, { useEffect, useState } from "react"

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

interface ChartDetailsProps {
    x: number
    y: number
}

const useAxios = (coin: string) => {
    const [coinDetails, setCoinDetails] = useState({} as CoinDetailsProps)
    const [chartDetails, setChartDetails] = useState({} as ChartDetailsProps[])
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const fetchData = async (coin: string) => {
        try {
            setIsLoading(true)
            const coinDetails = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
            )

            setCoinDetails(coinDetails.data)

            const chartDetails = await axios.get(
                `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=inr&days=1&interval=minutes`
            )

            const chartCoords = chartDetails.data.prices.map(
                (price: number[]) => ({ x: price[0], y: price[1].toFixed(2) })
            )

            setChartDetails(chartCoords)
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

    return {
        isLoading,
        isError,
        coinDetails,
        chartDetails,
    }
}

export default useAxios
