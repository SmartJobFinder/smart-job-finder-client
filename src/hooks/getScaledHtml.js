export function getScaledHtml(data, zoom, options = {}) {
    if (!data) return "";

    const containerPadding =
        options.templateType === "Classic" ? "20px" : "0px";

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=${zoom}, user-scalable=no">
            <style>
                /* Reset và Base Styles */
                html {
                    width: 100% !important;
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: #000 !important;
                }
                
                body {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    height: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow-x: hidden !important;
                    background: #000 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: flex-start !important;
                }
                
                /* Preview Wrapper với Zoom Control */
                .preview-wrapper {
                    width: 100% !important;
                    max-width: 800px !important;
                    min-width: 300px !important;
                    background: white !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                    transform-origin: top center !important;
                    transform: scale(${zoom}) !important;
                    margin: 20px auto !important;
                    position: relative !important;
                    margin-bottom: 40px !important;
                }
                
                /* Giữ layout gốc với float */
                .preview-wrapper .container {
                    width: 278mm !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    margin: 0 auto !important;
                    padding: ${containerPadding} !important; /* <--- động ở đây */
                    background: white !important;
                    overflow: hidden !important;
                }
                
                .preview-wrapper header {
                    width: 100% !important;
                    min-width: 278mm !important;
                    max-width: 100% !important;
                    padding: 30px !important;
                    display: table !important;
                    table-layout: fixed !important;
                    background: #2c3e50 !important;
                    color: white !important;
                }
                
                .preview-wrapper .header-image,
                .preview-wrapper .header-info {
                    display: table-cell !important;
                    vertical-align: top !important;
                }
                
                .preview-wrapper .header-image {
                    width: 145px !important;
                    padding-right: 25px !important;
                }
                
                .preview-wrapper .header-image img {
                    max-width: 120px !important;
                    max-height: 120px !important;
                    width: auto !important;
                    height: auto !important;
                    border: 3px solid #fff !important;
                    border-radius: 0 !important;
                }
                
                .preview-wrapper .contacts {
                    width: 100% !important;
                    overflow: hidden !important;
                }
                
                .preview-wrapper .contacts .col-left,
                .preview-wrapper .contacts .col-right {
                    float: left !important;
                    width: 48% !important;
                    margin-right: 4% !important;
                }
                
                .preview-wrapper .contacts .col-right {
                    margin-right: 0 !important;
                }
                
                .preview-wrapper .contact-item {
                    display: block !important;
                    margin-bottom: 6px !important;
                    color: #ecf0f1 !important;
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                }
                
                /* Sections */
                .preview-wrapper section {
                    width: 100% !important;
                    max-width: 100% !important;
                    padding: 20px 35px !important;
                    border-bottom: 2px solid #e0e0e0 !important;
                    margin-bottom: 15px !important;
                    overflow: hidden !important;
                }
                
                .preview-wrapper ul.skills {
                    width: 100% !important;
                    overflow: hidden !important;
                }
                
                .preview-wrapper ul.skills li {
                    float: left !important;
                    padding: 6px 12px !important;
                    margin: 4px 8px 4px 0 !important;
                    border-radius: 6px !important;
                    font-size: 13px !important;
                    color: #2c3e50 !important;
                    word-break: break-word !important;
                }
                
                /* Text và Typography */
                .preview-wrapper * {
                    word-wrap: break-word !important;
                    overflow-wrap: break-word !important;
                    hyphens: auto !important;
                }
                
                /* Mobile Responsive */
                @media screen and (max-width: 768px) {
                    .preview-wrapper {
                        max-width: 100% !important;
                        margin: 10px !important;
                    }
                    
                    .preview-wrapper header {
                        padding: 15px !important;
                        display: block !important;
                    }
                    
                    .preview-wrapper .header-image,
                    .preview-wrapper .header-info {
                        display: block !important;
                        width: 100% !important;
                    }
                    
                    .preview-wrapper .header-image {
                        text-align: center !important;
                        margin-bottom: 15px !important;
                    }
                    
                    .preview-wrapper .contacts .col-left,
                    .preview-wrapper .contacts .col-right {
                        float: none !important;
                        width: 100% !important;
                        margin: 0 !important;
                    }
                    
                    .preview-wrapper section {
                        padding: 10px 15px !important;
                    }
                }
                
                /* Print Styles Override */
                @media print {
                    .preview-wrapper {
                        transform: none !important;
                        max-width: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                    }
                    .preview-wrapper .container {
                        width: 278mm !important;
                    }
                }
                
                /* Clearfix for floated elements */
                .preview-wrapper .clearfix::after,
                .preview-wrapper .contacts::after,
                .preview-wrapper ul.skills::after {
                    content: "" !important;
                    display: table !important;
                    clear: both !important;
                }
            </style>
        </head>
        <body>
            <div class="preview-wrapper">
                ${data}
            </div>
        </body>
        </html>
    `;
}
