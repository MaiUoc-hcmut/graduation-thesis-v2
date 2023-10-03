import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

export const getDocumentCreatedByTeacher = createAsyncThunk('/document/getAllDocument', async (teacherId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.get(`/document/${teacherId}`);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const getDocumentById = createAsyncThunk('/document/getDocument/:documentId', async (documentId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.get(`/document/${documentId}`);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const createDocument = createAsyncThunk('/document/createDocument', async (document, thunkAPI) => {
    try {
        const response = await axiosConfig.post('/document', document);

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const uploadFile = createAsyncThunk('/document/upload-file', async (file: File, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('document', file);

        const response = await axiosConfig.post('/document/upload-file', formData);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const updateDocument = createAsyncThunk('/document/updateDocument', async (document, thunkAPI) => {
    try {
        const response = await axiosConfig.put('/document/:documentId', document);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const deleteDocument = createAsyncThunk('/document/deletDoument/:documentId', async (documentId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.delete(`/document/delete/${documentId}`);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

type Document = {
    id: number,
    name: string,
    url: string,
    views: number,
    downloads: number,
    createdAt: Date,
    updatedAt: Date,
}

type InitialState = {
    isInit: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    isFailed: boolean,
    message: string,
    document: Document[],
}

const initialState = {
    isLoading: false as boolean,
    isSuccess: false as boolean,
    isFailed: false as boolean,
    isInit: true as boolean,
    message: '' as string,
    document: [] as Document[],
} as InitialState;

export const document = createSlice({
    name: "document",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isFailed = false;
            state.isSuccess = false;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getDocumentCreatedByTeacher.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(getDocumentCreatedByTeacher.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document = action.payload;
                console.log(action.payload);
            })
            .addCase(getDocumentCreatedByTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(createDocument.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(createDocument.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document.push(action.payload);
                console.log(action.payload);
            })
            .addCase(createDocument.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(uploadFile.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document = action.payload;
                console.log(action.payload);
            })
            .addCase(uploadFile.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(updateDocument.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                const index = state.document.findIndex(
                    doc => doc.id === action.payload.id
                )
                state.document[index] = action.payload;
                console.log(action.payload);
            })
            .addCase(updateDocument.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(deleteDocument.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(deleteDocument.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                const index = state.document.findIndex(
                    doc => doc.id === action.payload.documentId
                )
                state.document.splice(index, 1);
                console.log(action.payload);
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                console.log("Rejected");
                state.isFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
    }
})


export const { reset } = document.actions;
export default document.reducer;