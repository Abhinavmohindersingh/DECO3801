import React from "react";

const SERVER_IP = ''

const mockFetchData = () => {
    const response = fetch('http://' + SERVER_IP + ':4000/pi')

};