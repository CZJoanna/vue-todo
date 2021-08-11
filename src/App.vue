<template>
  <section class="todoapp">
    <header>
      <h1>todos</h1>
    </header>

    <input
      type="text"
      class="new-todo"
      autofocus
      placeholder="需要做什麼？"
      v-model="newTodo"
      @keyup.enter="addTodo"
    />

    <main>
      <input id="toggle-all" type="checkbox" class="toggle-all" />
      <label for="toggle-all" @click="handleClick"></label>
      <ul class="todo-list">
        <li
          class="todo"
          :class="{ completed: todo.completed }"
          v-for="todo in filteredTodos"
          :key="todo.id"
        >
          <div class="view">
            <input
              :id="todo.id"
              type="checkbox"
              class="toggle"
              v-model="todo.completed"
            />
            <label :for="todo.id">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input type="text" class="edit" />
        </li>
      </ul>
    </main>
    <footer class="footer" v-show="isShowFooter">
      <span class="todo-count">
        <strong> {{ activeTodos }}</strong> items left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" @click="setVisibility('all')">All</a>
        </li>
        <li>
          <a href="#/active" @click="setVisibility('active')">Active</a>
        </li>
        <li>
          <a href="#/completed" @click="setVisibility('completed')"
            >Completed</a
          >
        </li>
      </ul>
      <button class="clear-completed">Clear completed</button>
    </footer>
  </section>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  data() {
    return {
      newTodo: null,
      todos: [
        { id: uuidv4(), title: "學習 Vue Template", completed: false },
        {
          id: uuidv4(),
          title: "學習在 Vue Template 中進行條件判斷",
          completed: true,
        },
        { id: uuidv4(), title: "中使用迴圈", completed: true },
      ],
      visibility: "all",
    };
  },

  methods: {
    addTodo() {
      const todo = { id: uuidv4(), title: this.newTodo, completed: false };
      this.todos.push(todo);
      this.newTodo = null;
    },

    removeTodo(e) {
      this.todos.filter((todo) => {
        if (todo.id === e.id) {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
        }
      });
      //  or 這樣寫 //增加這裡
      // this.todos = this.todos.filter(_todo => _todo.id !== todo.id)
    },

    handleClick() {
      console.log("click");
    },

    setVisibility(visibility) {
      console.log(visibility);
      this.visibility = visibility;
    },
  },

  computed: {
    isShowFooter() {
      if (this.todos.length) {
        return true;
      } else {
        return false;
      }
    },

    activeTodos() {
      return this.todos.filter((todo) => todo.completed === false).length;
    },

    filteredTodos() {
      const v = this.visibility;
      let filters = [];

      // 全部
      if (v === "all") {
        filters = this.todos;

        // 未完成
      } else if (v === "active") {
        filters = this.todos.filter((todo) => !todo.completed);

        // 已完成
      } else if (v === "completed") {
        filters = this.todos.filter((todo) => todo.completed);
      }

      return filters;
    },
  },
};
</script>

<style>
</style>