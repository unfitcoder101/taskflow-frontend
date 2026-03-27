const PORT = process.env.PORT || 3000

const BASE_URL = "https://taskflow-backend.onrender.com"

// SIGNUP
async function signup(){
  const emailInput = document.getElementById("signupEmail")
  const passwordInput = document.getElementById("signupPassword")

  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })

  const data = await res.json()
  console.log(data)

  emailInput.value = ""
  passwordInput.value = ""
}

// LOGIN
async function login(){
  const emailInput = document.getElementById("loginEmail")
  const passwordInput = document.getElementById("loginPassword")

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })

  const data = await res.json()
  console.log(data)

  localStorage.setItem("token", data.token)

  emailInput.value = ""
  passwordInput.value = ""

  getTasks()
}

// ADD TASK
async function addTask(){
  const input = document.getElementById("taskInput")
  const token = localStorage.getItem("token")

  await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ task: input.value })
  })

  input.value = ""
  getTasks()
}

// DELETE TASK
async function deleteTask(id){
  const token = localStorage.getItem("token")

  await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  getTasks()
}

// GET TASKS
async function getTasks(){
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })

  const tasks = await res.json()

  const list = document.getElementById("taskList")
  list.innerHTML = ""

  tasks.forEach(t => {
    const li = document.createElement("li")
    li.className = "task"

    const span = document.createElement("span")
    span.textContent = t.task

    const btn = document.createElement("button")
    btn.textContent = "Delete"
    btn.className = "delete-btn"
    btn.onclick = () => deleteTask(t._id)

    li.appendChild(span)
    li.appendChild(btn)
    list.appendChild(li)
  })
}