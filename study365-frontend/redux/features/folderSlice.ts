import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../axios.config';

interface DataFolder {
    parentId?: number,
    folderId?: number,
    name?: string,
}


export const getFoldersByParent = createAsyncThunk('/folder/getSubFolder/:parentId', async (parentId: number, thunkAPI) => {
    try {
        let endpointBase = '/folder/getSubFolder';
        if (parentId > 0) {
            endpointBase += `/${parentId}`;
        }
        const response = await axiosConfig.get(endpointBase);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const createFolder = createAsyncThunk('/folder/create/:parentId?', async (data: DataFolder, thunkAPI) => {
    try {
        let endpointBase = '/folder/create';
        if (data.parentId && data.parentId > 0) {
            endpointBase += `/${data.parentId}`;
        }

        const response = await axiosConfig.post(endpointBase, { name: data.name })

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
});

export const copyFolder = createAsyncThunk('/folder/copy/:parentId?', async (data: DataFolder, thunkAPI) => {
    try {
        let endpointBase = '/folder/copy';
        if (data.parentId && data.parentId > 0) {
            endpointBase += `/${data.parentId}`;
        }

        const response = await axiosConfig.post(endpointBase, { folderId: data.folderId })

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const updateFolder = createAsyncThunk('/folder/update/:folderId', async (data: DataFolder, thunkAPI) => {
    try {
        const dataRequest: {
        parent_folder_id?: number,
            name?: string,
        } = {
            
        }
        if (data.name !== undefined) {
            dataRequest.name = data.name;
        }
        if (data.parentId !== undefined) {
            dataRequest.parent_folder_id = data.parentId;
        }
        console.log(data.folderId, data.parentId);
        const response = await axiosConfig.put(`/folder/update/${data.folderId}`, dataRequest);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const deleteFolder = createAsyncThunk('/folder/delete/:folderId', async (folderId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.delete(`/folder/delete/${folderId}`);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})



type Folder = {
    id: number,
    parent_folder_id: number,
    id_teacher: number,
    name: string
}

type InitialState = {
    isInit: boolean,
    isLoading: boolean,
    isGetSuccess: boolean,
    isGetFailed: boolean,
    isCreateSuccess: boolean,
    isCreateFailed: boolean,
    isUpdateSuccess: boolean,
    isUpdateFailed: boolean,
    isDeleteSuccess: boolean,
    isDeleteFailed: boolean,
    message: string,
    currentFolderId: number,
    selectedFolderId: number,
    cutOrCopy: string,
    folders: Folder[],
}

const initialState = {
    isInit: true as boolean,
    isLoading: false as boolean,
    isGetFailed: false as boolean,
    isGetSuccess: false as boolean,
    isCreateFailed: false as boolean,
    isCreateSuccess: false as boolean,
    isUpdateFailed: false as boolean,
    isUpdateSuccess: false as boolean,
    isDeleteFailed: false as boolean,
    isDeleteSuccess: false as boolean,
    message: '' as string,
    currentFolderId: -1 as number,
    selectedFolderId: -1 as number,
    cutOrCopy: "" as string,
    folders: [] as Folder[],
} as InitialState;

export const folder = createSlice({
    name: "folder",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isGetFailed = false;
            state.isGetSuccess = false;
            state.isCreateFailed = false;
            state.isCreateSuccess = false;
            state.isDeleteFailed = false;
            state.isDeleteSuccess = false;
            state.message = '';
        },
        setCurrentFolderId: (state, action) => {
            state.currentFolderId = action.payload;
        },
        setSelectedFolder: (state, action) => {
            state.selectedFolderId = action.payload;
        },
        setCutOrCopyState: (state, action) => {
            state.cutOrCopy = action.payload;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getFoldersByParent.pending, (state) => {
                console.log('Pending');
                state.isLoading = true;
            }) 
            .addCase(getFoldersByParent.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isGetFailed = true;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(getFoldersByParent.fulfilled, (state, action) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isGetSuccess = true;
                state.folders = action.payload;
            })
            .addCase(createFolder.pending, (state) => {
                console.log('Pending');
                state.isLoading = true;
            })
            .addCase(createFolder.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isCreateFailed = true;
                state.isCreateSuccess = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isCreateSuccess = true;
                state.isCreateFailed = false;
                state.folders.push(action.payload);
                console.log(action.payload);
            })
            .addCase(copyFolder.pending, (state) => {
                console.log('Pending');
                state.isLoading = true;
            })
            .addCase(copyFolder.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isCreateFailed = true;
                state.isCreateSuccess = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(copyFolder.fulfilled, (state, aciton) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isCreateSuccess = true;
                state.isCreateFailed = false;
                state.selectedFolderId = -1;
                state.cutOrCopy = "";
            })
            .addCase(updateFolder.pending, (state) => {
                console.log('Pending');
                state.isLoading = false;
            })
            .addCase(updateFolder.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isUpdateFailed = true;
                state.isUpdateSuccess = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(updateFolder.fulfilled, (state, action) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isUpdateFailed = false;
                state.isUpdateSuccess = true;
                const index = state.folders.findIndex(
                    fol => fol.id === action.payload.id
                )
                state.folders[index] = action.payload;
                if (state.cutOrCopy === "cut") {
                    state.selectedFolderId = -1;
                    state.cutOrCopy = "";
                }
            })
            .addCase(deleteFolder.pending, (state) => {
                console.log('Pending');
                state.isLoading = true;
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isDeleteFailed = true;
                state.isDeleteSuccess = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isDeleteFailed = false;
                state.isDeleteSuccess = true;
                state.folders = state.folders.filter(folder => folder.id != action.payload.folderId);
            })
    }
});

export const { reset, setCurrentFolderId, setSelectedFolder, setCutOrCopyState } = folder.actions;
export default folder.reducer;