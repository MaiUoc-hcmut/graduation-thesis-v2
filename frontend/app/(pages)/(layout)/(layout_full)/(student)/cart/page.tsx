"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ClockIcon, Squares2X2Icon, FilmIcon, DocumentTextIcon, WalletIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { StarIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useAppSelector } from '@/redux/store';
import paymentApi from '@/app/api/paymentApi';
import Link from 'next/link';
import { renderStars } from '@/app/helper/RenderFunction';
import { convertTime, formatCash } from '@/app/helper/FormatFunction';
import { Button, Modal } from 'flowbite-react';



export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [change, setChange] = useState(false);
    const [modal, setModal] = useState<any>({});
    const { user } = useAppSelector(state => state.authReducer);
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarIcon
                key={index + 1}
                className={`text-${index + 1 <= rating ? 'yellow-300' : 'gray-300'} w-5 h-5`}
            />
        ));
    };
    useEffect(() => {
        async function fetchData() {
            await paymentApi.getCartOfStudent().then((data: any) => {
                setCartItems(data.data)
            }
            ).catch((err: any) => { })
        }
        fetchData()
    }, [change, user.id])

    return (
        <section className="py-10 flex flex-col justify-center items-center">
            <h2 className="title font-manrope font-semibold text-2xl leading-10 mb-8 text-center text-black">
                Giỏ hàng của bạn
            </h2>

            <div className="p-8 w-5/6 shadow-md rounded-xl border-[1px] border-gray-200">
                {
                    cartItems.length === 0 ?
                        <div className='p-6 flex flex-col justify-center items-center'>
                            <WalletIcon className='w-20 h-20 text-gray-300 p-4' />
                            <h3 className='text-center'>Giỏ hàng của bạn dang trống.</h3>
                        </div>

                        : <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="py-2 text-left text-lg">Khóa học</th>
                                    <th className="py-2 text-center text-lg">Giá</th>
                                    <th className="py-2 text-center text-lg">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item: any) => (
                                    <tr key={item.id}>
                                        <>
                                            <Modal show={modal[`delete-item-${item.id}`] || false} size="md" onClose={() => setModal({ ...modal, [`delete-item-${item.id}`]: false })} popup>
                                                <Modal.Header />
                                                <Modal.Body>
                                                    <form className="space-y-6" onSubmit={async (e) => {
                                                        e.preventDefault()
                                                        await paymentApi.deleteCart({ data: { id_course: item.id } }).catch((err: any) => {})
                                                        setChange(!change)
                                                    }}>
                                                        <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                                        <h3 className="mb-5 text-lg font-normal text-center text-gray-500 dark:text-gray-400">
                                                            Bạn có chắc muốn xóa khóa học này khỏi giỏ hàng?
                                                        </h3>
                                                        <div className="flex justify-center gap-4">
                                                            <Button color="failure" type='submit'>
                                                                Xóa
                                                            </Button>
                                                            <Button color="gray" onClick={() => {
                                                                setModal({ ...modal, [`delete-item-${item.id}`]: false })
                                                            }}>
                                                                Hủy
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </Modal.Body>
                                            </Modal>
                                        </>
                                        <td className="py-4">
                                            <div className='w-full flex'>
                                                <div className='relative w-40 h-32 mr-4'>
                                                    <Image
                                                        src={`${item.thumbnail ? item.thumbnail : '/images/cousre-thumnail-1.jpg'}`}
                                                        fill
                                                        className="rounded-md overflow-hidden object-cover object-center"
                                                        alt="logo"
                                                    />
                                                </div>
                                                <div>
                                                    <div className='mb-4 font-bold'>

                                                        {item.name}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {renderStars(Math.floor(item?.average_rating || 0))}
                                                        <span className="ml-2 bg-primary text-white text-xs font-medium px-1.5 py-0.5 rounded">
                                                            {item?.average_rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </td>

                                        <td className="py-4 text-center"><div>
                                            <div className="text-lg font-semibold text-secondary">{formatCash(`${item.price}`)} VNĐ</div>
                                        </div></td>

                                        <td className="py-4">
                                            <div className='flex justify-center items-center'>
                                                <button
                                                    className="p-2 focus:bg-red-300 hover:bg-red-300 bg-red-100 rounded-full group flex items-center justify-center focus-within:outline-red-500"
                                                    onClick={() => setModal({ ...modal, [`delete-item-${item.id}`]: true })}
                                                >
                                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td className='py-8'>
                                        <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">
                                            Tổng
                                        </h5>
                                    </td>
                                    <td className='py-8'>
                                        <h6 className="font-manrope font-bold text-3xl lead-10 text-primary text-center">
                                            {formatCash(`${cartItems.reduce((total, item: any) => total + item.price, 0)}`)} VNĐ
                                        </h6>
                                    </td>
                                    <td className='py-8'>
                                        <div className="flex justify-center">
                                            <Link
                                                href={'/checkout'}
                                                className="rounded-md w-2/3 py-2 px-3    bg-primary text-white font-semibold text-lg text-center transition-all duration-500 hover:bg-primary_hover"
                                            >
                                                Thanh toán
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                }

            </div>
        </section>
    );
}
