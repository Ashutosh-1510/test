function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPass").value;
  const role = document.getElementById("role").value;

  if (!email || !pass) return alert("Missing credentials");
  localStorage.setItem("currentUser", JSON.stringify({ email, role }));

  if (role === "user") window.location.href = "user_dashboard.html";
  else if (role === "agent") window.location.href = "agent_dashboard.html";
  else window.location.href = "admin_dashboard.html";
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function loadTickets(filterFn = () => true) {
  const user = getCurrentUser();
  let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  tickets = tickets.filter(filterFn);
  const container = document.getElementById("ticketList");
  container.innerHTML = "";
  tickets.forEach(t => {
    const div = document.createElement("div");
    div.className = "ticket-card";
    div.innerHTML = `<strong>${t.subject}</strong> | <em>${t.status}</em><br><p>${t.desc}</p><p><strong>Category:</strong> ${t.category}</p><p><strong>Votes:</strong> ${t.votes || 0}</p>`;
    if (user.role === "user") {
      div.innerHTML += `<button onclick="vote(${t.id}, 1)">⬆️ Upvote</button> <button onclick="vote(${t.id}, -1)">⬇️ Downvote</button>`;
    }
    container.appendChild(div);
  });
}

function vote(id, delta) {
  let tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  const index = tickets.findIndex(t => t.id === id);
  if (index !== -1) {
    tickets[index].votes = (tickets[index].votes || 0) + delta;
    localStorage.setItem("tickets", JSON.stringify(tickets));
    loadTickets(t => t.createdBy === getCurrentUser().email);
  }
}

function createTicket() {
  const subject = document.getElementById("subject").value;
  const desc = document.getElementById("desc").value;
  const category = document.getElementById("category").value;
  const ticket = {
    id: Date.now(),
    subject,
    desc,
    category,
    status: "Open",
    createdBy: getCurrentUser().email,
    replies: [],
    votes: 0
  };
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]");
  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  alert("Ticket Created");
  location.reload();
}
