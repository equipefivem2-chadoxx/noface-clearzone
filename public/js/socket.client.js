document.addEventListener("DOMContentLoaded",()=>{


    const socket = io();

    socket.emit(
        "join-map",
        MAP_ID
    );



    const btnNewUnit =
        document.getElementById("btn-new-unit");


    const modal =
        document.getElementById("modal-unit");


    const btnCancel =
        document.getElementById("btn-cancel-unit");


    const btnConfirm =
        document.getElementById("btn-confirm-unit");


    const input =
        document.getElementById("unit-name-input");


    const error =
        document.getElementById("modal-error");


    const list =
        document.getElementById("units-list");


    const tools =
        document.getElementById("tactical-tools");





    window.selectedUnit=null;







    /*
        OPEN MODAL
    */


    btnNewUnit.onclick=()=>{


        modal.classList.remove("hidden");


        setTimeout(()=>{

            input.focus();

        },100);


    };







    /*
        CLOSE MODAL
    */


    btnCancel.onclick=()=>{


        modal.classList.add("hidden");


        input.value="";


        error.textContent="";


    };








    /*
        CREATE UNIT
    */


    btnConfirm.onclick=()=>{


        const name =
            input.value.trim();



        if(!name){


            error.textContent=

            "UNIT IDENTIFIER REQUIRED";


            return;

        }




        socket.emit(

            "create-unit",

            name,

            response=>{


                if(!response.success){


                    error.textContent=

                    response.message;


                    return;


                }




                modal.classList.add("hidden");


                input.value="";



            }


        );



    };









    /*
        ADD UNIT
    */


    socket.on(

        "unit-added",

        unit=>{


            removeEmpty();



            createUnitCard(unit);



            showNotification(

                "UNIT DEPLOYED",

                unit.name

            );



        }

    );







    /*
        REMOVE UNIT
    */


    socket.on(

        "unit-removed",

        id=>{


            const card=

            document.querySelector(

                `[data-id="${id}"]`

            );



            if(card){


                card.style.transform=

                "translateX(100%)";


                card.style.opacity=0;



                setTimeout(()=>{


                    card.remove();


                    checkEmpty();


                },300);



            }




            if(

                window.selectedUnit &&

                window.selectedUnit.id===id

            ){


                window.selectedUnit=null;


                tools.classList.add("hidden");


            }



        }

    );









    /*
        CLICK UNIT
    */


    list.addEventListener(

        "click",

        e=>{


            const card=

            e.target.closest(

                ".unit-card"

            );



            if(!card)

            return;






            if(

                e.target.closest(

                    ".btn-delete"

                )

            ){



                socket.emit(

                    "delete-unit",

                    card.dataset.id

                );


                return;


            }







            document

            .querySelectorAll(

                ".unit-card"

            )

            .forEach(c=>{


                c.classList.remove(

                    "active"

                );


            });





            card.classList.add(

                "active"

            );





            window.selectedUnit={


                id:

                card.dataset.id,


                color:

                card.dataset.color


            };




            tools.classList.remove(

                "hidden"

            );



            showNotification(

                "UNIT SELECTED",

                card.querySelector(".unit-name").textContent

            );




        }


    );









    function createUnitCard(unit){



        const card=

        document.createElement(

            "div"

        );



        card.className="unit-card";



        card.dataset.id=

        unit.id;



        card.dataset.color=

        unit.color;




        card.innerHTML=`

        <div 
        class="unit-color"
        style="--u-color:${unit.color}">
        </div>


        <div class="unit-details">

            <span class="unit-name">

            ${unit.name}

            </span>


            <small>

            ● PATROL ACTIVE

            </small>


        </div>


        <button class="btn-delete">

        ×

        </button>

        `;



        list.appendChild(card);



    }







    function removeEmpty(){


        const empty=

        document.querySelector(

            ".empty-state"

        );


        if(empty)

        empty.remove();


    }






    function checkEmpty(){


        if(list.children.length===0){


            list.innerHTML=`

            <div class="empty-state">

            NO ACTIVE DEPLOYMENT

            </div>

            `;


        }


    }









    function showNotification(title,text){


        const box=

        document.createElement(

            "div"

        );



        box.className=

        "hud-notification";



        box.innerHTML=`

            <strong>${title}</strong>

            <span>${text}</span>

        `;



        document.body.appendChild(box);





        setTimeout(()=>{


            box.classList.add(

                "show"

            );


        },50);





        setTimeout(()=>{


            box.classList.remove(

                "show"

            );


            setTimeout(()=>box.remove(),300);



        },3000);




    }







    window.tacticalSocket=socket;



});