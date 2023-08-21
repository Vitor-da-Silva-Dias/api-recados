import { Response } from "express";

export class HttpResponse {
    public static badRequest(res: Response, reason: string) {
        return res.status(400).send({
            ok: false,
            message: `${reason}`,
        });
    }

    public static unauthorized(res: Response, reason: string) {
        return res.status(401).send({
            ok: false,
            message: `${reason}`,
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
