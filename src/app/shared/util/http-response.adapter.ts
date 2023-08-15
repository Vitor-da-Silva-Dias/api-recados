import { Response } from "express";

export class HttpResponse {
    public static fieldNotProvided(res: Response, field: string) {
        return res.status(400).send({
            ok: false,
            message: `${field} not provided`,
        });
    }

    public static unauthorized(res: Response) {
        return res.status(401).send({
            ok: false,
            message: `Invalid credentials`,
            code: 401,
        });
    }

    public static notFound(res: Response, field: string) {
        return res.status(404).send({
            ok: false,
            message: `${field} not found`,
        });
    }
}
