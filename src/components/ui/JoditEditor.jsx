"use client";

import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

const JoditEditorComponent = ({
    value,
    onChange,
    placeholder = "Nhập mô tả công việc...",
    className = "",
    height = "300px",
    readOnly = false,
}) => {
    const editor = useRef(null);

    // Cấu hình chỉ hiển thị một hàng toolbar đơn giản
    const config = useMemo(
        () => ({
            readonly: readOnly,
            height: height,
            placeholder: placeholder,
            toolbarButtonSize: "small",
            // Chỉ hiển thị những công cụ cơ bản trong một hàng
            buttons: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "undo",
                "redo",
            ],
            // Tắt tất cả các tính năng không cần thiết
            showCharsCounter: false,
            showWordsCounter: false,
            showXPathInStatusbar: false,
            language: "vi",
            theme: "default",
            iframe: true,
            iframeStyle:
                "html{margin:0;padding:0;}body{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:#000;background:transparent;margin:0;padding:8px;overflow:hidden;}body:after{content:'';display:block;clear:both;}ul,ol{margin:8px 0;padding-left:20px;}li{margin:4px 0;}",
            removeEmptyBlocks: true,
            enter: "P",
            enterBlock: "div",
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: "insert_clear_html",
            // Tắt các plugin không cần thiết
            disablePlugins: [
                "paste",
                "clipboard",
                "file",
                "image",
                "video",
                "table",
                "link",
                "symbol",
                "fullsize",
                "print",
                "about",
            ],
            // Loại bỏ các nút không mong muốn nhưng giữ lại ul (bullet list)
            removeButtons: [
                "source",
                "brush",
                "font",
                "fontsize",
                "paragraph",
                "align",
                "hr",
                "eraser",
                "copyformat",
                "symbol",
                "fullsize",
                "print",
                "about",
                "image",
                "file",
                "video",
                "table",
                "link",
                "microphone",
                "omega",
                "scissors",
                "robot",
                "strikethrough",
                "indent",
                "outdent",
                "left",
                "center",
                "right",
                "justify",
                "color",
                "background",
                "selectall",
                "cut",
                "copy",
                "paste",
                "selectall",
                "hr",
                "eraser",
                "superscript",
                "subscript",
                "fontsize",
                "font",
                "paragraph",
                "lineHeight",
                "formatBlock",
                "fontFamily",
                "fontSize",
                "brush",
                "copyformat",
                "about",
            ],
            // Chỉ hiển thị các nút được phép (bao gồm ul cho bullet list)
            buttonsMD: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "undo",
                "redo",
            ],
            buttonsSM: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "undo",
                "redo",
            ],
            buttonsXS: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "undo",
                "redo",
            ],
            // Tắt các tính năng nâng cao
            useAceEditor: false,
            useSplitMode: false,
            textIcons: false,
            defaultMode: "1",
            // Chỉ hiển thị một hàng toolbar
            toolbar: true,
            toolbarSticky: false,
            // Tắt toolbar thứ hai
            toolbarAdaptive: false,
            // Giới hạn số hàng toolbar
            toolbarInline: false,
            events: {
                afterInit: (editor) => {
                    // console.log("Jodit Simple Editor đã được khởi tạo!");
                    // Ẩn các toolbar không cần thiết sau khi khởi tạo
                    const toolbars =
                        editor.container.querySelectorAll(".jodit-toolbar");
                    if (toolbars.length > 1) {
                        for (let i = 1; i < toolbars.length; i++) {
                            toolbars[i].style.display = "none";
                        }
                    }
                },
            },
        }),
        [readOnly, height, placeholder]
    );

    const handleBlur = (newContent) => {
        if (onChange) {
            onChange(newContent);
        }
    };

    const handleChange = (newContent) => {
        // Chỉ log để debug, không update state
        // console.log("Content changed:", newContent.length, "characters");
    };

    return (
        <div className={`jodit-editor-wrapper ${className}`}>
            <JoditEditor
                ref={editor}
                value={value || ""}
                config={config}
                tabIndex={1}
                onBlur={handleBlur}
                onChange={handleChange}
            />
        </div>
    );
};

export default JoditEditorComponent;
