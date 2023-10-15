'use client'
import { useState, useEffect, useRef } from "react";
import { signout, reset } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Avatar() {
    const dispatch = useDispatch();
    const { isSuccess, isFailed } = useAppSelector(state => state.authReducer);
    const [isOpen, setIsOpen] = useState(false);

    const node = useRef<HTMLDivElement>(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (node.current && node.current.contains(e.target as Node)) {
            // inside click
            return;
        }
        // outside click 
        setIsOpen(false);
    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClickOutside);
        // return function to be called when unmounted
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        dispatch(reset())
        if (isSuccess) {
            redirect('/');
        }
        dispatch(reset());
    }, [isSuccess, dispatch, redirect]);

    const toggleOpen = () => setIsOpen(!isOpen);

    const logOut = () => {
        dispatch(signout());
    }

    return (
        <div className="relative" ref={node}>
            <div 
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={toggleOpen}
            >
                <p className="text-white font-bold text-2xl">A</p>
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <div 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                            role="menuitem"
                        >
                            <Link
                                href='/profile'
                            >
                                Trang cá nhân
                            </Link>
                        </div>
                        <div 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                            role="menuitem"
                            onClick={logOut}
                        >
                            Đăng xuất
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}