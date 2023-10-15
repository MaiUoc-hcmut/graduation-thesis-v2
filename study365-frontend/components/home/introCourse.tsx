import Link from "next/link";
import Image from "next/image";

export default function IntroCourse() {
    return (
        <div className="flex h-100 items-center">
            <div className="flex items-center justify-center w-132.5">
                <Image
                    src='/introCourse.png'
                    alt="introduction image"
                    width={350}
                    height={350}
                />
            </div>
            <div className="flex flex-grow h-100 items-center justify-center">
                <div className="">
                    <p className="text-4xl font-bold mb-6" 
                        style={{color: '#061469'}}
                    >
                        Bắt đầu tìm kiếm khóa học dễ dàng
                    </p>
                    <p className="mt-4 mb-6">
                        Các khóa học tại Study365 được kiểm duyệt kỹ càng nên luôn đảm bảo về chất lượng.
                    </p>

                    <Link href='/course'>
                        <button 
                            type="button" 
                            className="focus:outline-none text-white focus:ring-2
                                font-medium rounded-3xl text-sm px-5 py-2.5 dark:bg-blue-500 
                                dark:hover:bg-blue-700 font-bold w-34"
                        >
                            Khóa học
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}