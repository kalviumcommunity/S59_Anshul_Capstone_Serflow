import { createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'


// simple fetch but need to change it to fetch user _id based projects 
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/projects`
        ,{
          method: 'GET',
          credentials : 'include',
          headers: {
            'Authorization': 'Bearer ' + Cookies.get('token')
          },
        }
      );
      // console.log(`${import.meta.env.VITE_api_uri}/main/projects`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to fetch projects');
    }
  }
);

// add project code 
export const addProjectsAsync = createAsyncThunk(
  'projects/addProjectsAsync',
  async (payload) => {
    const isActive =  false 
    const project = {
      name: payload.name,
      isActive,
      columns: payload.newColumns,
    };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project`, {
        method: 'POST',
        credentials : 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(project)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to add project');
    }
  }
);

// Edit project redux thunk
export const editProjectsAsync = createAsyncThunk(
  'projects/editProjectsAsync',
  async (payload, {getState}) => { 
    const state = getState();
  // console.log(state) 
    
    const project = state.projects.projects.find((project) => project.isActive);
    if (project) {
      const updatedProject = {
        ...project,
        name: payload.name,
        columns: payload.newColumns
      };
    // console.log("OK till here", updatedProject, payload);
    // console.log(`>>> ${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`)
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to Edit project');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to Edit project');
    }
  }
}
);

// Delete project redux thunk
export const deleteProjectsAsync = createAsyncThunk(
  'projects/deleteProjectsAsync',
  async (payload, {getState}) => {
    const state = getState();
    const project = state.projects.projects.find((project) => project.isActive);
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${project._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token')
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to delete project');
    }
  }
);

// Add task redux thunk
export const addTaskAsync = createAsyncThunk(
  'projects/addTaskAsync',
  async (payload, {getState}) => {
    const state = getState();
    const { title, status, description, newColIndex } = payload;
    const subtasks = payload.Subtasks;
    const task = { title, description, subtasks, status };
    
    const activeProject = state.projects.projects.find((project) => project.isActive);
    const column = activeProject.columns[newColIndex];

    const updatedTasks = [...column.tasks, { ...task }];
    const updatedColumn = { ...column, tasks: updatedTasks };

    const   updatedProject = {
      ...activeProject,
      columns: activeProject.columns.map((col, index) =>
        index === newColIndex ? updatedColumn : col
      ),
    };


    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to add task');
    }
  }
);

// Add task redux thunk
export const editTaskAsync = createAsyncThunk(
  'projects/editTaskAsync',
  async (payload, {getState}) => {
    const state = getState();
    const { title, status, description, Subtasks, prevColIndex, newColIndex, taskIndex } = payload;
    const project = { ...state.projects.projects.find((project) => project.isActive) };
    const columns = project.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => ({ ...task }))
    }));
    const task = { ...columns[prevColIndex].tasks[taskIndex], title, status, description, subtasks: Subtasks };

    if (prevColIndex !== newColIndex) {

      columns[prevColIndex].tasks = columns[prevColIndex].tasks.filter((_, index) => index !== taskIndex);
      columns[newColIndex].tasks = [...columns[newColIndex].tasks, task];
    } else {
      columns[prevColIndex].tasks[taskIndex] = task;
    }
    const updatedProject = { ...project, columns };

    // console.log(updatedProject);
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to edit task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to edit task');
    }
  }
);

// drag task redux thunk
export const dragTaskAsync = createAsyncThunk(
  'projects/dragTaskAsync',
  async (payload, {getState}) => {
    const state = getState();
    const { colIndex, taskIndex, prevColIndex } = payload;
    const activeProject = state.projects.projects.find((project) => project.isActive);
    const prevColumn = activeProject.columns[prevColIndex];
    const newColumn = activeProject.columns[colIndex];
    const task = {...prevColumn.tasks[taskIndex],status : newColumn.name};
    const updatedPrevTasks = prevColumn.tasks.filter((task, index) => index !== taskIndex);
    const updatedNewTasks = [...newColumn.tasks, { ...task }];
    const updatedPrevColumn = { ...prevColumn, tasks: updatedPrevTasks };
    const updatedNewColumn = { ...newColumn, tasks: updatedNewTasks };
    const updatedColumns = activeProject.columns.map((col, index) =>
      index === prevColIndex ? updatedPrevColumn : index === colIndex ? updatedNewColumn : col
    );
    const updatedProject = { ...activeProject, columns: updatedColumns };

    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to drag task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to drag task');
    }
  }
);

// Set subtask complete redux thunk
export const setSubtaskCompleteAsync = createAsyncThunk(
  'projects/setSubtaskCompleteAsync',
  async (payload, {getState}) => {
    const state = getState();
    const { colIndex, taskIndex, index } = payload;
    
    // Clone the active project and relevant structures
    const activeProject = { ...state.projects.projects.find((project) => project.isActive) };
    const columns = activeProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => ({
        ...task,
        subtasks: task.subtasks.map(subtask => ({ ...subtask }))
      }))
    }));

    const subtask = columns[colIndex].tasks[taskIndex].subtasks[index];

    // Toggle the completion status of the subtask
    if (subtask) {
      subtask.isCompleted = !subtask.isCompleted;
    }

    const updatedProject = { ...activeProject, columns };

    // console.log(updatedProject);
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to drag task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to drag task');
    }
  }
)

// Set task Status
export const setTaskStatusAsync = createAsyncThunk(
  'projects/setTaskStatusAsync',
  async (payload, {getState}) => {
    const state = getState();
    const activeProject = { ...state.projects.projects.find((project) => project.isActive) };
    const { colIndex, taskIndex, status, newColIndex } = payload;

    const columns = activeProject.columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => ({ ...task }))
    }));

    const task = columns[colIndex].tasks[taskIndex];

    if (task && colIndex !== newColIndex) {
      columns[colIndex].tasks.splice(taskIndex, 1);
      columns[newColIndex].tasks.push(task);
      task.status = status;
    }

    const updatedProject = { ...activeProject, columns };
  // console.log(updatedProject)
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to drag task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to drag task');
    }
  }
)

// delete task redux thunk
export const deleteTaskAsync = createAsyncThunk(
  'projects/deleteTaskAsync',
  async (payload, { getState }) => {
    const state = getState();
    const { colIndex, taskIndex } = payload;

    const activeProject = { ...state.projects.projects.find((project) => project.isActive) };

    const columns = activeProject.columns.map((column, index) => {
      if (index === colIndex) {
        return {
          ...column,
          tasks: column.tasks.filter((_, idx) => idx !== taskIndex)
        };
      }
      return column;
    });

    const updatedProject = { ...activeProject, columns };
    // console.log(updatedProject)
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/project/${updatedProject._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('token')
        },
        body: JSON.stringify(updatedProject)
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  }
);

// set project active redux  thunk
