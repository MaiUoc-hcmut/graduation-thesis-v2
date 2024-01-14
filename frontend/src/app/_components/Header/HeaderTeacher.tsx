"use client"

/* eslint-disable react/jsx-no-undef */
import Link from 'next/link';
import Image from 'next/image';

export default function HeaderTeacher() {
    return (
        <div
            id="header"
            className="mdk-header js-mdk-header mb-0"
            data-fixed=""
            data-effects=""
        >
            <div className="mdk-header__content">
                {/* Navbar */}
                <div
                    className="navbar navbar-expand pr-0 navbar-dark-pickled-bluewood navbar-shadow"
                    id="default-navbar"
                    data-primary=""
                >
                    {/* Navbar Toggler */}
                    <button
                        className="navbar-toggler w-auto mr-16pt d-block rounded-0"
                        type="button"
                        data-toggle="sidebar"
                    >
                        <span className="material-icons">short_text</span>
                    </button>
                    {/* // END Navbar Toggler */}
                    {/* Navbar Brand */}
                    <a href="index.html" className="navbar-brand mr-16pt">
                        <span className="avatar avatar-sm navbar-brand-icon mr-0 mr-lg-8pt">
                            <span className="avatar-title rounded bg-primary">
                                <img
                                    src="../../public/images/illustration/student/128/white.svg"
                                    alt="logo"
                                    className="img-fluid"
                                />
                            </span>
                        </span>
                        <span className="d-none d-lg-block">Luma</span>
                    </a>
                    {/* // END Navbar Brand */}
                    <span className="d-none d-md-flex align-items-center mr-16pt">
                        <span className="avatar avatar-sm mr-12pt">
                            <span className="avatar-title rounded navbar-avatar">
                                <i className="material-icons">trending_up</i>
                            </span>
                        </span>
                        <small className="flex d-flex flex-column">
                            <strong className="navbar-text-100">Earnings</strong>
                            <span className="navbar-text-50">$12.3k</span>
                        </small>
                    </span>
                    <span className="d-none d-md-flex align-items-center mr-16pt">
                        <span className="avatar avatar-sm mr-12pt">
                            <span className="avatar-title rounded navbar-avatar">
                                <i className="material-icons">receipt</i>
                            </span>
                        </span>
                        <small className="flex d-flex flex-column">
                            <strong className="navbar-text-100">Sales</strong>
                            <span className="navbar-text-50">264</span>
                        </small>
                    </span>
                    {/* Navbar Search */}
                    <form
                        className="search-form navbar-search d-none d-md-flex mr-16pt"
                        action="index.html"
                    >
                        <button className="btn" type="submit">
                            <i className="material-icons">search</i>
                        </button>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search ..."
                        />
                    </form>
                    {/* // END Navbar Search */}
                    <div className="flex" />
                    {/* Navbar Menu */}
                    <div className="nav navbar-nav flex-nowrap d-flex mr-16pt">
                        {/* Notifications dropdown */}
                        <div
                            className="nav-item dropdown dropdown-notifications dropdown-xs-down-full"
                            data-toggle="tooltip"
                            data-title="Messages"
                            data-placement="bottom"
                            data-boundary="window"
                        >
                            <button
                                className="nav-link btn-flush dropdown-toggle"
                                type="button"
                                data-toggle="dropdown"
                                data-caret="false"
                            >
                                <i className="material-icons icon-24pt">mail_outline</i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right">
                                <div data-perfect-scrollbar="" className="position-relative">
                                    <div className="dropdown-header">
                                        <strong>Messages</strong>
                                    </div>
                                    <div className="list-group list-group-flush mb-0">
                                        <a
                                            href="javascript:void(0);"
                                            className="list-group-item list-group-item-action unread"
                                        >
                                            <span className="d-flex align-items-center mb-1">
                                                <small className="text-black-50">5 minutes ago</small>
                                                <span className="ml-auto unread-indicator bg-accent" />
                                            </span>
                                            <span className="d-flex">
                                                <span className="avatar avatar-xs mr-2">
                                                    <img
                                                        src="../../public/images/people/110/woman-5.jpg"
                                                        alt="people"
                                                        className="avatar-img rounded-circle"
                                                    />
                                                </span>
                                                <span className="flex d-flex flex-column">
                                                    <strong className="text-black-100">Michelle</strong>
                                                    <span className="text-black-70">
                                                        Clients loved the new design.
                                                    </span>
                                                </span>
                                            </span>
                                        </a>
                                        <a
                                            href="javascript:void(0);"
                                            className="list-group-item list-group-item-action"
                                        >
                                            <span className="d-flex align-items-center mb-1">
                                                <small className="text-black-50">5 minutes ago</small>
                                            </span>
                                            <span className="d-flex">
                                                <span className="avatar avatar-xs mr-2">
                                                    <img
                                                        src="../../public/images/people/110/woman-5.jpg"
                                                        alt="people"
                                                        className="avatar-img rounded-circle"
                                                    />
                                                </span>
                                                <span className="flex d-flex flex-column">
                                                    <strong className="text-black-100">Michelle</strong>
                                                    <span className="text-black-70">🔥 Superb job..</span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* // END Notifications dropdown */}
                        {/* Notifications dropdown */}
                        <div
                            className="nav-item ml-16pt dropdown dropdown-notifications dropdown-xs-down-full"
                            data-toggle="tooltip"
                            data-title="Notifications"
                            data-placement="bottom"
                            data-boundary="window"
                        >
                            <button
                                className="nav-link btn-flush dropdown-toggle"
                                type="button"
                                data-toggle="dropdown"
                                data-caret="false"
                            >
                                <i className="material-icons">notifications_none</i>
                                <span className="badge badge-notifications badge-accent">
                                    2
                                </span>
                            </button>
                            <div className="dropdown-menu dropdown-menu-right">
                                <div data-perfect-scrollbar="" className="position-relative">
                                    <div className="dropdown-header">
                                        <strong>System notifications</strong>
                                    </div>
                                    <div className="list-group list-group-flush mb-0">
                                        <a
                                            href="javascript:void(0);"
                                            className="list-group-item list-group-item-action unread"
                                        >
                                            <span className="d-flex align-items-center mb-1">
                                                <small className="text-black-50">3 minutes ago</small>
                                                <span className="ml-auto unread-indicator bg-accent" />
                                            </span>
                                            <span className="d-flex">
                                                <span className="avatar avatar-xs mr-2">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <i className="material-icons font-size-16pt text-accent">
                                                            account_circle
                                                        </i>
                                                    </span>
                                                </span>
                                                <span className="flex d-flex flex-column">
                                                    <span className="text-black-70">
                                                        Your profile information has not been synced
                                                        correctly.
                                                    </span>
                                                </span>
                                            </span>
                                        </a>
                                        <a
                                            href="javascript:void(0);"
                                            className="list-group-item list-group-item-action"
                                        >
                                            <span className="d-flex align-items-center mb-1">
                                                <small className="text-black-50">5 hours ago</small>
                                            </span>
                                            <span className="d-flex">
                                                <span className="avatar avatar-xs mr-2">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <i className="material-icons font-size-16pt text-primary">
                                                            group_add
                                                        </i>
                                                    </span>
                                                </span>
                                                <span className="flex d-flex flex-column">
                                                    <strong className="text-black-100">Adrian. D</strong>
                                                    <span className="text-black-70">
                                                        Wants to join your private group.
                                                    </span>
                                                </span>
                                            </span>
                                        </a>
                                        <a
                                            href="javascript:void(0);"
                                            className="list-group-item list-group-item-action"
                                        >
                                            <span className="d-flex align-items-center mb-1">
                                                <small className="text-black-50">1 day ago</small>
                                            </span>
                                            <span className="d-flex">
                                                <span className="avatar avatar-xs mr-2">
                                                    <span className="avatar-title rounded-circle bg-light">
                                                        <i className="material-icons font-size-16pt text-warning">
                                                            storage
                                                        </i>
                                                    </span>
                                                </span>
                                                <span className="flex d-flex flex-column">
                                                    <span className="text-black-70">
                                                        Your deploy was successful.
                                                    </span>
                                                </span>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* // END Notifications dropdown */}
                        <div className="nav-item dropdown">
                            <a
                                href="#"
                                className="nav-link d-flex align-items-center dropdown-toggle"
                                data-toggle="dropdown"
                                data-caret="false"
                            >
                                <span className="avatar avatar-sm mr-8pt2">
                                    <span className="avatar-title rounded-circle bg-primary">
                                        <i className="material-icons">account_box</i>
                                    </span>
                                </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <div className="dropdown-header">
                                    <strong>Account</strong>
                                </div>
                                <a className="dropdown-item" href="edit-account.html">
                                    Edit Account
                                </a>
                                <a className="dropdown-item" href="billing.html">
                                    Billing
                                </a>
                                <a className="dropdown-item" href="billing-history.html">
                                    Payments
                                </a>
                                <a className="dropdown-item" href="login.html">
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* // END Navbar Menu */}
                </div>
                {/* // END Navbar */}
            </div>
        </div>
    )
}
