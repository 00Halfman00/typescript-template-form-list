"use strict";
/*
  CHAPTER I:
  ///////////////////////////// FIRST TASK /////////////////////////////////////////////////////////
    1.  Create class ProjectForm
    2.  declare fields for html template element and html div element and
        retrieve both elements inside class' consturctor
    3.  retrive node from template via document.importedNode() into variable: const importedNode
    4.  retrieve first child element(form element) from node(fragment) into a variable: this.formElement
    5.  create class method named attach to render html form element and its child elements
        and invoke inside constructor so that it runs when class is initiated
  //////////////////////////// SECOND TASK /////////////////////////////////////////////////////////
    1.  create class methods passEvent and submitHandler
    2.  create decorator function to bind "this" to the class instance, added to submitHandler
    3.  create fields for inputs inside form and retrieve those elements inside constructor,
        not from the document.querySelector() but from the first element gotten from
        the imported template node: formElement.querySelector()
  ///////////////////////////  THIR TASK  //////////////////////////////////////////////////////////
    1.  create an interface for validation object
    2.  create validate function
    3.  invoke validate function inside submitHandler to validate the data of all three inputs
    4.  create evaluateInputs function to evaluate all three inputs via validate function
    5.  clear all three inputs via clearInputs class method
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validateInput) {
    let isValid = true;
    if (validateInput.required) { // no empty inputs allowed
        isValid = isValid && (validateInput.value + '').trim().length !== 0;
    }
    if (validateInput.minLength && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    }
    if (validateInput.maxLength && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    }
    if (validateInput.min && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value >= validateInput.min;
    }
    if (validateInput.max && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value < validateInput.max;
    }
    return isValid;
}
function evaluateInputs(title, description, people, required) {
    if (validate({
        value: title,
        required: required,
        minLength: 5,
        maxLength: 25,
    }) && validate({
        value: description,
        required: required,
        minLength: 10,
        maxLength: 100,
    }) && validate({
        value: title,
        required: required,
        min: 1,
        max: 11
    })) {
        return true;
    }
    return false;
}
function autoBind(_1, _2, descriptor) {
    const originMethod = descriptor.value;
    const modedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originMethod.bind(this);
        }
    };
    return modedDescriptor;
}
class ProjectForm {
    constructor() {
        this.templateElement = document.querySelector('#project-input');
        this.hostElement = document.querySelector('#app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild;
        this.formElement.id = 'user-input';
        this.titleInputElement = this.formElement.querySelector('#title');
        this.descriptionInputElement = this.formElement.querySelector('#description');
        this.peopleInputElement = this.formElement.querySelector('#people');
        this.attach();
        this.passEvent();
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = +this.peopleInputElement.value;
        this.clearInputs();
        const required = true;
        const validInputs = evaluateInputs(title, description, people, required);
        if (validInputs) {
            projectState.addProject({ id: '', title, description, people });
            return [title, description, people];
        }
        alert('Invalid inputs');
    }
    passEvent() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}
__decorate([
    autoBind
], ProjectForm.prototype, "submitHandler", null);
/*
CHAPTER 2:
  ///////////////////////////// FIRST TASK /////////////////////////////////////////////////////////
    1.  Create class ProjectList
    2.  declare fields for html template element and html div element and
        retrieve both elements inside class' consturctor
    3.  retrive node from template via document.importedNode() into variable: const importedNode
    4.  retrieve first child element(form element) from node(fragment) into a variable: this.sectionElement
    5.  create attach and configure class methods to render list of projects.
*/
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.querySelector('#project-list');
        this.hostElement = document.querySelector('#app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.sectionElement = importedNode.firstElementChild;
        this.unorderedListElement = this.sectionElement.querySelector('ul');
        this.h2Element = this.sectionElement.querySelector('h2');
        this.projects2List = [];
        projectState.addListener((projects) => {
            this.projects2List = [...projects];
            this.renderProjects();
        });
        this.attach();
        this.configure();
    }
    renderProjects() {
        this.unorderedListElement.innerHTML = '';
        this.projects2List.forEach(p => {
            const listItem = document.createElement('li');
            listItem.innerHTML = p.title;
            this.unorderedListElement.appendChild(listItem);
        });
    }
    configure() {
        this.sectionElement.id = `${this.type}-projects`;
        this.h2Element.innerHTML = `${this.type.toUpperCase()} PROJECTS`;
        this.unorderedListElement.id = `${this.type}-projects-list`;
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.sectionElement);
    }
}
/*
  CHAPTER III:
  ///////////////////////////// FIRST TASK /////////////////////////////////////////////////////////
    1.  Create class ProjectState
    2.  turn class ProjectStae inso a Singleton class
    3.  create an class method addProject that adds projects to the class field projectList
    4.  create class Project and function type: listener
    5.  create class method addListener that adds a listener function to the class field listeners
    6.  initialize class and deploy class method using instance inside class ProjectList to add listener to Project state's field: listeners
    7.  deploy listeners each time a project is added to ProjectState's field projectList

*/
class Project {
    constructor(id, title, description, people) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
    }
}
class ProjectState {
    constructor() {
        this.projectsList = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        const p = new ProjectState();
        return p;
    }
    addListener(fn) {
        this.listeners[this.listeners.length] = fn;
    }
    addProject(p) {
        p.id = Math.floor(Math.random() * 100) + '';
        this.projectsList[this.projectsList.length] = p;
        this.listeners.forEach(l => l([...this.projectsList]));
    }
}
const projectState = ProjectState.getInstance();
/////////////////////////////////////////// Initialize program /////////////////////////////////////
const initializeProject = new ProjectForm();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
