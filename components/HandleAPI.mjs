// this is mjs during development
import React from "react";

const SERVER_IP = '34.151.124.22'
const URL = 'http://' + SERVER_IP + ':4000/api' // pi is test url

const fetchData = async (start, end) => {
    // if start and end dates are provided
    try {
        // api performs error checking on dates
        const req = URL + '?start=' + start + "&end=" + end

        const response = await fetch(req, {
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

const fetchDate = async (date) => {
    try  {
        const req = URL + '?date=' + date

        const response = await fetch(req, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`bad response: ${response.status}`)
        } else {
            return await response.json()
        }
    } catch (error) {
        console.log({error: error.message})
    }
}

//const out = await fetchData(null,null)
const out = await fetchDate('2006-12-17')

console.log(out)