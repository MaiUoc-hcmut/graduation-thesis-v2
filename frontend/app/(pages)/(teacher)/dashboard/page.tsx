import { Alert, Navbar } from "flowbite-react"
import Image from "next/image"
export default function Dashboard() {

    return (
        <div className="h-[2000px] px-[30px] py-[20px] w-[calc(100%-254px)] bg-slate-50">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Default</span>
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Red</span>
        </div>
    )
}

