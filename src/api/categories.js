import { url } from "./configuration"

export const index = async () => {
    const r = await fetch(`${url}/categories`, {
        headers: {
            Accept: 'application/json'
        }
    })


    return await r.json()
}