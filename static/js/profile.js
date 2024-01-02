const formLogout = document.querySelector("form");
const spans = document.querySelectorAll("span");

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/api/users/current");

    if (response.status === 403) {
      throw new Error("Unauthorized");
    }

    const result = await response.json();
    const user = result.payload;

    spans[0].innerHTML = user.name;
    spans[1].innerHTML = user.lastName;
    spans[2].innerHTML = user.email;

    const ul = document.getElementById("profileUL");
    const liLogout = document.createElement("li");
    ul?.appendChild(liLogout);
    const aLogout = document.createElement("a");
    liLogout.appendChild(aLogout);
    aLogout.innerHTML = "Logout";
    aLogout.href = "#";
    aLogout.addEventListener("click", logout);
  } catch (error) {
    if (error.message === "Unauthorized") {
      alert("No autorizado!");
      return (window.location.href = "/login");
    } else alert(error);
  }
});

const logout = async (event) => {
  try {
    const response = await fetch("/api/sessions/current", {
      method: "DELETE",
    });

    if (response.status === 200) {
      alert("Logout successful!");
      window.location.href = "/login";
    } else {
      const error = await response.json();
      throw new Error(error);
    }
  } catch (error) {
    console.error("profile catch", error);
    alert(error.message);
  }
};
