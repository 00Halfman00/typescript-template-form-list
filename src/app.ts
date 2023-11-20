/*
  ////////////////    FIRST TASK  (create class and initialise)      ////////////////////
  1.  create class projectInput
  2.  creeate a template element field and a host element fields
  3.  create variable that imports node out of template element
  4.  create first-child element out of imported node vaiable(step 3)
  5.  create class method attach and invoke inside constructor that will render form onto HTML page
  6.  initialise class instance
  ////////////////    SECOND TASK (create class methods and decorator)    //////////////////////
  1.  create class method configure and invoke inside constructor to attach eventListener to form submission
      and pass class method submitHandler, which will have the event as parameter, to eventListener
  2.  create class method submitHandler to bind class via a decorator to class
  3.  create three fields containing the three input elements in form by querying the this.formElement,
      not the document.something something, and initiate them inside constructor
  4.  create function decorator autoBind and attach to class method submitHandler, inside autoBind create
      new PropertyDescriptor that has a method that binds the class to its value(originalMethod),
      to have "this" bound to the class instance
  ///////////////   THIRD TASK (crate interface and validation function)       /////////////////////////
  1.  create validation interface object
  2.  create validation function for input fields
  3.  invoke validation function inside submitHandler, once for each input
  4.  erase imput values
*/

interface validation {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(inputValues: validation) {
  let isValid = true;
  if (inputValues.required) {
    isValid = isValid && (inputValues.value + '').trim().length !== 0;
  }
  if (inputValues.minLength && typeof inputValues.value === 'string') {
    isValid =
      isValid && inputValues.value.trim().length > inputValues.minLength;
  }
  if (inputValues.maxLength && typeof inputValues.value === 'string') {
    isValid =
      isValid && inputValues.value.trim().length < inputValues.maxLength;
  }
  if (inputValues.min && typeof inputValues.value === 'number') {
    isValid = isValid && inputValues.value > inputValues.min;
  }
  if (inputValues.max && typeof inputValues.value === 'number') {
    isValid = isValid && inputValues.value < inputValues.max;
  }
  return isValid;
}

function autoBind(_1: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const modedDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      return originalMethod.bind(this);
    },
  };
  return modedDescriptor;
}

class inputForm {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLElement;
  formElement: HTMLElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.querySelector(
      '.project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.querySelector('#app')! as HTMLElement;
    const importNode = document.importNode(this.templateElement.content, true);
    this.formElement = importNode.firstElementChild as HTMLElement;
    this.formElement.id = 'user-input';
    this.titleInputElement = this.formElement.querySelector(
      '#title'
    )! as HTMLInputElement;
    this.descriptionInputElement = this.formElement.querySelector(
      '#description'
    )! as HTMLInputElement;
    this.peopleInputElement = this.formElement.querySelector(
      '#people'
    )! as HTMLInputElement;
    this.attach();
    this.configure();
  }
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
  }

  @autoBind
  private submitHandler(event: Event): [string, string, number] {
    event.preventDefault();
    const required = true;
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = +this.peopleInputElement.value;
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
    if (
      validate({
        value: title,
        required: required,
        minLength: 5,
        maxLength: 25,
      }) && // title input
      validate({
        value: description,
        required: required,
        minLength: 5,
        maxLength: 100,
      }) && // description input
      validate({ value: people, required: required, min: 1, max: 11 }) // people input
    ) {
      console.log('', title, '\n', description, '\n', people);
    } else {
      alert('invalid input values');
    }
    return [title, description, people];
  }

  private configure() {
    this.formElement.addEventListener('submit', this.submitHandler);
  }
}


///////////////////////// CLREATE PROJECT CLASS  ///////////////////////////////
/*
  1.  create class name projectList
    a.  retrieve template element
    b.  retrieve host element
    c.  retrieve node from template
    d.  aquire first element(section) from node
  2.  create class method attach to render HTML section element to host element
  3.  create class method to attach ids and content to elements under template with projects class name
*/


class projectList{
  templateElement: HTMLTemplateElement;   //<template id='single-projects'>
  hostElement: HTMLDivElement;            // <div id='app'>
  sectionElement: HTMLElement;
  unorderListElement: HTMLElement;
  h2Element: HTMLElement;

  constructor(private type: 'active' | 'finished'){
    this.templateElement = document.querySelector('.projects-list')! as HTMLTemplateElement;        //<template id='single-projects'>
    this.hostElement = document.getElementById('app')! as HTMLDivElement;                           // <div id='app'>
    const importedNode = document.importNode(this.templateElement.content, true);                   //  importedNode of type Fragment
    this.sectionElement = importedNode.firstElementChild! as HTMLElement;                           // <section class='projects'>
    this.unorderListElement = this.sectionElement.querySelector('ul')! as HTMLElement;              // <ul>
    this.h2Element = this.sectionElement.querySelector('h2')! as HTMLElement;                       // <h2>

    this.attach();
    this.configureContent();
  }

  configureContent(){
    this.sectionElement.id = `${this.type}-projects`;
    this.unorderListElement.id = `${this.type}-project-list`;
    this.h2Element.innerText = `${this.type.toUpperCase()} PROJECTS`;

  }

  attach(){
    this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);                       // inserAdjacentElement lets you append element at different place whereas appendChild method only adds it to the very end of elements
  }
}



const managedProjects = new inputForm();
const activeProjects = new projectList('active');
const finishedProjects = new projectList('finished');
