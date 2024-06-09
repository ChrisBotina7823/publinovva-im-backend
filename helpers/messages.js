const boldStyle = (message) => {
    return `<strong>${message}</strong>`
}

const welcomeMessage = (client, adminData = null) => {
  const message = `
  Estimado/a <b>${client.fullname}</b> ,<br><br>¡Bienvenido/a a <b>Universe Unity-Evolution</b>!
   👋 👋 👋&nbsp;&nbsp;Nos complace tenerte como parte de nuestra comunidad. A continuación, te presentamos algunos detalles sobre los beneficios que ofrecemos:
  <br><br>1.🎁 <b>Bono de Bienvenida</b>: Al unirte a Universe Unity-Evolution, recibirás un bono de <b>20 USDT</b>&nbsp;como agradecimiento por unirte a nosotros.
  <br><br>2.💹 <b>Beneficios Diarios</b>: Disfruta de un <b>3% de beneficios diarios</b>&nbsp;en tus inversiones. Nuestro equipo trabaja arduamente para garantizar que obtengas el máximo rendimiento posible.
  <br><br>3.💰 <b>Comisiones Más Bajas del Mercado</b>: Disfruta de las tarifas más competitivas para maximizar tus ganancias.
  <br><br>4.✈️ <b>Retiros Rápidos en Todo el Mundo</b>: Procesamos tus retiros de manera eficiente, sin importar dónde te encuentres.
  <br><br>5.🏛️ <b>Servicios Regulados y Certificados</b>: Opera con tranquilidad, sabiendo que nuestros servicios cumplen con las regulaciones y certificaciones necesarias.
  <br><br>6.🕐 <b>Atención Personalizada 24/7</b>: Estamos aquí para ti en todo momento. Si tienes alguna pregunta, inquietud o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte.
  <br><br>¡Gracias por elegir al equipo de <b>Universe Unity-Evolution 🌟</b>! 
  Esperamos que tengas una experiencia increíble con nosotros
  `
  return message
}



export {
    welcomeMessage,
    boldStyle
}