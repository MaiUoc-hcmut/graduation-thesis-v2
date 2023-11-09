'use client'
import { useAppSelector } from "@/redux/store";
import { useRef, useState, useEffect } from "react";
import ChangeAndAddAvatar from "@/components/teacher/Modal/changeAndAddAvatar";
import { redirect } from "next/navigation";

export default function Profile() {
    const authUser = useAppSelector(state => state.authReducer.user);
    const { isAuth } = useAppSelector(state => state.authReducer);
    const studentUser = useAppSelector(state => state.studentReducer.user);
    
    const [isOpen, setIsOpen] = useState(false);
    const [modalChangeAvatar, setModalChangeAvatar] = useState(false);

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

    useEffect(() => {
        
    }, [studentUser]);

    useEffect(() => {
        if (!isAuth) {
            redirect('/');
        }
    }, [isAuth]);


    const splitName = authUser.name.split(' ');
    const firstLetter = splitName[splitName.length - 1].charAt(0);

    return (
        <div ref={node}>
            <div className="flex justify-center relative">
                <div 
                    style={{
                        height: '350px',
                        width: '1024px',
                        position: 'relative',
                    }}
                >
                    <img 
                        style={{
                            objectFit: 'cover'
                        }}
                        className="w-full h-full"
                        src="/cover-profile.jpg"
                        alt="cover image"
                    />
                    <div 
                        className="bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                        style={{
                            position: 'absolute',
                            bottom: '-90px',
                            left: '20px',
                            width: '180px',
                            height: '180px'
                        }}
                        onClick={toggleOpen}
                    >
                        {
                            authUser.avatar ? 
                            <img
                                
                                src={authUser.avatar}
                                alt="avatar image"
                                className="rounded-full ring-4 cursor-pointer"
                            /> : 
                            <p 
                                className="text-white font-bold"
                                style={{
                                    fontSize: "100px"
                                }}
                            >
                                {firstLetter}
                            </p>
                        }
                    </div>
                    <span
                        className="font-bold ml-60 text-3xl"
                    >
                        {authUser.name}
                    </span>
                    {isOpen && (
                        <div 
                            className="absolute left-4 mt-16 w-50 rounded-md shadow-lg bg-gray ring-opacity-5"
                            onClick={toggleOpen}
                        >
                            {
                                authUser.avatar && (
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <div 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                                            role="menuitem"
                                        >
                                            Xem ảnh đại diện
                                        </div>
                                        <div 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                                            role="menuitem"
                                            onClick={() => setModalChangeAvatar(true)}
                                        >
                                            Thay ảnh đại diện
                                        </div>
                                    </div>
                                )
                            }
                            {
                                !authUser.avatar && (
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <div 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 hover:text-gray-900 cursor-pointer" 
                                            role="menuitem"
                                            onClick={() => setModalChangeAvatar(true)}
                                        >
                                            Tạo ảnh đại diện
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>
            <ChangeAndAddAvatar isVisible={modalChangeAvatar} onClose={() => setModalChangeAvatar(false)} />
        </div>
    )
}