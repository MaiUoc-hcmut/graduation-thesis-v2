"use client"

/* eslint-disable react/jsx-no-undef */
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderStudent() {
    return (
        <div id="header" className="mdk-header mdk-header--bg-dark bg-dark js-mdk-header mb-0" data-effects="parallax-background waterfall" data-fixed data-condenses>
            {/* <div className="mdk-header__bg">
                <div className="mdk-header__bg-front" style={{ backgroundImage: 'url(/images/photodune-4161018-group-of-students-m.jpg)' }} />
            </div> */}
            <div className="mdk-header__content justify-content-center">
                <div className="navbar navbar-expand navbar-dark-pickled-bluewood bg-transparent will-fade-background" id="default-navbar" data-primary>
                    <button className="navbar-toggler w-auto mr-16pt d-block rounded-0" type="button" data-toggle="sidebar">
                        <span className="material-icons">short_text</span>
                    </button>
                    <Link href="index.html" className="navbar-brand mr-16pt">
                        <span className="avatar avatar-sm navbar-brand-icon mr-0 mr-lg-8pt">
                            <span className="avatar-title rounded bg-primary">
                                <Image
                                    src="/images/illustration/student/128/white.svg"
                                    alt="logo"
                                    className="img-fluid"
                                    width={"40"}
                                    height={40}
                                />
                            </span>
                        </span>
                        <span className="d-none d-lg-block">Luma</span>
                    </Link>
                    <ul className="nav navbar-nav d-none d-sm-flex flex justify-content-start ml-8pt">
                        <li className="nav-item active">
                            <Link href="index.html" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" data-caret="false">Courses</Link>
                            <div className="dropdown-menu">
                                <Link href="courses.html" className="dropdown-item">Browse Courses</Link>
                                <Link href="student-course.html" className="dropdown-item">Preview Course</Link>
                                <Link href="student-lesson.html" className="dropdown-item">Preview Lesson</Link>
                                <Link href="student-take-course.html" className="dropdown-item"><span className="mr-16pt">Take Course</span> <span className="badge badge-notifications badge-accent text-uppercase ml-auto">Pro</span></Link>
                                <Link href="student-take-lesson.html" className="dropdown-item">Take Lesson</Link>
                                <Link href="student-take-quiz.html" className="dropdown-item">Take Quiz</Link>
                                <Link href="student-quiz-result-details.html" className="dropdown-item">Quiz Result</Link>
                                <Link href="student-dashboard.html" className="dropdown-item">Student Dashboard</Link>
                                <Link href="student-my-courses.html" className="dropdown-item">My Courses</Link>
                                <Link href="student-quiz-results.html" className="dropdown-item">My Quizzes</Link>
                                <Link href="help-center.html" className="dropdown-item">Help Center</Link>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <Link href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" data-caret="false">Paths</Link>
                            <div className="dropdown-menu">
                                <Link href="paths.html" className="dropdown-item">Browse Paths</Link>
                                <Link href="student-path.html" className="dropdown-item">Path Details</Link>
                                <Link href="student-path-assessment.html" className="dropdown-item">Skill Assessment</Link>
                                <Link href="student-path-assessment-result.html" className="dropdown-item">Skill Result</Link>
                                <Link href="student-paths.html" className="dropdown-item">My Paths</Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link href="pricing.html" className="nav-link">Pricing</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" data-caret="false">Teachers</Link>
                            <div className="dropdown-menu">
                                <Link href="instructor-dashboard.html" className="dropdown-item">Instructor Dashboard</Link>
                                <Link href="instructor-courses.html" className="dropdown-item">Manage Courses</Link>
                                <Link href="instructor-quizzes.html" className="dropdown-item">Manage Quizzes</Link>
                                <Link href="instructor-earnings.html" className="dropdown-item">Earnings</Link>
                                <Link href="instructor-statement.html" className="dropdown-item">Statement</Link>
                                <Link href="instructor-edit-course.html" className="dropdown-item">Edit Course</Link>
                                <Link href="instructor-edit-quiz.html" className="dropdown-item">Edit Quiz</Link>
                            </div>
                        </li>
                        <li className="nav-item dropdown" data-toggle="tooltip" data-title="Community" data-placement="bottom" data-boundary="window">
                            <Link href="#" className="nav-link dropdown-toggle" data-toggle="dropdown" data-caret="false">
                                <i className="material-icons">people_outline</i>
                            </Link>
                            <div className="dropdown-menu">
                                <Link href="teachers.html" className="dropdown-item">Browse Teachers</Link>
                                <Link href="student-profile.html" className="dropdown-item">Student Profile</Link>
                                <Link href="teacher-profile.html" className="dropdown-item">Instructor Profile</Link>
                                <Link href="blog.html" className="dropdown-item">Blog</Link>
                                <Link href="blog-post.html" className="dropdown-item">Blog Post</Link>
                                <Link href="faq.html" className="dropdown-item">FAQ</Link>
                                <Link href="help-center.html" className="dropdown-item">Help Center</Link>
                                <Link href="discussions.html" className="dropdown-item">Discussions</Link>
                                <Link href="discussion.html" className="dropdown-item">Discussion Details</Link>
                                <Link href="discussions-ask.html" className="dropdown-item">Ask Question</Link>
                            </div>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav ml-auto mr-0">
                        <li className="nav-item">
                            <Link href="login.html" className="nav-link" data-toggle="tooltip" data-title="Login" data-placement="bottom" data-boundary="window"><i className="material-icons">lock_open</i></Link>
                        </li>
                        <li className="nav-item">
                            <Link href="signup.html" className="btn btn-outline-white">Get Started</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}
