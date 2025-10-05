"use client";

import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const JoditEditorComponent = ({ 
    value, 
    onChange, 
    placeholder = "Nhập mô tả công việc...", 
    className = "",
    height = "300px",
    readOnly = false,
    simple = false
}) => {
    const editor = useRef(null);

    // Cấu hình đầy đủ
    const fullConfig = useMemo(() => ({ 
        readonly: readOnly,
        height: height,
        placeholder: placeholder,
        toolbarButtonSize: 'middle',
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'table', 'link', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'symbol', 'fullsize', 'print', 'about'
        ],
        uploader: {
            insertImageAsBase64URI: true,
        },
        language: 'vi',
        showCharsCounter: true,
        showWordsCounter: true,
        showXPathInStatusbar: false,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',
        useAceEditor: true,
        theme: 'default',
        iframe: true,
        iframeStyle: 'html{margin:0;padding:0;}body{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:#000;background:transparent;margin:0;padding:8px;overflow:hidden;}body:after{content:\'\';display:block;clear:both;}',
        textIcons: false,
        removeEmptyBlocks: true,
        enter: 'P',
        enterBlock: 'div',
        defaultMode: '1',
        useSplitMode: true,
        colorPickerDefaultTab: 'background',
        imageDefaultWidth: 300,
        removeButtons: ['brush', 'file'],
        disablePlugins: ['paste', 'clipboard'],
        events: {
            afterInit: (editor) => {
                console.log('Jodit Editor đã được khởi tạo!');
            }
        }
    }), [readOnly, height, placeholder]);

    // Cấu hình đơn giản cho Job Description
    const simpleConfig = useMemo(() => ({
        readonly: readOnly,
        height: height,
        placeholder: placeholder,
        toolbarButtonSize: 'small',
        buttons: [
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'link', '|',
            'undo', 'redo'
        ],
        language: 'vi',
        theme: 'default',
        uploader: {
            insertImageAsBase64URI: true,
        },
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',
        removeEmptyBlocks: true,
        enter: 'P',
        enterBlock: 'div'
    }), [readOnly, height, placeholder]);

    const config = simple ? simpleConfig : fullConfig;

    const handleBlur = (newContent) => {
        if (onChange) {
            onChange(newContent);
        }
    };

    const handleChange = (newContent) => {
        // Chỉ log để debug, không update state
        console.log('Content changed:', newContent.length, 'characters');
    };

    return (
        <div className={`jodit-editor-wrapper ${className}`}>
            <JoditEditor
                ref={editor}
                value={value || ''}
                config={config}
                tabIndex={1}
                onBlur={handleBlur}
                onChange={handleChange}
            />
        </div>
    );
};

export default JoditEditorComponent; 