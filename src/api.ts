import type { NextApiHandler, NextApiRequest } from "next/types";

type RequestMethods =
    | "HEAD"
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"

type ApiEndpointHandler = Partial<{
    [method in RequestMethods]: NextApiHandler
}>

export const defineMethods = (next: ApiEndpointHandler): NextApiHandler => async (req, res) => {
    const method = req.method as RequestMethods;
    // continue if method is defined
    if (typeof req.method !== 'string') {
        // bad request
        res.status(400).end();
        // Continue if method is supported

        // check if method is defined
    } else if (!next.hasOwnProperty(method)) {
        // method not allowed
        res.status(405).end();
    } else {
        // continue
        // @ts-ignore
        await next[method](req, res);
    }
}

export const requireBody = <T>(is: (data: any) => boolean) => (next: (o: T) => NextApiHandler): NextApiHandler => async (req, res) => {
    const body = req.body;

    if (!is(body)) {
        // bad request
        res.status(400).end();
    } else {
        // continue
        await next(body)(req, res);
    }
}

export const requireSession = <T>(auth: (req: NextApiRequest) => T | null) => (next: (o: NonNullable<T>) => NextApiHandler): NextApiHandler => async (req, res) => {
    const session = auth(req);
    if (!session) {
        // unauthorized
        res.status(401).end();
    } else {
        // continue
        await next(session)(req, res);
    }
}
