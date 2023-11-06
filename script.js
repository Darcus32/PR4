document.addEventListener('DOMContentLoaded', getMyLocation);
let intervalId = null;

let map = L.map('map')
map.setView([48.9163634, 24.7399542], 12)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)
let buttonFocus=document.getElementById("focus");
let setButton=document.getElementById("set");
let buttonFocusOnDest=document.getElementById("focusOnDest");
let watchId = null

function getMyLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(displayLocation, displayError)
    } else{
        alert('На жаль, немає підтримки геолокації')
    }
    map.on('click', onMapClick);
}

function displayLocation(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let div = document.getElementById("location");
    div.innerHTML = `Ти на широті: ${latitude}, довготі: ${longitude}`;
    div.innerHTML += `(з ${position.coords.accuracy} точністю метрів)`;
    let km = computeDistance(position.coords, ourCoords);
    let distance = document.getElementById("distance");
    distance.innerHTML = `Ти на ${km} km від Коледжу`

    buttonFocus.addEventListener("click", function(){
        map.flyTo([latitude, longitude], 17);
    })
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    var marker = L.marker([latitude, longitude]).addTo(map);
    marker.bindPopup("Your place").openPopup();
    var time = new Date(position.timestamp);
    var timeString = `Location timestamp: ${time.toLocaleString()}`;
    var timeMarker = L.marker([latitude, longitude]).addTo(map);
    timeMarker.bindPopup(timeString).openPopup();
    
}

function onMapClick(e) {
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`${e.latlng.lat.toFixed(7)}, ${e.latlng.lng.toFixed(7)}`)
        .openOn(map)
}

document.getElementById('watch').addEventListener('click', function() {
    if (intervalId === null) {
        intervalId = setInterval(getMyLocation, 5000);
    }
});

document.getElementById('clearWatch').addEventListener('click', function() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
});

function displayError(error) {
    const errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    };
    const errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage += " " + error.message;
    }
    let div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRadians(startCoords.latitude);
    let startLongRads = degreesToRadians(startCoords.longitude);
    let destLatRads = degreesToRadians(destCoords.latitude);
    let destLongRads = degreesToRadians(destCoords.longitude);
    let Radius = 6371;

    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)) * Radius;

    return distance;
}

function degreesToRadians(degrees) {
    let radians = (degrees * Math.PI) / 180;
    return radians;
}

let ourCoords = {
    latitude: 48.943134793201445,
    longitude: 24.7337637752979
}; 

setButton.addEventListener("click", function(){
    let destLatitude=document.getElementById("latitude").value;
    let destlongitude=document.getElementById("longitude").value;   
    let marker=L.marker([destLatitude,destlongitude]).addTo(map);
    marker.bindPopup(`Destination point:${destLatitude}, ${destlongitude}`);
})

buttonFocusOnDest.addEventListener("click", function(){
    let destLatitude=document.getElementById("latitude").value;
    let destlongitude=document.getElementById("longitude").value;
    map.flyTo([destLatitude, destlongitude],17);
})