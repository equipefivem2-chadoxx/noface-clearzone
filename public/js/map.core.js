document.addEventListener("DOMContentLoaded", () => {


    const map = L.map("map-container", {

        crs: L.CRS.Simple,

        minZoom:-2,

        maxZoom:2,

        zoomControl:false,

        attributionControl:false,

        preferCanvas:true

    });





    const bounds = [

        [0,0],

        [8192,8192]

    ];





    const overlay = L.imageOverlay(

        "/assets/map-gta5.jpg",

        bounds,

        {

            opacity:1,

            interactive:false

        }

    ).addTo(map);







    map.fitBounds(bounds);


    map.setZoom(-1);







    /*
        Effet caméra tactique
    */


    setTimeout(()=>{


        map.flyTo(

            [4096,4096],

            -1,

            {

                duration:1.2,

                easeLinearity:.25

            }

        );


    },300);







    /*
        Curseur initial
    */


    document

    .getElementById("map-container")

    .classList

    .add("cursor-grab");







    /*
        Overlay scan système
    */


    const hud = document.createElement("div");


    hud.className="map-hud-overlay";


    hud.innerHTML=`


        <div class="hud-top-left">


            <span class="pulse"></span>

            SATELLITE LINK ACTIVE


        </div>



        <div class="hud-bottom-right">


            SAN ANDREAS

            <br>

            TACTICAL GRID ONLINE


        </div>


    `;


    document.body.appendChild(hud);








    window.tacticalMap = map;



    console.log(

        "[CLEARZONE] Tactical map loaded:",

        MAP_ID

    );



});