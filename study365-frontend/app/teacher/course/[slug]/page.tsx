'use client'

import { PencilIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

export default function DetailCourse({ params }: { params: { slug: string } }) {
    const objBtn = {
        "btn-1": false,
        "btn-2": false,
    }
    const [display, setDisplay] = useState(objBtn)
    function setContent(id: string) {
        setDisplay({ ...display, [id]: true });
    }
    return (
        <div>
            <div className="p-5 mx-5 bg-white shadow-lg">
                <hr className='my-5 text-slate-300' />
                <div>
                    <div className='flex flex-row items-center mb-5'>
                        <button type='button' className='rounded-full shadow-sm bg-slate-200 p-1 mr-2' id="btn-2" onClick={(e) => {
                            setContent(e.target.id)
                        }}>
                            <ChevronDownIcon className='w-5 h-5 font-black' id="btn-1" />
                        </button>
                        <h4 className='font-bold text-xl text-[#676c70]'>CHƯƠNG 2</h4>
                    </div>
                    <div className={`${display['btn-1'] ? 'hidden' : ''} mb-2 border-[1px] border-slate-400 rounded-lg w-full p-5 flex flex-row items-center`}>
                        <p className='w-11/12 overflow-hidden px-2'><span className="pr-2 font-medium">Bài giảng 1:</span>Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số</p>
                        <div className='ml-5 flex flex-row'>
                            <button type='button'>
                                <PencilIcon className='w-5 h-5 mr-2 text-blue-600' />
                            </button>
                            <button type='button'>

                                <TrashIcon className='w-5 h-5 text-red-600' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}