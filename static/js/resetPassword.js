const resetPasswordForm = document.getElementById("resetPasswordForm");

resetPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // @ts-ignore
    body: new URLSearchParams(new FormData(resetPasswordForm)),
  });

  if (response.status === 200) {
    window.location.href = "/login";
  } else {
    const error = await response.json();
    alert(error.message);
  }
});
