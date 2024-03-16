// App.jsx / App.tsx

import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic-mathtype'
const editorConfiguration = {
    toolbar: [
        'Mathtype',
        'ChemType',
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'insertTable',
    ]
};

export default function CustomCKEditor({ setValue, value, position }: any) {


    return (
        <CKEditor
            editor={ClassicEditor}
            config={editorConfiguration}
            data={value}
            onChange={(event, editor) => {
                console.log(editor.getData());

                setValue(position, editor.getData())
            }}
        />

    )
}


