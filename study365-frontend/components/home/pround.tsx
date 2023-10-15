import Image from "next/image";

export default function Pround() {
    return (
        <div className="flex flex-col items-center space-y-4 p-10 h-125" style={{background: '#F2F6FF'}}>
            <div className="w-full h-10 flex items-center justify-center mt-10 mb-20">
                <p 
                    className="text-center text-4xl font-bold w-203"
                    style={{color: '#061469'}}
                >
                    STUDY365 tự hào mang đến phương pháp học tập
                    tân tiến và chuẩn quốc tế đến cho học viên
                </p>
            </div>

            <div className="w-full flex justify-between px-40">
                <div className="flex flex-col items-center space-y-2 w-40 h-60" style={{background: '#FFFFFF'}}>
                    <Image 
                        src='/lecture-icon.png'
                        alt="Image inside first"
                        width={40}
                        height={40}
                        className="mt-10"
                    />
                    <p className="text-center font-bold text-xl" style={{color: '#0D299C'}}>
                        1.000+
                    </p>
                    <p className="text-center font-bold">
                        Giảng viên chất lượng, chuyên môn cao
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 w-40 h-50" style={{background: '#CEDCFB'}}>
                    <Image 
                        src='/student-icon.png'
                        alt="Image inside first"
                        width={40}
                        height={40}
                        className="mt-10"
                    />
                    <p className="text-center font-bold text-xl" style={{color: '#0D299C'}}>
                        1.000.000+
                    </p>
                    <p className="text-center font-bold">
                        Học viên theo học
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 w-40 h-60" style={{background: '#FFFFFF'}}>
                    <Image 
                        src='/course-icon.png'
                        alt="Image inside first"
                        width={40}
                        height={40}
                        className="mt-10"
                    />
                    <p className="text-center font-bold text-xl" style={{color: '#0D299C'}}>
                        10.000+
                    </p>
                    <p className="text-center font-bold">
                        Khóa học đa dạng, phong phú
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 w-40 h-50" style={{background: '#CEDCFB'}}>
                    <Image 
                        src='/award-icon.png'
                        alt="Image inside first"
                        width={40}
                        height={40}
                        className="mt-10"
                    />
                    <p className="text-center font-bold text-xl" style={{color: '#0D299C'}}>
                        40.000+
                    </p>
                    <p className="text-center font-bold">
                        Đề thi chất lượng
                    </p>
                </div>
            </div>
        </div>
    )
}