import { url } from "./configuration"

export const index = async () => {
    const r = await fetch(`${url}/products`, {
        headers: {
            Accept: 'application/json'
        }
    })


    return await r.json()
}

export const store = async (body) => {
    const r = await fetch(`${url}/products`, {
        method: "POST",
        headers: {
            Accept: 'application/json'
        },
        body: body
    })


    return await r.json()
}