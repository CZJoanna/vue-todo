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
      @keypress.enter="addTodo"
    />

    <main>
      <input id="toggle-all" type="checkbox" class="toggle-all" />
      <label for="toggle-all" @click="handleClick"></label>
      <ul class="todo-list">
        <li
          class="todo"
          :class="{
            completed: todo.completed,
            editing: todo.id === currentEditTodo.id,
          }"
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
            <label :for="todo.id" @dblclick="editTodo(todo)"
              >{{ todo.title }}
            </label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            type="text"
            class="edit"
            autofocus
            v-model="currentEditTodo.title"
            @keypress.esc="cancelEdit"
            @keypress.enter="doneEdit"
            @blur="doneEdit"
          />
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
// import { v4 as uuidv4 } from "uuid";
import { apiHelper } from "./utils/helper";

const STORAGE_KEY = "your-todo-vue";

export default {
  data() {
    return {
      newTodo: "",
      todos: [],
      visibility: "all",
      currentEditTodo: "",
    };
  },

  mounted() {
    // console.log("mounted");
    //存在瀏覽器
    // this.todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    //資料庫來的
    this.fetchData();
  },

  watch: {
    todos: {
      handler() {
        this.saveStorage();
      },
      deep: true,
    },
  },

  methods: {
    fetchData() {
      apiHelper
        .get("/")
        .then((res) => {
          if (res.status === 200) {
            // console.log(res.data);
            this.todos = res.data.map((todo) => {
              if (todo.completed === 0) {
                return { ...todo, completed: false };
              } else {
                return { ...todo, completed: true };
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addTodo() {
      // 阻擋空白輸入
      // trim方法 去除字串前後多餘空格
      const title = this.newTodo && this.newTodo.trim();
      if (!title) {
        return;
      }
      // this.todos.push({ id: uuidv4(), title: this.newTodo, completed: false });
      apiHelper
        .post("/", { title: this.newTodo, completed: false })
        .then((res) => {
          console.log(res);
          this.newTodo = null;
          this.fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    removeTodo(e) {
      // this.todos.filter((todo) => {
      //   if (todo.id === e.id) {
      //     const index = this.todos.indexOf(todo);
      //     this.todos.splice(index, 1);
      //   }
      // });
      //  or 這樣寫 //增加這裡
      // this.todos = this.todos.filter(_todo => _todo.id !== todo.id)

      apiHelper.delete("/", { data: { id: e.id } }).then((res) => {
        console.log(res);
        this.fetchData();
      });
    },

    editTodo(todo) {
      this.currentEditTodo = { ...todo };
    },

    cancelEdit() {
      this.currentEditTodo = {};
    },

    doneEdit() {
      this.todos = this.todos
        .map((todo) => {
          if (todo.id == this.currentEditTodo.id) {
            return { ...this.currentEditTodo };
          } else {
            return todo;
          }
        })
        .filter((todo) => todo.title.trim());
      this.currentEditTodo = {};
    },

    handleClick() {
      console.log("試串API");
    },

    setVisibility(visibility) {
      this.visibility = visibility;
    },

    removeCompleted() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },

    saveStorage() {
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