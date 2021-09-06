import {useEffect, useState} from "react";
import {postBackend, useUser} from "@shared/functions";
import type {NextPage} from "next";
import {useRouter} from "next/router";

const Logout: NextPage = () => {
    const {mutateUser} = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        postBackend("/logout").then(() => {
            mutateUser(undefined).then();
            setLoading(false)
        });
    }, []);

    if(!loading)
        router.push("/").then()

    return (
        <div id="App">
            "Loading..."
        </div>
    );
};

export default Logout;