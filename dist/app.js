"use strict";
/////////////////////////   TOOLS   ///////////////////////////////////////
/*
  TASK VII: CREATE INTERFACES Drag and Dragged
    (projects can be dragged to either category: Active Projects or Finished Projects)
    1.  Drag will have two methods, but only one will be used.
    2.  Dragged will have three methods that will be used
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var projectStatus;
(function (projectStatus) {
    projectStatus["Active"] = "active";
    projectStatus["Finished"] = "finished";
})(projectStatus || (projectStatus = {}));
;
////////////////////////////////////////////////////////////////////////////////
/*
  TASK V: CREATE CLASS Base that ProjectList and Project Form will inherit from
    1.  creae fields that will address the need to have a templateElement, hostElement, and element element
    2.  retrieve the aforementioned elements via ids passed in as arguments to constructor function
    3.  provide an attach method that will be declared and initialised in Base class and all
        inheriting classes will invoke
    4.  provide abstract methods that will be declared in base class but must be configured
        and initialized in inheriting classes
*/
class Base {
    constructor(templateElementId, hostElementId, insertAt, elementId) {
        this.templateElement = document.querySelector('#' + templateElementId);
        this.hostElement = document.querySelector('#' + hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (elementId) {
            this.element.id = elementId;
        }
        this.attach(insertAt);
    }
    attach(insert) {
        this.hostElement.insertAdjacentElement(insert ? 'afterbegin' : 'beforeend', this.element);
    }
}
/*
  TASK VI: CREATE CLASS ProjectItem
    1.  create class projectItem that will display an item when invoked
*/
class ProjectItem extends Base {
    get peopleString() {
        return this.project.people <= 1 ? '1 person' : `${this.project.people} persons`;
    }
    constructor(hostId, p) {
        super('single-project', hostId, false, p.id);
        this.project = p,
            this.h2Element = this.element.querySelector('h2');
        this.h3Element = this.element.querySelector('h3');
        this.pElement = this.element.querySelector('p');
        this.render();
        this.configure();
    }
    dragStartHandler(event) {
        var _a;
        (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/plain', this.project.id);
        event.dataTransfer.dropEffect = 'move';
    }
    dragEndHandler(event) {
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    render() {
        this.h2Element.innerText = this.project.title;
        this.h3Element.innerText = this.peopleString;
        this.pElement.innerText = this.project.description;
    }
}
__decorate([
    autoBind
], ProjectItem.prototype, "dragStartHandler", null);
////////////////////////////////////////////////////////////////////////////////
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class Listener {
    constructor() {
        this.listenersList = [];
    }
    addListener(fn) {
        this.listenersList[this.listenersList.length] = fn;
    }
}
/*
  TASK III: CREATE CLASS  ProjectState
    1.  It will have a field for a list of projects and a list of listener functions
    2.  It will add projects and it will add listeners to each list
*/
class ProjectState extends Listener {
    constructor() {
        super(...arguments);
        this.projectsList = [];
    }
    static getInstance() {
        return this.instance = this.instance ? this.instance : new ProjectState();
    }
    addProject(p) {
        this.projectsList[this.projectsList.length] = p;
        this.runListeners();
    }
    updateProjectStatus(pId, status) {
        const p = this.projectsList.find(p => p.id === pId);
        if (p && status !== p.status) {
            p.status = status;
            this.runListeners();
        }
    }
    runListeners() {
        const projectsArr = [...this.projectsList];
        this.listenersList.forEach(l => l(projectsArr));
    }
}
const projectState = ProjectState.getInstance();
/*
  TASK II: CREATE CLASS  ProjectList
    1.  It will handle collecting the user input from three inputs
    2.  It will list data goten from inputs
    3.  hostElement will be a div
    4.  firstElementChild gotten from template will be a section element

*/
class ProjectList extends Base {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.projects2Reder = [];
        this.templateElement = document.querySelector('#project-list');
        this.uListElement = this.element.querySelector('ul');
        this.h2Element = this.element.querySelector('h2');
        this.configure();
        this.listen();
    }
    draggedOverHandler(event) {
        event.preventDefault();
        this.uListElement.classList.add('droppable');
    }
    draggedDropHandler(event) {
        event.preventDefault();
        this.uListElement.classList.remove('droppable');
        if (event.dataTransfer && event.dataTransfer.types.includes('text/plain')) {
            event.dataTransfer.effectAllowed = 'move';
            const data = event.dataTransfer.getData('text/plain');
            projectState.updateProjectStatus(data, this.type === 'active' ? projectStatus.Active : projectStatus.Finished);
        }
    }
    draggedLeaveHandler(event) {
        event.preventDefault();
        this.uListElement.classList.remove('droppable');
    }
    configure() {
        this.element.addEventListener('dragover', this.draggedOverHandler);
        this.element.addEventListener('drop', this.draggedDropHandler);
        this.element.addEventListener('dragleave', this.draggedDropHandler);
        this.uListElement.id = `${this.type}-projects-list`;
        this.h2Element.innerText = `${this.type.toUpperCase()} PROJECTS`;
        this.element.id = `${this.type}-projects`;
    }
    listen() {
        projectState.addListener((pL) => {
            this.projects2Reder = pL.filter(p => this.type === 'active' ? p.status === projectStatus.Active : p.status === projectStatus.Finished);
            this.render();
        });
    }
    render() {
        this.uListElement.innerHTML = '';
        this.projects2Reder.forEach(p => {
            new ProjectItem(this.uListElement.id, p);
        });
    }
}
__decorate([
    autoBind
], ProjectList.prototype, "draggedOverHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "draggedDropHandler", null);
__decorate([
    autoBind
], ProjectList.prototype, "draggedLeaveHandler", null);
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
/*
  TASK I: CREATE CLASS  ProjectForm
    1.  It will handle collecting the user input from three inputs
    2.  It will validate the data from the three inputs
    3.  hostElement will be a div
    4.  firstElementChild gotten from template will be a form element

*/
//////////////      TOOLS       /////////////////////////////////////////////
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
function evaluate(title, description, people, required) {
    if (validate({
        value: title,
        required: required,
        minLength: 5,
        maxLength: 50
    }) && validate({
        value: description,
        required: required,
        minLength: 12,
        maxLength: 100
    }) && validate({
        value: people,
        required: required,
        min: 1,
        max: 10
    })) {
        return true;
    }
    alert('invalid input/s values');
}
function validate(p) {
    let isValid = true;
    if (p.required) {
        isValid = isValid && (p.value + '').trim().length != null;
    }
    if (typeof p.value === 'string') {
        if (p.minLength != null) {
            isValid = isValid && p.value.length >= p.minLength;
        }
        if (p.maxLength != null) {
            isValid = isValid && p.value.length <= p.maxLength;
        }
    }
    if (typeof p.value === 'number') {
        if (p.min != null) {
            isValid = isValid && p.value >= p.min;
        }
        if (p.max != null) {
            isValid = isValid && p.value <= p.max;
        }
    }
    return isValid;
}
////////////////////////////////////////////////////////////////////////////
class ProjectForm extends Base {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptiontextAreaElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
    submitHandler(event) {
        event.preventDefault();
        const title = this.titleInputElement.value;
        const description = this.descriptiontextAreaElement.value;
        const people = +this.peopleInputElement.value;
        this.render();
        const required = true;
        const id = Math.floor(Math.random() * 1000) + '';
        const evaluated = evaluate(title, description, people, required);
        if (evaluated) {
            projectState.addProject(new Project(id, title, description, people, projectStatus.Active));
        }
    }
    render() {
        this.titleInputElement.value = '';
        this.descriptiontextAreaElement.value = '';
        this.peopleInputElement.value = '';
    }
}
__decorate([
    autoBind
], ProjectForm.prototype, "submitHandler", null);
const projectForm = new ProjectForm();
