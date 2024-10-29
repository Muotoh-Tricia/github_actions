import { defineStore } from "pinia";

export const useTodoStore = defineStore('todo', {
    state: () => ({
        todos: [],
    }),

    actions: {
        addTodo(todo){
            if(!todo || !todo.value) return;
            this.todos.push(todo);
            this.saveTodos();
            // return todo;
        },

        deleteTodo(index){
            this.todos.splice(index, 1)
            this.saveTodos();
        },

        editTodo(index, newValue){
            this.todos[index].value = newValue;
            this.saveTodos()
        },

        toggleCompleted(index){
            this.todos[index].completed = !this.todos[index].completed
        }, 

        loadTodosFromStorage(){
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                this.todos = JSON.parse(savedTodos)
            }
        },

        saveTodos(){
            localStorage.setItem('todos', JSON.stringify(this.todos))
        }
    }
})