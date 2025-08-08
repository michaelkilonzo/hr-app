document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("employeeTable");

  try {
    const res = await fetch("/api/employees");
    const employees = await res.json();

    employees.forEach((emp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-emp" value="${emp.employeeId}"></td>
        <td>${emp.employeeId}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td><input type="text" value="${emp.phoneNumber || ""}" class="phone-input form-control" /></td>
        <td><input type="email" value="${emp.email || ""}" class="email-input form-control" /></td>
        <td><input type="number" value="${emp.salary || ""}" class="salary-input form-control" /></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading employees", err);
  }
});

document.getElementById("updateForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const rows = document.querySelectorAll("#employeeTable tr");
  const updates = [];

  rows.forEach((row) => {
    const checkbox = row.querySelector(".select-emp");
    if (checkbox && checkbox.checked) {
      const employeeId = checkbox.value;
      const phoneNumber = row.querySelector(".phone-input").value.trim();
      const email = row.querySelector(".email-input").value.trim();
      const salary = row.querySelector(".salary-input").value.trim();

      updates.push({ employeeId, phoneNumber, email, salary });
    }
  });

  if (updates.length === 0) {
    alert("Please select at least one employee to update.");
    return;
  }

  try {
    const res = await fetch("/api/employees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates }),
    });

    const data = await res.json();
    alert(data.message || "Employees updated successfully");
    location.reload();
  } catch (err) {
    console.error("Error updating employees", err);
    alert("Failed to update employees.");
  }
});
