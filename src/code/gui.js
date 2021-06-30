"use strict"; // Forces strict mode JavaScript


const $=require('jquery');

let compute=function() {
    
    fetch ('http://localhost:8080/express_backend', {
		method: "GET"
		}).then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
        
            console.log("no error")    
          });
};

// ------------------------------------------------------------------
// Create GUI
// ------------------------------------------------------------------

/**
 * This function creates the main GUI of the application
 * by instantiating template elements and creating the menu
 * @alias Main.createGUI
 */
let createGUI=function() {
    
    
    // Attach a callback to the compute button on the GUI
    $('#compute').click( (e) => {
	e.preventDefault(); // cancel default behavior
	compute();
    });
};


window.onload=function() {
    createGUI();
};
    