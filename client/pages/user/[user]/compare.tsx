import type {NextPage} from "next";
import {getBackend, useUser} from "@shared/functions";
import Nav from "@components/Nav";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Link from "next/link";

const Compare: NextPage = () => {
    const router = useRouter();
    const {user} = useUser();
    const other = router.query.user as string;
    const [games, setGames] = useState({} as Record<number, any>);
    const [entries, setEntries] = useState({} as Record<number, Record<string, any>>);

    useEffect(() => {
        if (user) {
            if ((!user.isLoggedIn || user.username === other))
                router.push("/").then();
            else if (router.isReady)
                getBackend(`/user/${other}/compare`)
                    .then(res => {
                        setGames(res.games);
                        setEntries(res.entries);
                    });
        }
    }, [user, router.isReady]);

    if (games === {})
        return <div id="App"><Nav/></div>;

    return (
        <div id="App" className="text-center">
            <Nav/>
            <main className="mx-auto mt-10 inline-block mb-4">
                <ul className="bg-main-light rounded-md overflow-hidden w-max">
                    <li className="flex p-2 font-bold" key="heading">
                        <div className="flex-1 text-left">Game</div>
                        <div className="w-32">Your Score</div>
                        <div className="w-32">Their Score</div>
                    </li>
                    {Object.keys(entries).map((game: string) =>
                        <li key={game}>
                            <Link href={`/game/${game}`}>
                                <a className="flex p-2 hover:bg-indigo-500 transition-colors duration-150">
                                    <div className="flex-1 text-left pr-2">{games[+game].name}</div>
                                    <div className="w-32">{entries[+game][user.username].rating}</div>
                                    <div className="w-32">{entries[+game][other].rating}</div>
                                </a>
                            </Link>
                        </li>
                    )}
                </ul>
            </main>
        </div>
    );
};

export default Compare;