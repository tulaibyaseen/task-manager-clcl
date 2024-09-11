import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types';

interface UsersState {
  users: User[];
  allUsers: User[]; // For storing all users without pagination
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  allUsers: [],
  loading: false,
  error: null,
};

// Fetch users without pagination
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(
        'http://192.168.1.5:8001/api/admin/v1/admin/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data.data; // Return the users list
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const initialResponse = await axios.get(
        'http://192.168.1.5:8001/api/admin/v1/admin/user',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const allUsers = initialResponse.data.data;

      return allUsers;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Thunk for creating a user
export const createUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string; role: string },
  { rejectValue: string }
>('users/createUser', async (newUser, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.post(
      'http://192.168.1.5:8001/api/admin/v1/admin/user',
      newUser,
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

// Thunk for updating a user
export const updateUser = createAsyncThunk<
  User,
  { id: number; name: string; email: string },
  { rejectValue: string }
>('users/updateUser', async ({ id, name, email }, { rejectWithValue }) => {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.post(
      `http://192.168.1.5:8001/api/admin/v1/admin/user/${id}?_method=patch`,
      { name, email },
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

// Thunk for deleting a user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(
        `http://192.168.1.5:8001/api/admin/v1/admin/user/${userId}`,
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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload; // Assign users from API
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload; // Assign all users without pagination
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.users = state.users.filter((user) => user.id !== action.payload); // Remove deleted user
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = (action.payload as string) ?? 'Error deleting user';
      });
  },
});

export default usersSlice.reducer;
