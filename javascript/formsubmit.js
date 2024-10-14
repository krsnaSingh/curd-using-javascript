/*
    Author: Krishna Singh
    Date: 10-10-2024
    Description: This JavaScript file contains methods for simple CRUD (create, read, update, delete) operations.
*/

let employees = JSON.parse(localStorage.getItem('employees')) || [];
let editingIndex = null;

// Saving to local storage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Validation Functions
const validationFunctions = {
    name: validateName,
    dob: validateDOB,
    email: validateEmail,
    phone: validatePhone,
};

Object.keys(validationFunctions).forEach(field => {
    document.getElementById(field).addEventListener("input", validationFunctions[field]);
});

function validateName() {
    const name = document.getElementById("name").value;
    if (!/^[A-Za-z0-9 ]{4,20}$/.test(name)) {
        showError("name", "Name must be 4-20 characters long and can only contain letters, numbers, and spaces.");
    } else {
        clearError("name");
    }
}

function validateDOB() {
    const dobDate = new Date(document.getElementById("dob").value);
    const today = new Date();
    if (dobDate >= today) {
        showError("dob", "Date of Birth must be in the past");
    } else {
        clearError("dob");
    }
}

function validateEmail() {
    const email = document.getElementById("email").value;
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        showError("email", "Please enter a valid email address");
    } else {
        clearError("email");
    }
}

function validatePhone() {
    const phone = document.getElementById("phone").value;
    if (!/^\d{10}$/.test(phone)) {
        showError("phone", "Phone number must be exactly 10 digits");
    } else {
        clearError("phone");
    }
}

function showError(field, message) {
    document.getElementById(`${field}Error`).innerHTML = message;
    document.getElementById(field).classList.add("error-border");
}

function clearError(field) {
    document.getElementById(`${field}Error`).innerHTML = "";
    document.getElementById(field).classList.remove("error-border");
}

// Insert a new row or update an existing one in the basic table
function updateBasicTableRow(employee, index) {
    const basicTableBody = document.querySelector('.basic-table tbody');
    let row = document.getElementById(`row-${index}`);

    if (!row) { 
        row = document.createElement('tr');
        row.setAttribute('id', `row-${index}`);
        basicTableBody.appendChild(row);
    }

    row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td>${employee.dob}</td>
        <td>${employee.email}</td>
        <td>${employee.phone}</td>
        <td>${employee.hobbies.join(', ')}</td>
        <td>
            <a  onclick="editEmployee(${index})"><i class="fa-solid fa-user-pen" style="color: #080b35;"></i></a> |
            <a  onclick="deleteEmployee(${index})"><i class="fa-solid fa-trash" style="color: #f20d0d;"></i></a>
        </td>
    `;
}

// Display the entire basic table
function displayBasicTable() {
    employees.forEach((employee, index) => {
        updateBasicTableRow(employee, index);
    });
}

// Insert a new row or update an existing one in the advanced table
function updateAdvanceTable(employee, index) {
    let nameCell = document.getElementById(`adv-cell-name-${index}`);
    
    if (!nameCell) {
        // Row doesn't exist, create new rows
        const advRowName = document.getElementById('adv-row-name');
        const advRowGender = document.getElementById('adv-row-gender');
        const advRowDob = document.getElementById('adv-row-dob');
        const advRowEmail = document.getElementById('adv-row-email');
        const advRowPhone = document.getElementById('adv-row-phone');
        const advRowHobbies = document.getElementById('adv-row-hobbies');
        const advRowActions = document.getElementById('adv-row-actions');

        advRowName.innerHTML += `<td id="adv-cell-name-${index}">${employee.name}</td>`;
        advRowGender.innerHTML += `<td id="adv-cell-gender-${index}">${employee.gender}</td>`;
        advRowDob.innerHTML += `<td id="adv-cell-dob-${index}">${employee.dob}</td>`;
        advRowEmail.innerHTML += `<td id="adv-cell-email-${index}">${employee.email}</td>`;
        advRowPhone.innerHTML += `<td id="adv-cell-phone-${index}">${employee.phone}</td>`;
        advRowHobbies.innerHTML += `<td id="adv-cell-hobbies-${index}">${employee.hobbies.join(', ')}</td>`;
        advRowActions.innerHTML += `
            <td id="adv-cell-action-${index}">
                <a onclick="editEmployee(${index})"><i class="fa-solid fa-user-pen" style="color: #080b35;"></i></a> |
                <a onclick="deleteEmployee(${index})"><i class="fa-solid fa-trash" style="color: #f20d0d;"></i></a>
            </td>`;
    } else {
        // Row exists, update the cells
        nameCell.innerHTML = employee.name;
        document.getElementById(`adv-cell-gender-${index}`).innerHTML = employee.gender;
        document.getElementById(`adv-cell-dob-${index}`).innerHTML = employee.dob;
        document.getElementById(`adv-cell-email-${index}`).innerHTML = employee.email;
        document.getElementById(`adv-cell-phone-${index}`).innerHTML = employee.phone;
        document.getElementById(`adv-cell-hobbies-${index}`).innerHTML = employee.hobbies.join(', ');
    }
}

// Create the advanced table initially
function createAdvancedTable() {
    const advanceTableContainer = document.querySelector('.advance-table-container');

    // Clear existing table if any
    advanceTableContainer.innerHTML = '';

    // Create table HTML
    let tableHtml = `
    <table class="advance-table">              
        <tbody>
            <tr id="adv-row-name">
                <th>Name</th>
            </tr>
            <tr id="adv-row-gender">
                <th>Gender</th>
            </tr>
            <tr id="adv-row-dob">
                <th>DOB</th>
            </tr>
            <tr id="adv-row-email">
                <th>Email</th>
            </tr>
            <tr id="adv-row-phone">
                <th>Phone No</th>
            </tr>
            <tr id="adv-row-hobbies">
                <th>Hobbies</th>
            </tr>
            <tr id="adv-row-actions">
                <th>Actions</th>
            </tr>
        </tbody>
    </table>
`;

    advanceTableContainer.innerHTML = tableHtml;
}

// Display the advanced table initially
function displayAdvancedTable() {
     createAdvancedTable();  
    employees.forEach((employee, index) => {
        updateAdvanceTable(employee, index);
    });
}

// Display both tables on DOMContentLoaded
function displayTables() {

    //disable future date
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').setAttribute("max", today);

    displayBasicTable();
    displayAdvancedTable();
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    // Validate all fields
    validateName();
    validateDOB();
    validateEmail();
    validatePhone();

    if (document.querySelectorAll('.error-border').length > 0) {
        return;
    }

    const employeeData = {
        name: document.getElementById('name').value,
        gender: document.querySelector('input[name="gender"]:checked').nextElementSibling.textContent,
        dob: document.getElementById('dob').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(checkbox => checkbox.nextSibling.textContent.trim())
    };

    if (editingIndex !== null) {
        employees[editingIndex] = employeeData;
        updateBasicTableRow(employeeData, editingIndex);
        updateAdvanceTable(employeeData, editingIndex); 
        editingIndex = null;
    } else {
        employees.push(employeeData);
        updateBasicTableRow(employeeData, employees.length - 1);
        updateAdvanceTable(employeeData, employees.length - 1); 
    }

    saveToLocalStorage();
    resetForm();
}

// Reset form after submission
function resetForm() {
    document.querySelector('form').reset();
    editingIndex = null;
}

// Delete employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveToLocalStorage();

    // Remove from basic table
    const basicRow = document.getElementById(`row-${index}`);
    if (basicRow) basicRow.remove();

    // Remove cells from the advanced table
    const cellsToRemove = [
        document.getElementById(`adv-cell-name-${index}`),
        document.getElementById(`adv-cell-gender-${index}`),
        document.getElementById(`adv-cell-dob-${index}`),
        document.getElementById(`adv-cell-email-${index}`),
        document.getElementById(`adv-cell-phone-${index}`),
        document.getElementById(`adv-cell-hobbies-${index}`),
        document.getElementById(`adv-cell-action-${index}`)

    ];

    cellsToRemove.forEach(cell => {
        if (cell) cell.remove();
    });
}

// Edit employee
function editEmployee(index) {
    const employee = employees[index];
    document.getElementById('name').value = employee.name;
    document.getElementById('dob').value = employee.dob;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;

    document.querySelectorAll('input[name="hobbies"]').forEach(checkbox => {
        checkbox.checked = employee.hobbies.includes(checkbox.nextSibling.textContent.trim());
    });

    document.getElementById(employee.gender === 'Male' ? '1' : '2').checked = true;


    editingIndex = index;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', displayTables);
document.querySelector('form').addEventListener('submit', handleSubmit);
