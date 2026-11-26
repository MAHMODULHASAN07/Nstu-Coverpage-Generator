// NSTU Cover Page Generator - Main Application Controller

(function () {
  // Application State
  const STORAGE_KEY = 'nstu_cover_page_v4';
  const CUSTOM_KEY = 'nstu_cover_customization_v4';

  // Default state initialized with sample data from coverpage.docx
  const defaultFormData = {
    universityName: "Noakhali Science and Technology University",
    nstuLogo: window.DEFAULT_LOGOS ? window.DEFAULT_LOGOS.nstu : "",
    hasDepartmentLogo: true,
    departmentLogo: window.DEFAULT_LOGOS ? window.DEFAULT_LOGOS.iit : "",
    assignmentType: "Assignment",
    assignmentTopic: "Control Flow Graph (CFG) Construction and Cyclomatic Complexity Analysis on Water Sort Puzzle Game",
    courseTitle: "Software Metrics Lab",
    courseCode: "SE 3204",
    submissionDate: "16 December, 2026",
    submittedByLabel: "Submitted by",
    studentName: "Mohammad Rahim",
    studentId: "ASH2125055M",
    session: "2021-22",
    department: "Institute of Information Technology",
    studentUniversity: "Noakhali Science and Technology University",
    supervisedByLabel: "Submitted to",
    teacherName: "Md Hasan Imam",
    teacherDesignation: "Assistant Professor",
    teacherDepartment: "Institute of Information Technology",
    teacherUniversity: "Noakhali Science and Technology University"
  };

  const defaultCustomization = {
    fontFamily: 'Times New Roman',
    fontSize: 'normal',
    headerColor: '#002060',
    headerTextColor: '#FFFFFF',
    marginSize: 'normal',
    logoSize: 110,
    nstuLogoSize: 110,
    nstuLogoX: -10,
    nstuLogoY: -19,
    deptLogoSize: 100,
    deptLogoX: 0,
    deptLogoY: -4,
    logosGap: 66,
    tableWidth: 100,
    pageBorder: 'none',
    textAlign: 'center'
  };

  let formData = { ...defaultFormData };
  let customization = { ...defaultCustomization };
  let currentZoom = 0.78; // Default initial zoom for comfortable desktop view

  // Load from localStorage if available
  try {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    if (savedForm) {
      formData = { ...formData, ...JSON.parse(savedForm) };
      if (!formData.nstuLogo && window.DEFAULT_LOGOS) formData.nstuLogo = window.DEFAULT_LOGOS.nstu;
      if (!formData.departmentLogo && window.DEFAULT_LOGOS) formData.departmentLogo = window.DEFAULT_LOGOS.iit;
      if (!formData.submittedByLabel) formData.submittedByLabel = "Submitted by";
      if (!formData.supervisedByLabel) formData.supervisedByLabel = "Submitted to";
    }
    const savedCustom = localStorage.getItem(CUSTOM_KEY);
    if (savedCustom) {
      customization = { ...customization, ...JSON.parse(savedCustom) };
      if (!customization.nstuLogoSize) customization.nstuLogoSize = customization.logoSize || 110;
      if (!customization.deptLogoSize) customization.deptLogoSize = customization.logoSize || 110;
      if (typeof customization.nstuLogoX !== 'number') customization.nstuLogoX = 0;
      if (typeof customization.nstuLogoY !== 'number') customization.nstuLogoY = 0;
      if (typeof customization.deptLogoX !== 'number') customization.deptLogoX = 0;
      if (typeof customization.deptLogoY !== 'number') customization.deptLogoY = 0;
      if (typeof customization.logosGap !== 'number') customization.logosGap = 40;
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    } else {
      iconSvg = '<svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 3200);
  }

  // Auto-Save with Debounce
  let saveTimeout = null;
  function triggerAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        localStorage.setItem(CUSTOM_KEY, JSON.stringify(customization));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    }, 400);
  }
  const debouncedSave = triggerAutoSave;

  // Master Logo Size Updater (Syncs both logos, all sliders & badges)
  function updateMasterLogoSize(newSize) {
    const val = parseInt(newSize, 10);
    if (isNaN(val)) return;
    customization.logoSize = val;
    customization.nstuLogoSize = val;
    customization.deptLogoSize = val;

    const masterSlider = document.getElementById('slider-logo-size-master');
    if (masterSlider) masterSlider.value = val;
    const masterVal = document.getElementById('val-logo-size-master');
    if (masterVal) masterVal.textContent = `${val}px`;

    const c5Slider = document.getElementById('slider-logo-size');
    if (c5Slider) c5Slider.value = val;
    const c5Val = document.getElementById('val-logo-size');
    if (c5Val) c5Val.textContent = `${val}px`;

    const nstuSlider = document.getElementById('slider-nstu-logo-size');
    if (nstuSlider) nstuSlider.value = val;
    const nstuVal = document.getElementById('val-nstu-logo-size');
    if (nstuVal) nstuVal.textContent = `${val}px`;

    const deptSlider = document.getElementById('slider-dept-logo-size');
    if (deptSlider) deptSlider.value = val;
    const deptVal = document.getElementById('val-dept-logo-size');
    if (deptVal) deptVal.textContent = `${val}px`;

    debouncedSave();
    renderLivePreview();
  }

  // Populate Form Inputs with Current State
  function populateFormInputs() {
    const fields = [
      'universityName', 'assignmentType', 'assignmentTopic',
      'courseTitle', 'courseCode', 'submissionDate',
      'submittedByLabel', 'studentName', 'studentId', 'session', 'department', 'studentUniversity',
      'supervisedByLabel', 'teacherName', 'teacherDesignation', 'teacherDepartment', 'teacherUniversity'
    ];

    fields.forEach(field => {
      const el = document.getElementById(`input-${field}`);
      if (el) {
        el.value = formData[field] || '';
      }
    });

    // Checkbox for department logo
    const deptToggle = document.getElementById('toggle-dept-logo');
    if (deptToggle) {
      deptToggle.checked = Boolean(formData.hasDepartmentLogo);
    }

    // Customization inputs
    const fontSelect = document.getElementById('select-font-family');
    if (fontSelect) fontSelect.value = customization.fontFamily;

    const marginSelect = document.getElementById('select-margin-size');
    if (marginSelect) marginSelect.value = customization.marginSize;

    const borderSelect = document.getElementById('select-page-border');
    if (borderSelect) borderSelect.value = customization.pageBorder;

    const headerColorInput = document.getElementById('input-header-color');
    if (headerColorInput) headerColorInput.value = customization.headerColor;

    // Master Logo Size Sliders
    const masterSize = customization.logoSize || customization.nstuLogoSize || 110;
    const masterSlider = document.getElementById('slider-logo-size-master');
    if (masterSlider) {
      masterSlider.value = masterSize;
      const l = document.getElementById('val-logo-size-master');
      if (l) l.textContent = `${masterSize}px`;
    }
    const c5Slider = document.getElementById('slider-logo-size');
    if (c5Slider) {
      c5Slider.value = masterSize;
      const l = document.getElementById('val-logo-size');
      if (l) l.textContent = `${masterSize}px`;
    }

    // Individual Logo Sliders
    const nstuSize = customization.nstuLogoSize || masterSize;
    const nstuSizeSlider = document.getElementById('slider-nstu-logo-size');
    if (nstuSizeSlider) {
      nstuSizeSlider.value = nstuSize;
      const l = document.getElementById('val-nstu-logo-size');
      if (l) l.textContent = `${nstuSize}px`;
    }

    const nstuX = customization.nstuLogoX || 0;
    const nstuXSlider = document.getElementById('slider-nstu-logo-x');
    if (nstuXSlider) {
      nstuXSlider.value = nstuX;
      const l = document.getElementById('val-nstu-logo-x');
      if (l) l.textContent = nstuX === 0 ? '0px (Center)' : (nstuX > 0 ? `+${nstuX}px (Right)` : `${nstuX}px (Left)`);
    }

    const nstuY = customization.nstuLogoY || 0;
    const nstuYSlider = document.getElementById('slider-nstu-logo-y');
    if (nstuYSlider) {
      nstuYSlider.value = nstuY;
      const l = document.getElementById('val-nstu-logo-y');
      if (l) l.textContent = nstuY === 0 ? '0px (Level)' : (nstuY > 0 ? `+${nstuY}px (Down)` : `${nstuY}px (Up)`);
    }

    const deptSize = customization.deptLogoSize || masterSize;
    const deptSizeSlider = document.getElementById('slider-dept-logo-size');
    if (deptSizeSlider) {
      deptSizeSlider.value = deptSize;
      const l = document.getElementById('val-dept-logo-size');
      if (l) l.textContent = `${deptSize}px`;
    }

    const deptX = customization.deptLogoX || 0;
    const deptXSlider = document.getElementById('slider-dept-logo-x');
    if (deptXSlider) {
      deptXSlider.value = deptX;
      const l = document.getElementById('val-dept-logo-x');
      if (l) l.textContent = deptX === 0 ? '0px (Center)' : (deptX > 0 ? `+${deptX}px (Right)` : `${deptX}px (Left)`);
    }

    const deptY = customization.deptLogoY || 0;
    const deptYSlider = document.getElementById('slider-dept-logo-y');
    if (deptYSlider) {
      deptYSlider.value = deptY;
      const l = document.getElementById('val-dept-logo-y');
      if (l) l.textContent = deptY === 0 ? '0px (Level)' : (deptY > 0 ? `+${deptY}px (Down)` : `${deptY}px (Up)`);
    }

    const gap = typeof customization.logosGap === 'number' ? customization.logosGap : 40;
    const gapSlider = document.getElementById('slider-logos-gap');
    if (gapSlider) {
      gapSlider.value = gap;
      const l = document.getElementById('val-logos-gap');
      if (l) l.textContent = `${gap}px`;
    }

    const tableWidthSlider = document.getElementById('slider-table-width');
    if (tableWidthSlider) {
      tableWidthSlider.value = customization.tableWidth;
      const valLabel = document.getElementById('val-table-width');
      if (valLabel) valLabel.textContent = `${customization.tableWidth}%`;
    }

    // Logo image thumbs
    updateLogoPreviews();

    // Sync teacher directory if initialized
    if (typeof window.syncTeacherDirectorySelection === 'function') {
      window.syncTeacherDirectorySelection();
    }
  }

  // Update logo thumbnail previews in form
  function updateLogoPreviews() {
    const nstuThumb = document.getElementById('thumb-nstu-logo');
    if (nstuThumb) {
      nstuThumb.src = formData.nstuLogo || (window.DEFAULT_LOGOS ? window.DEFAULT_LOGOS.nstu : '');
    }

    const deptThumb = document.getElementById('thumb-dept-logo');
    if (deptThumb) {
      deptThumb.src = formData.departmentLogo || (window.DEFAULT_LOGOS ? window.DEFAULT_LOGOS.iit : '');
    }

    const deptSection = document.getElementById('dept-logo-upload-box');
    if (deptSection) {
      deptSection.style.display = formData.hasDepartmentLogo ? 'block' : 'none';
    }
  }

  // Render Live Preview
  function renderLivePreview() {
    const previewSheet = document.getElementById('preview-sheet');
    if (!previewSheet) return;

    // Font Family & Layout (No justify-between to avoid excessive gap above submission date)
    previewSheet.className = 'a4-sheet flex flex-col min-h-[297mm]';
    if (customization.fontFamily === 'Times New Roman') {
      previewSheet.classList.add('font-times');
    } else if (customization.fontFamily === 'Georgia') {
      previewSheet.classList.add('font-georgia');
    } else if (customization.fontFamily === 'Garamond') {
      previewSheet.classList.add('font-garamond');
    } else if (customization.fontFamily === 'Arial') {
      previewSheet.classList.add('font-arial');
    } else {
      previewSheet.classList.add('font-inter');
    }

    // Margins
    previewSheet.classList.add(`margin-${customization.marginSize || 'normal'}`);

    // Page Border
    if (customization.pageBorder === 'double') {
      previewSheet.classList.add('border-double-academic');
    } else if (customization.pageBorder === 'single') {
      previewSheet.classList.add('border-single-academic');
    }

    // University Name
    const elUni = document.getElementById('pv-university-name');
    if (elUni) {
      elUni.textContent = formData.universityName || 'Noakhali Science and Technology University';
    }

    // Logos (Independent Size, Horizontal (X) & Vertical (Y) Position for Each Logo)
    const elLogosContainer = document.getElementById('pv-logos-container');
    const elNstuLogo = document.getElementById('pv-nstu-logo');
    const elDeptLogo = document.getElementById('pv-dept-logo');

    const nstuH = customization.nstuLogoSize || customization.logoSize || 110;
    const deptH = customization.deptLogoSize || customization.logoSize || 110;
    const nstuX = customization.nstuLogoX || 0;
    const nstuY = customization.nstuLogoY || 0;
    const deptX = customization.deptLogoX || 0;
    const deptY = customization.deptLogoY || 0;
    const logosGap = typeof customization.logosGap === 'number' ? customization.logosGap : 40;

    if (elLogosContainer) {
      elLogosContainer.style.gap = `${logosGap}px`;
    }

    if (elNstuLogo) {
      elNstuLogo.src = formData.nstuLogo || '';
      elNstuLogo.style.height = `${nstuH}px`;
      elNstuLogo.style.transform = `translate(${nstuX}px, ${nstuY}px)`;
      elNstuLogo.style.display = formData.nstuLogo ? 'inline-block' : 'none';
    }

    if (elDeptLogo) {
      if (formData.hasDepartmentLogo && formData.departmentLogo) {
        elDeptLogo.src = formData.departmentLogo;
        elDeptLogo.style.height = `${deptH}px`;
        elDeptLogo.style.transform = `translate(${deptX}px, ${deptY}px)`;
        elDeptLogo.style.display = 'inline-block';
      } else {
        elDeptLogo.style.display = 'none';
      }
    }

    // Assignment Type & "on"
    const elType = document.getElementById('pv-assignment-type');
    if (elType) elType.textContent = formData.assignmentType || 'Assignment Report';

    // Topic
    const elTopic = document.getElementById('pv-assignment-topic');
    if (elTopic) elTopic.textContent = formData.assignmentTopic || 'Topic Title Goes Here';

    // Course Title & Code
    const elCourseTitle = document.getElementById('pv-course-title');
    if (elCourseTitle) elCourseTitle.textContent = formData.courseTitle || '';

    const elCourseCode = document.getElementById('pv-course-code');
    if (elCourseCode) elCourseCode.textContent = formData.courseCode || '';

    // Submission Date
    const elSubDate = document.getElementById('pv-submission-date');
    if (elSubDate) elSubDate.textContent = formData.submissionDate || '';

    // Table Headers (Customizable / Editable!)
    const elThSubmitted = document.getElementById('pv-th-submitted');
    if (elThSubmitted) {
      elThSubmitted.textContent = formData.submittedByLabel || 'Submitted by';
    }

    const elThSupervised = document.getElementById('pv-th-supervised');
    if (elThSupervised) {
      elThSupervised.textContent = formData.supervisedByLabel || 'Supervised by';
    }

    // Student Info
    const elStudentName = document.getElementById('pv-student-name');
    if (elStudentName) elStudentName.textContent = formData.studentName || 'Student Name';

    const elStudentId = document.getElementById('pv-student-id');
    if (elStudentId) elStudentId.textContent = formData.studentId ? `ID: ${formData.studentId}` : '';

    const elStudentSession = document.getElementById('pv-student-session');
    if (elStudentSession) elStudentSession.textContent = formData.session ? `Session: ${formData.session}` : '';

    const elStudentDept = document.getElementById('pv-student-dept');
    if (elStudentDept) elStudentDept.textContent = formData.department || '';

    const elStudentUni = document.getElementById('pv-student-uni');
    if (elStudentUni) elStudentUni.textContent = formData.studentUniversity || formData.universityName || 'Noakhali Science and Technology University';

    // Teacher Info
    const elTeacherName = document.getElementById('pv-teacher-name');
    if (elTeacherName) elTeacherName.textContent = formData.teacherName || "Teacher's Name";

    const elTeacherDesig = document.getElementById('pv-teacher-desig');
    if (elTeacherDesig) elTeacherDesig.textContent = formData.teacherDesignation || '';

    const elTeacherDept = document.getElementById('pv-teacher-dept');
    if (elTeacherDept) elTeacherDept.textContent = formData.teacherDepartment || formData.department || '';

    const elTeacherUni = document.getElementById('pv-teacher-uni');
    if (elTeacherUni) elTeacherUni.textContent = formData.teacherUniversity || formData.universityName || 'Noakhali Science and Technology University';

    // Table Styling
    const tableHeaderCells = document.querySelectorAll('.pv-table-th');
    tableHeaderCells.forEach(th => {
      th.style.backgroundColor = customization.headerColor || '#002060';
      th.style.color = customization.headerTextColor || '#FFFFFF';
    });

    const pvTable = document.getElementById('pv-table');
    if (pvTable) {
      pvTable.style.width = `${customization.tableWidth || 100}%`;
    }

    triggerAutoSave();
  }

  // Zoom controls
  function applyZoom(zoom) {
    currentZoom = Math.max(0.4, Math.min(1.5, zoom));
    const container = document.getElementById('preview-zoom-container');
    const label = document.getElementById('zoom-percentage-label');
    if (container) {
      container.style.transform = `scale(${currentZoom})`;
    }
    if (label) {
      label.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  // Date shortcuts
  function formatDateString(date) {
    const day = date.getDate();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // Bind Form Listeners
  function bindEventListeners() {
    const formFields = [
      'universityName', 'assignmentType', 'assignmentTopic',
      'courseTitle', 'courseCode', 'submissionDate',
      'submittedByLabel', 'studentName', 'studentId', 'session', 'department', 'studentUniversity',
      'supervisedByLabel', 'teacherName', 'teacherDesignation', 'teacherDepartment', 'teacherUniversity'
    ];

    formFields.forEach(field => {
      const el = document.getElementById(`input-${field}`);
      if (el) {
        el.addEventListener('input', (e) => {
          formData[field] = e.target.value;
          // Auto-sync university names
          if (field === 'universityName') {
            const studentUniInput = document.getElementById('input-studentUniversity');
            const teacherUniInput = document.getElementById('input-teacherUniversity');
            if (studentUniInput && (!formData.studentUniversity || formData.studentUniversity === defaultFormData.universityName)) {
              studentUniInput.value = e.target.value;
              formData.studentUniversity = e.target.value;
            }
            if (teacherUniInput && (!formData.teacherUniversity || formData.teacherUniversity === defaultFormData.universityName)) {
              teacherUniInput.value = e.target.value;
              formData.teacherUniversity = e.target.value;
            }
          }
          // Auto-sync department
          if (field === 'department') {
            const teacherDeptInput = document.getElementById('input-teacherDepartment');
            if (teacherDeptInput && !formData.teacherDepartment) {
              teacherDeptInput.value = e.target.value;
              formData.teacherDepartment = e.target.value;
            }
          }
          renderLivePreview();
        });
      }
    });

    // Department logo toggle
    const toggleDept = document.getElementById('toggle-dept-logo');
    if (toggleDept) {
      toggleDept.addEventListener('change', (e) => {
        formData.hasDepartmentLogo = e.target.checked;
        updateLogoPreviews();
        renderLivePreview();
      });
    }

    // Logo Upload Trigger Buttons (Opens file picker modal)
    const btnUploadNstu = document.getElementById('btn-upload-nstu-logo');
    if (btnUploadNstu) {
      btnUploadNstu.addEventListener('click', (e) => {
        e.preventDefault();
        const fi = document.getElementById('file-nstu-logo');
        if (fi) fi.click();
      });
    }

    const btnUploadDept = document.getElementById('btn-upload-dept-logo');
    if (btnUploadDept) {
      btnUploadDept.addEventListener('click', (e) => {
        e.preventDefault();
        const fi = document.getElementById('file-dept-logo');
        if (fi) fi.click();
      });
    }

    // Logo Upload Listeners
    setupLogoUpload('file-nstu-logo', 'nstuLogo');
    setupLogoUpload('file-dept-logo', 'departmentLogo');

    // Logo Restore Buttons
    const btnRestoreNstu = document.getElementById('btn-restore-nstu-logo');
    if (btnRestoreNstu) {
      btnRestoreNstu.addEventListener('click', () => {
        if (window.DEFAULT_LOGOS && window.DEFAULT_LOGOS.nstu) {
          formData.nstuLogo = window.DEFAULT_LOGOS.nstu;
          updateLogoPreviews();
          debouncedSave();
          renderLivePreview();
          showToast('Default NSTU Logo restored!', 'info');
        }
      });
    }

    const btnRestoreDept = document.getElementById('btn-restore-dept-logo');
    if (btnRestoreDept) {
      btnRestoreDept.addEventListener('click', () => {
        if (window.DEFAULT_LOGOS && window.DEFAULT_LOGOS.iit) {
          formData.departmentLogo = window.DEFAULT_LOGOS.iit;
          formData.hasDepartmentLogo = true;
          if (toggleDept) toggleDept.checked = true;
          updateLogoPreviews();
          debouncedSave();
          renderLivePreview();
          showToast('Default Department Logo restored!', 'info');
        }
      });
    }

    // Master Logo Size Sliders (Both Logos Synchronized)
    const masterSizeSlider = document.getElementById('slider-logo-size-master');
    if (masterSizeSlider) {
      masterSizeSlider.addEventListener('input', (e) => {
        updateMasterLogoSize(e.target.value);
      });
      masterSizeSlider.addEventListener('change', (e) => {
        updateMasterLogoSize(e.target.value);
      });
    }

    const card5LogoSlider = document.getElementById('slider-logo-size');
    if (card5LogoSlider) {
      card5LogoSlider.addEventListener('input', (e) => {
        updateMasterLogoSize(e.target.value);
      });
      card5LogoSlider.addEventListener('change', (e) => {
        updateMasterLogoSize(e.target.value);
      });
    }

    // Quick Logo Size Pills (85px, 110px, 135px)
    document.querySelectorAll('.btn-quick-logo-size').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sz = btn.getAttribute('data-size');
        if (sz) {
          updateMasterLogoSize(sz);
        }
      });
    });

    // Independent Logo Controls (Size and Horizontal Position)
    const nstuSizeSlider = document.getElementById('slider-nstu-logo-size');
    if (nstuSizeSlider) {
      nstuSizeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.nstuLogoSize = val;
        const lbl = document.getElementById('val-nstu-logo-size');
        if (lbl) lbl.textContent = `${val}px`;
        debouncedSave();
        renderLivePreview();
      });
    }

    const nstuXSlider = document.getElementById('slider-nstu-logo-x');
    if (nstuXSlider) {
      nstuXSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.nstuLogoX = val;
        const lbl = document.getElementById('val-nstu-logo-x');
        if (lbl) lbl.textContent = val === 0 ? '0px (Center)' : (val > 0 ? `+${val}px (Right)` : `${val}px (Left)`);
        debouncedSave();
        renderLivePreview();
      });
    }

    const nstuYSlider = document.getElementById('slider-nstu-logo-y');
    if (nstuYSlider) {
      nstuYSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.nstuLogoY = val;
        const lbl = document.getElementById('val-nstu-logo-y');
        if (lbl) lbl.textContent = val === 0 ? '0px (Level)' : (val > 0 ? `+${val}px (Down)` : `${val}px (Up)`);
        debouncedSave();
        renderLivePreview();
      });
    }

    const deptSizeSlider = document.getElementById('slider-dept-logo-size');
    if (deptSizeSlider) {
      deptSizeSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.deptLogoSize = val;
        const lbl = document.getElementById('val-dept-logo-size');
        if (lbl) lbl.textContent = `${val}px`;
        debouncedSave();
        renderLivePreview();
      });
    }

    const deptXSlider = document.getElementById('slider-dept-logo-x');
    if (deptXSlider) {
      deptXSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.deptLogoX = val;
        const lbl = document.getElementById('val-dept-logo-x');
        if (lbl) lbl.textContent = val === 0 ? '0px (Center)' : (val > 0 ? `+${val}px (Right)` : `${val}px (Left)`);
        debouncedSave();
        renderLivePreview();
      });
    }

    const deptYSlider = document.getElementById('slider-dept-logo-y');
    if (deptYSlider) {
      deptYSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.deptLogoY = val;
        const lbl = document.getElementById('val-dept-logo-y');
        if (lbl) lbl.textContent = val === 0 ? '0px (Level)' : (val > 0 ? `+${val}px (Down)` : `${val}px (Up)`);
        debouncedSave();
        renderLivePreview();
      });
    }

    const gapSlider = document.getElementById('slider-logos-gap');
    if (gapSlider) {
      gapSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        customization.logosGap = val;
        const lbl = document.getElementById('val-logos-gap');
        if (lbl) lbl.textContent = `${val}px`;
        debouncedSave();
        renderLivePreview();
      });
    }

    // Reset Logo Alignment Button
    const btnResetLogoPos = document.getElementById('btn-reset-logo-pos');
    if (btnResetLogoPos) {
      btnResetLogoPos.addEventListener('click', () => {
        customization.logoSize = defaultCustomization.logoSize;
        customization.nstuLogoSize = defaultCustomization.nstuLogoSize;
        customization.nstuLogoX = defaultCustomization.nstuLogoX;
        customization.nstuLogoY = defaultCustomization.nstuLogoY;
        customization.deptLogoSize = defaultCustomization.deptLogoSize;
        customization.deptLogoX = defaultCustomization.deptLogoX;
        customization.deptLogoY = defaultCustomization.deptLogoY;
        customization.logosGap = defaultCustomization.logosGap;

        populateFormInputs();
        debouncedSave();
        renderLivePreview();
        showToast('Logo alignment and sizes reset to default!', 'info');
      });
    }

    // Customization inputs
    const fontSelect = document.getElementById('select-font-family');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        customization.fontFamily = e.target.value;
        renderLivePreview();
      });
    }

    const marginSelect = document.getElementById('select-margin-size');
    if (marginSelect) {
      marginSelect.addEventListener('change', (e) => {
        customization.marginSize = e.target.value;
        renderLivePreview();
      });
    }

    const borderSelect = document.getElementById('select-page-border');
    if (borderSelect) {
      borderSelect.addEventListener('change', (e) => {
        customization.pageBorder = e.target.value;
        renderLivePreview();
      });
    }

    const headerColorInput = document.getElementById('input-header-color');
    if (headerColorInput) {
      headerColorInput.addEventListener('input', (e) => {
        customization.headerColor = e.target.value;
        renderLivePreview();
      });
    }

    // Preset color buttons
    document.querySelectorAll('.btn-color-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (color) {
          customization.headerColor = color;
          if (headerColorInput) headerColorInput.value = color;
          renderLivePreview();
        }
      });
    });

    const tableWidthSlider = document.getElementById('slider-table-width');
    if (tableWidthSlider) {
      tableWidthSlider.addEventListener('input', (e) => {
        customization.tableWidth = parseInt(e.target.value, 10);
        const valLabel = document.getElementById('val-table-width');
        if (valLabel) valLabel.textContent = `${customization.tableWidth}%`;
        renderLivePreview();
      });
    }

    // Date Shortcuts
    const btnDateToday = document.getElementById('btn-date-today');
    if (btnDateToday) {
      btnDateToday.addEventListener('click', () => {
        const todayStr = formatDateString(new Date());
        formData.submissionDate = todayStr;
        const input = document.getElementById('input-submissionDate');
        if (input) input.value = todayStr;
        renderLivePreview();
      });
    }

    const btnDateTomorrow = document.getElementById('btn-date-tomorrow');
    if (btnDateTomorrow) {
      btnDateTomorrow.addEventListener('click', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tmrwStr = formatDateString(tomorrow);
        formData.submissionDate = tmrwStr;
        const input = document.getElementById('input-submissionDate');
        if (input) input.value = tmrwStr;
        renderLivePreview();
      });
    }

    // Zoom Controls
    const btnZoomIn = document.getElementById('btn-zoom-in');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => applyZoom(currentZoom + 0.1));
    }

    const btnZoomOut = document.getElementById('btn-zoom-out');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => applyZoom(currentZoom - 0.1));
    }

    const btnZoomReset = document.getElementById('btn-zoom-reset');
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => applyZoom(0.8));
    }

    const btnZoomFit = document.getElementById('btn-zoom-fit');
    if (btnZoomFit) {
      btnZoomFit.addEventListener('click', () => {
        const wrapper = document.getElementById('preview-wrapper');
        if (wrapper) {
          const w = wrapper.clientWidth - 40;
          const a4WidthPx = 794; // 210mm at 96dpi
          const calculatedZoom = Math.min(1.0, w / a4WidthPx);
          applyZoom(calculatedZoom);
        }
      });
    }

    // Preset Selection
    const presetSelect = document.getElementById('select-quick-preset');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const key = e.target.value;
        if (window.NSTU_PRESETS && window.NSTU_PRESETS[key]) {
          formData = { ...formData, ...window.NSTU_PRESETS[key] };
          if (window.DEFAULT_LOGOS) {
            formData.nstuLogo = window.DEFAULT_LOGOS.nstu;
            formData.departmentLogo = window.DEFAULT_LOGOS.iit;
          }
          populateFormInputs();
          renderLivePreview();
          showToast(`Loaded "${window.NSTU_PRESETS[key].name}"!`, 'info');
        }
      });
    }

    // Reset Form Button
    const btnResetForm = document.getElementById('btn-reset-form');
    if (btnResetForm) {
      btnResetForm.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all fields to default NSTU sample values?')) {
          formData = { ...defaultFormData };
          customization = { ...defaultCustomization };
          populateFormInputs();
          renderLivePreview();
          showToast('Form reset to default sample values.', 'info');
        }
      });
    }

    // Download Actions
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    if (btnDownloadPdf) {
      btnDownloadPdf.addEventListener('click', handleDownloadPdf);
    }

    const btnDownloadDocx = document.getElementById('btn-download-docx');
    if (btnDownloadDocx) {
      btnDownloadDocx.addEventListener('click', handleDownloadDocx);
    }

    const btnPrintCover = document.getElementById('btn-print-cover');
    if (btnPrintCover) {
      btnPrintCover.addEventListener('click', () => {
        window.print();
      });
    }

    const btnDownloadPdfTop = document.getElementById('btn-download-pdf-top');
    if (btnDownloadPdfTop) {
      btnDownloadPdfTop.addEventListener('click', handleDownloadPdf);
    }

    const btnDownloadDocxTop = document.getElementById('btn-download-docx-top');
    if (btnDownloadDocxTop) {
      btnDownloadDocxTop.addEventListener('click', handleDownloadDocx);
    }

    // Mobile Tab Switcher
    const tabBtnForm = document.getElementById('mobile-tab-btn-form');
    const tabBtnPreview = document.getElementById('mobile-tab-btn-preview');
    const formSection = document.getElementById('form-container');
    const previewSection = document.getElementById('preview-wrapper');

    if (tabBtnForm && tabBtnPreview && formSection && previewSection) {
      tabBtnForm.addEventListener('click', () => {
        tabBtnForm.classList.add('bg-blue-900', 'text-white');
        tabBtnForm.classList.remove('bg-white', 'text-slate-700');
        tabBtnPreview.classList.add('bg-white', 'text-slate-700');
        tabBtnPreview.classList.remove('bg-blue-900', 'text-white');

        formSection.classList.remove('mobile-inactive-tab');
        formSection.classList.add('mobile-active-tab');
        previewSection.classList.remove('mobile-active-tab');
        previewSection.classList.add('mobile-inactive-tab');
      });

      tabBtnPreview.addEventListener('click', () => {
        tabBtnPreview.classList.add('bg-blue-900', 'text-white');
        tabBtnPreview.classList.remove('bg-white', 'text-slate-700');
        tabBtnForm.classList.add('bg-white', 'text-slate-700');
        tabBtnForm.classList.remove('bg-blue-900', 'text-white');

        previewSection.classList.remove('mobile-inactive-tab');
        previewSection.classList.add('mobile-active-tab');
        formSection.classList.remove('mobile-active-tab');
        formSection.classList.add('mobile-inactive-tab');

        const w = window.innerWidth - 32;
        const a4WidthPx = 794;
        applyZoom(Math.min(0.85, w / a4WidthPx));
      });
    }

    // Navbar & Hero "Create Cover Page" Buttons linked to Edit Section
    const navCreateBtns = document.querySelectorAll('#btn-nav-create, #btn-nav-create-mobile, #btn-hero-create');
    navCreateBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('generator-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        // If mobile view, ensure form edit tab is selected
        const tabForm = document.getElementById('mobile-tab-btn-form');
        if (tabForm && window.innerWidth < 1024) {
          tabForm.click();
        }
        const firstInput = document.getElementById('input-assignmentTopic') || document.getElementById('input-universityName');
        if (firstInput) setTimeout(() => firstInput.focus(), 650);
      });
    });
  }

  // Helper for logo upload with file reader
  function setupLogoUpload(inputId, stateKey) {
    const inputEl = document.getElementById(inputId);
    if (!inputEl) return;

    inputEl.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.match(/^image\/(png|jpeg|jpg|webp|svg\+xml)$/)) {
        showToast('Please upload a valid image (PNG, JPEG, WebP, or SVG).', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file is too large (max 5MB).', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        formData[stateKey] = event.target.result;
        if (stateKey === 'departmentLogo') {
          formData.hasDepartmentLogo = true;
          const toggle = document.getElementById('toggle-dept-logo');
          if (toggle) toggle.checked = true;
        }
        updateLogoPreviews();
        debouncedSave();
        renderLivePreview();
        inputEl.value = ''; // Reset so same file can be selected again
        showToast('Custom logo uploaded successfully!', 'success');
      };
      reader.onerror = () => {
        showToast('Error reading image file.', 'error');
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle PDF Download
  async function handleDownloadPdf() {
    const btn = document.getElementById('btn-download-pdf');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner mr-2"></span> Generating PDF...';
    }

    try {
      if (!window.NSTU_PDF) throw new Error('PDF module not initialized.');
      const safeId = (formData.studentId || formData.courseCode || 'CoverPage').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `NSTU_Cover_${safeId}.pdf`;

      await window.NSTU_PDF.downloadPdf(formData, customization, filename);

      showToast('PDF downloaded successfully! Text is fully selectable.', 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  // Handle DOCX Download
  async function handleDownloadDocx() {
    const btn = document.getElementById('btn-download-docx');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner mr-2"></span> Generating DOCX...';
    }

    try {
      if (!window.NSTU_DOCX) throw new Error('DOCX module not initialized.');
      const safeId = (formData.studentId || formData.courseCode || 'CoverPage').replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `NSTU_Cover_${safeId}.docx`;

      await window.NSTU_DOCX.downloadDocx(formData, customization, filename);

      showToast('Word document downloaded with editable tables & text!', 'success');
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error('DOCX generation error:', err);
      showToast('Failed to generate DOCX. Please try again.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  // NSTU Faculty Directory - Two Dropdowns (1. Dept -> 2. Teacher) with Auto-Fill
  function initTeacherDirectory() {
    const deptSelect = document.getElementById('select-teacher-dept');
    const teacherSelect = document.getElementById('select-teacher-name');
    const countBadge = document.getElementById('teacher-count-badge');
    const hintEl = document.getElementById('nstu-directory-hint');

    if (!deptSelect || !teacherSelect) return;

    const data = window.NSTU_TEACHERS_DATA || {};
    const deptList = Object.values(data).sort((a, b) => a.name.localeCompare(b.name));

    // Populate Department dropdown
    deptSelect.innerHTML = '<option value="">-- 1. Select Department / Institute --</option>';
    deptList.forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept.code;
      opt.textContent = dept.name;
      deptSelect.appendChild(opt);
    });

    // Also populate student department datalist if available
    const deptDatalist = document.getElementById('department-list');
    if (deptDatalist && deptList.length > 0) {
      deptDatalist.innerHTML = '';
      deptList.forEach(dept => {
        const opt = document.createElement('option');
        opt.value = dept.name;
        deptDatalist.appendChild(opt);
      });
    }

    // Function to populate teachers of chosen department
    function populateTeachers(deptCode, preselectIdx = -1) {
      teacherSelect.innerHTML = '';
      if (!deptCode || !data[deptCode]) {
        teacherSelect.disabled = true;
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-- 2. First Select Department Above --';
        teacherSelect.appendChild(opt);
        if (hintEl) hintEl.textContent = 'First select a department, then select the teacher from the list below.';
        return;
      }

      const dept = data[deptCode];
      teacherSelect.disabled = false;

      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = `-- 2. Select Teacher from ${dept.name} (${dept.teachers ? dept.teachers.length : 0} found) --`;
      placeholder.disabled = true;
      if (preselectIdx === -1) placeholder.selected = true;
      teacherSelect.appendChild(placeholder);

      if (dept.teachers) {
        dept.teachers.forEach((t, idx) => {
          const opt = document.createElement('option');
          opt.value = `${dept.code}:${idx}`;
          opt.textContent = `${t.name} — ${t.designation}`;
          if (preselectIdx === idx) opt.selected = true;
          teacherSelect.appendChild(opt);
        });
      }

      if (hintEl) {
        hintEl.innerHTML = `Showing faculty for <strong class="text-blue-900">${dept.name}</strong>. Choose a teacher to auto-fill.`;
      }
    }

    // Helper to auto-fill teacher fields and trigger preview update
    function selectAndFillTeacher(teacher, deptName) {
      if (!teacher) return;

      formData.teacherName = teacher.name || '';
      formData.teacherDesignation = teacher.designation || '';

      // Clean department naming for IIT & IIS
      let deptNameVal = teacher.department || deptName || '';
      const checkStr = ((teacher.deptCode || '') + ' ' + deptNameVal + ' ' + (teacher.name || '')).toLowerCase();
      if (teacher.deptCode === 'IIT(SE)' || checkStr.includes('information technology') || (checkStr.includes('software engineering') && !checkStr.includes('environmental'))) {
        deptNameVal = 'Institute of Information Technology';
      } else if (teacher.deptCode === 'IIS' || teacher.deptCode === 'ISLM' || checkStr.includes('information science') || checkStr.includes('library management')) {
        deptNameVal = 'Institute of Information Science';
      }

      formData.teacherDepartment = deptNameVal;
      formData.teacherUniversity = teacher.university || 'Noakhali Science and Technology University';

      const fieldsToHighlight = ['input-teacherName', 'input-teacherDesignation', 'input-teacherDepartment', 'input-teacherUniversity'];
      fieldsToHighlight.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (id === 'input-teacherName') el.value = formData.teacherName;
          if (id === 'input-teacherDesignation') el.value = formData.teacherDesignation;
          if (id === 'input-teacherDepartment') el.value = formData.teacherDepartment;
          if (id === 'input-teacherUniversity') el.value = formData.teacherUniversity;

          // Visual highlight animation
          el.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/60');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/60');
          }, 1400);
        }
      });

      debouncedSave();
      renderLivePreview();
      showToast(`Selected: ${teacher.name} (${teacher.designation})`, 'success');
    }

    // Event: Department dropdown changed
    deptSelect.addEventListener('change', (e) => {
      const deptCode = e.target.value;
      populateTeachers(deptCode);
    });

    // Event: Teacher dropdown changed
    teacherSelect.addEventListener('change', (e) => {
      const val = teacherSelect.value;
      if (!val) return;
      const [deptCode, idxStr] = val.split(':');
      const idx = parseInt(idxStr, 10);
      if (data[deptCode] && data[deptCode].teachers && data[deptCode].teachers[idx]) {
        const teacher = data[deptCode].teachers[idx];
        selectAndFillTeacher(teacher, data[deptCode].name);
      }
    });

    // Synchronize teacher dropdown selection with formData.teacherName
    function syncTeacherDropdownWithFormData() {
      if (!formData.teacherName) {
        deptSelect.value = '';
        populateTeachers('');
        return;
      }

      const targetName = formData.teacherName.trim().toLowerCase();
      let matchedDeptCode = '';
      let matchedIdx = -1;

      for (const dept of deptList) {
        if (!dept.teachers) continue;
        const idx = dept.teachers.findIndex(t => t.name && t.name.trim().toLowerCase() === targetName);
        if (idx !== -1) {
          matchedDeptCode = dept.code;
          matchedIdx = idx;
          break;
        }
      }

      if (matchedDeptCode && matchedIdx !== -1) {
        deptSelect.value = matchedDeptCode;
        populateTeachers(matchedDeptCode, matchedIdx);
      } else {
        deptSelect.value = '';
        populateTeachers('');
      }
    }

    // Expose for external calls (like preset or reset)
    window.syncTeacherDirectorySelection = syncTeacherDropdownWithFormData;

    // Initial population on load
    syncTeacherDropdownWithFormData();
  }

  // Accordion / Collapsible Sections for Form Cards
  function initFormAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    const expandAllBtn = document.getElementById('btn-accordion-expand-all');
    const collapseAllBtn = document.getElementById('btn-accordion-collapse-all');

    function toggleAccordion(header, forceOpen = null) {
      const targetId = header.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const chevron = header.querySelector('.accordion-chevron');
      const statusEl = header.querySelector('.accordion-status');
      if (!content) return;

      const isCurrentlyOpen = !content.classList.contains('hidden');
      const shouldOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

      if (shouldOpen) {
        content.classList.remove('hidden');
        header.setAttribute('aria-expanded', 'true');
        header.classList.add('bg-blue-50/40');
        if (chevron) chevron.classList.add('rotate-180');
        if (statusEl) {
          statusEl.textContent = 'Editing';
          statusEl.className = 'accordion-status text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 hidden sm:inline-block';
        }
      } else {
        content.classList.add('hidden');
        header.setAttribute('aria-expanded', 'false');
        header.classList.remove('bg-blue-50/40');
        if (chevron) chevron.classList.remove('rotate-180');
        if (statusEl) {
          statusEl.textContent = 'Click to Edit';
          statusEl.className = 'accordion-status text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hidden sm:inline-block';
        }
      }

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    headers.forEach(header => {
      header.addEventListener('click', () => {
        toggleAccordion(header);
      });
    });

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => {
        headers.forEach(h => toggleAccordion(h, true));
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', () => {
        headers.forEach(h => toggleAccordion(h, false));
      });
    }
  }

  // University Campus Photo Carousel in Hero Section
  function initHeroSlider() {
    const frame = document.getElementById('hero-carousel-frame');
    if (!frame) return;

    const slides = frame.querySelectorAll('.hero-slide-img');
    const dotsContainer = document.getElementById('hero-slider-dots');
    const counter = document.getElementById('hero-slider-counter');
    const captionEl = document.getElementById('hero-slider-caption');
    const prevBtn = document.getElementById('btn-hero-prev');
    const nextBtn = document.getElementById('btn-hero-next');

    if (!slides.length) return;

    // =========================================================================
    // NSTU CAMPUS PHOTO LOCATION NAMES (ক্যাম্পাসের লোকেশন নাম পরিবর্তন করুন এখানে)
    // =========================================================================
    // নিচের ৬টি নাম আপনার সঠিক ছবির নাম/লোকেশন অনুযায়ী বাংলায় বা ইংরেজিতে পরিবর্তন করুন:
    const captions = [
      "Shahid Minar",   // 1. image1.jpg এর লোকেশন নাম
      "Administration Building",      // 2. image2.jpeg এর লোকেশন নাম
      "July Shaheed Smriti Chhatri Hall",            // 3. image3.jpeg এর লোকেশন নাম
      "Shahid Minar", // 4. image4.jpeg এর লোকেশন নাম
      "Campus main gate",       // 5. image5.jpeg এর লোকেশন নাম
      "NSTU central mosque",   // 6. image6.jpeg এর লোকেশন নাম
      "Shahid Minar",   // 1. image1.jpg এর লোকেশন নাম
      "Administration Building",      // 2. image2.jpeg এর লোকেশন নাম
      "July Shaheed Smriti Chhatri Hall",            // 3. image3.jpeg এর লোকেশন নাম
      "Shahid Minar", // 4. image4.jpeg এর লোকেশন নাম
      "Campus main gate",       // 5. image5.jpeg এর লোকেশন নাম
      "NSTU central mosque"   // 6. image6.jpeg এর লোকেশন নাম
    ];

    let currentIndex = 0;
    let timer = null;
    const intervalMs = 3000;

    // Render dot indicators
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `transition-all duration-300 rounded-full cursor-pointer ${idx === 0 ? 'w-6 h-2 bg-blue-400 shadow-sm' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`;
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(idx);
          resetTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
          slide.classList.remove('opacity-0', 'scale-105', 'pointer-events-none', 'z-0');
          slide.classList.add('opacity-100', 'scale-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'scale-100', 'z-10');
          slide.classList.add('opacity-0', 'scale-105', 'pointer-events-none', 'z-0');
        }
      });

      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
      }

      if (captionEl && captions[currentIndex]) {
        captionEl.innerHTML = `<i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-400 shrink-0"></i> ${captions[currentIndex]}`;
        if (window.lucide) window.lucide.createIcons({ root: captionEl });
      }

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, idx) => {
          if (idx === currentIndex) {
            dot.className = 'transition-all duration-300 rounded-full w-6 h-2 bg-blue-400 shadow-sm cursor-pointer';
          } else {
            dot.className = 'transition-all duration-300 rounded-full w-2 h-2 bg-white/40 hover:bg-white/70 cursor-pointer';
          }
        });
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(nextSlide, intervalMs);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetTimer() {
      stopTimer();
      startTimer();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetTimer();
      });
    }

    // Pause on hover
    frame.addEventListener('mouseenter', stopTimer);
    frame.addEventListener('mouseleave', startTimer);

    // Touch swipe support for mobile
    let touchStartX = 0;
    frame.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    frame.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        nextSlide();
      } else if (touchEndX - touchStartX > 40) {
        prevSlide();
      }
      startTimer();
    }, { passive: true });

    // Initial start
    goToSlide(0);
    startTimer();
  }

  // Initialize on DOM Ready or immediately if already loaded
  function initApp() {
    initHeroSlider();
    initFormAccordions();
    initTeacherDirectory();
    populateFormInputs();
    renderLivePreview();
    bindEventListeners();
    applyZoom(window.innerWidth < 1024 ? 0.65 : 0.78);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // Expose globals for debugging/testing
  window.NSTU_APP = {
    getFormData: () => formData,
    getCustomization: () => customization,
    setFormData: (newData) => {
      formData = { ...formData, ...newData };
      populateFormInputs();
      renderLivePreview();
    },
    updateMasterLogoSize,
    initTeacherDirectory,
    renderLivePreview,
    showToast
  };
})();
