
/////////////////////////   TOOL   ///////////////////////////////////////
enum projectStatus {Active='active', Finished='finished'};
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

abstract class Base<T extends HTMLElement, U extends HTMLElement>{
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateElementId:string, hostElementId:string, insertAt:boolean, elementId?:string){
    this.templateElement = document.querySelector('#'+templateElementId)! as HTMLTemplateElement;
    this.hostElement = document.querySelector('#'+hostElementId)! as T;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild! as U;
    if(elementId){
      this.element.id = elementId;
    }
    this.attach(insertAt);
  }

  private attach(insert:boolean){
    this.hostElement.insertAdjacentElement(insert?'afterbegin':'beforeend', this.element);
  }
  abstract configure():void;
  abstract render():void;
}

/*
  TASK VI: CREATE CLASS ProjectItem
    1.  create class projectItem that will display an item when invoked
*/

class ProjectItem extends Base<HTMLUListElement, HTMLDataListElement>{
  h2Element: HTMLElement;
  h3Element: HTMLElement;
  pElement: HTMLParagraphElement;
  project: Project

  get peopleString(){
    return  this.project.people <= 1 ? '1 person' :`${this.project.people} persons`;
  }

  constructor(hostId: string, p: Project){
    super('single-project', hostId, false, p.id)
    this.project = p,
    this.h2Element =  this.element.querySelector('h2')! as HTMLElement;
    this.h3Element = this.element.querySelector('h3')! as HTMLElement;
    this.pElement = this.element.querySelector('p')! as HTMLParagraphElement;
    this.configure();
  }
  configure(){
    this.h2Element.innerText = this.project.title;
    this.h3Element.innerText = this.peopleString;
    this.pElement.innerText = this.project.description;
  }
  render(){}
}

/*
  TASK IV: CREATE CLASS  Project and Listener
    1.  classs Project will dynamically assign values to an instance
    2.  class Listener will manage a list of listeners and a method to add listeners
*/

/////////////////////////   TOOL   ///////////////////////////////////////
type listener<T> = (pL: T[]) => void;
////////////////////////////////////////////////////////////////////////////////

class Project{
  constructor(
    public id:string,
    public title: string,
    public description: string,
    public people: number,
    public status: projectStatus
  ){}
}

abstract class Listener<T>{
  protected listenersList: listener <T>[] = [];

  addListener(fn: listener <T>){
    this.listenersList[this.listenersList.length] = fn;
  }
}

/*
  TASK III: CREATE CLASS  ProjectState
    1.  It will have a field for a list of projects and a list of listener functions
    2.  It will add projects and it will add listeners to each list
*/

class ProjectState extends Listener<Project>{
  projectsList: Project[] = [];
  private static instance: ProjectState;

  static getInstance(){
    return this.instance = this.instance ? this.instance : new ProjectState();
  }
  addProject(p: Project){
    this.projectsList[this.projectsList.length] = p;
    const projectsArr = [...this.projectsList];
    this.listenersList.forEach(l => l(projectsArr));
  }
}

const projectState = ProjectState.getInstance();

////////////////////////////////////////////////////////////////////////////

/*
  TASK II: CREATE CLASS  ProjectList
    1.  It will handle collecting the user input from three inputs
    2.  It will list data goten from inputs
    3.  hostElement will be a div
    4.  firstElementChild gotten from template will be a section element

*/

class ProjectList extends Base<HTMLDivElement, HTMLElement>{
  uListElement: HTMLUListElement;
  h2Element: HTMLElement;
  projects2Reder: Project[] = [];


  constructor(private type: 'active' | 'finished'){
    super('project-list','app', false, `${type}-projects` );
    this.templateElement = document.querySelector('#project-list')! as HTMLTemplateElement;
    this.uListElement = this.element.querySelector('ul')! as HTMLUListElement;
    this.h2Element = this.element.querySelector('h2')! as HTMLElement;
    this.configure();
    this.listen();
  }

  configure(){
    this.uListElement.id = `${this.type}-projects-list`;
    this.h2Element.innerText = `${this.type.toUpperCase()} PROJECTS`;
    this.element.id = `${this.type}-projects`;
  }
  listen(){
    projectState.addListener((pL: Project[]) => {
      this.projects2Reder= pL.filter( p =>
        this.type === 'active' ? p.status === projectStatus.Active : p.status === projectStatus.Finished
      )
      this.render();
    })
  }
  render(){
    this.uListElement.innerHTML = '';
      this.projects2Reder.forEach(p => {
        new ProjectItem(this.uListElement.id, p);
      })
  }
}

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
function autoBind(_1: any, _2:string, descriptor: PropertyDescriptor){
  const originMethod = descriptor.value;
  const modedDescriptor = {
    configurable: true,
    enumerable: false,
    get(){
      return originMethod.bind(this);
    }
  }
  return modedDescriptor;
}

interface project {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function evaluate(title: string, description: string, people: number, required: boolean){
  if(validate({
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
  })){
    return true;
  }
  alert('invalid input/s values')
}

function validate(p: project){
  let isValid = true;
  if(p.required){
    isValid = isValid && (p.value + '').trim().length != null;
  }
  if(typeof p.value === 'string'){
    if(p.minLength != null){
      isValid = isValid && p.value.length >= p.minLength;
    }
    if(p.maxLength != null){
      isValid = isValid && p.value.length <= p.maxLength;
    }
  }
  if(typeof p.value === 'number'){
    if(p.min != null){
      isValid = isValid && p.value >= p.min;
    }
    if(p.max != null){
      isValid = isValid && p.value <= p.max;
    }
  }
  return isValid;
}
////////////////////////////////////////////////////////////////////////////


class ProjectForm extends Base<HTMLDivElement, HTMLFormElement>{

  titleInputElement: HTMLInputElement;
  descriptiontextAreaElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;

  constructor(){
    super('project-input', 'app', true, 'user-input');
    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptiontextAreaElement = this.element.querySelector('#description')! as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
    this.configure();
  }

  configure(){
    this.element.addEventListener('submit', this.submitHandler)
  }
  @autoBind
  private submitHandler(event: Event){
    event.preventDefault();
    const title = this.titleInputElement.value;
    const description = this.descriptiontextAreaElement.value;
    const people = +this.peopleInputElement.value;
    const required = true;
    const id = Math.floor(Math.random() * 1000) + '';
    this.render();
    const evaluated = evaluate(title, description, people, required);
    if(evaluated){
      projectState.addProject(new Project(id, title, description, people, projectStatus.Active))
    }
  }
  render(){
    this.titleInputElement.value = '';
    this.descriptiontextAreaElement.value = '';
    this.peopleInputElement.value = '';
  }
}

const projectForm = new ProjectForm();
