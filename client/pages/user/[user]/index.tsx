import type {NextPage} from "next";
import {Fragment, Ref, RefObject, useEffect, useRef, useState} from "react";
import {getBackend, getCover, useUser} from "@shared/functions";
import Nav from "@components/Nav";
// import {ListModal} from "../../components/ListModal";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import {useRouter} from "next/router";
import {ListModal} from "@components/ListModal";

interface Entry {
    gameId: number,
    userId: number,
    status: string,
    rating: number,
    playtime: number,
    note: string
}

interface Game {
    id: number,
    name: string,
    cover: { url: string },
}

interface Data {
    games: { [id: number]: Game },
    entries: { [category: string]: Entry[] }
}

interface GameProps {
    entry: Entry,
    game: Game,
    username: string,
    refreshEntries: () => void,
}

function ProfileGame(props: GameProps) {
    const {user} = useUser();
    const [showModal, setModal] = useState(false);

    function onCloseModal() {
        setModal(false);
        props.refreshEntries();
    }

    return <li
               onClick={() => {
                   if (user.isLoggedIn)
                       setModal(true);
               }}
               className="flex text-gray-400 p-2 hover:bg-indigo-500 hover:text-white
                          transition-colors duration-150 cursor-pointer last:rounded-b-md">
        <div className="flex-1 h-10" style={{maxWidth: "2.5rem"}}>
            <Link href={`/game/${props.game.id}`}>
                <img src={getCover(props.game.cover.url)} className="rounded"/>
            </Link>
        </div>
        <div className="flex-1 flex items-center text-left px-4 relative"
             style={{flex: 5}}>
            <span className="flex-1">
            {props.game.name}
            </span>

            {props.entry.note &&
            <div className="relative flex self-center justify-center">
            <span className="material-icons" data-tip={props.entry.note}
                  style={{fontSize: "18px"}}> chat </span>
                <ReactTooltip place="right" effect="solid"/>
            </div>
            }
        </div>
        <div className="flex-1 flex items-center justify-center">{props.entry.rating}</div>
        <div className="flex-1 flex items-center justify-center">{props.entry.playtime}</div>

        {user.username === props.username &&
        <ListModal game={props.game.id} entry={props.entry} onClose={onCloseModal} show={showModal}/>
        }

    </li>;
}

const User: NextPage = () => {
    const router = useRouter();
    const {user} = router.query as { user: string };
    const [data, setData] = useState<Data>({games: {}, entries: {}});

    function refreshEntries() {
        if (router.isReady)
            getBackend(`user/${user}`).then(res => {
                if (res.entries)
                    setData({entries: res.entries, games: res.games});
            });
    }

    useEffect(refreshEntries, [router.isReady]);

    return (
        <div id="App" className="text-center">
            <Nav/>
            <main className="mx-auto mt-10 inline-block mb-4">
                {Object.keys(data.entries).map(category =>
                    <div className="group">
                        <div
                            className="group-first:mt-0 mt-8 mb-1 ml-4 text-gray-400 text-left text-xl">{category}</div>
                        <ul className="rounded-md dark:bg-main-light" style={{width: "40rem"}}>
                            <li key={`headings-${category}`} className="flex px-2 py-3 font-bold rounded-t-md">
                                <div className="ml-10 flex items-center text-left px-4" style={{flex: 5}}>Title</div>
                                <div className="flex-1 flex items-center justify-center">Rating</div>
                                <div className="flex-1 flex items-center justify-center">Playtime</div>
                            </li>
                            {data.entries[category].map(entry =>
                                <ProfileGame key={entry.gameId}
                                             entry={entry}
                                             username={user}
                                             game={data.games[entry.gameId]}
                                             refreshEntries={refreshEntries}/>)
                            }
                        </ul>
                    </div>)}
            </main>
        </div>
    );
};

export default User;