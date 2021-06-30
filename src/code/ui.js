"use strict"; // Forces strict mode JavaScript

// These are hints for JSHint
/*jshint browser: true*/
/*jshint undef: true, unused: true */
/*global window*/

const $=require('jquery');

/**
 * Note that instead of id's as in step 5 we use a random attribute called name to index into the elements.
 * This way we can include multiple copies of this form. If we used id's, this break the rule that 'ids' must be unique.
 */

const formtext=`
      <form class="form">
	<button class="btn btn-primary" type="submit" name="compute" style="width:200px">Start</button>
    </form>
    <HR>`;

// -----------------------------------------------------------------
/**
 * The custom form element
 *
 * to access simply include this file into your code and then add this as an element to your html page
 *
 * @example
 *  <custom-form   id="viewer_menubar"></custom-form> 
 *
 */


class CustomFormElement extends  HTMLElement {

    constructor() {
	super();
    }
    
    connectedCallback() {

        
	// Create GUI
	this.core_element=$(formtext);
	this.appendChild(this.core_element[0]); // mapping for Jquery to regular web element

	this.compute_button=this.core_element.find(`[name='compute']`);

	// Attach a callback to the compute button on the GUI
	this.compute_button.click( (e) => {
	    e.preventDefault(); // cancel default behavior
	    this.compute();
	});

}




    /**
     * This function computes the results, 
     * creates the results dialog if this is the first time
     * and displays the results in the results dialog
     * It first calls {@link Main.storeGUIValuesInApplicationState} to update the 
     * current application state from the GUI and then {@link BmiModule.getdescription} to generate the results
     */
	 compute (){
		fetch ('http://localhost:8080/express_backend', {
		method: "GET"
		}).then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
        
            console.log("no error")    
          });}

}



// Register the element
window.customElements.define('custom-form', CustomFormElement);


