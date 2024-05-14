import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_api_uri}/main/projects`);
      console.log(`${import.meta.env.VITE_api_uri}/main/projects`)
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
        headers: {
          'Content-Type': 'application/json'
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
