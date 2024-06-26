"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/redux/store";
import { DataTable } from "@/app/_components/Table/TableFormat"
import { columns } from "@/app/_components/Table/ReviewColumns/course_columns"
import { useSearchParams } from "next/navigation"
import userApi from "@/app/api/userApi"
import courseApi from "@/app/api/courseApi";


export default function CourseReview() {

    const user = useAppSelector(state => state.authReducer.user);
    const [reviews, setReviews] = useState<any>([])
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [courses, setCourses] = useState<any>([])
    const searchParams = useSearchParams();
    const queries = Object.fromEntries(searchParams.entries());
    let filterString = ''
    for (const key of Object.keys(queries)) {
        filterString += `${key}=${queries[key]}&`
    }
    const [selectedCourseId, setSelectedCourseId] = useState(
        searchParams.get('id_course') || ''
    );
    const handleCourseChange = (event: any) => {
        setSelectedCourseId(event.target.value);
    };
    useEffect(() => {
        async function fetchData() {
            await courseApi.getAllByTeacher(`${user.id}`, '1').then((data: any) => {
                setCourses(data.data.courses)
            }).catch((err: any) => { })
            await courseApi.getAllReview(`${user.id}`).then((data: any) => {
                setReviews(data.data)
            }).catch((err: any) => { })
        }
        fetchData()
    }, [page, user.id]);


    return (
        <div>
            <div>
                <div className="font-bold text-[#171347] text-lg">Lọc kết quả</div>
                <form className="p-5 bg-white mt-4 rounded-lg flex justify-between items-center">
                    <div>
                        <div className="flex items-center">
                            <div className="">
                                <input date-rangepicker="true" defaultValue={searchParams.get("preDate") || ''} name="preDate" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
                            </div>
                            <span className="mx-4 text-gray-500">đến</span>
                            <div className="">

                                <input date-rangepicker="true" defaultValue={searchParams.get("postDate") || ''} name="postDate" type="date" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end" />
                            </div>
                        </div>
                    </div>
                    <div>
                        {courses.length > 0 ? (
                            <select id="id_course" defaultValue={selectedCourseId} onChange={handleCourseChange} name="id_course" className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value="">Chọn khóa học</option>

                                {courses?.map((course: any, index: number) => {
                                    return (
                                        <option key={course.id} value={`${course.id}`}>{course.name}</option>
                                    )
                                })}
                            </select>
                        ) : (
                            null
                        )}

                    </div>
                    <div>
                        <select id="star" name="star" defaultValue={searchParams.get("star") || ''} className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Chọn sao</option>
                            {Array.from({ length: 5 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                </option>
                            ))}

                        </select>
                    </div>
                    <button type='submit' className='h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Lọc</button>
                </form>
            </div>
            <div className="mt-5">
                <div className="font-bold text-[#171347] text-lg">Đánh giá của tôi</div>
                <div className="container mx-auto rounded-lg mt-4">
                    <DataTable columns={columns} data={reviews} page={page} setPage={setPage} pageCount={pageCount} />
                </div>
            </div>
        </div>
    )
}

