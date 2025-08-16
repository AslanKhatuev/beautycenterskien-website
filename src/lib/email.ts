import nodemailer from "nodemailer";

interface BookingEmailData {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
}

// Opprett transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingConfirmation(booking: BookingEmailData) {
  const { name, email, phone, serviceName, price, date, time } = booking;

  // Format dato til norsk format
  const formattedDate = new Date(date).toLocaleDateString("no-NO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // E-post til deg (salon-eier)
  const ownerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ec4899;">🌸 Ny timebestilling!</h2>
      
      <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #831843; margin-top: 0;">Kundedetaljer:</h3>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin-top: 0;">Behandlingsdetaljer:</h3>
        <p><strong>Behandling:</strong> ${serviceName}</p>
        <p><strong>Pris:</strong> ${price} NOK</p>
        <p><strong>Dato:</strong> ${formattedDate}</p>
        <p><strong>Tidspunkt:</strong> ${time}</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        Denne e-posten ble sendt automatisk fra booking-systemet ditt.
      </p>
    </div>
  `;

  // E-post til kunden
  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ec4899;">🌸 Takk for din bestilling!</h2>
      
      <p>Hei ${name},</p>
      
      <p>Vi har mottatt din timebestilling og ser frem til å se deg!</p>
      
      <div style="background-color: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #831843; margin-top: 0;">Din bestilling:</h3>
        <p><strong>Behandling:</strong> ${serviceName}</p>
        <p><strong>Pris:</strong> ${price} NOK</p>
        <p><strong>Dato:</strong> ${formattedDate}</p>
        <p><strong>Tidspunkt:</strong> ${time}</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #1d4ed8; margin-top: 0;">📍 Praktisk informasjon:</h4>
        <p>• Møt opp 5 minutter før avtalt tid</p>
        <p>• Avbestilling må skje minst 24 timer i forveien</p>
      </div>
      
      <p>Har du spørsmål? Kontakt oss på:</p>
      <p>📧 ${process.env.EMAIL_FROM}<br/>
      📱 +47 968 09 506</p>
      
      <p>Vi gleder oss til å se deg!</p>
      <p>www.beautycenter.no<p>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        Med vennlig hilsen,<br/>
        Beauty Center Skien
      </p>
    </div>
  `;

  try {
    // Send e-post til salon-eier
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `🌸 Ny timebestilling - ${serviceName} - ${formattedDate}`,
      html: ownerEmailHtml,
    });

    // Send bekreftelse til kunden
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Bekreftelse på din timebestilling - Beauty Center Skien`,
      html: customerEmailHtml,
    });

    console.log("E-poster sendt successfully");
    return { success: true };
  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
