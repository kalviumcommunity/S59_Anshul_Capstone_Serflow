import { createSlice } from "@reduxjs/toolkit";
import data from "./../data/data.json";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: data.projects,
  },
    reducers: {
      addProject: (state, action) => {
        const isActive = state.length > 0 ? false : true;
        const payload = action.payload;
        const project = {
          name: payload.name,
          isActive,
          columns: [],
        };
        project.columns = payload.newColumns;
        return {
          ...state,
          projects: [...state.projects, project],
        };
      },
      editProject: (state, action) => {
        const payload = action.payload;
        const project = state.find((project) => project.isActive);
        project.name = payload.name;
        project.columns = payload.newColumns;
      },
      deleteProject: (state) => {
        const project = state.find((project) => project.isActive);
        state.splice(state.indexOf(project), 1);
      },
      setProjectActive: (state, action) => {
        const index = action.payload.index;
        state.projects.forEach((project, i) => {
          project.isActive = i === index;
        });
      },      
      addTask: (state, action) => {
        const { title, status, description, subtasks, newColIndex } =
          action.payload;
        const task = { title, description, subtasks, status };
        const project = state.find((project) => project.isActive);
        const column = project.columns.find(
          (col, index) => index === newColIndex
        );
        column.tasks.push(task);
      },
      editTask: (state, action) => {
        const {
          title,
          status,
          description,
          subtasks,
          prevColIndex,
          newColIndex,
          taskIndex,
        } = action.payload;
        const project = state.find((project) => project.isActive);
        const column = project.columns.find(
          (col, index) => index === prevColIndex
        );
        const task = column.tasks.find((task, index) => index === taskIndex);
        task.title = title;
        task.status = status;
        task.description = description;
        task.subtasks = subtasks;
        if (prevColIndex === newColIndex) return;
        column.tasks = column.tasks.filter(
          (task, index) => index !== taskIndex
        );
        const newCol = project.columns.find(
          (col, index) => index === newColIndex
        );
        newCol.tasks.push(task);
      },
      dragTask: (state, action) => {
        const { colIndex, prevColIndex, taskIndex } = action.payload;
        const project = state.find((project) => project.isActive);
        const prevCol = project.columns.find((col, i) => i === prevColIndex);
        const task = prevCol.tasks.splice(taskIndex, 1)[0];
        project.columns.find((col, i) => i === colIndex).tasks.push(task);
      },
      setSubtaskCompleted: (state, action) => {
        const payload = action.payload;
        const project = state.find((project) => project.isActive);
        const col = project.columns.find((col, i) => i === payload.colIndex);
        const task = col.tasks.find((task, i) => i === payload.taskIndex);
        const subtask = task.subtasks.find((subtask, i) => i === payload.index);
        subtask.isCompleted = !subtask.isCompleted;
      },
      setTaskStatus: (state, action) => {
        const payload = action.payload;
        const project = state.find((project) => project.isActive);
        const columns = project.columns;
        const col = columns.find((col, i) => i === payload.colIndex);
        if (payload.colIndex === payload.newColIndex) return;
        const task = col.tasks.find((task, i) => i === payload.taskIndex);
        task.status = payload.status;
        col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
        const newCol = columns.find((col, i) => i === payload.newColIndex);
        newCol.tasks.push(task);
      },
      deleteTask: (state, action) => {
        const payload = action.payload;
        const project = state.find((project) => project.isActive);
        const col = project.columns.find((col, i) => i === payload.colIndex);
        col.tasks = col.tasks.filter((task, i) => i !== payload.taskIndex);
      },
  },
});

export default projectSlice;

// Correction code Immer Redux tooklit 
// // import { createSlice } from "@reduxjs/toolkit";
// import data from "./../data/data.json";

// const projectSlice = createSlice({
//   name: "projects",
//   initialState: {
//     projects: data.projects,
//   },
//   reducers: {
//     addProject: (state, action) => {
//       const isActive = state.projects.length > 0 ? false : true;
//       const payload = action.payload;
//       const newProject = {
//         name: payload.name,
//         isActive,
//         columns: payload.newColumns,
//       };
//       return {
//         ...state,
//         projects: [...state.projects, newProject],
//       };
//     },
//     editProject: (state, action) => {
//       const payload = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       if (project) {
//         project.name = payload.name;
//         project.columns = payload.newColumns;
//       }
//     },
//     deleteProject: (state) => {
//       const index = state.projects.findIndex((project) => project.isActive);
//       if (index !== -1) {
//         state.projects.splice(index, 1);
//       }
//     },
//     setProjectActive: (state, action) => {
//       const index = action.payload.index;
//       state.projects.forEach((project, i) => {
//         project.isActive = i === index;
//       });
//     },
//     addTask: (state, action) => {
//       const { title, status, description, subtasks, newColIndex } = action.payload;
//       const task = { title, description, subtasks, status };
//       const project = state.projects.find((project) => project.isActive);
//       const column = project.columns[newColIndex];
//       column.tasks.push(task);
//     },
//     editTask: (state, action) => {
//       const { title, status, description, subtasks, prevColIndex, newColIndex, taskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const column = project.columns[prevColIndex];
//       const task = column.tasks[taskIndex];
//       if (task) {
//         task.title = title;
//         task.status = status;
//         task.description = description;
//         task.subtasks = subtasks;
//         if (prevColIndex !== newColIndex) {
//           column.tasks.splice(taskIndex, 1);
//           project.columns[newColIndex].tasks.push(task);
//         }
//       }
//     },
//     dragTask: (state, action) => {
//       const { colIndex, prevColIndex, taskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const prevColumn = project.columns[prevColIndex];
//       const task = prevColumn.tasks.splice(taskIndex, 1)[0];
//       project.columns[colIndex].tasks.push(task);
//     },
//     setSubtaskCompleted: (state, action) => {
//       const { colIndex, taskIndex, subtaskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const subtask = project.columns[colIndex].tasks[taskIndex].subtasks[subtaskIndex];
//       if (subtask) {
//         subtask.isCompleted = !subtask.isCompleted;
//       }
//     },
//     setTaskStatus: (state, action) => {
//       const { colIndex, taskIndex, status, newColIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const task = project.columns[colIndex].tasks[taskIndex];
//       if (task && colIndex !== newColIndex) {
//         project.columns[colIndex].tasks.splice(taskIndex, 1);
//         project.columns[newColIndex].tasks.push(task);
//       }
//       task.status = status;
//     },
//     deleteTask: (state, action) => {
//       const { colIndex, taskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const tasks = project.columns[colIndex].tasks;
//       if (taskIndex >= 0 && taskIndex < tasks.length) {
//         tasks.splice(taskIndex, 1);
//       }
//     },
//   },
// });

// export default projectSlice;
