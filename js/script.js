$(document).ready(function() {
    // Load employee information list on page load
    loadEmployeeList();

    // Handle click event on employee list rows
    $(document).on('click', '#employeeList tbody tr', function() {
        $(this).addClass('active').siblings().removeClass('active');
        var employeeId = $(this).attr('data-id');
        loadEmployeeDetails(employeeId);
    });

    // Handle click event on Add Employee button
    $(document).on('click', '#addEmployee', function() {
        clearEmployeeForm();
        $('#employeeList tbody tr').removeClass('active');
    });

    // Handle click event on Edit Employee button
    $(document).on('click', '#editEmployee', function() {
        var employeeId = $('#employeeList tbody tr.active').attr('data-id');
        if (employeeId) {
            loadEmployeeDetails(employeeId);
        } else {
            showMessage('Please select an employee to edit.', 'error');
        }
    });

    // Handle click event on Delete Employee button
    $(document).on('click', '#deleteEmployee', function() {
        var employeeId = $('#employeeList tbody tr.active').attr('data-id');
        if (employeeId) {
            if (confirm('Are you sure you want to delete this employee?')) {
                deleteEmployee(employeeId);
            }
        } else {
            showMessage('Please select an employee to delete.', 'error');
        }
    });

    // Handle click event on Save button
    $(document).on('click', '#saveEmployee', function() {
        var employee = {
            name: $('#employeeName').val(),
            id: $('#employeeId').val(),
            entryDate: $('#entryDate').val(),
            jobPosition: $('#jobPosition').val()
        };
        if (validateEmployee(employee)) {
            saveEmployee(employee);
        }
    });

    // Handle click event on Cancel button
    $(document).on('click', '#cancelEmployee', function() {
        clearEmployeeForm();
        $('#employeeList tbody tr').removeClass('active');
    });

    function loadEmployeeList() {
        $.ajax({
            url: '/api/employees',
            type: 'GET',
            success: function(response) {
                $('#employeeList tbody').empty();
                response.forEach(function(employee) {
                    var row = `<tr data-id="${employee.id}">
                        <td>${employee.name}</td>
                        <td>${employee.id}</td>
                        <td>${employee.entryDate}</td>
                        <td>${employee.jobPosition}</td>
                    </tr>`;
                    $('#employeeList tbody').append(row);
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage(`Failed to load employee list. Error: ${errorThrown}`, 'error');
            }
        });
    }

    function loadEmployeeDetails(employeeId) {
        $.ajax({
            url: `/api/employees/${employeeId}`,
            type: 'GET',
            success: function(response) {
                $('#employeeName').val(response.name);
                $('#employeeId').val(response.id);
                $('#entryDate').val(response.entryDate);
                $('#jobPosition').val(response.jobPosition);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage(`Failed to load employee details. Error: ${errorThrown}`, 'error');
            }
        });
    }

    function saveEmployee(employee) {
        $.ajax({
            url: '/api/employees',
            type: 'POST',
            data: employee,
            success: function(response) {
                showMessage(response.message, 'success');
                clearEmployeeForm();
                loadEmployeeList();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage(`Failed to save employee. Error: ${errorThrown}`, 'error');
            }
        });
    }

    function deleteEmployee(employeeId) {
        $.ajax({
            url: `/api/employees/${employeeId}`,
            type: 'DELETE',
            success: function(response) {
                showMessage(response.message, 'success');
                clearEmployeeForm();
                loadEmployeeList();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                showMessage(`Failed to delete employee. Error: ${errorThrown}`, 'error');
            }
        });
    }

    function validateEmployee(employee) {
        if (employee.name.trim() === '') {
            showMessage('Please enter a name.', 'error');
            return false;
        }
        if (employee.id.trim() === '') {
            showMessage('Please enter an ID.', 'error');
            return false;
        }
        if (employee.entryDate.trim() === '') {
            showMessage('Please enter an entry date.', 'error');
            return false;
        }
        if (employee.jobPosition.trim() === '') {
            showMessage('Please enter a job position.', 'error');
            return false;
        }
        return true;
    }

    function clearEmployeeForm() {
        $('#employeeName').val('');
        $('#employeeId').val('');
        $('#entryDate').val('');
        $('#jobPosition').val('');
    }

    function showMessage(message, type) {
        $('#message').removeClass().addClass('ui message ' + type).text(message);
    }
});
