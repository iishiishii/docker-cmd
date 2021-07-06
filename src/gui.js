"use strict"; // Forces strict mode JavaScript


// const $=require('jquery');

const formtext = `
<form class="form">
<button class="btn btn-primary" type="submit" name="compute" style="width:200px">Start</button>
<HR>
	<div name="result" style="width:400px"> </div>
</form>
<HR>`;


class CustomFormElement extends  HTMLElement {

  constructor() {
    super();
    this.resultsdialog=null;
  }
  
  connectedCallback() {

// Create GUI
this.core_element=$(formtext);
this.appendChild(this.core_element[0]); // mapping for Jquery to regular web element

this.compute_button=this.core_element.find(`[name='compute']`);


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
compute() {
  fetch ('http://localhost:8080/express_backend', {
		method: "GET"
		}).then(response => {
            if (!response.ok) {
              throw Error(response.statusText);
            }
        
            console.log("no error")    
          });

}

}


// Register the element
window.customElements.define('custom-form', CustomFormElement);


