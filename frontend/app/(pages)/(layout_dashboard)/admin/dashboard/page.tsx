"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Dashboard() {

    return (
        <div className="h-[2000px] px-[30px] py-[20px] w-[calc(100%-254px)] bg-slate-50">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

        </div>
    )
}

