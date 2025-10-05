"use client";

import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const JoditDemoPage = () => {
    const editor = useRef(null);
    const [content, setContent] = useState(`
        <h2>Chào mừng đến với Jodit Editor Demo!</h2>
        <p>Đây là một <strong>WYSIWYG editor</strong> mạnh mẽ và dễ sử dụng.</p>
        <ul>
            <li>Tính năng 1: <em>Rich text formatting</em></li>
            <li>Tính năng 2: <u>Hỗ trợ nhiều định dạng</u></li>
            <li>Tính năng 3: <span style="color: #3b82f6;">Màu sắc và styling</span></li>
        </ul>
        <p>Hãy thử chỉnh sửa nội dung này!</p>
    `);

    // Cấu hình editor cho Job Description
    const config = useMemo(() => ({
        readonly: false,
        height: 400,
        placeholder: 'Nhập mô tả công việc...',
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
        enter: 'P',
        defaultMode: '1',
        useSplitMode: true,
        colorPickerDefaultTab: 'background',
        imageDefaultWidth: 300,
        removeButtons: ['brush', 'file'],
        disablePlugins: ['paste', 'clipboard'],
        events: {
            afterInit: (editor) => {
                console.log('Jodit Editor đã được khởi tạo!');
            },
            afterPaste: (editor) => {
                console.log('Đã paste nội dung');
            }
        }
    }), []);

    // Editor tối ưu - subset của full editor
    const optimizedConfig = useMemo(() => ({
        readonly: false,
        height: 300,
        placeholder: 'Nhập mô tả công việc...',
        toolbarButtonSize: 'middle',
        // Chỉ lấy những buttons cần thiết từ full editor
        buttons: [
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'link', '|',
            'undo', 'redo'
        ],
        // Sử dụng tất cả cấu hình từ full editor nhưng loại bỏ những gì không cần
        uploader: {
            insertImageAsBase64URI: true,
        },
        language: 'vi',
        showCharsCounter: false, // Tắt counter để gọn hơn
        showWordsCounter: false,
        showXPathInStatusbar: false,
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',
        useAceEditor: false, // Tắt Ace editor để nhẹ hơn
        theme: 'default',
        iframe: true,
        iframeStyle: 'html{margin:0;padding:0;}body{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:#000;background:transparent;margin:0;padding:8px;overflow:hidden;}body:after{content:\'\';display:block;clear:both;}ul,ol{margin:8px 0;padding-left:20px;}li{margin:4px 0;}',
        textIcons: false,
        removeEmptyBlocks: true,
        enter: 'P',
        enterBlock: 'div',
        defaultMode: '1',
        useSplitMode: false, // Tắt split mode để đơn giản hơn
        colorPickerDefaultTab: 'background',
        imageDefaultWidth: 300,
        // Không remove buttons nào, chỉ dùng những gì cần
        disablePlugins: ['paste', 'clipboard'], // Giữ paste handling
        events: {
            afterInit: (editor) => {
                console.log('Optimized Editor đã được khởi tạo!');
            }
        }
    }), []);

    // Editor siêu đơn giản - chỉ những gì cơ bản nhất
    const minimalConfig = useMemo(() => ({
        readonly: false,
        height: 250,
        placeholder: 'Nhập nội dung...',
        toolbarButtonSize: 'small',
        buttons: [
            'bold', 'italic', '|',
            'ul', 'ol', '|',
            'undo', 'redo'
        ],
        language: 'vi',
        theme: 'default',
        iframe: true,
        iframeStyle: 'html{margin:0;padding:0;}body{box-sizing:border-box;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.4;color:#000;background:transparent;margin:0;padding:8px;overflow:hidden;}body:after{content:\'\';display:block;clear:both;}ul,ol{margin:8px 0;padding-left:20px;}li{margin:4px 0;}',
        removeEmptyBlocks: true,
        enter: 'P',
        enterBlock: 'div',
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: 'insert_clear_html',
        disablePlugins: [],
        events: {
            afterInit: (editor) => {
                console.log('Minimal Editor đã được khởi tạo!');
            }
        }
    }), []);

    const handleBlur = (newContent) => {
        setContent(newContent);
        console.log('Nội dung đã thay đổi:', newContent);
    };

    const handleChange = (newContent) => {
        console.log('Content changed:', newContent.length, 'characters');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Jodit Editor Demo - Subset Approach
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Demo các phiên bản editor khác nhau - từ full đến minimal
                    </p>

                    {/* Editor đầy đủ tính năng */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Full Editor (Tất cả tính năng)
                        </h2>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                tabIndex={1}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Editor tối ưu - subset của full */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Optimized Editor (Subset của Full Editor)
                        </h2>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <JoditEditor
                                value={content}
                                config={optimizedConfig}
                                tabIndex={2}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Đặc điểm:</strong> Sử dụng cấu hình từ full editor nhưng chỉ hiển thị buttons cần thiết</p>
                        </div>
                    </div>

                    {/* Editor siêu đơn giản */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Minimal Editor (Chỉ cơ bản)
                        </h2>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <JoditEditor
                                value={content}
                                config={minimalConfig}
                                tabIndex={3}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Đặc điểm:</strong> Chỉ có bold, italic, lists, undo/redo</p>
                        </div>
                    </div>

                    {/* So sánh các phiên bản */}
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            So sánh các phiên bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white p-4 rounded border">
                                <h4 className="font-medium text-gray-800 mb-2">Full Editor</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Tất cả tính năng</li>
                                    <li>• Source code editing</li>
                                    <li>• Images, tables, links</li>
                                    <li>• Font, colors, alignment</li>
                                    <li>• Character/word counter</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded border">
                                <h4 className="font-medium text-gray-800 mb-2">Optimized</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Bold, italic, underline</li>
                                    <li>• Lists (ul, ol)</li>
                                    <li>• Links</li>
                                    <li>• Undo/redo</li>
                                    <li>• Paste handling</li>
                                </ul>
                            </div>
                            <div className="bg-white p-4 rounded border">
                                <h4 className="font-medium text-gray-800 mb-2">Minimal</h4>
                                <ul className="space-y-1 text-gray-600">
                                    <li>• Bold, italic</li>
                                    <li>• Lists (ul, ol)</li>
                                    <li>• Undo/redo</li>
                                    <li>• Siêu nhẹ</li>
                                    <li>• Phù hợp mobile</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị HTML output */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            HTML Output
                        </h2>
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                                {content}
                            </pre>
                        </div>
                    </div>

                    {/* Buttons để test */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => setContent('<h1>Nội dung mới!</h1><p>Đã được reset.</p>')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Reset Content
                        </button>
                        <button
                            onClick={() => {
                                const newContent = content + '<p><em>Đã thêm nội dung mới!</em></p>';
                                setContent(newContent);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add Content
                        </button>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(content);
                                alert('Đã copy HTML vào clipboard!');
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Copy HTML
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoditDemoPage; 