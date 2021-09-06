import {useEffect, useState} from "react";
import {getBackend, getCover, postBackend, useUser} from "@shared/functions";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import Nav from "@components/Nav";
import Link from "next/link";
import type {NextPage} from "next";
import {ListModal} from "@components/ListModal";

interface SeriesResult {
    id: number,
    name: string,
    cover?: { url: string }

}

interface GameResult {
    id: number,
    name: string
    cover: { url: string }
    first_release_date: number
    genres: { name: string }
    collection?: {
        name: string,
        games: SeriesResult[]
    },
    platforms: { name: string }
    summary: string
}

function SeriesElement({game}: { game: SeriesResult }) {
    return <motion.li
        className="rounded shadow h-20 w-20 inline-block mb-4 mr-4
                   bg-cover justify-bottom relative z-0 hover:z-10"
        initial="none"
        whileHover="hover"
        whileTap={{scale: 0.9}}
        variants={{hover: {scale: 1.1, borderBottomRightRadius: 0, borderTopRightRadius: 0}, none: {scale: 1}}}
        style={{backgroundImage: `url(${getCover(game.cover?.url).replace("t_thumb", "t_thumb_2x")})`}}>
        <motion.div
            variants={{
                hover: {width: "100px", padding: "4px"},
                none: {width: 0, padding: 0}
            }}
            transition={{duration: 0.1}}
            className="absolute bottom-0 left-0 right-0 bg-main-light absolute left-full top-0 bottom-0
                       inline-block max-h-full overflow-hidden text-sm leading-tight shadow rounded-r">
            {game.name}
        </motion.div>
    </motion.li>;
}

const Game: NextPage = () => {
    const router = useRouter();
    const {user, mutateUser} = useUser();
    const {id: gameId} = router.query;
    const [showModal, setShowModal] = useState(false);
    const [game, setGame] = useState<GameResult | undefined>(undefined);

    useEffect(() => {
        if (router.isReady)
            getBackend(`games/${gameId}`).then(res => setGame(res));
    }, [router.isReady]);

    if (game === undefined)
        return <div id="App"><Nav/></div>;

    const favourited = user.favourites.find((f: any) => f.gameId === game.id);

    async function favourite() {
        const {user} = await postBackend("user/favourite", {gameId});
        if (user)
            await mutateUser({isLoggedIn: true, ...user});
    }

    return (
        <div id="App" className="text-center">
            <Nav/>
            <main className="mx-auto mt-10 inline-block">
                <div className="rounded-md dark:bg-main-light p-4 flex mb-8">
                    <div
                        className="w-52 inline-block">
                        <img alt="Game cover" className="w-full rounded"
                             src={`https:${game.cover.url.replace("t_thumb", "t_thumb_2x")}`}/>
                        <div className="mt-4 flex">
                            <div className="flex-1 flex">
                                <button className="button w-5/6 rounded-r-none" onClick={() => {
                                    if (user.isLoggedIn)
                                        setShowModal(true);
                                }}>
                                    Add to List
                                </button>
                                <button className="button bg-indigo-400 flex-1 rounded-l-none material-icons">
                                    expand_more
                                </button>
                                <ListModal game={game.id} show={showModal} onClose={() => setShowModal(false)}/>
                            </div>
                            <button className={`button ml-4 ${favourited ? "bg-red-500" : "bg-main-dark"} hover:bg-red-500
                                                hover:text-white transition-colors duration-150 w-9 material-icons`}
                                    onClick={favourite}>
                                {favourited ? "favorite" : "favorite_border"}
                            </button>
                        </div>
                    </div>
                    <div className="max-w-4xl pl-6 text-left">
                        <h1 className="text-xl mb-2">
                            {game.name}
                        </h1>
                        <div className="opacity-60 overflow-ellipsis">{game.summary}</div>
                    </div>
                </div>

                {game && game.collection &&
                <div className="max-w-6xl text-left">
                    <div className="mb-2">{game.collection.name} Series</div>
                    <ul>
                        {game.collection.games.map(child => child.id !== game.id &&
                            <Link href={`/redirect-game/${child.id}`}>
                                <SeriesElement game={child}/>
                            </Link>
                        )}
                    </ul>
                </div>
                }
            </main>
        </div>
    );
};

export default Game;
