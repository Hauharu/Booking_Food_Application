// testApi.js
import fetch from 'node-fetch'


const url = 'http://127.0.0.1:8000/Store/';
const token = 'AnbeQt1ZjM5uDkGIqNVnAE6ICWPQjD';

fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
