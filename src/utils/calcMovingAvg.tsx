import { ChartDataResponseProps, ChartDetailsProps } from "../hooks/useAxios"

const calcMovingAvg = (data: ChartDetailsProps[]) => {
    const len = data.length

    const movingAvg =
        data.reduce((acc: number, cur, i: number) => {
            if (len - 20 <= i) {
                return acc + Number(cur.y)
            } else return 0
        }, 0) / 20

    const spike = movingAvg * 0.01

    const movingAvgDetails = data.map((coinData) => ({
        x: coinData.x,
        y: movingAvg,
    }))

    return { movingAvgDetails, spike }
}

export default calcMovingAvg
