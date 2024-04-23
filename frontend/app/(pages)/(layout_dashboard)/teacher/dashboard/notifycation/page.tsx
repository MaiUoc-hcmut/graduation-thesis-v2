"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import notifyApi from '@/app/api/notifyApi';
import { useAppSelector } from '@/redux/store';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { convertToVietnamTime } from '@/app/helper/FormatFunction';

export default function NotifycationDashboard() {
    const [notifycations, setNotifycations] = useState<any>([])
    const { user } = useAppSelector(state => state.authReducer);
    useEffect(() => {
        async function fetchData() {
            if (user) {

                await notifyApi.getNotify(`${user.id}`).then((data) => {
                    setNotifycations(data.data)
                }).catch((err: any) => { })

            }
        }
        fetchData()
    }, [user]);
    return (
        <div>
            <div className="font-bold text-[#171347] text-lg">Thông báo</div>
            <div className='mt-10'>
                {
                    notifycations?.map((notify: any, index: any) => {
                        return (
                            <div key={notify.id} className='rounded-md bg-white shadow-sm mb-5 px-10 py-5'>

                                <div className='flex items-center justify-between'>
                                    <div className="text-[#171347] text-sm font-semibold w-1/4 flex flex-col justify-center items-start">
                                        <div className='mb-2 flex justify-center items-center'>
                                            {
                                                notify.read ? null : <div className='rounded-full w-3 h-3 p-1 bg-[#f63c3c] mr-1'>

                                                </div>
                                            }

                                            Thông báo mới từ hệ thống
                                        </div>
                                        <span className='text-[#818894] text-xs'>
                                            {convertToVietnamTime(notify.createdAt)}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 text-sm flex-1 text-center">
                                        {notify.type === 'course' && (
                                            <>Khóa học <span className='font-medium text-black'>{notify.name}</span>  vừa được tạo thành công</>
                                        )}
                                        {notify.type === 'topic' && (
                                            <>Có người vừa tạo chủ đề <span className='font-medium text-black'>{notify.name}</span> trong khóa học <span className='font-medium text-black'>{notify.course_name}</span></>
                                        )}
                                    </div>
                                    {
                                        notify.type === 'course' && (<Link href={'/teacher/dashboard/course'} className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                            <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                        </Link>)
                                    }
                                    {
                                        notify.type === 'topic' && (<Link href={`/course/learning/${notify.id_course}/forum/${notify.id_topic}`} className="text-gray-500 text-sm w-1/12 flex justify-center items-center">
                                            <button type='button' onClick={async () => { if (!notify.read) await notifyApi.readNotify({ data: [notify.id] }) }} className='px-4 py-2 border-[1px] border-gray-200 rounded-md hover:text-white hover:bg-primary'>Xem</button>
                                        </Link>)
                                    }

                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>

    )
}
