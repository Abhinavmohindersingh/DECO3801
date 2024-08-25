// this is mjs during development
import React from "react";

const SERVER_IP = '34.151.124.22'
const URL = 'http://' + SERVER_IP + ':4000/api' // pi is test url

const fetchData = async (start = null, end = null, date = null) => {
    // if start and end dates are provided
    if (start && end) { 
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

    } else if (date) {
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
    
};

const out = await fetchData(null,null,'2006-12-17')

console.log(out)