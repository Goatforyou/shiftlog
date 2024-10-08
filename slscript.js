// script.js
const form = document.getElementById('shift-log-form');
const tbody = document.getElementById('shift-logs-tbody');

// Store shift logs in local storage
const shiftLogs = JSON.parse(localStorage.getItem('shiftLogs')) || [];

// Handle form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const minerName = document.getElementById('miner-name').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const events = document.getElementById('events').value;

    // Create a new shift log object
    const shiftLog = {
        id: Date.now(), // unique id for each shift log
        minerName,
        startTime,
        endTime,
        events
    };

    // Add the new shift log to the array
    shiftLogs.push(shiftLog);

    // Save the updated array to local storage
    localStorage.setItem('shiftLogs', JSON.stringify(shiftLogs));

    // Display the updated shift logs in the table
    displayShiftLogs();
});

// Display shift logs in the table
function displayShiftLogs() {
    tbody.innerHTML = '';
    shiftLogs.forEach((shiftLog, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${shiftLog.minerName}</td>
            <td>${shiftLog.startTime}</td>
            <td>${shiftLog.endTime}</td>
            <td>${shiftLog.events}</td>
            <td>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle edit button click
tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const index = e.target.dataset.index;
        const shiftLog = shiftLogs[index];
        document.getElementById('miner-name').value = shiftLog.minerName;
        document.getElementById('start-time').value = shiftLog.startTime;
        document.getElementById('end-time').value = shiftLog.endTime;
        document.getElementById('events').value = shiftLog.events;
        // Add a hidden input to store the index of the shift log being edited
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'index';
        hiddenInput.value = index;
        form.appendChild(hiddenInput);
    }
});

// Handle delete button click
tbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        shiftLogs.splice(index, 1);
        localStorage.setItem('shiftLogs', JSON.stringify(shiftLogs));
        displayShiftLogs();
    }
});

// Handle form submission for editing
form.addEventListener('submit', (e) => {
    if (e.target.querySelector('input[name="index"]')) {
        e.preventDefault();
        const index = e.target.querySelector('input[name="index"]').value;
        const minerName = document.getElementById('miner-name').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const events = document.getElementById('events').value;
        shiftLogs[index] = {
            id: shiftLogs[index].id,
            minerName,
            startTime,
            endTime,
            events
        };
        localStorage.setItem('shiftLogs', JSON.stringify(shiftLogs));
        displayShiftLogs();
        // Remove the hidden input
        e.target.querySelector('input[name="index"]').remove();
    }
});


// Get the download button element
var downloadButton = document.getElementById('downloadToExcel');

// Add an event listener to the download button click event
downloadButton.addEventListener('click', function(event) {
  event.preventDefault();

  // Get the user input data from the form
  var formData = new FormData(form);

  // Create a new XLSX workbook
  var workbook = XLSX.createWorkbook();

  // Create a new worksheet
  var worksheet = workbook.addWorksheet('Sheet1');

  // Set the header row
  var headerRow = ['Name', 'Email'];
  worksheet.addRow(headerRow);

  // Add the user input data to the worksheet
  var rowData = [formData.get('name'), formData.get('email')];
  worksheet.addRow(rowData);

  // Generate the Excel file
  var excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  // Download the Excel file
  var link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([excelFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  link.download = 'Book1.xlsx';
  link.click();
});