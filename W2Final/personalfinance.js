const toggle = document.getElementById("darkToggle");
function setDark(isDark) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);
  toggle.innerHTML = isDark
    ? '<i class="ri-sun-line"></i>'
    : '<i class="ri-moon-line"></i>';
}
toggle.addEventListener("click", () => {
  setDark(!document.body.classList.contains("dark"));
});
setDark(localStorage.getItem("darkMode") === "true");

let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
let editId = null;

const form = document.getElementById("transactionForm");
const submitBtn = document.getElementById("submitBtn");
const errorMsg = document.getElementById("errorMsg");

const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const amountInput = document.getElementById("amount");
const descInput = document.getElementById("description");
const dateInput = document.getElementById("date");

function setTodayDateIfEmpty() {
  if (!dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
}
setTodayDateIfEmpty();

function validateForm() {
  const amount = Number(amountInput.value);

  if (!typeInput.value || !categoryInput.value || !descInput.value ||
    !amountInput.value || !dateInput.value ) {
    submitBtn.disabled = true;
    errorMsg.textContent = "Please fill all fields correctly.";
    return false;
  }

  if (isNaN(amount)) {
    submitBtn.disabled = true;
    errorMsg.textContent = "Amount must be a number.";
    return false;
  }

  if (amount <= 0) {
    submitBtn.disabled = true;
    errorMsg.textContent = "Amount must be greater than 0.";
    return false;
  }

  if(new Date(dateInput.value) > new Date()) {
    submitBtn.disabled = true;
    errorMsg.textContent = "Date must be before and current date.";
    return false;
  }

  submitBtn.disabled = false;
  errorMsg.textContent = "";
  submitBtn.classList.remove('cursor-not-allow');
  submitBtn.classList.add('cursor-pointer')
  return true;
}

form.addEventListener("input", validateForm);

form.addEventListener("submit", e => {
  e.preventDefault(); 

  const data = {
    id: editId !== null ? editId : Date.now(),
    type: typeInput.value,
    category: categoryInput.value,
    amount: Number(amountInput.value),
    description: descInput.value,
    date: dateInput.value
  };

  if (editId !== null) {
    transactions = transactions.map(t =>
      t.id === editId ? data : t
    );
  } else {
    transactions.push(data);
  }

  editId = null;
  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  submitBtn.disabled = true;
  render();
});

function updateDashboard() {
  const income = transactions.filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expense = transactions.filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  document.getElementById("income").textContent = `$ ${income.toFixed(2)}`;
  document.getElementById("expense").textContent = `$ ${expense.toFixed(2)}`;

  const bal = income - expense;
  const balEl = document.getElementById("balance");
  balEl.textContent = `$ ${bal.toFixed(2)}`;
  balEl.className = bal >= 0
    ? "text-2xl font-bold text-blue-700"
    : "text-2xl font-bold text-red-500";
}

const filterType = document.getElementById("filterType");
const filterCategory = document.getElementById("filterCategory");
const sortBy = document.getElementById("sortBy");
const searchInput = document.getElementById("search");
function render() {
  updateDashboard();
  const list = document.getElementById("transactionList");
  list.innerHTML = "";
  let filtered = [...transactions];

  if(filterType.value !== "all") {
    filtered = filtered.filter( t => t.type === filterType.value);
  }

  if(filterCategory.value !== "all") {
    filtered = filtered.filter(g => g.category === filterCategory.value);
  }

  if(searchInput.value.trim() !== "") {
    const keyWord = searchInput.value.toLowerCase();
    filtered = filtered.filter(d => d.description.toLowerCase().includes(keyWord));
  }

  switch (sortBy.value) {
    case "date-asc":
    filtered.sort((a,b) => new Date(a.date) - new Date(b.date));
    break;
    case "date-desc":
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    break;
    case "amount-asc":
    filtered.sort((a, b) => a.amount - b.amount);
    break;
    case "amount-desc":
    filtered.sort((a, b) => b.amount - a.amount);
    break;
  }

  filtered.forEach(t => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow flex justify-between";

    card.innerHTML = `
      <div>
        <p class="font-bold">${t.description}</p>
        <p class="text-sm text-gray-600">${t.category} • ${t.date}</p>
      </div>
      <div class="text-right">
        <p class="${t.type === "income" ? "text-blue-500" : "text-red-500"} font-bold mb-2">
          ${t.type === "income" ? "+" : "-"}$${t.amount}
        </p>
        <button onclick="editTx(${t.id})" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer">
          <i class="ri-edit-2-line"></i>
        </button>
        <button onclick="deleteTx(${t.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 ml-2 cursor-pointer">
          <i class="ri-delete-bin-6-line"></i>
        </button>
      </div>
    `;
    list.appendChild(card);
  });
}

function deleteTx(id) {
  transactions = transactions.filter(item => item.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

function editTx(id) {
  const t = transactions.find(x => x.id === id);
  editId = id;
  typeInput.value = t.type;
  categoryInput.value = t.category;
  amountInput.value = t.amount;
  descInput.value = t.description;
  dateInput.value = t.date;
  validateForm();
}
render();
let renderAfterFilter = [filterType, filterCategory, sortBy, searchInput];
renderAfterFilter.forEach(item => item.addEventListener("input", render));

document.getElementById("exportJson").addEventListener("click", () => {
  const dataStr = JSON.stringify(transactions, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();

  URL.revokeObjectURL(url);
});

document.getElementById("exportCsv").addEventListener("click", () => {
  if (transactions.length === 0) return;

  const headers = ["ID", "Type", "Category", "Amount", "Description", "Date"];
  const rows = transactions.map(t => [
    t.id,
    t.type,
    t.category,
    t.amount,
    `"${t.description.replace(/"/g, '""')}"`,
    t.date
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();

  URL.revokeObjectURL(url);
});


document.getElementById("importJson").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = event => {
    try {
      const imported = JSON.parse(event.target.result);

      if (!Array.isArray(imported)) {
        alert("Invalid JSON format");
        return;
      }

      transactions = imported;
      localStorage.setItem("transactions", JSON.stringify(transactions));
      render();
      alert("Transactions imported successfully ✅");
    } catch (err) {
      alert("Error reading JSON file ❌");
    }
  };

  reader.readAsText(file);
  e.target.value = "";
});

