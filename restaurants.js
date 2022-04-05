$(document).ready(function () {
    $(".modal").addClass("is-active");
});

$(".delete").click(function () {
    $(".modal").removeClass("is-active");
});

$(".button").click(function () {
    $(".modal").removeClass("is-active");
});


function initMap() {
    // Create the map.
    const denver = {
        lat: 39.7392,
        lng: -104.9903
    };

    

    const map = new google.maps.Map(document.getElementById("map"), {
        center: denver,
        zoom: 15,
        mapId: "8d193001f940fde3",
    });
    // Create the places service.
    const service = new google.maps.places.PlacesService(map);
    let getNextPage;
    const moreButton = document.getElementById("more");

    moreButton.onclick = function () {
        moreButton.disabled = true;
        if (getNextPage) {
            getNextPage();
        }
    };

    // var request = {
    //     query: "restaurant denver"
    //     fields: ["name", "geometry"]
    // }

    // Perform a nearby search.
    service.nearbySearch({
            location: denver,
            radius: 500,
            type: "restaurant"
        },
        // input query search
        // service.findPlaceFromQuery(request,
        (results, status, pagination) => {
            if (status !== "OK" || !results) return;

            addPlaces(results, map);
            moreButton.disabled = !pagination || !pagination.hasNextPage;
            if (pagination && pagination.hasNextPage) {
                getNextPage = () => {
                    // Note: nextPage will call the same handler function as the initial call
                    pagination.nextPage();
                };
            }
        }
    );
}

function addPlaces(places, map) {
    const placesList = document.getElementById("places");

    for (const place of places) {
        if (place.geometry && place.geometry.location) {
            // const image = {
            //     url: place.icon,
            //     size: new google.maps.Size(71, 71),
            //     origin: new google.maps.Point(0, 0),
            //     anchor: new google.maps.Point(17, 34),
            //     scaledSize: new google.maps.Size(25, 25),
            // };



            // marker = new google.maps.Marker({
            //     map,
            //     icon: image,
            //     title: place.name,
            //     position: place.geometry.location,
            // });

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