import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

interface DocData {
    categories: Categories,
    name: string,
    id?: number,
    file?: File
}

interface Categories {
    class: number,
    level: string,
    subject: string,
}

export const getDocumentCreatedByTeacher = createAsyncThunk('/document/createdByTeacher', async (teacherId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.get(`/document/teacher/${teacherId}`);

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

export const createDocument = createAsyncThunk('/document/createDocument', async (document: DocData, thunkAPI) => {
    try {
        // Upload file 
        const formData = new FormData();
        if (document.file) {
            formData.append('document', document.file);
        }
        const responseUrl = await axiosConfig.post('/document/upload-file', formData);

        if (responseUrl.status !== 200) return thunkAPI.rejectWithValue(responseUrl.data.message);

        // After receive the Url, create the document
        const docData = {
            categories: document.categories,
            name: document.name,
            url: responseUrl.data
        }
        const response = await axiosConfig.post('/document', docData);

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const updateDocument = createAsyncThunk('/document/updateDocument', async (document: DocData, thunkAPI) => {
    try {
        const response = await axiosConfig.put(`/document/${document.id}`, document);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const deleteDocument = createAsyncThunk('/document/:documentId', async (documentId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.delete(`/document/${documentId}`);

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
    class: number,
    subject: string,
    level: string,
    views: number,
    downloads: number,
    createdAt: Date,
    updatedAt: Date,
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
    document: Document[],
}

const initialState = {
    isLoading: false as boolean,
    isGetSuccess: false as boolean,
    isGetFailed: false as boolean,
    isCreateSuccess: false as boolean,
    isCreateFailed: false as boolean,
    isUpdateSuccess: false as boolean,
    isUpdateFailed: false as boolean,
    isDeleteSuccess: false as boolean,
    isDeleteFailed: false as boolean,
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
            state.isGetFailed = false;
            state.isGetSuccess = false;
            state.isCreateFailed = false;
            state.isCreateSuccess = false;
            state.isDeleteFailed = false;
            state.isDeleteSuccess = false;
            state.message = '';
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
                state.isGetSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document = action.payload;
            })
            .addCase(getDocumentCreatedByTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isGetFailed = true;
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
                state.isCreateSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document.push(action.payload);
            })
            .addCase(createDocument.rejected, (state, action) => {
                console.log("Rejected");
                state.isCreateFailed = true;
                state.isLoading = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                    console.log(action.payload);
                }
            })
            .addCase(updateDocument.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(updateDocument.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isUpdateSuccess = true;
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
                state.isUpdateFailed = true;
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
                state.isDeleteSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document = state.document.filter(doc => doc.id != action.payload.documentId);
            })
            .addCase(deleteDocument.rejected, (state, action) => {
                console.log("Rejected");
                state.isDeleteFailed = true;
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