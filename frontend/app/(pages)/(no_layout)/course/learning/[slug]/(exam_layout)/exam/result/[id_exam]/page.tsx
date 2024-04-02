"use client"
import axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import examApi from '@/app/api/examApi';

export default function ResultExam({ params }: { params: { slug: string, id_exam: string } }) {
    const [open, setOpen] = useState(false);
    const [assignment, setAssignment] = useState<any>()
    const [openSidebar, setOpenSideBar] = useState(true);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        async function fetchData() {
            examApi.getDetailAssigmnent(params.id_exam).then((data) => {
                setAssignment(data.data)
            })
        }
        fetchData()
    }, []);


    let listQuestion;
    let listNumber;
    if (assignment) {
        listQuestion = assignment.details?.map((question: any, index: number) => {
            if (question.multi_choice) {
                return (
                    <div id={`question${index + 1}`} key={index} className="mt-5 border-[1px] border-[#ececec] p-3 rounded-md shadow-sm bg-slate-50">
                        <div className="flex justify-between items-center">
                            <div className="text-lg  font-normal  text-[#000]">
                                <div style={{ display: "flex" }}>
                                    <span style={{ marginRight: '8px' }} className="font-semibold text-[#153462]">Câu {index + 1}: </span>
                                    {parse(question.content_text)}
                                </div>
                            </div>
                            {question.isCorrect ? (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                    correct
                                </span>
                            ) : (
                                <span
                                    key={index}
                                    className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                                >
                                    wrong
                                </span>
                            )}
                        </div>
                        <div>
                            <ul
                                className="mt-4 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                {question.Answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-4">

                                            <input
                                                id="checked-checkbox"
                                                disabled defaultChecked={answer.selected_answer.is_selected}
                                                type="checkbox"
                                                value={answer.id}
                                                name={question.id}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <label
                                                htmlFor="checked-checkbox"
                                                className="ms-2 font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                {parse(answer.content_text)}
                                            </label>

                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="font-medium ml-4">
                                {question?.Answers?.map((answer: any, index: number) => {
                                    if (answer.isCorrect) {
                                        return (
                                            <span key={index}>
                                                <span> </span>
                                                {alphabet[index]}
                                            </span>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div id={`question${index + 1}`} key={index} className="mt-5 border-[1px] border-[#ececec] p-3 rounded-md shadow-sm bg-slate-50">
                        <div className="flex justify-between items-center">
                            <div style={{ display: "flex" }}>
                                <span style={{ marginRight: '8px' }} className="font-semibold text-[#153462]">Câu {index + 1}: </span>
                                {parse(question.content_text)}
                            </div>
                            {question.isCorrect ? (
                                <span
                                    key={index}
                                    className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                >
                                    correct
                                </span>
                            ) : (
                                <span
                                    key={index}
                                    className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"
                                >
                                    wrong
                                </span>
                            )}
                        </div>
                        <div>
                            <ul className="mt-2 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white ">
                                {question?.Answers?.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-2 ">
                                            <div className="flex items-center mb-2">
                                                <input id="default-radio-1" disabled defaultChecked={answer.selected_answer.is_selected} type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{parse(answer.content_text)}</label>
                                            </div>

                                        </li>
                                        // <li key={index} className="w-full rounded-t-lg flex flex-row items-center">
                                        //     <div className="flex items-center">
                                        //         {answer.isSelected ? (
                                        //             <input
                                        //                 id={answer.answerId}
                                        //                 type="radio"
                                        //                 value=""
                                        //                 name={`list-radio${question.questionId}`}
                                        //                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        //                 defaultChecked
                                        //             />
                                        //         ) : (
                                        //             <input
                                        //                 id={answer.answerId}
                                        //                 type="radio"
                                        //                 value=""
                                        //                 name={`list-radio${question.questionId}`}
                                        //                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        //             />
                                        //         )}
                                        //         <label
                                        //             htmlFor="list-radio-license"
                                        //             className="w-full mt-2 ml-2 text-base font-medium text-gray-900 dark:text-gray-300 "
                                        //         >
                                        //             {alphabet[index]}. <span>{answer.description}</span>
                                        //         </label>
                                        //         {/* {answer.isSelected ? (
                                        //             answer.isCorrect ? (
                                        //                 <TiTick className="text-[#2FD790] text-4xl" />
                                        //             ) : (
                                        //                 <MdOutlineCancel className="text-[#E44848] text-3xl" />
                                        //             )
                                        //         ) : (
                                        //             ''
                                        //         )} */}
                                        //     </div>
                                        // </li>
                                    );
                                })}
                            </ul>
                            <div className="font-medium ml-4">
                                {question?.Answers?.map((answer: any, index: number) => {
                                    if (answer.isCorrect) {
                                        return <div key={index}>Đáp án: {alphabet[index]}</div>;
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                );
            }
        });
        // listNumber = assignment.details.map((question: any, index: number) => {
        //     if (!formData.hasOwnProperty(question.questionId)) {
        //         return (
        //             <Link
        //                 href={`#question${index + 1}`}
        //                 key={index}
        //                 className="bg-[#f0efef] p-2 w-9 h-9 rounded-xl flex justify-center items-center font-normal"
        //                 style={{
        //                     boxShadow: '0px 1px 4px 0px #00000033 -1px -1px 4px 0px #00000026 inset 1px 1px 4px 0px #0000001A inset',
        //                     textDecoration: 'none',
        //                 }}
        //             >
        //                 {index + 1}
        //             </Link>
        //         );
        //     } else {
        //         return (
        //             <a
        //                 href={`#question${index + 1}`}
        //                 key={index}
        //                 className="p-2 w-10 h-10 rounded-xl flex justify-center items-center font-normal text-[#2FD790]"
        //                 style={{
        //                     background: 'rgba(47, 215, 144, 0.15)',
        //                     boxShadow: '1px 1px 2px 0px #2FD79040 1px 1px 3px 0px #2FD7905C inset -1px -1px 2px 0px #2FD79052 inset',
        //                     textDecoration: 'none',
        //                 }}
        //             >
        //                 {index + 1}
        //             </a>
        //         );
        //     }
        // });
    }

    return (
        <div className="bg-[#FBFAF9] relative py-10">
            <div className="px-10 py-5 bg-[#153462] fixed w-full top-0 left-0">
                <div className="flex justify-between h-full items-center">
                    <div className="text-[#fff] text-[22px] font-medium text-center ">dsfaaaaaaaaa</div>
                </div>
            </div>
            <div className='mx-3 '>
                <div className="flex flex-row">
                    <div
                        className={`px-2 ${openSidebar ? "w-[74%]" : "flex-1 px-10 mr-12 ml-10"} bg-white `}

                    >
                        <div
                            className={`bg-white rounded-lg mt-16 p-4 flex items-center mx-5`}
                            style={{
                                boxShadow: '0px 0px 4px 0px #00000040',
                            }}
                        >
                            <div
                                className="w-32 h-32 py-3 px-7 rounded-full text-4xl text-[#2FD790] font-normal flex justify-center items-center mr-5"
                                style={{
                                    borderImageSource: 'radial-gradient(100% 2743.76% at 100% 84.52%, #2FD790 0%, rgba(47, 215, 144, 0) 100%)',
                                    boxShadow: '1px 2px 4px 0px #00000040 -1px -2px 4px 0px #00000040 inset',
                                }}
                            >
                                {assignment?.score.toFixed(1)}
                            </div>
                            <div className="flex">
                                <div className="flex flex-col justify-between mr-4">
                                    {/* <div className="py-1 text-[#757575]">Bài kiểm tra:</div>
                                    <div className="py-1 text-[#757575]">Thời gian làm bài:</div> */}
                                    <div className="py-1 text-[#757575]">Số câu bỏ trống</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời đúng:</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời sai:</div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    {/* <div className="py-1 text-[#000]">0</div>
                                    <div className="py-1 text-[#000]">0</div> */}
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
                            <div className="mt-2">{listQuestion}</div>
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
                            {/* <div className="grid grid-cols-5 justify-items-center gap-y-3">{listNumber}</div> */}
                            <div className="text-center mt-10 mb-2">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                >
                                    Nộp bài
                                </button>
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
