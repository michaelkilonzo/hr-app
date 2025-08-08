document.addEventListener('DOMContentLoaded', () => {
  loadJobs();
  loadManagers();
  loadDepartments();

  const form = document.getElementById('hireForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      salary: parseFloat(form.salary.value),
      job_id: form.job_id.value,
      manager_id: form.manager_id.value ? parseInt(form.manager_id.value) : null,
      department_id: parseInt(form.department_id.value),
    };

    try {
      const res = await fetch('/api/employees/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      const messageDiv = document.getElementById('message');
      if (res.ok) {
        messageDiv.textContent = result.message || 'Employee hired successfully.';
        messageDiv.classList.remove('d-none', 'alert-danger');
        messageDiv.classList.add('alert-success');
        form.reset();
      } else {
        messageDiv.textContent = result.error || 'Failed to hire employee.';
        messageDiv.classList.remove('d-none', 'alert-success');
        messageDiv.classList.add('alert-danger');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      const messageDiv = document.getElementById('message');
      messageDiv.textContent = 'Network or server error.';
      messageDiv.classList.remove('d-none', 'alert-success');
      messageDiv.classList.add('alert-danger');
    }
  });
});

async function loadJobs() {
  try {
    const res = await fetch('/api/employees/jobs');
    const jobs = await res.json();

    const jobSelect = document.getElementById('job_id');
    jobSelect.innerHTML = '<option value="" disabled selected>Select Job</option>';

    jobs.forEach((job) => {
      const option = document.createElement('option');
      option.value = job.JOB_ID;
      option.textContent = job.JOB_TITLE;
      jobSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load jobs:', err);
  }
}

async function loadManagers() {
  try {
    const res = await fetch('/api/employees/managers');
    const managers = await res.json();

    const managerSelect = document.getElementById('manager_id');
    managerSelect.innerHTML = '<option value="" disabled selected>Select Manager</option>';

    managers.forEach((manager) => {
      const option = document.createElement('option');
      option.value = manager.EMPLOYEE_ID;
      option.textContent = manager.NAME;
      managerSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load managers:', err);
  }
}

async function loadDepartments() {
  try {
    const res = await fetch('/api/employees/departments');
    const departments = await res.json();

    const deptSelect = document.getElementById('department_id');
    deptSelect.innerHTML = '<option value="" disabled selected>Select Department</option>';

    departments.forEach((dept) => {
      const option = document.createElement('option');
      option.value = dept.DEPARTMENT_ID;
      option.textContent = dept.DEPARTMENT_NAME;
      deptSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load departments:', err);
  }
}
