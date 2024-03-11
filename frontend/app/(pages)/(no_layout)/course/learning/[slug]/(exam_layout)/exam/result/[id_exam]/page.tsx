"use client"
import axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

export default function Exam({ state }: any) {
    const [formData, setFormData] = useState<any>({});
    const [exam, setExam] = useState<any>([
        {
            id: 1,
            title: "À",
            description: "Adf",
            answers: [
                {
                    answerId: "dà",
                    description: "Đáp án 1"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 2"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 3"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 4"
                }
            ]
        },
        {
            id: 1,
            title: "À",
            description: "Adf",
            answers: [
                {
                    answerId: "dà",
                    description: "Đáp án 1"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 2"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 3"
                },
                {
                    answerId: "dà",
                    description: "Đáp án 4"
                }
            ]
        },

    ]);
    const [open, setOpen] = useState(false);
    const [openSidebar, setOpenSideBar] = useState(true);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        // const getExam = async () => {
        //     try {
        //         const response = await axios.get(
        //             `http://localhost:4001/test/studentGetTestQuestion?classId=${state.currentTest.classId}&testId=${state.currentTest.id}`,
        //         );
        //         setExam(response.data);
        //     } catch (error) {
        //         console.error('Error fetching data:', error);
        //     }
        // };

        // getExam();
    }, []);


    let listQuestion;
    let listNumber;
    if (exam) {
        listQuestion = exam.map((question: any, index: number) => {
            if (question.multipleAnswer) {
                return (
                    <div id={`question${index + 1}`} key={index} className="mt-5">
                        <div className="flex justify-between items-center">
                            <div className="text-lg  font-normal  text-[#000]">
                                <div style={{ display: "flex" }}>
                                    <span style={{ marginRight: '8px' }} className="font-semibold text-[#153462]">Câu {index + 1}: </span>
                                    {parse(question.description)}
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
                            <ul className="mt-3 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white">
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-4">
                                            {answer.isSelected ? (
                                                <input
                                                    id={answer.answerId}
                                                    type="checkbox"
                                                    value=""
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    defaultChecked
                                                />
                                            ) : (
                                                <input
                                                    id={answer.answerId}
                                                    type="checkbox"
                                                    value=""
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                            )}
                                            <label
                                                htmlFor="list-radio-license"
                                                className="mt-2 ml-2 text-base font-medium text-gray-900 dark:text-gray-300 mr-2"
                                            >
                                                {alphabet[index]}. <span>{answer.description}</span>
                                            </label>
                                            {/* {answer.isSelected ? (
                                                answer.isCorrect ? (
                                                    <TiTick className="ml-2 text-[#2FD790] text-xl" />
                                                ) : (
                                                    <MdOutlineCancel className="ml-2 text-[#E44848] text-base" />
                                                )
                                            ) : (
                                                ''
                                            )} */}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="font-medium ml-4">
                                Đáp án:
                                {question.answers.map((answer: any, index: number) => {
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
                            <div className="text-lg  font-normal text-[#000]">
                                <span className="font-medium text-[#153462]">Câu {index + 1}: </span>
                                {parse(question.description)}
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
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-2 ">
                                            <div className="flex items-center mb-2">
                                                <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label>
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
                                {question.answers.map((answer: any, index: number) => {
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
        listNumber = exam.map((question: any, index: number) => {
            if (!formData.hasOwnProperty(question.questionId)) {
                return (
                    <Link
                        href={`#question${index + 1}`}
                        key={index}
                        className="bg-[#f0efef] p-2 w-9 h-9 rounded-xl flex justify-center items-center font-normal"
                        style={{
                            boxShadow: '0px 1px 4px 0px #00000033 -1px -1px 4px 0px #00000026 inset 1px 1px 4px 0px #0000001A inset',
                            textDecoration: 'none',
                        }}
                    >
                        {index + 1}
                    </Link>
                );
            } else {
                return (
                    <a
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
                    </a>
                );
            }
        });
    }

    return (
        <div className="bg-[#FBFAF9] relative py-10">
            <div className="px-10 py-5 bg-[#153462] fixed w-full top-0 left-0">
                <div className="flex justify-between h-full items-center">
                    <div className="text-[#fff] text-[22px] font-medium text-center ">dsfaaaaaaaaa</div>
                    <div className="text-white text-[22px] font-medium" id="displayDiv"></div>
                </div>
            </div>
            <div className='mx-3 '>
                <div className="flex flex-row">
                    <div
                        className={`px-2 ${openSidebar ? "w-[74%]" : "flex-1 px-10 mr-12 ml-10"}  `}

                    >
                        <div
                            className={`bg-white rounded-lg mt-16 p-4 flex items-center`}
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
                                {0}
                            </div>
                            <div className="flex">
                                <div className="flex flex-col justify-between mr-4">
                                    <div className="py-1 text-[#757575]">Bài kiểm tra:</div>
                                    <div className="py-1 text-[#757575]">Thời gian làm bài:</div>
                                    <div className="py-1 text-[#757575]">Số câu đã làm</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời đúng:</div>
                                    <div className="py-1 text-[#757575]">Số câu trả lời sai:</div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <div className="py-1 text-[#000]">0</div>
                                    <div className="py-1 text-[#000]">0</div>
                                    <div className="py-1 text-[#000]">0</div>
                                    <div className="py-1 text-[#000]">0</div>
                                    <div className="py-1 text-[#000]">0</div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-xl py-3 px-6 mt-4' style={{
                            boxShadow: '0px 0px 4px 0px #00000040 mt-10',
                        }}>
                            <div className="font-medium text-xl text-[#000]">Đáp án</div>
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
