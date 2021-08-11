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
            <label :for="todo.id">{{ todo.title }} </label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input type="text" class="edit" />
        </li>
      </ul>
    </main>
    <footer class="footer" v-show="isShowFooter">
      <span class="todo-count">
        <strong> {{ activeTodos }}</strong> {{ activeTodos | pluralize }} left
      </span>
      <ul class="filters">
        <li>
          <a
            href="#/all"
            @click="setVisibility('all')"
            :class="{ selected: visibility === 'all' }"
            >All</a
          >
        </li>
        <li>
          <a
            href="#/active"
            @click="setVisibility('active')"
            :class="{ selected: visibility === 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a
            href="#/completed"
            @click="setVisibility('completed')"
            :class="{ selected: visibility === 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "your-todo-vue";

export default {
  data() {
    return {
      newTodo: "",
      todos: [],
      visibility: "all",
    };
  },

  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  },
  updated() {
    console.log("updated");
  },

  watch: {
    todos: {
      handler() {
        console.log("saveToStorage");
        this.saveStorage();
      },
      deep: true,
    },
  },

  methods: {
    addTodo() {
      // 阻擋空白輸入
      // trim方法 去除字串前後多餘空格
      const title = this.newTodo && this.newTodo.trim();
      if (!title) {
        return;
      }
      this.todos.push({ id: uuidv4(), title: this.newTodo, completed: false });
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
      // console.log(visibility);
      this.visibility = visibility;
    },

    removeCompleted() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },

    saveStorage() {
      console.log("saveStorage"); //測試完可刪
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
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

  filters: {
    pluralize(num) {
      if (num > 1) {
        return "items";
      } else {
        return "item";
      }
    },
  },
};
</script>

<style>
</style>