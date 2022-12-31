import { useState } from "react"
import Home from "./pages/Home"

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="App0 bg-[url('bg.svg')] bg-cover ">
            {/*     Title     */}
            <h1 className="text-4xl font-semibold border-b-2 border-gray-500 bg-emerald-700 p-6">
                Fin-Tracker
            </h1>
            <Home />
        </div>
    )
}

export default App
