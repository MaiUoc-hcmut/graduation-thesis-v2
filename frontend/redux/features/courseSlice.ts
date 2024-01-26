import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosConfig, { setAuthToken } from '../axios.config';

interface DocData {
    categories: Categories,
    parentId?: number,
    files: File[],
}

interface DocUpdateData {
    categories: Categories,
    id: number,
}

interface Categories {
    class: number,
    level: string,
    subject: string,
}

interface ResponseUploadFile {
    name: string,
    url: string,
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

export const getDocumentBelongToFolder = createAsyncThunk('/document/folder/:parentId', async (parentId: number, thunkAPI) => {
    try {
        const response = await axiosConfig.get(`/document/folder/${parentId}`);

        if (response.status !== 200) return thunkAPI.rejectWithValue(response.data.message);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const createCourse = createAsyncThunk('/courses', async (document: DocData, thunkAPI) => {
    try {
        // Upload file 
        const formData = new FormData();

        if (document.files.length > 0) {
            document.files.forEach((file, index) => {
                if (file) {
                    formData.append(`document[${index}]`, file);
                }
            })
        }
        const responseUrls = await axiosConfig.post('/document/upload-multi-file', formData);

        if (responseUrls.status !== 200) return thunkAPI.rejectWithValue(responseUrls.data.message);

        let parentId = -1;
        if (document.parentId && document.parentId > 0) {
            parentId = document.parentId;
        }

        // After receive the Url, create the document
        const docData = responseUrls.data.map((response: ResponseUploadFile) => {
            return {
                name: response.name,
                url: response.url,
            }
        })
        const requestData = {
            fileData: docData,
            parentId
        }
        const response = await axiosConfig.post('/document', requestData);

        if (response.status !== 201) return thunkAPI.rejectWithValue(response.data);

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const updateDocument = createAsyncThunk('/document/updateDocument', async (document: DocUpdateData, thunkAPI) => {
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
                state.isGetFailed = false;
                state.isInit = false;
                state.isLoading = false;
                state.document = action.payload;
            })
            .addCase(getDocumentCreatedByTeacher.rejected, (state, action) => {
                console.log("Rejected");
                state.isGetFailed = true;
                state.isGetSuccess = false;
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
            .addCase(getDocumentBelongToFolder.pending, (state) => {
                console.log('Pending');
                state.isLoading = true;
            })
            .addCase(getDocumentBelongToFolder.rejected, (state, action) => {
                console.log('Rejected');
                state.isLoading = false;
                state.isGetFailed = true;
                state.isGetSuccess = false;
                if (typeof action.payload === 'string') {
                    state.message = action.payload;
                } else if (action.payload instanceof Error) {
                    state.message = action.payload.message;
                } else {
                    // Handle other cases or assign a default message
                    state.message = "An error occurred";
                }
            })
            .addCase(getDocumentBelongToFolder.fulfilled, (state, action) => {
                console.log('Fullfiled');
                state.isLoading = false;
                state.isGetFailed = false;
                state.isGetSuccess = true;
                state.document = action.payload;
            })
            .addCase(createCourse.pending, (state) => {
                console.log('pending');
                state.isLoading = true;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                console.log("Fullfiled");
                state.isCreateSuccess = true;
                state.isInit = false;
                state.isLoading = false;
                state.document.concat(action.payload);
            })
            .addCase(createCourse.rejected, (state, action) => {
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