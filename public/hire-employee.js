document.getElementById('hireForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    email: form.email.value,
    phone: form.phone.value,
    salary: parseFloat(form.salary.value),
    job_id: form.job_id.value,
    manager_id: parseInt(form.manager_id.value),
    department_id: parseInt(form.department_id.value)
  };

  const res = await fetch('/api/employees/hire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  const msgBox = document.getElementById('message');
  msgBox.classList.remove('d-none', 'alert-success', 'alert-danger');
  msgBox.classList.add(res.ok ? 'alert-success' : 'alert-danger');
  msgBox.textContent = result.message || result.error;
});
