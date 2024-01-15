import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'

export function SortableItem(props) {
    const [openForm, setOpenForm] = useState({})
    const [formData, setFormData] = useState([])
    const [formD, setFormD] = useState({})

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.chapter });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    const index = props.id
    const chapter = props.chapter
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {
                <div className="border-[1px] border-slate-400 py-2 px-5 mb-5">
                    <div className={`flex ${openForm[`c${index}`] ? 'hidden' : ''}`}>
                        <p className="text-lg"><span className=" font-medium">Chương {index + 1}:</span> {chapter.name}</p>
                        <div className='ml-5 flex flex-row'>
                            <button type='button' onClick={() => {
                                setFormD(formData[index])
                                setOpenForm({ [`c${index}`]: true })
                            }}>
                                <PencilIcon className='w-5 h-5 mr-2 text-blue-600' />
                            </button>
                            <button type='button' onClick={() => setOpenModal({ [`btn-ld${lecture.id}`]: true })}>
                                <TrashIcon className='w-5 h-5 text-red-600' />
                            </button>
                        </div>
                    </div>
                    <div className={`${openForm[`c${index}`] ? '' : 'hidden'} bg-white border-[1px] py-2 px-5`}>

                        <p className="text-xl font-medium">Sửa chương</p>
                        <div className="p-2">
                            <div className="text-left">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                            Tên chương
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={e => {
                                                    setFormD({ ...formD, name: e.target.value })
                                                }}
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formD.name}
                                                autoComplete="given-name"
                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                                            Trạng thái
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                onChange={(e) => handlerInput(e, 0)}
                                                id="status"
                                                name="status"
                                                autoComplete="country-name"
                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                            >
                                                <option value={true}>Công khai</option>
                                                <option value={false}>Riêng tư</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-100 py-3 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setOpenForm({ [`c${index}`]: false })
                                            formData[index] = formD
                                            setFormD({})
                                            setFormData([...formData])
                                        }}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            setOpenForm({ [`c${index}`]: false })
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>



                    </div>
                    {
                        chapter.lectures.map((lecture: object, idxl) => {
                            return (
                                <div key={idxl} className="border-[1px] bg-white border-slate-400 py-2 px-5 ml-10 mt-5">
                                    <p><span className="font-medium">Bài giảng {idxl + 1}: </span>{lecture.name}</p>
                                </div>
                            )
                        })
                    }
                    <button type="button" className="mt-5 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={() => {
                            setOpenForm({ [`create-lecture${index}`]: true })
                            setFormD({ "name": "" })
                        }}>Thêm bài giảng</button>

                    <div className={`${openForm[`create-lecture${index}`] ? '' : 'hidden'} mt-5 bg-white border-[1px] py-2 px-5`}>

                        <p className="text-xl font-medium">Bài giảng mới</p>
                        <div className="p-2">
                            <div className="text-left">
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                            Tên bài giảng
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                onChange={e => {
                                                    setFormD({ ...formD, name: e.target.value })
                                                }}
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={formD.name}
                                                autoComplete="given-name"
                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-3">
                                        <label htmlFor="country" className="block text-base font-medium leading-6 text-gray-900">
                                            Trạng thái
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                onChange={(e) => handlerInput(e, 0)}
                                                id="status"
                                                name="status"
                                                autoComplete="country-name"
                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                            >
                                                <option value={true}>Công khai</option>
                                                <option value={false}>Riêng tư</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-100 py-3 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setOpenForm({ [`create-lecture${index}`]: false })
                                            formData[index].lectures.push(formD)
                                            setFormData(formData)
                                            console.log(formData);
                                            updateFields({ chapters: formData })
                                        }}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            setOpenForm({ [`create-lecture${index}`]: false })
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

