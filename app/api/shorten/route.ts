import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req: any) {
    const body = await req.json();
    const { originalUrl } = body;

    const shortId = nanoid(6);

    await prisma.url.create({
        data: {
            shortId,
            originalUrl
        },
    })

    return Response.json({
        shortUrl: `http://localhost:3000/${shortId}`
    })
}