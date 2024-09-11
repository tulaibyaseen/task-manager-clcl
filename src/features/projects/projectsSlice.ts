import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Project, ProjectUser } from '../../types';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  assignedUsers: boolean;
}

const initialState: ProjectsState = {
  projects: [],
  assignedUsers: true,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

//get all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (page: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    console.log('role', role);

    try {
      if (role == 'admin') {
        const response = await axios.get(
          `http://192.168.1.5:8001/api/admin/projects/v1/admin/project?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('response33', response.data.data);

        return response?.data?.data;
      } else {
        const response = await axios.get(
          `http://192.168.1.5:8001/api/v1/project`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        return response.data.data;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // If the error is an Axios error and has a response, we can extract the message
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

//create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (
    project: { name: string; description: string; is_active: number },
    { rejectWithValue },
  ) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        'http://192.168.1.5:8001/api/admin/projects/v1/admin/project',
        project,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data; // Adjust according to actual API response structure
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);
//updating the project
export const updateProject = createAsyncThunk<
  Project,
  { id: number; name: string }
>('projects/updateProject', async ({ name, id }, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    console.log('idasssssss', id);

    const response = await axios.post(
      `http://192.168.1.5:8001/api/admin/projects/v1/admin/project/${id}?_method=patch`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
//deleting a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (userId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      console.log('userId', userId);

      await axios.delete(
        `http://192.168.1.5:8001/api/admin/projects/v1/admin/project/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateProjectUsers = createAsyncThunk(
  'projects/updateProjectUsers',
  async ({
    projectId,
    users,
    name,
  }: {
    projectId: number;
    users: number[];
    name: string;
  }) => {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `http://192.168.1.5:8001/api/admin/projects/v1/admin/project/${projectId}/assign`,
      { name, user_ids: users }, // Ensure the correct field is used here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setAssignedUsers(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.totalPages = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.projects.push(action.payload);
        },
      )
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.projects = state.projects.filter(
            (project) => project.project_id !== action.payload,
          );
        },
      )
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Error deleting Project';
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          // Update the specific project in the state
          const updatedProject = action.payload;
          state.projects = state.projects.map((project) =>
            project.project_id === updatedProject.project_id
              ? updatedProject
              : project,
          );
        },
      )
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? 'Error updating project';
      })
      .addCase(
        updateProjectUsers.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.assignedUsers = !state.assignedUsers;
        },
      );
  },
});

export const { setPage } = projectsSlice.actions;
export default projectsSlice.reducer;
