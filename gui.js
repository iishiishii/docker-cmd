"use strict"; // Forces strict mode JavaScript


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


compute() {

  // window.fetch ('https://alphamev.ai/', {
	// 	method: "GET"
	// 	}).then(response => {
  //           if (!response.ok) {
  //             throw Error(response.statusText);
  //           }
        
  //           console.log("no error")    
  //         });


}


}


// Register the element
window.customElements.define('custom-form', CustomFormElement);


