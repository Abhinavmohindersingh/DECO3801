import React from "react";

const SERVER_IP = '35.197.170.143'
const URL = 'http://' + SERVER_IP + ':4000/pi'

const mockFetchData = async () => {
    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json' // to prevent 'undefined'
            }
        })

        if (!response.ok) {
            throw new Error(`bad response: ${response.status}`)
        } else {
            return await response.json() // api should always give json
        }
    } catch (error) {
        console.log({error: error.message})
    }
    
};

const out = await mockFetchData()

console.log(out)