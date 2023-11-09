'use client'
import { useState, useEffect, useRef } from "react";
import { signout, reset } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Avatar() {
    const dispatch = useDispatch<AppDispatch>();
    const { isSuccess, user } = useAppSelector(state => state.authReducer);
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

    const toggleOpen = () => setIsOpen(!isOpen);

    const logOut = () => {
        setIsOpen(false);
        dispatch(reset());
        dispatch(signout());
        dispatch(reset());
    }

    const splitName = user.name.split(' ');
    const firstLetter = splitName[splitName.length - 1].charAt(0);

    return (
        <div className="relative" ref={node}>
            <div 
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={toggleOpen}
            >
                {
                    user.avatar ? (
                        <img 
                            src={user.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    ) : (
                        <p className="text-white font-bold text-2xl">{firstLetter}</p>
                    )
                }
            </div>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray ring-opacity-5"
                    style={{zIndex: 10}}
                >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <Link
                            href='/profile'
                        >
                            <div 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                                role="menuitem"
                                onClick={() => setIsOpen(false)}
                            >
                                Trang cá nhân
                            </div>
                        </Link>
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