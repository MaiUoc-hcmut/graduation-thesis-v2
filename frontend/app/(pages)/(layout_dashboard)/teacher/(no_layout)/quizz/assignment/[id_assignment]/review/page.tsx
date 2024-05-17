"use client"
import axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import examApi from '@/app/api/examApi';
import { useForm } from 'react-hook-form';
import { convertToHourMinuteSecond, convertToVietnamTime } from '@/app/helper/FormatFunction';
import { useRouter } from 'next/navigation';
import TinyMceEditorComment from '@/app/_components/Editor/TinyMceEditorComment';


export default function ReviewExam({ params }: { params: { slug: string, id_assignment: string } }) {
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [assignment, setAssignment] = useState<any>()
    const [openSidebar, setOpenSideBar] = useState(true);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    const [toggle, setToggle] = useState<any>({})
    const [type, setType] = useState('comment')

    const {
        register,
        reset,
        getValues,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm()
    useEffect(() => {
        async function fetchData() {
            examApi.getDetailAssigmnent(params.id_assignment).then((data) => {
                setAssignment(data.data)
            })
        }
        fetchData()
    }, [params.id_assignment]);


    let listQuestion;
    let listNumber;
    if (assignment) {
        listQuestion = assignment.details?.map((question: any, index: number) => {
            return (
                <div id={`question${index + 1}`} key={index} className="mt-5 border-[1px] border-[#ececec] p-3 rounded-md shadow-sm bg-slate-50">
                    <div className="flex justify-between items-center">
                        <div className=" font-normal text-[#000] flex-1">
                            <div className='flex'>
                                <span className="font-semibold text-[#153462] mr-1">Câu {index + 1}: </span>
                                {parse(question.content_text)}

                            </div>

                        </div>
                        <div className='w-1/6 flex justify-end items-center'>
                            {question.is_correct ? (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                    đúng
                                </span>
                            ) : (
                                <span
                                    key={index}
                                    className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                                >
                                    sai
                                </span>
                            )}
                        </div>
                    </div>
                    {
                        question.content_image && <div className='relative w-1/2 h-64 mt-5 z-auto'>
                            <Image
                                src={question.content_image}
                                fill
                                className='w-full h-full overflow-hidden object-cover object-center '
                                alt="logo"
                            />
                        </div>
                    }
                    <div>
                        <ul
                            className="mt-4 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                        >
                            {
                                question?.Answers?.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="items-center mb-2 ">
                                            <div className="flex items-center mb-2">
                                                {
                                                    question.multi_choice ? <input
                                                        id={answer.id}
                                                        disabled defaultChecked={answer.selected_answer.is_selected}
                                                        type="checkbox"
                                                        value={answer.id}
                                                        name={question.id}
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    /> : <input id={answer.id} disabled defaultChecked={answer.selected_answer?.is_selected} type="radio" name={question.id} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />

                                                }
                                                <p className='ml-2 mr-1'>{alphabet[index]}.</p>
                                                <label htmlFor={answer.id} className="text-sm font-medium text-gray-900 dark:text-gray-300">{parse(answer.content_text)}</label>
                                                <div className='ml-4'>
                                                    {
                                                        answer.is_correct ? <CheckIcon className="w-5 h-5 text-green-500" /> : <XMarkIcon className="w-5 h-5 text-red-500" />
                                                    }

                                                </div>
                                            </div>
                                            {
                                                answer.content_image && <div className='relative w-1/2 h-64 mt-5 z-0'>
                                                    <Image
                                                        src={answer.content_image}
                                                        fill
                                                        className='w-full h-full overflow-hidden object-cover object-center'
                                                        alt="logo"
                                                    />
                                                </div>
                                            }
                                        </li>
                                    );
                                })
                            }

                        </ul>
                        <div className="font-medium ml-4">
                            {question?.Answers?.map((answer: any, index: number) => {
                                if (answer.isCorrect) {
                                    return (
                                        <span key={index}>
                                            <span></span>
                                            {alphabet[index]}
                                        </span>
                                    );
                                }
                            })}
                        </div>
                    </div>
                    <div className='flex justify-end text-sm'>
                        <button className='underline' type="button" onClick={() => setToggle({ ...toggle, [`form-${question.id_question}`]: !toggle[`form-${question.id_question}`] })}>
                            Thêm nhận xét
                        </button>
                    </div>
                    <div className={`${toggle[`form-${question.id_question}`] ? '' : 'hidden'} mt-5`}>
                        {/* <textarea
                            defaultValue={question.comment}
                            placeholder="Nhập nhận xét của bạn..."
                            {...register(`${question.id}`)}
                            className="w-full mt-5 p-2 border rounded focus:ring-0 focus:border-primary_border"
                            rows={4}
                        ></textarea> */}
                        <TinyMceEditorComment value={question.comment} setValue={setValue} position={question.id} link={'http://localhost:4001/api/v1/images/single'} />
                    </div>
                </div>
            );
        });
        listNumber = assignment.details?.map((question: any, index: number) => {
            // if (question.is_correct) {
            //     return (
            //         <Link
            //             href={`#question${index + 1}`}
            //             key={index}
            //             className="bg-[#f0efef] p-2 w-9 h-9 rounded-xl flex justify-center items-center font-normal"
            //             style={{
            //                 boxShadow: '0px 1px 4px 0px #00000033 -1px -1px 4px 0px #00000026 inset 1px 1px 4px 0px #0000001A inset',
            //                 textDecoration: 'none',
            //             }}
            //         >
            //             {index + 1}
            //         </Link>
            //     );
            // }
            if (!question.is_correct) {
                return (
                    <Link
                        href={`#question${index + 1}`}
                        key={index}
                        className="p-2 w-10 h-10 rounded-xl flex justify-center items-center font-normal text-[#E44848]"
                        style={{
                            boxShadow: '0px 1px 4px 0px rgba(207, 56, 56, 0.25) -1px -1px 4px 0px rgba(207, 56, 56, 0.36) inset 1px 1px 4px 0px rgba(207, 56, 56, 0.32 inset',
                            backgroundColor: 'rgba(228, 72, 72, 0.15)',
                            textDecoration: 'none',
                        }}
                    >
                        {index + 1}
                    </Link>
                );
            }
            else {
                return (
                    <Link
                        href={`#question${index + 1}`}
                        key={index}
                        className="p-2 w-10 h-10 rounded-xl flex justify-center items-center font-normal text-[#2FD790]"
                        style={{
                            background: 'rgba(47, 215, 144, 0.15)',
                            boxShadow: '1px 1px 2px 0px #2FD79040 1px 1px 3px 0px #2FD7905C inset -1px -1px 2px 0px #2FD79052 inset',
                            textDecoration: 'none',
                        }}
                    >
                        {index + 1}
                    </Link>
                );
            }
        });
    }

    return (
        <div className="bg-[#FBFAF9] relative pt-10">
            <div className="px-10 py-5 bg-[#153462] fixed w-full top-0 left-0 z-10">
                <div className="flex justify-between h-full items-center">
                    <div className="text-[#fff] text-[22px] font-medium text-center ">{assignment?.exam_name}</div>
                </div>
            </div>
            <div className='mx-3 '>
                <div className="flex flex-row">
                    <div
                        className={`px-2 ${openSidebar ? "w-[74%]" : "flex-1 px-10 mr-12 ml-10"} bg-white pb-5 `}

                    >
                        <div
                            className={`bg-white rounded-lg mt-16 p-4 flex items-center mx-5`}
                            style={{
                                boxShadow: '0px 0px 4px 0px #00000040',
                            }}
                        >
                            <div
                                className="w-32 h-32 py-3 px-7 bg-slate-50 rounded-full text-4xl text-[#2FD790] font-normal flex justify-center items-center mr-5"
                                style={{
                                    borderImageSource: 'radial-gradient(100% 2743.76% at 100% 84.52%, #2FD790 0%, rgba(47, 215, 144, 0) 100%)',
                                    boxShadow: '1px 2px 4px 0px #00000040 -1px -2px 4px 0px #00000040 inset',
                                }}
                            >
                                {assignment?.score.toFixed(1)}
                            </div>
                            <div className="flex">
                                <div className="flex flex-col justify-between mr-4">
                                    <div className="py-1 text-[#757575]">Bài kiểm tra:</div>
                                    <div className="py-1 text-[#757575]">Thời gian hoàn thành:</div>
                                    <div className="py-1 text-[#757575]">Thời gian làm bài:</div>
                                    <div className="py-1 text-[#757575]">Số câu bỏ trống</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời đúng:</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời sai:</div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="py-1 text-[#000]">{assignment?.exam_name}</div>
                                    <div className="py-1 text-[#000]">{convertToVietnamTime(assignment?.time_end)}</div>
                                    <div className="py-1 text-[#000]">{convertToHourMinuteSecond(assignment?.time_to_do || '')}</div>
                                    <div className="py-1 text-[#000]">{assignment?.empty_question}</div>
                                    <div className="py-1 text-[#000]">{assignment?.right_question}</div>
                                    <div className="py-1 text-[#000]">{assignment?.wrong_question}</div>
                                </div>
                            </div>

                        </div>

                        {/* <div className='mt-5 mx-5'>
                            <h3 className='font-semibold text-lg'>Phân tích chi tiết</h3>
                            <div className="mt-5 overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Chuyên đề
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Số câu đúng
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Số câu sai
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Số câu bỏ qua
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Phàn trăm
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                Apple MacBook Pro 17
                                            </th>
                                            <td className="px-6 py-4">Silver</td>
                                            <td className="px-6 py-4">Laptop</td>
                                            <td className="px-6 py-4">$2999</td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href="#"
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                            <th
                                                scope="row"
                                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                Microsoft Surface Pro
                                            </th>
                                            <td className="px-6 py-4">White</td>
                                            <td className="px-6 py-4">Laptop PC</td>
                                            <td className="px-6 py-4">$1999</td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href="#"
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> */}

                        <div className='bg-white rounded-xl py-3 px-6 mt-4' style={{
                            boxShadow: '0px 0px 4px 0px #00000040 mt-10',
                        }}>
                            <div className="text-lg text-[#000] font-semibold">Đáp án</div>
                            <form onSubmit={handleSubmit(async (data: any) => {

                                const detail_questions = []

                                for (const key in data) {
                                    if (data.hasOwnProperty(key) && key !== 'comment') {
                                        detail_questions.push({
                                            id: key,
                                            comment: data[key]
                                        });
                                    }
                                }

                                const formData = {
                                    data: {
                                        comment: data.comment || "",
                                        type: type,
                                        detail_questions: detail_questions
                                    }
                                }

                                await examApi.commentAssigmnent(params.id_assignment, formData).then((data) => {
                                    router.push(`/teacher/dashboard/course/quizz/${assignment?.id_exam}/assignment`)
                                }).catch((err) => { })


                            })} className='mt-2'>{listQuestion}
                                <div className='mt-5'>
                                    <h3 className='text-secondary font-bold text-xl'>Nhận xét bài làm</h3>
                                    <div className='mt-5'>

                                        <TinyMceEditorComment value={assignment?.comment} setValue={setValue} position={'comment'} link={'http://localhost:4001/api/v1/images/single'} />
                                    </div>
                                    <div className='flex justify-end'>
                                        <button type='submit' onClick={() => setType('draft')} className='mt-5 mr-5 h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Lưu bản nháp</button>
                                        <button type='submit' onClick={() => setType('comment')} className='mt-5 h-[36px] px-[22px] bg-primary shadow-primary_btn_shadow border-primary text-white rounded-md hover:bg-primary_hover'>Hoàn thành đánh giá</button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>

                    <div
                        className={`${openSidebar ? "" : "hidden"} ml-5 bg-white p-4 min-h-svh h-auto top-[75px] fixed right-0 w-1/4 shadow-lg`}

                    >
                        <button onClick={() => setOpenSideBar(false)}>
                            <XMarkIcon className='w-5 h-5 absolute top-3 right-3 font-bold' />
                        </button>
                        <div className="border-[1px] border-[#ececec] shadow-sm rounded-xl p-3 mt-4">
                            <p className="rounded-md text-center font-medium text-lg text-[#153462] mb-5">Điều hướng bài kiểm tra</p>
                            <div className="grid grid-cols-5 justify-items-center gap-y-3">{listNumber}</div>
                            <div className="text-center mt-10 mb-2">
                                <Link href={`/teacher/dashboard/course/quizz/${assignment?.id_exam}/assignment`}>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        onClick={() => {
                                            setOpen(true);
                                        }}
                                    >
                                        Thoát
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className={`${openSidebar ? "hidden" : ""}  top-[85px] fixed right-2`}>
                        <button className='p-2 bg-white flex shadow-md items-center justify-center rounded-lg' onClick={() => setOpenSideBar(true)}>
                            <ChevronLeftIcon className='w-5 h-5 font-bold ' />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}