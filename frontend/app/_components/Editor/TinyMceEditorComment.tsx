import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TinyMceEditorComment({ setValue, value, position, editorRef }: any) {

    function extractTimestamps(text: string): string[] {
        // Regex to match timestamps in various formats (optional colons, leading zeros)
        const regex = /^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/;

        const timestamps: string[] = [];
        let match: RegExpExecArray | null;
        console.log(regex.exec(text), text.match(regex));

        // Loop through all matches (may have multiple timestamps)
        while ((match = regex.exec(text)) !== null) {
            // Extract captured groups (handles optional colons and leading zeros)
            const hours = match[1] ? match[1] : "00";
            const minutes = match[2].padStart(2, "0"); // Ensure two-digit format
            const seconds = match[3].padStart(2, "0");
            const timestamp = `[${hours}:${minutes}:${seconds}]`;

            // Add formatted timestamp to the array
            timestamps.push(timestamp);
        }

        return timestamps;
    }

    function convertTimestampToUrl(timestamp: any) {
        // Chuyển đổi timestamp thành định dạng phù hợp với URL video
        const hours = timestamp[1];
        const minutes = timestamp[2];
        const seconds = timestamp[3];

        // Ví dụ URL video
        const videoUrl = `https://www.youtube.com/watch?v=videoId&t=${hours}m${minutes}s`;

        return videoUrl;
    }

    function createLink(timestamp: any, url: any) {
        // Tạo link với URL video và timestamp
        const link = `<a href="${url}" target="_blank">${timestamp}</a>`;

        return link;
    }


    const handleEditorChange = (content: any, editor: any) => {
        // Lấy nội dung phần bình luận
        const text = content;

        // Lấy tất cả timestamp trong text
        const timestamps = extractTimestamps(text);
        // Duyệt qua từng timestamp
        timestamps?.forEach(timestamp => {
            // Chuyển đổi timestamp thành URL
            const url = convertTimestampToUrl(timestamp);

            // Tạo link
            const link = createLink(timestamp, url);

            // Thay thế timestamp bằng link
            editor.setContent(editor.getContent().replace(timestamp, link));
        });
        setValue(position, content)
    };

    const handleImageUpload: any = (blobInfo: any, success: any, failure: any) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:4001/api/v1/images/single", true);

            const formData = new FormData();
            formData.append("image", blobInfo.blob(), blobInfo.filename());

            xhr.onload = () => {
                if (xhr.status === 403) {
                    reject({ message: "HTTP Error: " + xhr.status, remove: true });
                    return;
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                    reject("HTTP Error: " + xhr.status);
                    return;
                }

                const json = JSON.parse(xhr.responseText);

                resolve(json.url);
            };

            xhr.onerror = () => {
                reject({ message: "Image upload failed", remove: true });
                if (failure && typeof failure === "function") {
                    failure("Image upload failed");
                }
            };

            xhr.send(formData);
        });
    };


    return (
        <Editor
            apiKey='3wrf8xthqaxg88pboqgmvyterhthdjvpae4bjj2k0jml5dvs'
            initialValue={value || ''}
            onInit={(evt, editor) => { if (editorRef) editorRef.current = editor }}
            init={{
                height: 200,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help' + 'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
                menu: {
                    file: { title: 'File', items: 'newdocument restoredraft | preview | export print | deleteallconversations' },
                    edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall | searchreplace' },
                    view: { title: 'View', items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments' },
                    insert: { title: 'Insert', items: 'image link media addcomment pageembed template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime' },
                    format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat' },
                    tools: { title: 'Tools', items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount' },
                    table: { title: 'Table', items: 'inserttable | cell row column | advtablesort | tableprops deletetable' },
                    help: { title: 'Help', items: 'help' }
                },
                images_upload_handler: handleImageUpload,
                images_upload_url: "http://localhost:4001/api/v1/images/single",
                image_title: true,
                extended_valid_elements: "span[class]",
                file_picker_types: 'image',
            }}
            onEditorChange={handleEditorChange}
        />
    );
};
