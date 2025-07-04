let chart; // Global chart instance

window.onload = () => {
  const table = document.getElementById("gradeTable");

  // Add input filters and blur validation to grade cells
  for (let i = 1; i <= 5; i++) {
    const gradeCell = table.rows[i].cells[2];

    gradeCell.addEventListener("input", () => {
      let val = gradeCell.innerText.replace(/[^0-9.]/g, '');
      const parts = val.split('.');
      if (parts.length > 2) val = parts[0] + '.' + parts[1];
      gradeCell.innerText = val;
      placeCaretAtEnd(gradeCell);
    });

    gradeCell.addEventListener("blur", () => {
      let val = parseFloat(gradeCell.innerText);
      if (isNaN(val) || val < 2 || val > 4) {
        gradeCell.innerText = "";
        table.rows[i].cells[3].innerText = "";
      } else {
        val = Math.floor(val * 100) / 100;
        gradeCell.innerText = val.toFixed(2);
        table.rows[i].cells[3].innerText = (val * 3).toFixed(2);
      }
    });
  }

  // Draw empty chart on load
  const defaultLabels = ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"];
  const emptyData = [null, null, null, null, null];
  drawGraph(defaultLabels, emptyData);
};

function calculateGPA() {
  const table = document.getElementById("gradeTable");
  let total = 0;
  let valid = true;
  let labels = [];
  let data = [];

  for (let i = 1; i <= 5; i++) {
    const subject = table.rows[i].cells[0].innerText.trim() || `Subject ${i}`;
    const grade = parseFloat(table.rows[i].cells[2].innerText);

    if (isNaN(grade) || grade < 2 || grade > 4) {
      valid = false;
      break;
    }

    labels.push(subject);
    data.push(grade);
    total += grade * 3;
  }

  document.getElementById("finalGPA").innerText = valid
    ? (total / 15).toFixed(2)
    : "⚠️ Enter valid grades : (";

  if (valid) {
    drawGraph(labels, data);
  }
}

function resetTable() {
  const table = document.getElementById("gradeTable");

  for (let i = 1; i <= 5; i++) {
    table.rows[i].cells[0].innerText = "";
    table.rows[i].cells[2].innerText = "";
    table.rows[i].cells[3].innerText = "";
  }

  document.getElementById("finalGPA").innerText = "";

  // Redraw empty graph
  const defaultLabels = ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"];
  const emptyData = [null, null, null, null, null];
  drawGraph(defaultLabels, emptyData);
}

function drawGraph(labels, data) {
  const ctx = document.getElementById('gradeChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Grade per Subject',
        data: data,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.2,
        fill: true,
        pointRadius: 5,
        spanGaps: true
      }]
    },
    options: {
      responsive: true,
      animation: { duration: 700 },
      scales: {
        y: {
          min: 0,
          max: 4.5,
          title: { display: true, text: 'Grade' }
        },
        x: {
          title: { display: true, text: 'Subjects' }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection !== "undefined"
      && typeof document.createRange !== "undefined") {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

function limitSubjectLength(cell) {
  const maxLength = 14;
  if (cell.innerText.length > maxLength) {
    cell.innerText = cell.innerText.slice(0, maxLength);
    placeCaretAtEnd(cell);
  }
}


// this is the new code

 let chart1 = null;

    const labels = [
      "Sem 1", "Sem 2", "Sem 3", "Sem 4", 
      "Sem 5", "Sem 6", "Sem 7", "Sem 8", "Internship"
    ];

    // 📈 Create empty chart with only axes
    function setupChart() {
  const ctx = document.getElementById("gpaChart").getContext("2d");
  chart1 = new Chart(ctx, { // <-- FIXED
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        data: [],
        borderColor: "blue",
        backgroundColor: "lightblue",
        fill: false,
        tension: 0.1,
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          min: 0,
          max: 4.5,
          title: {
            display: true,
            text: "GPA"
          }
        },
        x: {
          title: {
            display: true,
            text: "Semester"
          }
        }
      }
    }
  });
}

    function handleGPA(cell) {
      const raw = cell.textContent.trim();

      // Allow only digits and a single dot
      if (!/^\d*\.?\d*$/.test(raw)) {
        cell.textContent = '';
        return;
      }

      const value = parseFloat(raw);
      const row = cell.parentElement;
      const credit = row.rowIndex === 9 ? 3 : 15;
      const earnedCell = row.querySelector(".earned");

      if (raw === '' || isNaN(value) || value < 2 || value > 4) {
        cell.textContent = '';
        earnedCell.textContent = '';
        return;
      }

      earnedCell.textContent = (value * credit).toFixed(2);
    }

    function calculateCGPA() {
      let totalPoints = 0;
      let valid = true;
      let gpaData = [];

      document.querySelectorAll("#cgpaTable tr").forEach((row, index) => {
        const gpaCell = row.querySelector('[contenteditable="true"]');
        if (gpaCell) {
          const value = parseFloat(gpaCell.textContent.trim());
          const credit = index === 9 ? 3 : 15;

          if (isNaN(value) || value < 2 || value > 4) {
            valid = false;
          } else {
            totalPoints += value * credit;
            gpaData.push(value);
          }
        }
      });

      const cgpaDisplay = document.getElementById("finalCGPA");

      if (!valid) {
        cgpaDisplay.textContent = "Only numbers between 2.00 and 4.00 are allowed";
        cgpaDisplay.classList.add("error");
        chart.data.datasets[0].data = [];
        chart.update();
        return;
      }

      const cgpa = totalPoints / 123;
      cgpaDisplay.textContent = cgpa.toFixed(2);
      cgpaDisplay.classList.remove("error");

      // ✅ Update Graph
      chart1.data.datasets[0].data = gpaData;
      chart1.update();
    }

    function resetTable() {
      document.querySelectorAll('[contenteditable="true"]').forEach(cell => cell.textContent = '');
      document.querySelectorAll(".earned").forEach(cell => cell.textContent = '');
      const cgpa = document.getElementById("finalCGPA");
      cgpa.textContent = '';
      cgpa.classList.remove("error");

      // ❌ Clear Chart
      chart1.data.datasets[0].data = [];
      chart1.update();
    }

    // ⚡ Initialize empty graph on page load
    setupChart();