// NSTU Cover Page Generator - DOCX Export Module
// Exact replication with user-defined headers, equal-level logos, visible borders & large date

(function() {
  function base64ToUint8Array(base64DataUrl) {
    try {
      const parts = base64DataUrl.split(',');
      const base64String = parts.length > 1 ? parts[1] : parts[0];
      const binaryString = atob(base64String);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      console.error('Error decoding base64 image for DOCX:', e);
      return null;
    }
  }

  function cleanHex(color) {
    if (!color) return '002060';
    return color.replace('#', '').trim();
  }

  async function generateDocx(data, options = {}) {
    if (!window.docx) {
      throw new Error('Word document generation library (docx) is not loaded.');
    }

    const {
      Document,
      Paragraph,
      TextRun,
      ImageRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      BorderStyle,
      ShadingType,
      Packer
    } = window.docx;

    const fontName = options.fontFamily || 'Times New Roman';
    const headerBgColor = cleanHex(options.headerColor || '002060');
    const headerTextColor = cleanHex(options.headerTextColor || 'FFFFFF');
    const marginTwips = options.marginSize === 'compact' ? 1080 : (options.marginSize === 'wide' ? 1800 : 1440);

    const children = [];

    // 1. University Title (24pt bold, Navy 0A1D30, Centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 180, line: 240 },
        children: [
          new TextRun({
            text: data.universityName || 'Noakhali Science and Technology University',
            bold: true,
            size: 48, // 24pt
            color: '0A1D30',
            font: fontName
          })
        ]
      })
    );

    // 2. Logos Paragraph (Independent size & horizontal position)
    const logoRuns = [];
    const nstuLogoBytes = data.nstuLogo ? base64ToUint8Array(data.nstuLogo) : null;
    const deptLogoBytes = (data.hasDepartmentLogo && data.departmentLogo) ? base64ToUint8Array(data.departmentLogo) : null;

    const nstuScale = (options.nstuLogoSize || options.logoSize || 110) / 110;
    const deptScale = (options.deptLogoSize || options.logoSize || 110) / 110;

    const nstuWidth = Math.round(108 * nstuScale);
    const nstuHeight = Math.round(155 * nstuScale);
    const deptWidth = Math.round(112 * deptScale);
    const deptHeight = Math.round(155 * deptScale);

    if (nstuLogoBytes) {
      logoRuns.push(
        new ImageRun({
          data: nstuLogoBytes,
          transformation: { width: nstuWidth, height: nstuHeight }
        })
      );
    }

    if (deptLogoBytes) {
      // Dynamic spacing between logos based on logosGap and horizontal offsets
      const gapPx = typeof options.logosGap === 'number' ? options.logosGap : 40;
      const netOffset = ((options.deptLogoX || 0) - (options.nstuLogoX || 0)) / 5;
      const numSpaces = Math.max(3, Math.min(35, Math.round((gapPx / 40) * 15 + netOffset)));
      logoRuns.push(
        new TextRun({
          text: ' '.repeat(numSpaces),
          size: 44,
          font: fontName
        })
      );
      logoRuns.push(
        new ImageRun({
          data: deptLogoBytes,
          transformation: { width: deptWidth, height: deptHeight }
        })
      );
    }

    if (logoRuns.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 360 }, // Extra space after logo as requested
          children: logoRuns
        })
      );
    }

    // 3. Spacing paragraph before Assignment Report
    children.push(new Paragraph({ spacing: { after: 120 }, children: [] }));

    // 4. Assignment Type (14pt bold, centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60, line: 240 },
        children: [
          new TextRun({
            text: data.assignmentType || 'Assignment Report',
            bold: true,
            size: 28, // 14pt
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    // 5. "on" (14pt bold, centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80, line: 240 },
        children: [
          new TextRun({
            text: 'on',
            bold: true,
            size: 28,
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    // 6. Assignment Topic (20pt bold, centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 240, line: 280 },
        children: [
          new TextRun({
            text: data.assignmentTopic || 'Topic Title Goes Here',
            bold: true,
            size: 40, // 20pt
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    // 7. Course Title (14pt bold, centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80, line: 240 },
        children: [
          new TextRun({
            text: 'Course Title:  ',
            bold: true,
            size: 28,
            color: '000000',
            font: fontName
          }),
          new TextRun({
            text: data.courseTitle || '',
            bold: true,
            size: 28,
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    // 8. Course Code (14pt bold, centered)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 360, line: 240 },
        children: [
          new TextRun({
            text: 'Course Code : ',
            bold: true,
            size: 28,
            color: '000000',
            font: fontName
          }),
          new TextRun({
            text: data.courseCode || '',
            bold: true,
            size: 28,
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    // 9. Submitted By & Supervised By Table (All borders visible, no text overflow!)
    const prominentBorder = {
      style: BorderStyle.SINGLE,
      size: 8, // ~1pt solid line, prominent and visible!
      color: '002060'
    };

    const createCellParagraph = (text, isHeading = false) => {
      return new Paragraph({
        spacing: { before: 40, after: 40, line: 240 },
        alignment: isHeading ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: text,
            bold: true,
            size: 28, // 14pt bold
            color: isHeading ? headerTextColor : '000000',
            font: fontName
          })
        ]
      });
    };

    const studentParagraphs = [
      createCellParagraph(data.studentName || 'Student Name'),
      createCellParagraph(`ID: ${data.studentId || ''}`),
      createCellParagraph(`Session: ${data.session || ''}`),
      createCellParagraph(data.department || ''),
      createCellParagraph(data.studentUniversity || data.universityName || 'Noakhali Science and Technology University')
    ];

    const teacherParagraphs = [
      createCellParagraph(data.teacherName || "Teacher's Name"),
      createCellParagraph(data.teacherDesignation || 'Assistant Professor'),
      createCellParagraph(data.teacherDepartment || data.department || ''),
      createCellParagraph(data.teacherUniversity || data.universityName || 'Noakhali Science and Technology University')
    ];

    const submittedHeader = data.submittedByLabel || 'Submitted by';
    const supervisedHeader = data.supervisedByLabel || 'Supervised by';

    const table = new Table({
      width: { size: 9758, type: WidthType.DXA },
      borders: {
        top: prominentBorder,
        bottom: prominentBorder,
        left: prominentBorder,
        right: prominentBorder,
        insideHorizontal: prominentBorder,
        insideVertical: prominentBorder
      },
      rows: [
        // Header Row
        new TableRow({
          height: { value: 659, rule: 'atLeast' },
          children: [
            new TableCell({
              width: { size: 4584, type: WidthType.DXA },
              shading: { fill: headerBgColor, val: ShadingType.CLEAR, color: 'auto' },
              margins: { top: 140, bottom: 140, left: 180, right: 180 },
              children: [createCellParagraph(submittedHeader, true)]
            }),
            new TableCell({
              width: { size: 5174, type: WidthType.DXA },
              shading: { fill: headerBgColor, val: ShadingType.CLEAR, color: 'auto' },
              margins: { top: 140, bottom: 140, left: 180, right: 180 },
              children: [createCellParagraph(supervisedHeader, true)]
            })
          ]
        }),
        // Content Row
        new TableRow({
          height: { value: 2660, rule: 'atLeast' },
          children: [
            new TableCell({
              width: { size: 4584, type: WidthType.DXA },
              margins: { top: 160, bottom: 160, left: 200, right: 200 },
              children: studentParagraphs
            }),
            new TableCell({
              width: { size: 5174, type: WidthType.DXA },
              margins: { top: 160, bottom: 160, left: 200, right: 200 },
              children: teacherParagraphs
            })
          ]
        })
      ]
    });

    children.push(table);

    // 10. Spacing before Submission Date
    children.push(new Paragraph({ spacing: { before: 400, after: 100 }, children: [] }));

    // 11. Submission Date (Larger font: 17pt / size 34 bold, centered at bottom)
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 280, after: 0, line: 240 },
        children: [
          new TextRun({
            text: 'Submission Date: ',
            bold: true,
            size: 34, // 17pt (larger font size as requested)
            color: '000000',
            font: fontName
          }),
          new TextRun({
            text: data.submissionDate || '',
            bold: true,
            size: 34,
            color: '000000',
            font: fontName
          })
        ]
      })
    );

    const doc = new Document({
      title: `${data.assignmentType || 'Assignment'} - ${data.studentName || 'NSTU Student'}`,
      description: 'NSTU Assignment Cover Page generated by NSTU Cover Page Generator',
      creator: 'NSTU Cover Page Generator',
      sections: [{
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: {
              top: marginTwips,
              right: marginTwips,
              bottom: marginTwips,
              left: marginTwips
            }
          }
        },
        children: children
      }]
    });

    return await Packer.toBlob(doc);
  }

  async function downloadDocx(data, options = {}, filename = null) {
    const blob = await generateDocx(data, options);
    const fname = filename || `NSTU_Cover_${(data.studentId || data.courseCode || 'CoverPage').replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }

  const exportObj = {
    generateDocx,
    downloadDocx
  };

  if (typeof window !== 'undefined') {
    window.NSTU_DOCX = exportObj;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportObj;
  }
})(typeof window !== 'undefined' ? window : this);
