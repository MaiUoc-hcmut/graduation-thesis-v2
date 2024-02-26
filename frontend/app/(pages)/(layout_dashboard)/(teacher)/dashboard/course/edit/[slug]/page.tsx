'use client'

import courseApi from "@/app/api/courseApi";
import { useEffect, useState } from "react";
import Edit from './edit'

export default function EditCourse({ params }: { params: { slug: string } }) {
    const [data, setData] = useState()
    useEffect(() => {
        async function fetchData() {
            await courseApi.get(params.slug).then((data: any) => setData(data.data))
        }
        fetchData()
    }, []);
    if (data) {
        return (
            <Edit id={params.slug} course={data} />
        )
    }
    else {
        return null
    }

}



