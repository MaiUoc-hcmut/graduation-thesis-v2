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
            id: 2,
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
        {
            id: 2,
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
        {
            id: 2,
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
    const intervalRef = useRef<any>(null);
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];
    const COUNTER_KEY = 123;
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

        return hoursString + ':' + minutesString + ':' + secondsString;
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
        // var countDownTime = window.localStorage.getItem(`${COUNTER_KEY}`) || state.currentTest.period * 60;

        countDown(1200, function () {
            alert('Hết giờ làm bài!!!');
            // submitTest(convertTime(state.currentTest.period));
        });

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

    async function submitTest(time: string) {
        let res: any = [];
        Object.entries(formData).map((answer) => {
            res.push({
                questionId: answer[0],
                answerIds: answer[1],
            });
        });

        const submitAnswer = async () => {
            try {
                const response = await axios.post(
                    'http://localhost:4001/test/studentSubmitAnswer',
                    {
                        params: {
                            classId: state.currentTest.classId,
                            testId: state.currentTest.id,
                            timeSpent: time,
                            choices: res,
                        },
                    },
                    {
                        withCredentials: true,
                    },
                );
                return response;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
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

    let listQuestion;
    let listNumber;
    if (exam) {
        listQuestion = exam.map((question: any, index: number) => {
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
                                                <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
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
                        <p className="text-lg  mb-[-10px] font-normal text-[#000]">
                            <span className="font-semibold text-[#153462]">Câu {index + 1}: </span>
                            {parse(question.description)}
                        </p>
                        <div>
                            <ul
                                className="mt-6 text-base text-gray-900 rounded-lg dark:bg-gray-700 dark:text-white"
                                onChange={(e: any) => {
                                    handlerInput(question.questionId, e.target.id);
                                }}
                            >
                                {question.answers.map((answer: any, index: number) => {
                                    return (
                                        <li key={index} className="flex items-center mb-2">
                                            <div className="flex items-center mb-2">
                                                <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor="default-radio-1" className="ms-2 font-medium text-gray-900 dark:text-gray-300">{answer.description}</label>
                                            </div>

                                        </li>
                                    );
                                })}
                            </ul>
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
    );
}
