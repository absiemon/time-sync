import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


function TextEditor({editorContent, setEditorContent, setImagesInfo}) {

    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: [] }],
          [{ font: [] }],
          [{ align: ["right", "center", "justify"] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          [{ color: ["red", "#785412"] }],
          [{ background: ["red", "#785412"] }]
        ],
      };

      const formats = [ "header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "color", "image", "background", "align", "size", "font"
      ];

      const handleProcedureContentChange = (content, delta, source, editor) => {
        const imageInfo = extractImageInfo(content);
        if(imageInfo.length>0){
          setImagesInfo(imageInfo);
        }
        setEditorContent(content);
      };

      const extractImageInfo = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const imageElements = doc.querySelectorAll('img');
        
        const imageInfo = [];
        imageElements.forEach((img) => {
          const src = img.getAttribute('src');
          const alt = img.getAttribute('alt');
          imageInfo.push({ src, alt });
        });
        console.log(imageInfo)
        return imageInfo;
      };
      

      
    return (
        <>
            <ReactQuill
                value={editorContent}
                onChange={handleProcedureContentChange}
                modules={modules}
                formats={formats}
                placeholder="Compose a template..."
            />
        </>
    )
}

export default TextEditor