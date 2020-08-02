import events from "./pubSub.js";

class Todo {
    constructor(title, description, dueDate, priority, notes, id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.id = id;
        this.check = false;
    }
}

class TodoProject {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }
    addTodo(title, description, dueDate, priority, notes, id) {
        const todo = new Todo(title, description, dueDate, priority, notes, id);
        this.todos.push(todo);
    }
}

export { TodoProject }
