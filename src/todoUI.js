import { events } from "./pubSub.js";
function Ui() {

    const cacheHTML = (() => {
        let selectedId = 0;
        const AddTaskForm = document.getElementById("add-task-form");
        const addProjectFormInput = (() => {
            const name = document.getElementById("projectName");
            return { name }
        })()

        const AddProjectForm = document.getElementById("add-project-form");
        const addTaskFormInput = (() => {
            const title = document.getElementById("todoTitle");
            const description = document.getElementById("todoDescription");
            const dueDate = document.getElementById("todoDueDate");
            const priority = document.getElementById("todoPriority");
            const notes = document.getElementById("todoNotes");
            const id = document.getElementById("todoId");


            return { title, description, dueDate, priority, notes, id }
        })()
        return { AddTaskForm, addTaskFormInput, AddProjectForm, addProjectFormInput, selectedId }
    })()


    const renderProjects = (todoProjects) => {
        const projectsContainer = document.getElementById("project-container");
        projectsContainer.innerHTML = "";
        todoProjects.forEach((project, i) => {
            const container = document.createElement("div");
            container.setAttribute("data", i);
            container.classList.add("project");
            if (cacheHTML.selectedId === i) { container.classList.add("selectedProject"); renderProjectSelected(project.todos); }
            const title = document.createElement("h3");
            title.textContent = project.name
            container.appendChild(title);
            const todoContainer = document.createElement("div");
            todoContainer.setAttribute("class", "todo-list")
            todoContainer.style.display = "none";
            const todoList = document.createElement("ul");
            project.todos.length != 0 ? project.todos.forEach(todo => todoList.appendChild(createTodoElement(todo))) :
                todoContainer.textContent = "There isn't any To-Do in this project.";
            todoContainer.appendChild(todoList)
            const hiddenBtn = document.createElement("button");
            hiddenBtn.setAttribute("type", "button");
            hiddenBtn.addEventListener("click", (e) => { setHidden(todoContainer); e.stopPropagation(); })
            hiddenBtn.textContent = "Show"
            container.appendChild(hiddenBtn);
            container.appendChild(todoContainer);
            projectsContainer.appendChild(container);
            container.addEventListener("click", (e) => {
                document.querySelector(".selectedProject").classList.remove("selectedProject");
                cacheHTML.selectedId = +e.currentTarget.getAttribute("data");
                e.currentTarget.classList.add("selectedProject");
                renderProjectSelected(project.todos)
            })
        });
    }
    const renderProjectSelected = (project) => {
        const projectSelectedContainer = document.getElementById("project-selected-info");
        projectSelectedContainer.innerHTML = "";
        const addOnlyText = (element, parent) => {
            const elementContainer = document.createElement("li");
            if (element != "") {
                elementContainer.textContent = element;
                parent.appendChild(elementContainer)
            }
        }
        const onDoneProject = (todoDiv) => {
            todoDiv.style.backgroundColor = "grey";

        }
        if (project.length != 0) {
            project.forEach((projectSelected, i) => {

                const todoDiv = document.createElement("div");
                const editBtn = document.createElement("button");
                editBtn.classList.add("edit-button")
                const todoTitle = document.createElement("h3");
                const todoAttList = document.createElement("ul");
                const checkLabel = document.createElement("label");
                checkLabel.setAttribute("for", `task-${i}-completed`);
                checkLabel.textContent = "Done";
                const todoCheck = document.createElement("input");
                todoCheck.setAttribute("type", "checkbox");
                todoCheck.setAttribute("id", `task-${i}-completed`);
                todoCheck.addEventListener("change", () => (onDoneProject(todoDiv)));
                todoDiv.classList.add("todo-div")
                checkLabel.textContent = "Done";
                todoTitle.textContent = projectSelected.title;
                addOnlyText(projectSelected.description, todoAttList)
                addOnlyText(projectSelected.dueDate, todoAttList)
                addOnlyText(projectSelected.notes, todoAttList)
                addOnlyText(projectSelected.priority, todoAttList)
                todoDiv.appendChild(editBtn);

                todoDiv.appendChild(todoTitle);
                todoDiv.appendChild(todoAttList);
                todoDiv.appendChild(checkLabel);

                todoDiv.appendChild(todoCheck);
                projectSelectedContainer.appendChild(todoDiv);
                switch (projectSelected.priority) {
                    case "High":
                        todoDiv.style.backgroundColor = "#ff00006e"
                        break;
                    case "Medium":
                        todoDiv.style.backgroundColor = "#ffe565ad"

                        break;
                    case "Low":
                        todoDiv.style.backgroundColor = "#00ff006e"

                        break;
                }

            });
        }
    }

    const createTodoElement = (todo) => {
        const title = document.createElement("li");
        title.textContent = todo.title;

        return title;
    }
    const setHidden = (element, visible = "flex", hidden = "none") => {
        window.getComputedStyle(element).display === hidden ? element.style.display = visible : element.style.display = hidden;
    }
    const requestAddTask = () => {
        const form = cacheHTML.addTaskFormInput;
        const valid = validateImput(form.title, "Title is required")
        const obj = {
            title: form.title.value,
            description: form.description.value,
            dueDate: form.dueDate.value,
            priority: form.priority.value,
            notes: form.notes.value,
            id: form.id.value,
            projectIndex: cacheHTML.selectedId
        }
        events.emit("addTaskRequest", obj)
    }
    const requestAddProject = () => {

        const form = cacheHTML.addProjectFormInput;
        const valid = validateImput(form.name, "Name is required")
        if (valid) {
            const project = {
                name: form.name.value
            }
            events.emit("addProjectRequest", project);
        }

    }
    const validateImput = (imputCamp, msg = "Camps Required", condition = "") => {
        if (imputCamp.value != condition) {
            imputCamp.style.borderColor = "black"
            return true
        }
        else {
            imputCamp.style.borderColor = "red";
            alert(msg)
            return false
        }
    }
    const setEvents = (() => {
        events.on("projectsChanged", renderProjects);
        document.getElementById("add-task").addEventListener("click", () => { setHidden(cacheHTML.AddTaskForm) })
        document.getElementById("finishAddTask").addEventListener("click", (e) => { requestAddTask(e); })
        document.getElementById("add-project").addEventListener("click", () => { setHidden(cacheHTML.AddProjectForm) })
        document.getElementById("finishAddProject").addEventListener("click", (e) => { requestAddProject(); })

    })()


}

export { Ui }