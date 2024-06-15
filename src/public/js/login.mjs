const formularioLogin = document.getElementById("formulario-login");

formularioLogin.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const datos = {
    email,
    password,
  };

  try {
    const response = await fetch("/api/session/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (response.ok) {
      console.log("Inicio de sesión exitoso");
      window.location.href = "/"; // Replace with the URL of the main page
    } else {
      throw new Error(
        `Error de inicio de sesión: ${errorData.msg || "Ocurrió un error"}`,
      );
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert(error.message); // Display the more informative error message
  }
});
