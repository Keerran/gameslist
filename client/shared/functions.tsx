import moment from "moment";
import Router from "next/router";
import {useEffect} from "react";
import useSWR from "swr";
import {NextApiHandler} from "next";
import {NextApiRequest, NextApiResponse} from "next/dist/shared/lib/utils";

function objToQueryString(obj: Object) {
    const keyValuePairs = [];
    for (const key in obj) {
        // @ts-ignore
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
}

export function getCover(url?: string) {
    if (url === undefined) return "";
    return `https:${url}`;
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}

const statuses = ["Released", "Unreleased", "Alpha", "Beta", "Early Access", "Offline", "Cancelled", "Rumoured"];

export function formatRelease(release_date?: number, status_i?: number) {
    let year = "";
    let statusString = "";
    if (status_i === undefined)
        status_i = release_date === undefined ? 1 : 0;

    const status = statuses[status_i];

    console.log(release_date, status_i);

    switch (status) {
        case "Released":
            year = moment(release_date! * 1000).format("YYYY");
            break;
        case "Alpha":
        case "Beta":
        case "Early Access":
            year = moment(release_date! * 1000).format("YYYY");
            statusString = " " + status;
            break;
        case "Unreleased":
        case "Offline":
        case "Cancelled":
        case "Rumoured":
            statusString = status;
            break;
    }

    return year + statusString;
}

type Methods = "POST" | "PUT" | "DELETE";

function requestBackend(endpoint: string, method: Methods, data?: Object) {
    return fetch("/api/" + endpoint, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

export function getBackend(endpoint: string, data?: Object): Promise<any> {
    const dataString = objToQueryString(data ?? {});
    return fetch(`/api/${endpoint}?${dataString}`, {method: "GET"})
        .then(res => res.json());
}

export function postBackend(endpoint: string, data?: Object): Promise<any> {
    return requestBackend(endpoint, "POST", data);
}

export function putBackend(endpoint: string, data?: Object): Promise<any> {
    return requestBackend(endpoint, "PUT", data);
}

export function deleteBackend(endpoint: string, data?: Object): Promise<any> {
    return requestBackend(endpoint, "DELETE", data);
}

interface UseUserProps {
    redirectTo?: string,
    redirectIfFound?: boolean
}

export function useUser({redirectTo, redirectIfFound = false}: UseUserProps = {}) {
    const {data: user, mutate: mutateUser} = useSWR('/api/user');

    useEffect(() => {
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return;

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            Router.push(redirectTo).then();
        }
    }, [user, redirectIfFound, redirectTo]);

    return {user, mutateUser};
}

export function merge(obj1: any, obj2: any) {
  const answer = {} as any;
  for(const key in obj2) {
    if(answer[key] === undefined || answer[key] === null)
      answer[key] = obj2[key];
  }
  for(const key in obj1) {
    if(answer[key] === undefined || answer[key] === null)
      answer[key] = obj1[key];
  }
  console.log(answer);
  return answer
}