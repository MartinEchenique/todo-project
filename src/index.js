import { TodoProject, Todo } from "./todo.js";
import { Ui } from "./todoUI.js";
import { events } from "./pubSub.js";
window.onload = (() => {
    Ui();
    const app = (() => {
        let firstProject = new TodoProject("Test");
        firstProject.addTodo("TITLE1", "Description", "Date", "Low", "Notes", 0);
        firstProject.addTodo("TITLE2", "Description", "Date", "High", "Notes", 1);
        firstProject.addTodo("TITLE1", "Description", "Date", "Low", "Notes", 0);
        firstProject.addTodo("TITLE2", "Description", "Date", "Medium", "Notes", 1);

        const todoProjects = [];
        todoProjects.push(firstProject)
        events.emit("projectsChanged", todoProjects);

        const addProject = (project) => {
            const projectToAdd = new TodoProject(project.name);
            todoProjects.push(projectToAdd);
            events.emit("projectsChanged", todoProjects);
        }
        const createTodo = (object) => {
            let index = object.projectIndex;
            todoProjects[index].addTodo(object.title, object.description, object.dueDate, object.priority, object.notes, object.id);
            events.emit("projectsChanged", todoProjects);
        }

        const appEvents = (() => {
            events.on("addProjectRequest", addProject)
            events.on("addTaskRequest", createTodo)

        })()


    })()



})()

