const boldStyle = (message) => {
    return `<strong>${message}</strong>`
}

const welcomeMessage = (client, adminData = null) => {
    const subject = "¡Bienvenido a Universe Unity-Evolution!";
    const description =  `
Estimado/a ${client.fullname},

<br><br>¡Somos la ${boldStyle("Plataforma Ideal para Trading!")}. Nos complace darte la bienvenida a ${boldStyle("Universe Unity-Evolution")}. Te proporcionaremos todas las herramientas y el soporte necesarios para que operes con confianza y tengas éxito en el mundo del trading.

<br><br>A continuación, te presentamos algunos de los beneficios que ofrecemos:

<br><br>1. ${boldStyle("Bono de Bienvenida")}: Recibe ${boldStyle("20 USDT")} como agradecimiento por unirte a nosotros.

<br><br>2. ${boldStyle("Beneficios Diarios")}: Obtén un ${boldStyle("3% diario")} en tus inversiones, gracias al esfuerzo de nuestro equipo para maximizar tu rendimiento.

<br><br>3. ${boldStyle("Comisiones Más Bajas del Mercado")}: Disfruta de las tarifas más competitivas para maximizar tus ganancias.

<br><br>4. ${boldStyle("Retiros Rápidos en Todo el Mundo")}: Procesamos tus retiros de manera eficiente, sin importar dónde te encuentres.

<br><br>5. ${boldStyle("Servicios Regulados y Certificados")}: Opera con tranquilidad, sabiendo que nuestros servicios cumplen con las regulaciones y certificaciones necesarias.

<br><br>6. ${boldStyle("Atención Personalizada 24/7")}: Estamos disponibles en todo momento para asistirte. Si tienes preguntas o necesitas ayuda, no dudes en contactarnos.

<br><br>Gracias por elegir a Universe Unity-Evolution. Esperamos que tengas una experiencia increíble con nosotros.

<br><br>Atentamente,
<br>El equipo de Universe Unity-Evolution
    `;
    return {subject, description}
}

export {
    welcomeMessage,
    boldStyle
}