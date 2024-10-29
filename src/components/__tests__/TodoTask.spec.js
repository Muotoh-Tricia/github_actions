import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import TodoDetails from "@/TodoDetails.vue";
import { useTodoStore } from "@/stores/todoStore";

// describe is used to group related tests
describe("TodoDetails component", () => {
  let wrapper, todoStore;

  //  beforeEach and afterEach set up and clean up before and after each test.
  beforeEach(() => {
    setActivePinia(createPinia());
    todoStore = useTodoStore();
    wrapper = mount(TodoDetails, {
      global: {
        plugins: [createPinia()],
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  // it method defines a single test case
  it("adds a new todo item when addItem is called", async () => {
    todoStore.addTodo({
      id: 1,
      value: "New task",
      completed: false,
    });

    // verify todo was added to the store
    expect(todoStore.todos).toHaveLength(1); //expect is used for assertions i.e checking if conditions are met
    expect(todoStore.todos[0].value).toBe("New task");
  });

  it("does not add an empty todo item", async () => {
    wrapper.vm.userInput = ""; // vm allows us to have access to the component instance
    await wrapper.find(".btn-success").trigger("click");
    expect(todoStore.todos.length).toBe(0);
  });

  it("editing an exisiting todo item", async () => {
    todoStore.addTodo({
      id: 1,
      value: "Edit Task",
      completed: false,
    });

    wrapper.vm.editItem(0);
    await wrapper.vm.$nextTick();

    expect(todoStore.todos[0].value).toBe("Edit Task");
  });

  it("delete a todo item when deleteItem is called", async () => {
    // vi is a vitest object for mocking function, which is useful for simulating behaviours (eg, browser confirmations).
    window.confirm = vi.fn(() => true); //mock confirm dialog
    wrapper.vm.deleteItem(0);

    expect(todoStore.todos.length).toBe(0);
  });

  // Assignment
  //write test cases for toggleCompleted and loadTodoFromStorage

  // test case for toggleCompleted
  it("toggle a todo when item is completed", async () => {
    todoStore.addTodo({
      id: 1,
      value: "Toggle Task",
      completed: false,
    });

    expect(todoStore.todos).toHaveLength(1);
    expect(todoStore.todos[0].completed).toBe(false) ||
      todoStore.todos[0].completed.toBe(true);
  });

  // test case for loadTodoFromLocalStorage
  it("loads todos from storage when loadTodoFromStorage is called", async () => {
    const mockTodos = JSON.stringify([
      { id: 1, value: "Mock Task", completed: false },
      { id: 2, value: "Another Task", completed: true },
    ]);
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(mockTodos),
    });
    todoStore.loadTodosFromStorage();
    // Assert that todos are loaded correctly
    expect(todoStore.todos).toHaveLength(2);
    expect(todoStore.todos[0].value).toBe("Mock Task");
    expect(todoStore.todos[1].completed).toBe(true);
  });


  
});
