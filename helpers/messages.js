const boldStyle = (message) => {
    return `<strong>${message}</strong>`
}

const welcomeMessage = (client, adminData = null) => {
    const subject = "¡Bienvenido a Universe Unity-Evolution!";
    const description =  `
    <div dir="ltr" class="es-wrapper-color" lang="es" style="background-color:#F6F6F6"><!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#f6f6f6"></v:fill>
    </v:background>
<![endif]-->
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
<tr>
<td valign="top" style="padding:0;Margin:0">
<table class="es-header" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
 <tr>
  <td align="center" style="padding:0;Margin:0">
   <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
     <tr>
      <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
       <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
         <tr>
          <td align="left" style="padding:0;Margin:0;width:560px">
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
             <tr>
              <td align="center" style="padding:0;Margin:0;font-size:0px"><img class="adapt-img" src="https://fhvzxek.stripocdn.email/content/guids/777f778d-1489-4d26-8ca2-af3591cfe3b2/images/imagen3_iwV.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="560"></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table></td>
 </tr>
</table>
<table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
 <tr>
  <td align="center" style="padding:0;Margin:0">
   <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
     <tr>
      <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-right:20px;padding-left:20px">
       <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
         <tr>
          <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
           <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
             <tr>
              <td align="left" style="padding:0;Margin:0"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">Estimado/a <b>${client.fullname}</b> ,<br><br>¡Bienvenido/a a <b>Universe Unity-Evolution</b>! 👋 👋 👋&nbsp;&nbsp;Nos complace tenerte como parte de nuestra comunidad. A continuación, te presentamos algunos detalles sobre los beneficios que ofrecemos:<br><br>1.🎁 <b>Bono de Bienvenida</b>: Al unirte a Universe Unity-Evolution, recibirás un bono de <b>20 USDT</b>&nbsp;como agradecimiento por unirte a nosotros.<br><br>2.💹 <b>Beneficios Diarios</b>: Disfruta de un <b>3% de beneficios diarios</b>&nbsp;en tus inversiones. Nuestro equipo trabaja arduamente para garantizar que obtengas el máximo rendimiento posible.<br><br>3.💰 <b>Comisiones Más Bajas del Mercado</b>: Disfruta de las tarifas más competitivas para maximizar tus ganancias.<br><br>4.✈️ <b>Retiros Rápidos en Todo el Mundo</b>: Procesamos tus retiros de manera eficiente, sin importar dónde te encuentres.<br><br>5.🏛️ <b>Servicios Regulados y Certificados</b>: Opera con tranquilidad, sabiendo que nuestros servicios cumplen con las regulaciones y certificaciones necesarias.<br><br>6.🕐 <b>Atención Personalizada 24/7</b>: Estamos aquí para ti en todo momento. Si tienes alguna pregunta, inquietud o necesitas asistencia, no dudes en ponerte en contacto con nuestro equipo de soporte.<br><br>¡Gracias por elegir al equipo de <b>Universe Unity-Evolution 🌟</b>! Esperamos que tengas una experiencia increíble con nosotros.<br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">​</p></td>
             </tr>
             <tr>
              <td align="center" style="padding:0;Margin:0"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#2CB543;border-width:0px 0px 2px 0px;display:inline-block;border-radius:30px;width:auto"><a href="https://wa.me/+573213094199" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#31CB4B;border-radius:30px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #31CB4B">Obten Asesoria para tu primera inversión</a></span></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table></td>
 </tr>
</table>
<table class="es-footer" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
 <tr>
  <td align="center" style="padding:0;Margin:0">
   <table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
     <tr>
      <td align="left" style="Margin:0;padding-top:20px;padding-right:20px;padding-left:20px;padding-bottom:20px">
       <table cellspacing="0" cellpadding="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
         <tr>
          <td align="left" style="padding:0;Margin:0;width:560px">
           <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#132038" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#132038" role="presentation">
             <tr>
              <td align="center" style="padding:0;Margin:0;padding-top:20px;font-size:0px"><img class="adapt-img" src="https://fhvzxek.stripocdn.email/content/guids/777f778d-1489-4d26-8ca2-af3591cfe3b2/images/universe_unity_evolution_logo.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="250"></td>
             </tr>
             <tr>
              <td align="center" style="padding:0;Margin:0;padding-bottom:20px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px">¡Con alianza de gestión en Colombia para toda Latinoamérica!</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><br></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><b>Contacto</b></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><a href="mailto:info@universeunity-evolution.online" style="mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:12px">info@universeunity-evolution.online</a></p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#ffffff;font-size:12px"><br>Whatsapp:<a style="mso-line-height-rule:exactly;text-decoration:underline;color:#ffffff;font-size:12px" target="_blank" href="https://wa.me/+573213094199"> <u>+57 3213094199</u></a></p></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
   </table></td>
 </tr>
</table></td>
</tr>
</table>
</div>
`
    return {subject, description}
}

export {
    welcomeMessage,
    boldStyle
}