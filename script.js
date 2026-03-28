console.log("NEW VERSION LOADED 🚀")

const BASE_URL = "https://taskflow-backend101.onrender.com"

// SIGNUP
async function signup(){
  const emailInput = document.getElementById("signupEmail")
  const passwordInput = document.getElementById("signupPassword")

  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })

  const data = await res.json()
  console.log("SIGNUP:", data)

  emailInput.value = ""
  passwordInput.value = ""
}

// LOGIN
async function login(){
  const emailInput = document.getElementById("loginEmail")
  const passwordInput = document.getElementById("loginPassword")

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value
    })
  })

  const data = await res.json()
  console.log("LOGIN:", data)

  if(!data.token){
    console.log("Login failed")
    return
  }

  localStorage.setItem("token", data.token)

  emailInput.value = ""
  passwordInput.value = ""

  getTasks()
}

// ADD TASK
async function addTask(){
  const input = document.getElementById("taskInput")
  const token = localStorage.getItem("token")

  if(!token){
    console.log("No token found")
    return
  }

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

  const data = await res.json()

  if(!Array.isArray(data)){
    console.log("ERROR:", data)
    return
  }

  const tasks = data

  const list = document.getElementById("taskList")
  list.innerHTML = ""

  tasks.forEach(t => {
    const li = document.createElement("li")
    li.className = "task"

    const span = document.createElement("span")
    span.textContent = t.task

    const btn = document.createElement("button")
    btn.textContent = "❌"
    btn.className = "delete-btn"
    btn.onclick = () => deleteTask(t._id)

    li.appendChild(span)
    li.appendChild(btn)
    list.appendChild(li)
  })
}