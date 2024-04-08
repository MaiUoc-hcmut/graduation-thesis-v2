"use client"
import { useState } from 'react';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';
export default function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Product 1', price: 100 },
        { id: 2, name: 'Product 2', price: 200 },
        { id: 3, name: 'Product 3', price: 300 },
    ]);

    const handleDelete = (itemId: any) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
    };

    return (
        <section className="py-10 relative">
            <h2 className="title font-manrope font-semibold text-4xl leading-10 mb-8 text-center text-black">
                Giỏ hàng của bạn
            </h2>
            <div className="px-4 mx-10 flex">
                <div className='mr-5 w-2/3'>
                    {cartItems.map((item) => {
                        return (
                            <div key={item.id} className="rounded-xl h-60 border-[1px] border-gray-200 p-6 flex mb-5">
                                <div className="relative flex-1 mr-5">
                                    <Image
                                        src={`${'/images/cousre-thumnail-1.jpg'}`}
                                        fill
                                        className='rounded-md overflow-hidden object-cover object-center'
                                        alt="logo"
                                    />
                                </div>
                                <div className="w-2/3">
                                    <div className="flex items-center justify-between w-full mb-4">
                                        <h5 className="font-manrope font-semibold text-xl leading-9 text-gray-900">
                                            Round white portable speaker
                                        </h5>
                                        <button className="p-2 focus:bg-red-300 hover:bg-red-300 bg-red-100 rounded-full group flex items-center justify-center focus-within:outline-red-500">
                                            <TrashIcon onClick={() => handleDelete(item.id)} className='w-5 h-5 text-red-500' />

                                        </button>
                                    </div>
                                    <p className="font-normal text-base leading-7 text-gray-500 mb-6">

                                    </p>
                                    <div className="flex justify-between items-center">

                                        <h6 className="text-primary font-manrope font-bold text-2xl leading-9 text-right">
                                            $220
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='flex-1 border-[1px] border-gray-200 rounded-md p-4 h-80'>
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 ">
                        <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">
                            Tổng
                        </h5>
                        <div className="flex items-center justify-between gap-5 ">

                            <h6 className="font-manrope font-bold text-3xl lead-10 text-primary">
                                $440
                            </h6>
                        </div>
                    </div>
                    <div className="">
                        <p className="font-normal text-base leading-7 text-gray-500 text-center mb-5 mt-6">
                            Shipping taxes, and discounts calculated at checkout
                        </p>
                        <button className="rounded-full py-4 px-6 bg-indigo-600 text-white font-semibold text-lg w-full text-center transition-all duration-500 hover:bg-indigo-700 ">
                            Checkout
                        </button>
                    </div>
                </div>

            </div>
        </section>

    );
}
