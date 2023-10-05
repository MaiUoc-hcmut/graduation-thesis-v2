/* eslint-disable react/jsx-key */
'use client'
import { PencilIcon } from '@heroicons/react/24/solid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { FormEvent, useEffect } from 'react'
import chapterApi from '@/app/api/chapterApi'
import courseApi from '@/app/api/courseApi'

import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import lectureApi from '@/app/api/lectureApi'

export default function DetailCourse({ params }: { params: { slug: string } }) {
    const [dataForm, setDataForm] = useState({})
    const [openModal, setOpenModal] = useState({})
    const cancelButtonRef = useRef(null)
    const [display, setDisplay] = useState({})
    const [course, setCourse] = useState({})
    const [chapterList, setChapterList] = useState([])
    const [changeData, setChangeData] = useState(false)
    useEffect(() => {
        const fetchChapterList = async () => {
            try {
                const chapter = await chapterApi.getFull({ 'id_course': params.slug });
                const course = await courseApi.getFull(params.slug)
                console.log(chapter);

                setCourse(course)
                setChapterList(chapter);
            } catch (error) {
                console.log('Failed to fetch chapter list: ', error);
            }
        }

        fetchChapterList();
    }, [changeData]);

    function handlerInput(e: FormEvent<HTMLInputElement>, id: number) {
        setDataForm({ ...dataForm, [id]: { ...dataForm[id], [e.target.name]: e.target.value } })
    }

    const listChapter = chapterList.map((chapter: object) => {
        const listLecture = chapter.lectures.map((lecture: Object) => {
            return (

                <div key={lecture.id} >
                    {/* Modal delete lecture */}
                    < Transition.Root show={openModal[`btn-ld${chapter.id}`] ? true : false} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                    </div>
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                            Cảnh báo
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Bạn có chắc muốn xóa bài giảng này
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={async () => {
                                                        setOpenModal(false)
                                                        await lectureApi.delete(lecture.id)
                                                        setChangeData(!changeData)
                                                    }}
                                                >
                                                    Xóa
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={() => setOpenModal(false)}
                                                    ref={cancelButtonRef}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </ Transition.Root>
                    {/* Modal update lecture */}
                    < Transition.Root show={openModal[`btn-l${chapter.id}`] ? true : false} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative top-10 first-letter:transform overflow-hidden rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className=" bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 w-full">
                                                        <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center text-lg">
                                                            Sửa bài giảng
                                                        </Dialog.Title>

                                                        <div className="mt-2 overflow-y-auto no-scrollbar h-80 mb-10">
                                                            <form onSubmit={async (e) => {
                                                                e.preventDefault()
                                                                const data = { ...lecture, ...dataForm[lecture.id] }
                                                                delete data['createdAt']
                                                                delete data['updatedAt']
                                                                await lectureApi.update(data, lecture.id)
                                                                setChangeData(!changeData)
                                                            }}>
                                                                <div className="p-5">
                                                                    <div className="text-left">
                                                                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                                                            <div className="sm:col-span-6">
                                                                                <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                    Tên bài giảng
                                                                                </label>
                                                                                <div className="mt-2">
                                                                                    <input
                                                                                        onChange={(e) => handlerInput(e, lecture.id)}
                                                                                        type="text"
                                                                                        name="name"
                                                                                        defaultValue={lecture.name}
                                                                                        id="name"
                                                                                        autoComplete="given-name"
                                                                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="sm:col-span-6">
                                                                                <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                    Mô tả
                                                                                </label>
                                                                                <div className="mt-2">
                                                                                    <input
                                                                                        onChange={(e) => handlerInput(e, lecture.id)}
                                                                                        type="text"
                                                                                        name="description"
                                                                                        defaultValue={lecture.description}
                                                                                        id="description"
                                                                                        autoComplete="given-name"
                                                                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className="sm:col-span-6">
                                                                                <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                    Thứ tự
                                                                                </label>
                                                                                <div className="mt-2">
                                                                                    <input
                                                                                        onChange={(e) => handlerInput(e, lecture.id)}
                                                                                        type="number"
                                                                                        name="order"
                                                                                        defaultValue={lecture.order}
                                                                                        id="order"
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
                                                                                        onChange={(e) => handlerInput(e, lecture.id)}
                                                                                        id="status"
                                                                                        name="status"
                                                                                        defaultValue={lecture.status}
                                                                                        autoComplete="country-name"
                                                                                        className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                    >
                                                                                        <option value={true}>Mở</option>
                                                                                        <option value={false}>Khóa</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="absolute bottom-0 right-0 bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                    <button
                                                                        type="submit"
                                                                        className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                                        onClick={() => setOpenModal(false)}
                                                                    >
                                                                        Lưu
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                        onClick={() => setOpenModal(false)}
                                                                        ref={cancelButtonRef}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </ Transition.Root>
                    <div className={`mb-2 border-[1px] border-slate-400 rounded-lg w-full p-5 flex flex-row items-center`}>
                        <p className='w-11/12 overflow-hidden px-2'><span className="pr-2 font-medium">Bài giảng 1:</span>{lecture.name}</p>
                        <div className='ml-5 flex flex-row'>
                            <button type='button' onClick={() => setOpenModal({ [`btn-l${chapter.id}`]: true })}>
                                <PencilIcon className='w-5 h-5 mr-2 text-blue-600' />
                            </button>
                            <button type='button' onClick={() => setOpenModal({ [`btn-ld${chapter.id}`]: true })}>
                                <TrashIcon className='w-5 h-5 text-red-600' />
                            </button>
                        </div>
                    </div>
                </div>

            )
        })
        return (
            <div key={chapter.id}>
                {/* Modal delete chapter */}
                <Transition.Root show={openModal[`btn-cd${chapter.id}`] ? true : false} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className="bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                        Cảnh báo
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            Bạn có chắc muốn xóa chương này
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={async () => {
                                                    setOpenModal(false)
                                                    await chapterApi.delete(chapter.id)
                                                    setChangeData(!changeData)
                                                }}
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setOpenModal(false)}
                                                ref={cancelButtonRef}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                {/* Modal update chapter */}
                <Transition.Root show={openModal[`btn-c${chapter.id}`] ? true : false} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative top-10 first-letter:transform overflow-hidden rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className=" bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 w-full">
                                                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center text-lg">
                                                        Sửa chương
                                                    </Dialog.Title>

                                                    <div className="mt-2 overflow-y-auto no-scrollbar h-80 mb-10">
                                                        <form onSubmit={async (e) => {
                                                            e.preventDefault()
                                                            const data = { ...chapter, ...dataForm[chapter.id] }
                                                            delete data['createdAt']
                                                            delete data['updatedAt']
                                                            await chapterApi.update(data, chapter.id)
                                                            setChangeData(!changeData)
                                                        }}>
                                                            <div className="p-5">
                                                                <div className="text-left">
                                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Tên chương
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="text"
                                                                                    name="name"
                                                                                    defaultValue={chapter.name}
                                                                                    id="name"
                                                                                    autoComplete="given-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Mô tả
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="text"
                                                                                    name="description"
                                                                                    defaultValue={chapter.description}
                                                                                    id="description"
                                                                                    autoComplete="given-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Thứ tự
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="number"
                                                                                    name="order"
                                                                                    defaultValue={chapter.order}
                                                                                    id="order"
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
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    id="status"
                                                                                    name="status"
                                                                                    defaultValue={chapter.status}
                                                                                    autoComplete="country-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value={true}>Mở</option>
                                                                                    <option value={false}>Khóa</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="absolute bottom-0 right-0 bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                                    onClick={() => setOpenModal(false)}
                                                                >
                                                                    Lưu
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                    onClick={() => setOpenModal(false)}
                                                                    ref={cancelButtonRef}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                {/* Modal create lecture */}
                <Transition.Root show={openModal[`btn-lc${chapter.id}`] ? true : false} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <Dialog.Panel className="relative top-10 bg-slate-50 transform overflow-hidden rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className=" bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mt-3 w-full">
                                                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center text-lg">
                                                        Thêm bài giảng
                                                    </Dialog.Title>

                                                    <div className="mt-2 overflow-y-auto no-scrollbar h-80 mb-10">
                                                        <form onSubmit={async (e) => {
                                                            e.preventDefault()
                                                            const data = { ...dataForm[chapter.id], ['id_chapter']: chapter.id }
                                                            await lectureApi.create(data)
                                                            setChangeData(!changeData)
                                                        }}>
                                                            <div className="p-5">
                                                                <div className="text-left">
                                                                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Tên bài giảng
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="text"
                                                                                    name="name"
                                                                                    id="name"
                                                                                    autoComplete="given-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Mô tả
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="text"
                                                                                    name="description"
                                                                                    id="description"
                                                                                    autoComplete="given-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="sm:col-span-6">
                                                                            <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                                Thứ tự
                                                                            </label>
                                                                            <div className="mt-2">
                                                                                <input
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    type="number"
                                                                                    name="order"
                                                                                    id="order"
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
                                                                                    onChange={(e) => handlerInput(e, chapter.id)}
                                                                                    id="status"
                                                                                    name="status"
                                                                                    autoComplete="country-name"
                                                                                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                                >
                                                                                    <option value={true}>Mở</option>
                                                                                    <option value={false}>Khóa</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="absolute bottom-0 right-0 bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                                <button
                                                                    type="submit"
                                                                    className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                                    onClick={async () => {
                                                                        setOpenModal(false)
                                                                    }}
                                                                >
                                                                    Thêm
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                    onClick={() => setOpenModal(false)}
                                                                    ref={cancelButtonRef}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <div>
                    <div className='flex flex-row items-center mb-5'>
                        <button type='button' className='rounded-full shadow-sm bg-slate-200 p-1 mr-2' id="btn-2" onClick={() => {
                            setDisplay({ ...display, [`dis-${chapter.id}`]: !display[`dis-${chapter.id}`] })
                        }}>
                            <ChevronDownIcon className='w-5 h-5 font-black' id="btn-1" />
                        </button>
                        <h4 className='font-bold text-xl text-[#676c70]'>{chapter.name}</h4>
                        <div className='ml-2 flex flex-row'>
                            <button type='button' onClick={() => setOpenModal({ [`btn-c${chapter.id}`]: true })}>
                                <PencilIcon className='w-5 h-5 mr-2 text-blue-600' />
                            </button>
                            <button type='button' onClick={() => setOpenModal({ [`btn-cd${chapter.id}`]: true })}>
                                <TrashIcon className='w-5 h-5 text-red-600' />
                            </button>
                        </div>
                    </div>
                    <div className={`${display[`dis-${chapter.id}`] ? '' : 'hidden'}`}>
                        {
                            listLecture
                        }

                        <div className='mt-5 flex justify-end'>
                            <button type="button" onClick={() => setOpenModal({ [`btn-lc${chapter.id}`]: true })} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Thêm bài giảng</button>
                        </div>
                    </div>
                </div>
                <hr className='my-5 text-slate-300' />
            </div >
        )
    })

    return (
        <div>
            <Transition.Root show={openModal[`btn-add-chapter`] ? true : false} as={Fragment}>
                <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpenModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen  overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative top-10 bg-slate-50 transform overflow-hidden rounded-lg shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className=" bg-slate-50 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 w-full">
                                                <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 text-center text-lg">
                                                    Thêm chương
                                                </Dialog.Title>

                                                <div className="mt-2 overflow-y-auto no-scrollbar h-80 mb-10">
                                                    <form onSubmit={async (e) => {
                                                        e.preventDefault()
                                                        const data = { ...dataForm[0], ['id_course']: params.slug }
                                                        await chapterApi.create(data)
                                                        setChangeData(!changeData)
                                                    }}>
                                                        <div className="p-5">
                                                            <div className="text-left">
                                                                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                                                                    <div className="sm:col-span-6">
                                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                            Tên chương
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <input
                                                                                onChange={(e) => handlerInput(e, 0)}
                                                                                type="text"
                                                                                name="name"
                                                                                id="name"
                                                                                autoComplete="given-name"
                                                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sm:col-span-6">
                                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                            Mô tả
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <input
                                                                                onChange={(e) => handlerInput(e, 0)}
                                                                                type="text"
                                                                                name="description"
                                                                                id="description"
                                                                                autoComplete="given-name"
                                                                                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-input_primary ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-1 sm:text-sm sm:leading-6"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sm:col-span-6">
                                                                        <label htmlFor="name" className="block text-base font-medium leading-6 text-gray-900">
                                                                            Thứ tự
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <input
                                                                                onChange={(e) => handlerInput(e, 0)}
                                                                                type="number"
                                                                                name="order"
                                                                                id="order"
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
                                                                                <option value={true}>Mở</option>
                                                                                <option value={false}>Khóa</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="absolute bottom-0 right-0 bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                            <button
                                                                type="submit"
                                                                className="inline-flex w-full justify-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                                                                onClick={async () => {
                                                                    setOpenModal(false)
                                                                }}
                                                            >
                                                                Thêm
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="mt-3 inline-flex w-full justify-center rounded-md text-white bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                                onClick={() => setOpenModal(false)}
                                                                ref={cancelButtonRef}
                                                            >
                                                                Hủy
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>


            <div className="p-5 mx-5 bg-white shadow-lg">
                <h3 className='font-bold text-center text-[#676c70] text-2xl'> Khóa học: {course.name}</h3>
                <hr className='my-5 text-slate-300' />
                <div className='mt-5 mb-10 flex justify-end'>
                    <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        onClick={() => {
                            setOpenModal({ ...openModal, 'btn-add-chapter': true })
                        }}>Thêm chương</button>
                </div>
                {listChapter}
            </div>
        </div>
    )
}