
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const res = await request.json()
    const sessionToken = res.payload?.accessToken
    if (!sessionToken) {
        return Response.json({
            message: "Không nhận được token"
        }, {
            status: 400,
        })
    }

    return Response.json({ res }, {
        status: 200,
        headers: { 'Set-Cookie': `sessionToken=${sessionToken}; Path=/` },
    })
}
export async function DELETE(request: Request) {
    cookies().delete('sessionToken')
    return Response.json({}, {
        status: 200,
    })
}