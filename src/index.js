import { TodoProject, Todo } from "./todo.js";
import { Ui } from "./todoUI.js";
import { events } from "./pubSub.js";
import { storage } from "./localStorageManager.js";

window.onload = (() => {
    Ui();
    const app = (() => {
        const todoProjects = [];
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
        const poputaleProjects = (() => {
            for (let i = 0; i < localStorage.length; i++) {
                const object = JSON.parse(localStorage.getItem(`project${i}`));
                const project = new TodoProject(object.name);
                object.todos.forEach(todo => {
                    project.addTodo(todo.title, todo.description, todo.dueDate, todo.priority, todo.notes, todo.id);
                });
                todoProjects.push(project)
                console.log(project)

            }
        })()
        const appEvents = (() => {
            events.on("addProjectRequest", addProject)
            events.on("addTaskRequest", createTodo)

        })()
        events.emit("projectsChanged", todoProjects);
    })()




})()

