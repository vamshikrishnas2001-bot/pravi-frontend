function togglePw(){
  const inp=document.getElementById('loginPass');
  const ico=document.getElementById('eyeIcon');
  if(inp.type==='password'){inp.type='text';ico.className='fa-solid fa-eye-slash'}
  else{inp.type='password';ico.className='fa-solid fa-eye'}
}
function showToast(msg,isErr){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.querySelector('i').style.color=isErr?'#ff6b6b':'#00c9a7';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}
async function doLogin(){
  const email = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();

  if(!email || !password){
    showToast('Please enter email and password.', true);
    return;
  }

  try {
    const res = await fetch("https://pravi-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if(res.ok){
      showToast("Login successful 🚀");
      localStorage.setItem("token", data.token);

      setTimeout(()=>{
        window.location.href = "admin-panel.html";
      }, 1000);
    } else {
      showToast(data.message || "Login failed", true);
    }

  } catch(err){
    showToast("Server error", true);
  }
}
document.addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});