// Menu Toggle
function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
  }

  // Search Box Functionality
document.querySelector('.search-icon').addEventListener('click', function() {
    let searchQuery = document.querySelector('#searchInput').value;
    alert("Searching for: " + searchQuery);
});

  
  // Open/Close Modal
  function openModal() {
    document.getElementById("auth-modal").style.display = "block";
  }
  
  function closeModal() {
    document.getElementById("auth-modal").style.display = "none";
  }
  
  // Switch Login/Signup
  function switchToSignup() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
  }
  
  function switchToLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  }
  
  // Signup Function (POST to backend)
  async function signupUser() {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
  
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Signup successful!");
      switchToLogin();
    } else {
      alert(data.msg || "Signup failed.");
    }
  }
  
  // Login Function (POST to backend)
  // Replace the existing loginUser() function with:
async function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        name: data.name,
        email: data.email
      }));
      closeModal();
      updateAuthUI(); // Show profile instead of login button
    } else {
      alert(data.msg || "Invalid credentials.");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Add these new functions:
function updateAuthUI() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const loginBtn = document.getElementById('loginButton');
  const profileContainer = document.getElementById('userProfileContainer');
  
  if (userData && userData.name) {
    loginBtn.style.display = 'none';
    profileContainer.style.display = 'flex';
    document.getElementById('userAvatar').textContent = 
      userData.name.split(' ').map(n => n[0]).join('');
    document.getElementById('userName').textContent = userData.name;
  } else {
    loginBtn.style.display = 'block';
    profileContainer.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  window.location.href = 'index.html';
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);


// // Enhanced updateAuthUI function
// function updateAuthUI() {
//   const userData = JSON.parse(localStorage.getItem('user'));
//   const loginBtn = document.getElementById('loginButton');
//   const profileContainer = document.getElementById('userProfileContainer');
  
//   if (userData && userData.name) {
//     loginBtn.style.display = 'none';
//     profileContainer.style.display = 'flex';
    
//     // Get initials (handles multi-word names)
//     const initials = userData.name.split(' ')
//       .filter(word => word.length > 0)
//       .map(word => word[0])
//       .join('')
//       .toUpperCase()
//       .substring(0, 2);
    
//     document.getElementById('userAvatar').textContent = initials;
//     document.getElementById('userName').textContent = 
//       userData.name.length > 12 
//         ? userData.name.substring(0, 10) + '...' 
//         : userData.name;
//   } else {
//     loginBtn.style.display = 'block';
//     profileContainer.style.display = 'none';
//   }
// }

// // Enhanced logout with confirmation
// function logout() {
//   if (confirm('Are you sure you want to log out?')) {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     updateAuthUI();
//     // Optional: Redirect to home or refresh
//     window.location.href = 'index.html';
//   }
// }

function toggleDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.classList.toggle("show");
}

// Optional: Close dropdown if clicked outside
document.addEventListener("click", function (e) {
  const profile = document.getElementById("userProfileContainer");
  const dropdown = document.getElementById("profileDropdown");

  if (!profile.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// Profile view function
function viewProfile() {
  // Implement your profile page navigation
  window.location.href = 'profile.html';
}

// Saved places function
function viewBookmarks() {
  // Implement your bookmarks page navigation
  window.location.href = 'bookmarks.html';
}


  // async function loginUser() {
  //   const email = document.getElementById("login-email").value;
  //   const password = document.getElementById("login-password").value;
  
  //   const response = await fetch("http://localhost:5000/api/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });
  
  //   const data = await response.json();
  //   if (response.ok) {
  //     alert("Login successful!");
  //     localStorage.setItem("loggedIn", "true");
  //     closeModal();
  //     document.getElementById("more-details").style.display = "block";
  //   } else {
  //     alert(data.msg || "Invalid credentials.");
  //   }
  // }
  
  // Voice Search
  function startVoiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("You said:", transcript);
        document.querySelector(".heritage-search-bar").value = transcript;

        // First, try navigation
        const voiceNavigationMap = {
            "madurai": "Madurai.html",
            "meenakshi ": "meenakshi.html",
            "meenakshi temple": "meenakshi.html",
            "meenakshi amman kovil": "meenakshi.html",
            "chennai": "chennai.html",
            "mahabalipuram": "mahabalipuram.html"
        };

        for (let keyword in voiceNavigationMap) {
            if (transcript.includes(keyword)) {
                window.location.href = voiceNavigationMap[keyword];
                return;
            }
        }

        // If no navigation match found, do keyword highlight search
        searchInPage(transcript);
    };

    recognition.onerror = function(event) {
        console.error("Voice recognition error:", event.error);
    };
}


function searchInPage(keyword) {
    const elements = document.querySelectorAll(".searchable");

    elements.forEach((el) => {
        const keywords = el.getAttribute("data-keywords").toLowerCase();

        if (keywords.includes(keyword)) {
            el.style.backgroundColor = "#ffff99"; // highlight
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            el.style.backgroundColor = ""; // remove previous highlights
        }
    });
}


  
  // Search Button
  document.querySelector('.search-icon').addEventListener('click', function() {
    let searchQuery = document.querySelector('#searchInput').value;
    alert("Searching for: " + searchQuery);
  });
  
  // Restrict Access
  // function checkLogin() {
  //   if (localStorage.getItem("loggedIn") === "true") {
  //     document.getElementById("more-details").style.display = "block";
  //   } else {
  //     alert("Please log in first.");
  //     openModal();
  //   }
  // }
  function checkLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // User is logged in - show protected content
      document.getElementById("more-details").style.display = "block";
    } else {
      alert("Please log in first.");
      openModal();
    }
  }
  