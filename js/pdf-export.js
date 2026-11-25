// NSTU Cover Page Generator - Selectable Vector PDF Export Module
// Exact replication of sample cover page structure, fonts, sizes, positions and styles

(function(root) {
  function hexToRgb(hex) {
    if (!hex) return { r: 0, g: 32, b: 96 };
    let c = hex.replace('#', '').trim();
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function getFontFamily(fontKey) {
    const f = (fontKey || '').toLowerCase();
    if (f.includes('arial') || f.includes('sans') || f.includes('inter')) {
      return 'helvetica';
    }
    return 'times'; // Academic standard default (Times New Roman)
  }

  async function generatePdf(data, options = {}) {
    const jspdfModule = (typeof window !== 'undefined' && window.jspdf) || (typeof global !== 'undefined' && global.jspdf);
    if (!jspdfModule || !jspdfModule.jsPDF) {
      throw new Error('PDF generation library (jsPDF) is not loaded.');
    }

    const { jsPDF } = jspdfModule;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const fontName = getFontFamily(options.fontFamily);
    const headerColor = hexToRgb(options.headerColor || '#002060');
    const headerTextColor = hexToRgb(options.headerTextColor || '#FFFFFF');
    const pageBorder = options.pageBorder || 'none';

    const pageWidth = 210;
    const pageHeight = 297;
    const marginX = options.marginSize === 'compact' ? 16 : (options.marginSize === 'wide' ? 26 : 20);
    const contentWidth = pageWidth - (marginX * 2);

    // Optional Page Border (if user explicitly chooses one in Customization)
    if (pageBorder === 'double') {
      doc.setDrawColor(0, 32, 96);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
      doc.setLineWidth(0.3);
      doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);
    } else if (pageBorder === 'single') {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    }

    // 1. University Title (Exact sample: 24pt bold, Navy #0A1D30, Centered)
    let cursorY = 25;
    doc.setFont(fontName, 'bold');
    doc.setFontSize(22);
    doc.setTextColor(10, 29, 48); // #0A1D30
    const uniLines = doc.splitTextToSize(data.universityName || 'Noakhali Science and Technology University', contentWidth + 10);
    doc.text(uniLines, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += (uniLines.length * 8) + 6;

    // 2. Logos (Independent size & horizontal position for each logo + extra breathing space)
    const nstuScale = (options.nstuLogoSize || options.logoSize || 110) / 110;
    const deptScale = (options.deptLogoSize || options.logoSize || 110) / 110;

    const nstuLogoW = 34 * nstuScale;
    const nstuLogoH = 46 * nstuScale;
    const deptLogoW = 34 * deptScale;
    const deptLogoH = 46 * deptScale;

    const logosGapPx = typeof options.logosGap === 'number' ? options.logosGap : 40;
    const logoGapMm = (logosGapPx / 40) * 16; // 40px corresponds to ~16mm

    const nstuOffsetMm = (options.nstuLogoX || 0) * 0.264583;
    const deptOffsetMm = (options.deptLogoX || 0) * 0.264583;
    const nstuOffsetYMm = (options.nstuLogoY || 0) * 0.264583;
    const deptOffsetYMm = (options.deptLogoY || 0) * 0.264583;

    const hasDept = Boolean(data.hasDepartmentLogo && data.departmentLogo);

    if (data.nstuLogo && hasDept) {
      const totalLogosW = nstuLogoW + logoGapMm + deptLogoW;
      const baseStartX = (pageWidth - totalLogosW) / 2;

      const nstuX = baseStartX + nstuOffsetMm;
      const deptX = baseStartX + nstuLogoW + logoGapMm + deptOffsetMm;

      const maxLogoH = Math.max(nstuLogoH, deptLogoH);
      // Vertically align logos with their individual Y offsets
      const nstuY = cursorY + ((maxLogoH - nstuLogoH) / 2) + nstuOffsetYMm;
      const deptY = cursorY + ((maxLogoH - deptLogoH) / 2) + deptOffsetYMm;

      try {
        doc.addImage(data.nstuLogo, 'PNG', nstuX, nstuY, nstuLogoW, nstuLogoH, undefined, 'FAST');
      } catch (e) {
        console.warn('Could not add NSTU logo to PDF:', e);
      }

      try {
        doc.addImage(data.departmentLogo, 'PNG', deptX, deptY, deptLogoW, deptLogoH, undefined, 'FAST');
      } catch (e) {
        console.warn('Could not add Department logo to PDF:', e);
      }

      // Extra space after logos as requested by user
      cursorY += maxLogoH + Math.max(0, nstuOffsetYMm, deptOffsetYMm) + 18;
    } else if (data.nstuLogo) {
      const startX = ((pageWidth - nstuLogoW) / 2) + nstuOffsetMm;
      const startY = cursorY + nstuOffsetYMm;
      try {
        doc.addImage(data.nstuLogo, 'PNG', startX, startY, nstuLogoW, nstuLogoH, undefined, 'FAST');
      } catch (e) {
        console.warn('Could not add logo to PDF:', e);
      }
      cursorY += nstuLogoH + Math.max(0, nstuOffsetYMm) + 18;
    } else {
      cursorY += 28;
    }

    // 3. Assignment Type (Exact sample: 14pt bold, centered)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(data.assignmentType || 'Assignment Report', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 7.5;

    // 4. "on" (Exact sample: 14pt bold, centered)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    doc.text('on', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 9;

    // 5. Assignment Topic (Exact sample: 19.5pt bold, centered with clean word-wrap)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(19.5);
    const topicLines = doc.splitTextToSize(data.assignmentTopic || 'Topic Title Goes Here', 165);
    doc.text(topicLines, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += (topicLines.length * 8.2) + 10;

    // 6. Course Title (Exact sample: 14pt bold, centered)
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    doc.text(`Course Title:  ${data.courseTitle || ''}`, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 7.5;

    // 7. Course Code (Exact sample: 14pt bold, centered)
    doc.text(`Course Code : ${data.courseCode || ''}`, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 15;

    // 8. Table: "Submitted by" & "Supervised by"
    // Customizable headers, all borders visible (#002060), and text strictly wrapped inside cell bounds!
    const tableW = 172 * ((options.tableWidth || 100) / 100);
    const tableX = (pageWidth - tableW) / 2;
    const col1W = tableW * 0.47;
    const col2W = tableW * 0.53;
    const headerH = 11;
    const paddingX = 4.5;
    const paddingY = 4;

    const submittedHeader = data.submittedByLabel || 'Submitted by';
    const supervisedHeader = data.supervisedByLabel || 'Supervised by';

    // Header Background Fill
    doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    doc.rect(tableX, cursorY, col1W, headerH, 'F');
    doc.rect(tableX + col1W, cursorY, col2W, headerH, 'F');

    // Header Distinct Visible Borders (Dark Navy #002060, 0.6mm width)
    doc.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
    doc.setLineWidth(0.6);
    doc.rect(tableX, cursorY, col1W, headerH, 'D');
    doc.rect(tableX + col1W, cursorY, col2W, headerH, 'D');

    // Header Text (White, Bold, 14pt, Centered)
    doc.setTextColor(headerTextColor.r, headerTextColor.g, headerTextColor.b);
    doc.setFont(fontName, 'bold');
    doc.setFontSize(14);
    doc.text(submittedHeader, tableX + (col1W / 2), cursorY + 7.5, { align: 'center' });
    doc.text(supervisedHeader, tableX + col1W + (col2W / 2), cursorY + 7.5, { align: 'center' });

    // Table Content Lines (Exact sample: ALL BOLD, 13.5pt)
    doc.setFontSize(13.5);
    const rawStudentLines = [
      data.studentName || 'Student Name',
      data.studentId ? `ID: ${data.studentId}` : '',
      data.session ? `Session: ${data.session}` : '',
      data.department || '',
      data.studentUniversity || data.universityName || 'Noakhali Science and Technology University'
    ].filter(Boolean);

    const rawTeacherLines = [
      data.teacherName || "Teacher's Name",
      data.teacherDesignation || 'Assistant Professor',
      data.teacherDepartment || data.department || '',
      data.teacherUniversity || data.universityName || 'Noakhali Science and Technology University'
    ].filter(Boolean);

    // CRITICAL: Split text to prevent ANY overflow outside the table cells
    const maxStudentColW = col1W - (paddingX * 2);
    const maxTeacherColW = col2W - (paddingX * 2);

    const wrappedStudentLines = [];
    rawStudentLines.forEach(item => {
      const split = doc.splitTextToSize(item, maxStudentColW);
      wrappedStudentLines.push(...split);
    });

    const wrappedTeacherLines = [];
    rawTeacherLines.forEach(item => {
      const split = doc.splitTextToSize(item, maxTeacherColW);
      wrappedTeacherLines.push(...split);
    });

    const lineHeight = 6.4;
    const bodyContentCount = Math.max(wrappedStudentLines.length, wrappedTeacherLines.length, 5);
    const bodyHeight = (bodyContentCount * lineHeight) + (paddingY * 2) + 2;
    const bodyY = cursorY + headerH;

    // Body Cell Distinct Visible Borders (Dark Navy #002060, 0.6mm width - all borders clearly visible!)
    doc.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
    doc.setLineWidth(0.6);
    doc.rect(tableX, bodyY, col1W, bodyHeight, 'D');
    doc.rect(tableX + col1W, bodyY, col2W, bodyHeight, 'D');

    // Render Student Lines (Bold, strictly within column 1)
    let curLineY = bodyY + paddingY + 5.2;
    doc.setTextColor(0, 0, 0);
    doc.setFont(fontName, 'bold');
    wrappedStudentLines.forEach(lineText => {
      doc.text(lineText, tableX + paddingX, curLineY);
      curLineY += lineHeight;
    });

    // Render Teacher Lines (Bold, strictly within column 2)
    curLineY = bodyY + paddingY + 5.2;
    wrappedTeacherLines.forEach(lineText => {
      doc.text(lineText, tableX + col1W + paddingX, curLineY);
      curLineY += lineHeight;
    });

    // 9. Submission Date (Exact sample: Positioned naturally below table with clean academic gap, 17pt bold)
    const dateY = bodyY + bodyHeight + 18;
    doc.setFont(fontName, 'bold');
    doc.setFontSize(17);
    doc.setTextColor(0, 0, 0);
    doc.text(`Submission Date: ${data.submissionDate || ''}`, pageWidth / 2, dateY, { align: 'center' });

    return doc;
  }

  async function downloadPdf(data, options = {}, filename = null) {
    const doc = await generatePdf(data, options);
    const fname = filename || `NSTU_Cover_${(data.studentId || data.courseCode || 'CoverPage').replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
    doc.save(fname);
  }

  function printCoverPage() {
    window.print();
  }

  const exportObj = {
    generatePdf,
    downloadPdf,
    printCoverPage
  };

  if (typeof window !== 'undefined') {
    window.NSTU_PDF = exportObj;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportObj;
  }
})(typeof window !== 'undefined' ? window : this);
