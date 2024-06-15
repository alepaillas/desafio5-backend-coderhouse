const formularioRegistro = document.getElementById("formulario-registro");

formularioRegistro.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value; // Assuming you have a last name field
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const edad = document.getElementById("edad").value; // Assuming you have an age field

  const datos = {
    nombre,
    apellido,
    email,
    password,
    edad,
  };

  fetch("/api/session/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((respuesta) => respuesta.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Usuario registrado exitosamente");
        // Redirigir a la página de inicio de sesión o mostrar mensaje de éxito
        window.location.href = "/"; // Reemplazar con la URL de la página de inicio de sesión
      } else {
        alert("Error al registrarse: " + data.msg);
      }
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error);
      alert("Error de conexión. Inténtalo de nuevo más tarde.");
    });
});
