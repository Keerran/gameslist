import {Dialog} from "@headlessui/react";
import {ModalProps} from "@shared/types";
import {ReactEventHandler, SyntheticEvent, useEffect, useRef, useState} from "react";
import {formatRelease, getBackend, getCover} from "@shared/functions";
import {AnimatePresence, motion} from "framer-motion";
import Link from "next/link";
import Select from "@components/Select";

// interface Result {
//     id: number,
//     name: string,
//     url: string
//
// }

export interface Result {
    id: number,
    name: string,
    cover?: {
        id: number,
        url: string
    },
    first_release_date: number,
    status?: number
}

interface ResultProps {
    results: Result[]
}

function Results({results}: ResultProps) {
    const ulVariants = {
        open: {
            height: "auto",
            opacity: 1
        },
        closed: {
            height: 0,
            opacity: 0,
            transition: {
                damping: 1000
            },
            transitionEnd: {
                display: "none"
            }
        },
    };

    function addDefaultImage(e: SyntheticEvent<HTMLImageElement>) {
        const target = e.target as HTMLImageElement;


        target.src = "https://via.placeholder.com/48/0B1622?text=%20";
    }

    return (
        <motion.ul key="ul"
                   initial="closed"
                   variants={ulVariants}
                   exit="closed"
                   transition={{type: "spring", stiffness: 600, damping: 37}}
                   animate="open">
            {results.map(result =>
                <li id={result.id.toString()}
                    key={result.id}
                    className="group">
                    <Link href={`/game/${result.id}`}>
                        <a className="w-full flex justify-start align-center px-5 py-2.5 font-semibold cursor-pointer
                                     hover:bg-blue-500 hover:text-white transition-all duration-150 ease
                                     group-first:pt-4 group-last:pb-4">
                            <img
                                className="h-12 mr-2 rounded"
                                onError={addDefaultImage}
                                src={getCover(result.cover?.url)}/>
                            <div className="text-left">
                                {result.name}
                                <span className="block pt-1"
                                      style={{fontSize: "12px"}}>
                                {formatRelease(result.first_release_date, result.status)} Game
                            </span>
                            </div>
                        </a>
                    </Link>
                </li>
            )}
        </motion.ul>
    );
}

export default function SearchModal(props: ModalProps) {
    const initialFocus = useRef(null)
    const [timeout, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined);
    const [query, setQuery] = useState("");
    const [type, setType] = useState("Games");
    const [results, setResults] = useState([] as Result[]);

    function onFinishTyping() {
        getBackend("games/search", {query}).then((res: Result[]) => {
            if (Array.isArray(res))
                setResults(res);
            else
                console.error(res);
        });
    }

    function onType() {
        setResults([]);
        if (timeout !== undefined)
            clearTimeout(timeout);
        const newTimeout = setTimeout(onFinishTyping, 300);
        setTimeoutId(newTimeout);
    }

    useEffect(onType, [query]);

    const overlayVariants = {
        closed: {
            opacity: 0
        },
        open: {
            opacity: 0.6
        }
    };

    const barVariants = {
        closed: {
            opacity: 0,
            top: 10
        },
        open: {
            opacity: 1,
            top: 80
        }
    };

    const transition = {
        duration: 0.25,
    };

    return (
        <AnimatePresence>
            {props.show &&
            <Dialog static
                    as={motion.div}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={transition}
                    open={props.show}
                    initialFocus={initialFocus}
                    onClose={() => {
                        props.onClose();
                        setResults([]);
                    }}
                    className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay as={motion.div} transition={transition} variants={overlayVariants}
                                    className="fixed inset-0 bg-black"/>

                    <motion.div
                        variants={barVariants}
                        transition={transition}
                        className="rounded-md bg-white dark:bg-main-light flex items-stretch justify-between
                                   absolute overflow-hidden dark:placeholder-gray-400 dark:text-gray-400"
                        style={{width: "660px"}}>

                        <button className="material-icons px-4 search-mini font-bold"
                              onClick={() => {
                                  if (timeout)
                                      clearTimeout(timeout);
                                  setTimeoutId(undefined);
                                  onFinishTyping();
                              }} style={{paddingTop: "3px"}}>
                            search
                        </button>

                        <input
                            ref={initialFocus}
                            onChange={(e) => setQuery(e.target.value)}
                            type="text"
                            className="bg-transparent flex-1 placeholder-gray-300 dark:placeholder-gray-400
                                       dark:text-gray-400 appearance-none h-12 font-semibold focus:outline-none"
                            placeholder="Search"/>

                            {/*<Select change={val => setType(val)} value={type} name="type" values={["Games", "Users"]}/>*/}
                    </motion.div>
                    <div
                        className="absolute rounded-md top-48 bg-white z-10 overflow-hidden
                                   dark:placeholder-gray-400 dark:text-gray-400 dark:bg-main-light"
                        style={{width: "660px"}}>
                        {results.length > 0 &&
                        <Results results={results}/>
                        }
                    </div>
                </div>
            </Dialog>
            }
        </AnimatePresence>
    );
}