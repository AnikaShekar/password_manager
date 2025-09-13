const websiteInput = document.getElementById("website");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const table = document.querySelector("table");
const alertBox = document.getElementById("alert");
const submitBtn = document.querySelector(".btn");

const maskPassword = pass => "*".repeat(pass.length);

const showAlert = (msg = "Copied!") => {
  alertBox.textContent = msg;
  alertBox.style.display = "inline";
  setTimeout(() => alertBox.style.display = "none", 2000);
};

const getPasswords = () => JSON.parse(localStorage.getItem("passwords") || "[]");

const savePasswords = arr => localStorage.setItem("passwords", JSON.stringify(arr));

const showPasswords = () => {
  const passwords = getPasswords();
  table.innerHTML = "";

  if (passwords.length > 0) {
    table.innerHTML = `
      <tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Actions</th>
      </tr>
    `;

    passwords.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.website} <button class="copy-btn">Copy</button></td>
        <td>${p.username} <button class="copy-btn">Copy</button></td>
        <td>
          <span class="masked">${maskPassword(p.password)}</span>
          <span class="real" style="display:none">${p.password}</span>
          <button class="toggle-btn">Show</button>
          <button class="copy-btn">Copy</button>
        </td>
        <td><button class="delete-btn">Delete</button></td>
      `;
      table.appendChild(row);
    });
  } else {
    table.innerHTML = `<tr><td colspan="4">No Data To Show</td></tr>`;
  }
};

table.addEventListener("click", e => {
  const target = e.target;

  if (target.classList.contains("copy-btn")) {
    const td = target.parentNode;
    let text = td.querySelector(".real") ? td.querySelector(".real").textContent : td.textContent.replace("Copy", "").trim();
    navigator.clipboard.writeText(text);
    showAlert("Copied!");
  }

  if (target.classList.contains("delete-btn")) {
    const row = target.parentNode.parentNode;
    const website = row.cells[0].textContent.replace("Copy", "").trim();
    const passwords = getPasswords();
    const updated = passwords.filter(p => p.website !== website);
    savePasswords(updated);
    showPasswords();
  }

  if (target.classList.contains("toggle-btn")) {
    const td = target.parentNode;
    const masked = td.querySelector(".masked");
    const real = td.querySelector(".real");
    if (masked.style.display === "none") {
      masked.style.display = "";
      real.style.display = "none";
      target.textContent = "Show";
    } else {
      masked.style.display = "none";
      real.style.display = "";
      target.textContent = "Hide";
    }
  }
});

submitBtn.addEventListener("click", e => {
  e.preventDefault();

  const website = websiteInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!website || !username || !password) return alert("Please fill all fields");

  const passwords = getPasswords();

  if (passwords.some(p => p.website === website && p.username === username)) {
    return alert("This entry already exists!");
  }

  passwords.push({ website, username, password });
  savePasswords(passwords);
  showPasswords();

  document.getElementById("password-form").reset();
  alert("Password Saved");
});

showPasswords();