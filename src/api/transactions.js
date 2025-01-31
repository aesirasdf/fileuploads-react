import { url } from "./configuration"

export const store = async (body) => {
    const r = await fetch(`${url}/transactions`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({cart: body})
    })


    return await r.json()
}


export const index = async () => {
    const r = await fetch(`${url}/transactions`, {
        headers: {
            Accept: 'application/json'
        }
    })


    return await r.json()
}