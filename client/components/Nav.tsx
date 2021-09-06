import {useEffect, useState} from "react";
import LoginModal from "./LoginModal";
import SearchModal from "./SearchModal";
import Popover from "./Popover";
import Link from "next/link";
import {useUser} from "@shared/functions";

export default function Nav() {
    const {user={isLoggedIn: false}} = useUser();
    const [showAccountOpts, setShowAccount] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <nav className="bg-main-light">
            <div>
                <div className="flex items-center justify-between h-16 px-8">
                    <div>
                        <img src="/badelogosmall.svg" className="h-8"/>
                    </div>
                    <div className="flex-1 flex items-stretch justify-center space-x-4 h-full">
                        <Link href="/">
                            <a className="navLink flex items-center">Home</a>
                        </Link>
                        {user.isLoggedIn &&
                        <Link href={`/user/${user.username}`}>
                            <a className="navLink flex items-center">Profile</a>
                        </Link>
                        }
                        <Link href="/">
                            <a className="navLink flex items-center">Game List</a>
                        </Link>
                    </div>
                    <div id="profile" className="flex items-center space-x-4 mr-12">
                        <SearchModal show={searchOpen} onClose={() => setSearchOpen(false)}/>
                        <button className="hover:text-white material-icons"
                                onClick={() => setSearchOpen(true)}>
                            search
                        </button>

                        {!user.isLoggedIn &&
                        <div>
                            <LoginModal show={loginOpen} onClose={() => setLoginOpen(false)}/>
                            <button className="navLink hover:bg-gray-700 mr-2" onClick={() => setLoginOpen(true)}>
                                Login
                            </button>

                            <Link href="/signup">
                                <a className="navLink bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700">
                                    Signup
                                </a>
                            </Link>
                        </div>
                        }
                        {user.isLoggedIn &&
                        <div className="flex justify-center items-center">
                            <button className="hover:text-white material-icons h-full"
                                    onClick={() => setShowAccount(!showAccountOpts)}>
                                account_circle
                            </button>
                            <Popover show={showAccountOpts} onClose={() => setShowAccount(false)}
                                     className="top-12 mt-3 w-40">
                                <li className="popoverItem text-left align-middle leading-normal">
                                    <Link href="/logout">
                                        <a>
                                        <span className="material-icons text-sm px-2 leading-4 align-middle"
                                              style={{marginTop: -2}}>
                                            logout
                                        </span>
                                            Logout
                                        </a>
                                    </Link>
                                </li>
                            </Popover>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
}