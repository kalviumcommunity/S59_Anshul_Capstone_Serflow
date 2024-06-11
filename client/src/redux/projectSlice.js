import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from 'react-redux';
import { fetchProjects, addProjectsAsync, editProjectsAsync, deleteProjectsAsync, addTaskAsync, dragTaskAsync, editTaskAsync, setSubtaskCompleteAsync, setTaskStatusAsync, deleteTaskAsync } from './thunk';
import data from "./../data/data.json";


const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
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
      const project = state.projects.find((project) => project.isActive);
      if (project) {
        project.name = payload.name;
        project.columns = payload.newColumns;
      }
    },
    deleteProject: (state) => {
      const index = state.projects.findIndex((project) => project.isActive);
      if (index !== -1) {
        state.projects.splice(index, 1);
      }
    },
    setProjectActive: (state, action) => {
      const index = action.payload.index;
      state.projects.forEach((project, i) => {
        project.isActive = i === index;
      });
    },
    addTask: (state, action) => {
      const { title, status, description, newColIndex } = action.payload;
      const subtasks = action.payload.Subtasks;
      const task = { title, description, subtasks, status };
    
      // Find the active project and the corresponding column
      const activeProject = state.projects.find((project) => project.isActive);
      const column = activeProject.columns[newColIndex];
    
      // Create a new array of tasks for the column
      const updatedTasks = [...column.tasks, { ...task }];
    
      // Create a new copy of the column with updated tasks
      const updatedColumn = { ...column, tasks: updatedTasks };
    
      // Create a new copy of the project with updated column
      const   updatedProject = {
        ...activeProject,
        columns: activeProject.columns.map((col, index) =>
          index === newColIndex ? updatedColumn : col
        ),
      };
    
      // new array of projects with updated project - Don't direfctly maniplute the state (dosen't work)
      const updatedProjects = state.projects.map((project) =>
        project.isActive ? updatedProject : project
      );
    
      // Return a new state object with updated projects
      console.log(updatedProject)
      return {
        ...state,
        projects: updatedProjects,
      };
    },
    editTask: (state, action) => {
      const { title, status, description, Subtasks, prevColIndex, newColIndex, taskIndex } = action.payload;
      const project = state.projects.find((project) => project.isActive);
      const column = project.columns[prevColIndex];
      const task = column.tasks[taskIndex];
      console.log(Subtasks)
      if (task) {
        task.title = title;
        task.status = status;
        task.description = description;
        task.subtasks = Subtasks;
        if (prevColIndex !== newColIndex) {
          column.tasks.splice(taskIndex, 1);
          project.columns[newColIndex].tasks.push(task);
        }
      }
    }, 
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const project = state.projects.find((project) => project.isActive);
      const prevCol = project.columns.find((col, i) => i === prevColIndex);
      const task = prevCol.tasks.splice(taskIndex, 1)[0];
      project.columns.find((col, i) => i === colIndex).tasks.push(task);
    },
    setSubtaskCompleted: (state, action) => {
      const { colIndex, taskIndex, index } = action.payload;
      const project = state.projects.find((project) => project.isActive);
      const subtask = project.columns[colIndex].tasks[taskIndex].subtasks[index];
      if (subtask) {
        subtask.isCompleted = !subtask.isCompleted;
      }
    },
    setTaskStatus: (state, action) => {
      const { colIndex, taskIndex, status, newColIndex } = action.payload;
      const project = state.projects.find((project) => project.isActive);
      const task = project.columns[colIndex].tasks[taskIndex];
      if (task && colIndex !== newColIndex) {
        project.columns[colIndex].tasks.splice(taskIndex, 1);
        project.columns[newColIndex].tasks.push(task);
      }
      task.status = status;
    },
    deleteTask: (state, action) => {
      const { colIndex, taskIndex } = action.payload;
      const project = state.projects.find((project) => project.isActive);
      const tasks = project.columns[colIndex].tasks;
      if (taskIndex >= 0 && taskIndex < tasks.length) {
        tasks.splice(taskIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
    // Fetch Project actions
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // console.log(action.payload)
      })

    // Add Project actions
      .addCase(addProjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = [...state.projects, action.payload];
        // console.log(state.projects)
      })
      .addCase(addProjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Edit Project actions
      .addCase(editProjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);
        if (index !== -1) {
          state.projects[index] = updatedProject; // Update the project in the state
        }
        console.log("Project updated successfully");
      })
      .addCase(editProjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // console.log(action.error.message)
      })

      // Delete Project actions
      .addCase(deleteProjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        const deletedProject = action.payload;
        state.projects = state.projects.filter(project => project._id !== deletedProject._id);
      })
      .addCase(deleteProjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // add task actions
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Task added successfully");
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // drag task actions
      .addCase(dragTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dragTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Task dragged successfully");
      })
      .addCase(dragTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })

      // edit task actions
      .addCase(editTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Task edited successfully");
      })
      .addCase(editTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // set subtask complete
      .addCase(setSubtaskCompleteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setSubtaskCompleteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Subtask Toggled successfully");
      })
      .addCase(setSubtaskCompleteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // set subtask complete
      .addCase(setTaskStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setTaskStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Task Status changed successfully");
      })
      .addCase(setTaskStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Task actions
      .addCase(deleteTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project._id === updatedProject._id);  
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        console.log("Task deleted successfully")
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

  }
});


export default projectSlice;


// WORKING BACKUP
// import { createSlice } from "@reduxjs/toolkit";
// import data from "./../data/data.json";

// const projectSlice = createSlice({
//   name: "projects",
//   initialState: {
//     projects: data.projects,
//   },
//   reducers: {
//     addProject: (state, action) => {
//       const isActive = state.length > 0 ? false : true;
//       const payload = action.payload;
//       const project = {
//         name: payload.name,
//         isActive,
//         columns: [],
//       };
//       project.columns = payload.newColumns;
//       return {
//         ...state,
//         projects: [...state.projects, project],
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
//       const { title, status, description, newColIndex } = action.payload;
//       const subtasks = action.payload.Subtasks;
//       const task = { title, description, subtasks, status };
    
//       // Find the active project and the corresponding column
//       const activeProject = state.projects.find((project) => project.isActive);
//       const column = activeProject.columns[newColIndex];
    
//       // Create a new array of tasks for the column
//       const updatedTasks = [...column.tasks, { ...task }];
    
//       // Create a new copy of the column with updated tasks
//       const updatedColumn = { ...column, tasks: updatedTasks };
    
//       // Create a new copy of the project with updated column
//       const updatedProject = {
//         ...activeProject,
//         columns: activeProject.columns.map((col, index) =>
//           index === newColIndex ? updatedColumn : col
//         ),
//       };
    
//       // Create a new array of projects with updated project
//       const updatedProjects = state.projects.map((project) =>
//         project.isActive ? updatedProject : project
//       );
    
//       // Return a new state object with updated projects
//       console.log(updatedProject)
//       return {
//         ...state,
//         projects: updatedProjects,
//       };
//     },
//     editTask: (state, action) => {
//       const { title, status, description, Subtasks, prevColIndex, newColIndex, taskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const column = project.columns[prevColIndex];
//       const task = column.tasks[taskIndex];
//       console.log(Subtasks)
//       if (task) {
//         task.title = title;
//         task.status = status;
//         task.description = description;
//         task.subtasks = Subtasks;
//         if (prevColIndex !== newColIndex) {
//           column.tasks.splice(taskIndex, 1);
//           project.columns[newColIndex].tasks.push(task);
//         }
//       }
//     }, 
//     dragTask: (state, action) => {
//       const { colIndex, prevColIndex, taskIndex } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const prevCol = project.columns.find((col, i) => i === prevColIndex);
//       const task = prevCol.tasks.splice(taskIndex, 1)[0];
//       project.columns.find((col, i) => i === colIndex).tasks.push(task);
//     },
//     setSubtaskCompleted: (state, action) => {
//       const { colIndex, taskIndex, index } = action.payload;
//       const project = state.projects.find((project) => project.isActive);
//       const subtask = project.columns[colIndex].tasks[taskIndex].subtasks[index];
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
//   }
// });

// export default projectSlice;



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
