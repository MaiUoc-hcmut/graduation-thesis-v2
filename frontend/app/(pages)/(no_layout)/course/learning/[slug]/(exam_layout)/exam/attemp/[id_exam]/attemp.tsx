"use client"
import axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import parse from 'html-react-parser';
import Link from 'next/link';
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import examApi from '@/app/api/examApi';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

export default function AttempExam({ params, exam }: { params: { slug: string, id_exam: string }, exam: any }) {
    const [formData, setFormData] = useState<any>({});
    const [open, setOpen] = useState(false);
    const [openSidebar, setOpenSideBar] = useState(true);
    const intervalRef = useRef<any>(null);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    const COUNTER_KEY = 'countdown';
    const {
        register,
        getValues,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    function handlerInput(id_question: string, answer: string) {
        setFormData({ ...formData, [id_question]: [answer] });
    }
    function handlerInputMultiChoice(id_question: string, answer: string, isChecked: boolean) {
        let res = [];
        if (formData[id_question]) {
            res = formData[id_question];
            if (isChecked) {
                res.push(answer);
            } else {
                res = res.filter(function (anw: string) {
                    return anw !== answer;
                });
            }
        } else {
            res = [answer];
        }

        setFormData({ ...formData, [id_question]: res });
    }

    function convertTime(i: number) {
        let hours = parseInt(`${i / 3600}`, 10);
        let minutes = parseInt(`${(i - hours * 3600) / 60}`, 10);
        let seconds = parseInt(`${i % 60}`, 10);

        let hoursString = hours < 10 ? '0' + hours : hours;
        let minutesString = minutes < 10 ? '0' + minutes : minutes;
        let secondsString = seconds < 10 ? '0' + seconds : seconds;

        if (hoursString == '00')
            return minutesString + ':' + secondsString
        else
            return hoursString + ':' + minutesString + ':' + secondsString

    }

    function countDown(i: number, callback: any) {
        intervalRef.current = setInterval(function () {
            let tmp = document.getElementById('displayDiv')
            if (tmp) {
                tmp.innerHTML = convertTime(i);
            }
            if (i-- > 0) {
                window.localStorage.setItem(`${COUNTER_KEY}`, `${i}`);
            } else {
                window.localStorage.removeItem(`${COUNTER_KEY}`);
                clearInterval(intervalRef.current);
                callback();
            }
        }, 1000);
    }

    useEffect(() => {
        if (exam?.period) {
            var countDownTime = Number(window.localStorage.getItem(COUNTER_KEY)) || exam?.period * 60;
            countDown(countDownTime, function () {
                alert('Hết giờ làm bài!!!');
                // submitTest(convertTime(state.currentTest.period));
            });
        }

    }, [exam?.period]);

    async function submitTest(time: string) {
        let data: any = {
            id_exam: params.id_exam,
            time_start: "2024-03-12 16:38:55",
            time_end: "2024-03-12 17:36:55",
            assignment: []
        }
        exam.questions.map((question: any) => {
            data.assignment.push({
                id_question: question.id,
                answers: question.answers.map((answer: any) => {
                    return {
                        id_answer: answer.id,
                        is_selected: formData[question.id][0] == answer.id
                    }
                })

            })
        })

        const submitAnswer = async () => {
            examApi.submitExam({ data })
        };

        try {
            const response = await submitAnswer();
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            window.localStorage.removeItem(`${COUNTER_KEY}`);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    }
    // console.log(formData, exam);
    // console.log(errors);

    let listQuestion;
    let listNumber;
    if (exam) {
        listQuestion = exam?.questions?.map((question: any, index: number) => {
            if (question.multipleAnswer) {
                return (
                    <div id={`question${index + 1}`} key={index} className="mb-4">
                        <p className="text-lg mb-[-10px] font-normal  text-[#000]">
                            <div style={{ display: "flex" }}>
                                <span style={{ marginRight: '8px' }} className="font-semibold text-[#153462]">Câu {index + 1}: </span>
                                {parse(question.description)}
                            </div>
                        </p>
                        <div>
                            <ul
                                className="mt-3 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                                onChange={(e: any) => {
                                    handlerInputMultiChoice(question.questionId, e.target.id, e.target.checked);
                                }}
                            >
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-4">
                                            <div className="flex items-center mb-4">
                                                <input id="default-radio-1" type="radio" value={answer.id} name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-radio-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div id={`question${index + 1}`} key={index} className="mb-4">
                        <div className="text-lg  mb-[-10px] font-normal text-[#000]">
                            <span className="font-semibold text-[#153462] flex">Câu {index + 1}: {parse(question.content_text)}</span>
                            {/* <div className='relative w-1/2 h-64 mt-2 z-0'>
                                <Image
                                    src="/images/course-cover-1.jpg"
                                    fill
                                    className='w-full h-full overflow-hidden object-cover object-center'
                                    alt="logo"
                                />
                            </div> */}
                        </div >
                        <div>
                            <ul
                                className="mt-6 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                            // onChange={(e: any) => {
                            //     handlerInput(question.id, e.target.id);
                            // }}

                            >
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className=" mb-5">
                                            <div className="flex items-center mb-2">
                                                <input  {...register(`${question.id}`, { required: "Câu hỏi chưa hoàn thành." })} id={answer.id} type="radio" value={answer.id} name={question.id} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <p className='ml-2 mr-1'>{alphabet[index]}.</p>

                                                <label htmlFor="default-radio-1" className="font-medium text-gray-900 dark:text-gray-300">{answer.content_text}</label>
                                            </div>
                                            {/* <div className='relative w-1/2 h-64 mt-3 z-0'>
                                                <Image
                                                    src="/images/course-cover-1.jpg"
                                                    fill
                                                    className='w-full h-full overflow-hidden object-cover object-center'
                                                    alt="logo"
                                                />
                                            </div> */}
                                        </li>
                                    );
                                })}
                                {errors?.[question.id]?.message && (
                                    <p className='text-sm text-red-400'>{`${errors?.[question.id]?.message}`}</p>
                                )}
                            </ul>
                        </div>
                    </div >
                );
            }
        });
        listNumber = exam?.questions?.map((question: any, index: number) => {
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
        <form onSubmit={handleSubmit((data) => {
            console.log(data, 1);


        })} className="bg-[#FBFAF9] relative py-10">
            <div className="px-10 py-5 bg-[#153462] fixed w-full top-0 left-0 z-10">
                <div className="flex justify-between h-full items-center">
                    <div className="text-[#fff] text-[22px] font-medium text-center ">{exam?.title}</div>
                    <div className="text-white text-[22px] font-medium" id="displayDiv"></div>
                </div>
            </div>

            <div className="flex flex-row j mx-3 mt-12">
                <div
                    className={`px-10 ${openSidebar ? "w-[74%]" : "flex-1 px-10 mr-12 ml-10"}  bg-white rounded-xl py-3`}
                    style={{
                        boxShadow: '0px 0px 4px 0px #00000040',
                    }}
                >
                    {listQuestion}
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
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                // onClick={() => {
                                //     setOpen(true);
                                //     submitTest('10')
                                // }}
                                type='submit'
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
        </form>
    );
}
