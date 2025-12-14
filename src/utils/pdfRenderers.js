
import jsPDF from "jspdf";
import { t } from "@/i18n/i18n"; // Giả định t có thể import được

const pageWidth = 210; // A4 width in mm
const marginX = 15;

// === HELPER FUNCTIONS (Có thể tái sử dụng cho các mẫu) ===

// Helper: viết title section
const writeSectionTitle = (doc, cursorY, title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, marginX, cursorY);
    return cursorY + 8;
};

// Helper: viết block text (tự wrap dòng)
const writeParagraph = (doc, cursorY, text, fontSize = 11, bold = false, xPos = marginX, maxWidth = pageWidth - marginX * 2) => {
    if (!text) return cursorY;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(fontSize);

    // Tách dòng
    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
        if (cursorY > 280) {
            doc.addPage();
            cursorY = 20;
        }
        doc.text(line, xPos, cursorY);
        // Tính toán khoảng cách dòng dựa trên font size
        cursorY += fontSize * 0.6 + 1;
    });
    return cursorY + 2; // Khoảng cách sau đoạn văn
};


// =======================================================
// === MẪU 1: MẪU CƠ BẢN (Gần giống code hiện tại) ===
// =======================================================

const renderTemplateBasic = (doc, cv) => {
    const info = cv.information;
    let cursorY = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(info.fullName || "", marginX, cursorY);
    cursorY += 8;

    // Title/Location/Age
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const headerInfo = `${info.title || ""} - ${info.location || ""}${info.age ? ` • ${info.age} ${t`years old`}` : ""}`;
    cursorY = writeParagraph(doc, cursorY, headerInfo, 11);

    // Gender
    cursorY = writeParagraph(doc, cursorY, `${t`Gender`}: ${info.gender || ""}`, 10);

    // Separator line
    cursorY += 2;
    doc.setDrawColor(150);
    doc.setLineWidth(0.3);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 6;

    // Summary
    cursorY = writeSectionTitle(doc, cursorY, t`Professional Summary`);
    cursorY = writeParagraph(doc, cursorY, cv.introduce, 11);

    // Objective
    cursorY = writeSectionTitle(doc, cursorY, t`Career Objective`);
    cursorY = writeParagraph(doc, cursorY, cv.objective, 11);

    // Education
    if (cv.edu && cv.edu.length > 0) {
        cursorY = writeSectionTitle(doc, cursorY, t`Education`);
        cv.edu.forEach((e) => {
            cursorY = writeParagraph(doc, cursorY, e.schoolName, 11, true);
            cursorY = writeParagraph(doc, cursorY, `${e.majors || ""} (${e.degree || ""})`, 10);
            cursorY = writeParagraph(doc, cursorY, e.duration || "", 10);
            cursorY += 3;
        });
    }

    // Experience
    if (cv.experience && cv.experience.length > 0) {
        cursorY = writeSectionTitle(doc, cursorY, t`Work Experience`);
        cv.experience.forEach((exp) => {
            cursorY = writeParagraph(doc, cursorY, `${exp.position || ""} - ${exp.companyName || ""}`, 11, true);
            cursorY = writeParagraph(doc, cursorY, exp.duration || "", 10);
            cursorY = writeParagraph(doc, cursorY, exp.description || "", 10);
            cursorY += 3;
        });
    }

    // Skills
    if (cv.skills && cv.skills.length > 0) {
        cursorY = writeSectionTitle(doc, cursorY, t`Skills`);
        cursorY = writeParagraph(doc, cursorY, cv.skills.join(", "), 10);
    }
};

// =======================================================
// === MẪU 2: MẪU HAI CỘT (Layout khác biệt) ===
// =======================================================

// Thêm vào file hiện tại của bạn (cùng chỗ với các template khác)

const renderTemplateTwoColumns = (doc, cv) => {
    const info = cv.information;

    // ====== CÀI ĐẶT CHUNG ======
    const leftColWidth = 68;                    // Cột trái rộng hơn chút cho đẹp
    const leftPadding = 14;
    const rightX = marginX + leftColWidth + 12;
    const rightWidth = pageWidth - rightX - marginX;

    // Nền cột trái: màu xanh xám hiện đại (hoặc bạn có thể đổi thành #2c3e50, #34495e...)
    doc.setFillColor(33, 57, 82); // Màu xanh đậm sang trọng
    doc.rect(0, 0, leftColWidth + 10, 297, "F");

    // Đường viền trắng nhẹ giữa 2 cột (tùy chọn)
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.line(leftColWidth + 10, 0, leftColWidth + 10, 297);

    // ====================================
    // === CỘT TRÁI - SIDEBAR (Trắng chữ trên nền tối) ===
    // ====================================
    let yLeft = 24;

    // Helper cho cột trái
    const leftSectionTitle = (text) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text(text.toUpperCase(), marginX + leftPadding, yLeft);
        yLeft += 9;
    };

    const leftText = (text, fontSize = 10, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(220, 220, 220);
        const lines = doc.splitTextToSize(text, leftColWidth - leftPadding - 5);
        lines.forEach(line => {
            doc.text(line, marginX + leftPadding, yLeft);
            yLeft += 5.5;
        });
        yLeft += 2;
    };

    const leftBullet = (text) => {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("• " + text, marginX + leftPadding + 3, yLeft);
        yLeft += 5.8;
    };

    // Ảnh đại diện tròn (nếu có link ảnh - jspdf không hỗ trợ tốt ảnh base64 dài, nên giả lập bằng hình tròn)
    // Nếu bạn dùng jspdf + html2canvas thì mới có ảnh thật được
    doc.setFillColor(255, 255, 255);
    doc.circle(marginX + leftPadding + 15, yLeft + 15, 22, "F");
    yLeft += 55; // chừa chỗ cho ảnh

    // Tên + chức danh nổi bật
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(info.fullName || "YOUR NAME", marginX + leftPadding, yLeft);
    yLeft += 9;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(180, 220, 255);
    doc.text(info.title || "Senior Position", marginX + leftPadding, yLeft);
    yLeft += 15;

    // Contact
    leftSectionTitle(t`Contact`);
    leftText(`${info.location || ""}`);
    leftText(`${info.phone || ""}`);
    leftText(`${info.email || ""}`);
    if (info.linkedin) leftText(info.linkedin);
    if (info.github) leftText(info.github);
    yLeft += 8;

    // Personal Info
    leftSectionTitle(t`Details`);
    if (info.age) leftText(`${t`Age`}: ${info.age} ${t`years old`}`);
    leftText(`${t`Gender`}: ${info.gender || ""}`);
    if (info.nationality) leftText(`${t`Nationality`}: ${info.nationality}`);
    yLeft += 8;

    // Skills
    if (cv.skills?.length > 0) {
        leftSectionTitle(t`Skills`);
        cv.skills.forEach(skill => leftBullet(skill));
        yLeft += 8;
    }

    // Languages (nếu có thêm field)
    if (cv.languages?.length > 0) {
        leftSectionTitle(t`Languages`);
        cv.languages.forEach(lang => leftBullet(lang));
    }

    // ====================================
    // === CỘT PHẢI - MAIN CONTENT ===
    // ====================================
    let yRight = 24;

    const rightSectionTitle = (text) => {
        doc.setTextColor(33, 57, 82); // màu chính của sidebar
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(text.toUpperCase(), rightX, yRight);
        yRight += 4;
        doc.setDrawColor(33, 57, 82);
        doc.setLineWidth(0.8);
        doc.line(rightX, yRight, rightX + 40, yRight); // gạch chân ngắn đẹp
        doc.setTextColor(0, 0, 0);
        yRight += 10;
    };

    const rightParagraph = (text, fontSize = 10.5, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(50, 50, 50);
        const lines = doc.splitTextToSize(text, rightWidth);
        lines.forEach(line => {
            if (yRight > 280) {
                doc.addPage();
                // Reset nền cột trái cho trang mới
                doc.setFillColor(33, 57, 82);
                doc.rect(0, 0, leftColWidth + 10, 297, "F");
                yRight = 24;
            }
            doc.text(line, rightX, yRight);
            yRight += fontSize * 0.6 + 1.2;
        });
        yRight += 3;
    };

    // Professional Summary
    if (cv.introduce) {
        rightSectionTitle(t`Professional Summary`);
        rightParagraph(cv.introduce, 10.5);
        yRight += 5;
    }

    // Experience
    if (cv.experience?.length > 0) {
        rightSectionTitle(t`Work Experience`);
        cv.experience.forEach(exp => {
            // Position + Company
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11.5);
            doc.setTextColor(0, 0, 0);
            doc.text((exp.position || "") + " at " + (exp.companyName || ""), rightX, yRight);
            yRight += 6;

            // Duration + Location (nếu có)
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 100, 100);
            doc.text((exp.duration || "") + (exp.location ? " • " + exp.location : ""), rightX, yRight);
            yRight += 7;

            // Description
            if (exp.description) {
                rightParagraph(exp.description, 10.2);
            }
            yRight += 6;
        });
    }

    // Education
    if (cv.edu?.length > 0) {
        rightSectionTitle(t`Education`);
        cv.edu.forEach(e => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.text(e.schoolName || "", rightX, yRight);
            yRight += 5.5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            doc.text((e.majors || "") + (e.degree ? ", " + e.degree : ""), rightX, yRight);
            yRight += 5;

            doc.setFont("helvetica", "italic");
            doc.setFontSize(9.5);
            doc.setTextColor(100, 100, 100);
            doc.text(e.duration || "", rightX, yRight);
            yRight += 10;
        });
    }

    // Projects / Certificates (tuỳ chọn thêm sau)
};

// =======================================================
// === MẪU 3: RIGHT SIDEBAR CV (Details + Skills bên phải) ===
// =======================================================

const renderTemplateRightSidebar = (doc, cv) => {
    const info = cv?.information || {};
    const pageHeight = 297;

    // Layout
    const sidebarWidth = 65;
    const sidebarX = pageWidth - marginX - sidebarWidth;   // bắt đầu cột phải
    const mainX = marginX;                                 // main content bên trái
    const mainWidth = sidebarX - mainX - 8;                // trừ khoảng cách

    // === VẼ BACKGROUND CỘT PHẢI (màu navy) ===
    doc.setFillColor(10, 36, 63); // navy đậm
    doc.rect(sidebarX, 0, pageWidth - sidebarX, pageHeight, "F");

    // ============================
    // === MAIN CONTENT (TRÁI) ===
    // ============================
    let yMain = 25;

    // Header: Tên
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(info.fullName || "", mainX, yMain);
    yMain += 8;

    // Chức danh
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    if (info.title) {
        doc.setTextColor(90);
        doc.text(info.title, mainX, yMain);
        yMain += 10;
        doc.setTextColor(0);
    }

    // Helper: vẽ title section bên trái (Profile, Employment History,...)
    const drawMainSectionTitle = (label) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(10, 36, 63);
        doc.text(label, mainX, yMain);
        yMain += 3;

        // gạch mảnh dưới title
        doc.setDrawColor(10, 36, 63);
        doc.setLineWidth(0.5);
        doc.line(mainX, yMain, mainX + 35, yMain);
        yMain += 5;

        doc.setTextColor(0);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
    };

    // Profile / Summary
    drawMainSectionTitle("Profile");
    yMain = writeParagraph(doc, yMain, cv.introduce, 10.5, false, mainX, mainWidth);
    yMain += 4;

    // Employment History
    if (cv.experience && cv.experience.length > 0) {
        drawMainSectionTitle("Employment History");

        cv.experience.forEach((exp) => {
            // Thời gian (dạng nhỏ, chữ in nghiêng)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(120);
            if (exp.duration) {
                doc.text(exp.duration.toUpperCase(), mainX, yMain);
                yMain += 4;
            }
            doc.setTextColor(0);

            // Company + Location (optional)
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            const companyLine = [exp.position, exp.companyName].filter(Boolean).join(", ");
            yMain = writeParagraph(doc, yMain, companyLine, 10.5, true, mainX, mainWidth);

            // Description (có thể là bullet hoặc đoạn thường)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            yMain = writeParagraph(doc, yMain, exp.description || "", 10, false, mainX, mainWidth);

            yMain += 4;

            // Page break basic
            if (yMain > 270) {
                doc.addPage();
                // đơn giản: chỉ reset yMain, không vẽ lại sidebar (nếu muốn có thể vẽ lại)
                yMain = 25;
            }
        });

        yMain += 4;
    }

    // Education
    if (cv.edu && cv.edu.length > 0) {
        drawMainSectionTitle("Education");

        cv.edu.forEach((e) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10.5);
            const degreeLine = e.degree
                ? [e.degree, e.schoolName].filter(Boolean).join(", ")
                : (e.schoolName || "");
            yMain = writeParagraph(doc, yMain, degreeLine, 10.5, true, mainX, mainWidth);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            let subLine = "";
            if (e.majors) subLine += e.majors;
            if (e.duration) subLine += (subLine ? " | " : "") + e.duration;
            if (subLine) {
                yMain = writeParagraph(doc, yMain, subLine, 9, false, mainX, mainWidth);
            }

            if (e.description) {
                yMain = writeParagraph(doc, yMain, e.description, 9.5, false, mainX, mainWidth);
            }

            yMain += 4;
            if (yMain > 270) {
                doc.addPage();
                yMain = 25;
            }
        });
    }

    // ==============================
    // === RIGHT SIDEBAR (PHẢI)  ===
    // ==============================
    let ySide = 30;
    const sidePaddingX = sidebarX + 8;
    const sideInnerWidth = sidebarWidth - 16;

    doc.setTextColor(255, 255, 255);

    // Helper: title trong sidebar (Details, Skills)
    const drawSidebarTitle = (label) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(label, sidePaddingX, ySide);
        ySide += 5;

        doc.setLineWidth(0.4);
        doc.setDrawColor(255, 255, 255);
        doc.line(sidePaddingX, ySide, sidePaddingX + 25, ySide);
        ySide += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
    };

    const writeSidebarText = (text) => {
        if (!text) return;
        ySide = writeParagraph(
            doc,
            ySide,
            text,
            9,
            false,
            sidePaddingX,
            sideInnerWidth
        );
    };

    // DETAILS
    drawSidebarTitle("Details");
    if (info.address) writeSidebarText(info.address);
    else if (info.location) writeSidebarText(info.location);

    if (info.phone) writeSidebarText(info.phone);
    if (info.email) writeSidebarText(info.email);
    if (info.website) writeSidebarText(info.website);

    ySide += 8;

    // SKILLS: mỗi skill là 1 "pill" chữ trắng nền border nhạt
    if (cv.skills && cv.skills.length > 0) {
        drawSidebarTitle("Skills");

        cv.skills.forEach((skill) => {
            if (!skill) return;

            const label = typeof skill === "string" ? skill : skill.name || "";
            const textWidth = doc.getTextWidth(label);
            const pillPaddingX = 4;
            const pillPaddingY = 3;
            const pillWidth = Math.min(sideInnerWidth, textWidth + pillPaddingX * 2);
            const pillHeight = 7;

            // Nền pill
            doc.setFillColor(18, 56, 93); // sáng hơn 1 chút
            doc.rect(
                sidePaddingX,
                ySide - pillHeight + 5,
                pillWidth,
                pillHeight,
                "F"
            );

            // Text skill
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            doc.text(label, sidePaddingX + pillPaddingX, ySide + 1);

            ySide += pillHeight + 3;

            if (ySide > 270) {
                // nếu quá trang, tạm dừng (đơn giản), có thể addPage để vẽ tiếp nếu muốn
                return;
            }
        });
    }
};


// === Export Map ===
export const pdfRenderers = {
    basic: renderTemplateBasic,
    'two-columns': renderTemplateTwoColumns,
    'right-sidebar': renderTemplateRightSidebar,
};