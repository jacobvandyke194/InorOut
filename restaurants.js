$(document).ready(function () {
    $(".modal").addClass("is-active");
});

$(".delete").click(function () {
    $(".modal").removeClass("is-active");
});

$(".button").click(function () {
    $(".modal").removeClass("is-active");
});

var map;
var dc = {lat: 38.9072, lng: -77.0369}


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: dc,
        zoom: 8,
        mapId: "8d193001f940fde3",    

    });
}


function formHandler() {
    var checkbox = $("#checkbox");
    checkbox.val(checkbox[0].checked ? "true" : "false");

    localStorage.setItem("keyword", document.getElementById("keyword").value);
    localStorage.setItem("zipCode", document.getElementById("zip").value);
    localStorage.setItem("radius", document.getElementById("radius").value);
    localStorage.setItem("openNow", document.getElementById("checkbox").value);

    // var zipCode = Number(localStorage.getItem("zipCode"));
    var zipCode = Number(document.getElementById("zip").value);
    console.log(zipCode);

    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        params:{
            address:zipCode,
            key: 'AIzaSyBI3NxF4qGonUrluR6Ui1jFSRvMoILAy8s'
        }
    })
    .then(function(response){
        console.log(response);      
        console.log(response.data.results[0].geometry.location.lat);
        console.log(response.data.results[0].geometry.location.lng);
        localStorage.setItem("lat", response.data.results[0].geometry.location.lat);
        localStorage.setItem("lng", response.data.results[0].geometry.location.lng);

    })
    .catch(function(error){
        console.log(error);
    });

};

function getResults() {
    setTimeout(function(){
    
    var userLocation = {
        lat: Number(localStorage.getItem("lat")),
        lng: Number(localStorage.getItem("lng"))
    };
    console.log(userLocation);

    // var keyword = localStorage.getItem("keyword");
    var keyword = document.getElementById("keyword").value;
    // var radius = Number(localStorage.getItem("radius"));
    var radius = Number(document.getElementById("radius").value);
    // var openStatus = eval(localStorage.getItem("openNow"));
    var openStatus = eval(document.getElementById("checkbox").value);

    console.log(keyword);
    console.log(radius);
    console.log(openStatus);


    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 13,
        mapId: "8d193001f940fde3",
    });
    //     // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) {
            getNextPage();
        }
    };

    service.textSearch({
            location: userLocation,
            radius: radius,
            type: "restaurant",
            query: keyword,
            openNow: openStatus,
        },


        (results, status, pagination) => {
            if (status !== "OK" || !results) return;

            addPlaces(results, map);
            moreButton.disabled = !pagination || !pagination.hasNextPage;
            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    pagination.nextPage();
                };
            }
        }
    );
    }, 300 );
}

function addPlaces(places, map) {
    const placesList = document.getElementById("places");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {

            const infowindow = new google.maps.InfoWindow();

            const marker = new google.maps.Marker({
                map,
                position: place.geometry.location
            });

            google.maps.event.addListener(marker, "click", () => {

                infowindow.open(map);
            });

            const li = document.createElement("li");

            li.textContent = place.name;
            placesList.appendChild(li);
            li.addEventListener("click", () => {
                map.setCenter(place.geometry.location);
            });
        }
    }
}
