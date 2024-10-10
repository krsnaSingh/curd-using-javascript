/*
    Author: Krishna Singh
    Date: 10-10-2024
    Description: This javascript file contains methods to simple crud (create, read, update ,delete) operations.
*/

let employees = JSON.parse(localStorage.getItem('employees')) || [];
let editingIndex = null;

//saving to local storage
function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Validation Function
function validateInputs(name, dob, email, phone) {
    
    if (!/^[A-Za-z0-9 ]{4,20}$/.test(name)) {
        alert("Name must be 4-20 characters long and can only contain letters, numbers, and spaces.");
        return false;
    }

    
    const today = new Date();
    const dobDate = new Date(dob);
    if (dobDate >= today) {
        alert("Date of Birth must be in the past.");
        return false;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    
    if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        return false;
    }

    return true;
}

//handle submit form
function handleSubmit(event) {
    event.preventDefault(); 

    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked').nextElementSibling.textContent;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!validateInputs(name, dob, email, phone)) {
        return; 
    }
    
    const hobbies = Array.from(document.querySelectorAll('input[name="hobbies"]:checked')) 
                         .map(checkbox => checkbox.nextSibling.textContent.trim()); 

    if(editingIndex!==null){
         //Update existing employee
        employees[editingIndex] = {
            name,
            gender,
            dob,
            email,
            phone,
            hobbies
        };

        editingIndex = null; 

    }else{

        const newEmployee = {
            name,
            gender,
            dob,    
            email,
            phone,
            hobbies
        };

        employees.push(newEmployee);
    }

    saveToLocalStorage();
    displaybasicTable(); 
    displayAdvancedTable()
    document.querySelector('form').reset();
}

//Displaying Basic table data
function displaybasicTable() {

    const basicTableBody = document.querySelector('.basic-table tbody');
    basicTableBody.innerHTML = ''; 

    employees.forEach((employee, index) => {
        const row = `<tr>
                        <td>${employee.name}</td>
                        <td>${employee.gender}</td>
                        <td>${employee.dob}</td>
                        <td>${employee.email}</td>
                        <td>${employee.phone}</td>
                        <td>${employee.hobbies.join(', ')}</td>
                        <td><button class='editbutton' onclick="editEmployee(${index})">Edit</button> | <button class="deletebutton" onclick="deleteEmployee(${index})">Delete</button></td>
                    </tr>`;
        basicTableBody.innerHTML += row;
    })
}

//Displaying Basic table data
function displayAdvancedTable() {
    const advanceTableContainer = document.querySelector('.advance-table-container');
    
    if (employees.length === 0) {
        advanceTableContainer.innerHTML = '<p>No employees available.</p>';
        return;
    }

    let tableHtml = `
        <table class="advance-table">
            <thead>
                <tr>
                    <th>Name</th>
                    ${employees.map(employee => `<td>${employee.name}</td>`).join('')}
                </tr>
                <tr>
                    <th>Gender</th>
                    ${employees.map(employee => `<td>${employee.gender}</td>`).join('')}
                </tr>
                <tr>
                    <th>DOB</th>
                    ${employees.map(employee => `<td>${employee.dob}</td>`).join('')}
                </tr>
                <tr>
                    <th>Email</th>
                    ${employees.map(employee => `<td>${employee.email}</td>`).join('')}
                </tr>
                <tr>
                    <th>Phone No</th>
                    ${employees.map(employee => `<td>${employee.phone}</td>`).join('')}
                </tr>
                <tr>
                    <th>Hobbies</th>
                    ${employees.map(employee => `<td>${employee.hobbies.join(', ')}</td>`).join('')}
                </tr>
            </thead>
        </table>
    `;

    advanceTableContainer.innerHTML = tableHtml;
}

//delete employee
function deleteEmployee(index) {
    employees.splice(index, 1);
    saveToLocalStorage();
    displaybasicTable();
    displayAdvancedTable();
}

//Edit employee
function editEmployee(index) {

    const employee = employees[index];

    //console.log("inside edit employe method ", employee)
    document.getElementById('name').value = employee.name;
    document.getElementById('dob').value = employee.dob;
    document.getElementById('email').value = employee.email;
    document.getElementById('phone').value = employee.phone;

    document.querySelectorAll('input[name="hobbies"]').forEach(checkbox => {
        // console.log("checkbox ",checkbox)
        checkbox.checked = employee.hobbies.includes(checkbox.value);
    });
    
    const selectedgender = employee.gender;
    if(selectedgender=='Male') {
        document.getElementById('1').checked = true;
    }
    if(selectedgender=='Female'){
        document.getElementById('2').checked = true;
    } 

    editingIndex = index;
}


document.addEventListener('DOMContentLoaded', displayAdvancedTable);
document.addEventListener('DOMContentLoaded', displaybasicTable);
document.querySelector('form').addEventListener('submit', handleSubmit);
