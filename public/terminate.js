document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("employeeTable");

  try {
    const res = await fetch("/api/employees/terminate");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${await res.text()}`);
    }

    const employees = await res.json();

    employees.forEach((emp) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><input type="checkbox" class="select-emp" value="${emp.employeeId}"></td>
        <td>${emp.employeeId}</td>
        <td>${emp.firstName} ${emp.lastName}</td>
        <td>${emp.phoneNumber}</td>
        <td>${emp.email}</td>
        <td>${emp.deptName}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading employees:", err);
  }

  const handleUpdate = async () => {
    console.log("Update handler triggered");

    const rows = document.querySelectorAll("#employeeTable tr");
    const terminate = [];

    rows.forEach((row) => {
      const checkbox = row.querySelector(".select-emp");
      if (checkbox && checkbox.checked) {
        const employeeId = checkbox.value;
        terminate.push({ employeeId});
      }
    });

    if (terminate.length === 0) {
      alert("Please select at least one employee to terminate.");
      return;
    }

    try {
      const res = await fetch("/api/employees/terminate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terminate }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      alert(data.message || "Employees terminated successfully");
      location.reload();
    } catch (err) {
      console.error("Error terminating employees:", err);
      alert("Failed to terminate employees.");
    }
  };

  const form = document.getElementById("terminateForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleUpdate();
    });
  }

  const submitBtn = document.querySelector("#terminateForm button[type='submit']");
  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleUpdate();
    });
  }
});
