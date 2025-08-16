// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Zod schema for kontaktskjema validering
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Navn må være minst 2 tegn")
    .max(100, "Navn kan ikke være lengre enn 100 tegn")
    .regex(/^[a-zA-ZæøåÆØÅ\s\-\.]+$/, "Navn kan kun inneholde bokstaver"),

  email: z
    .string()
    .email("Ugyldig e-postadresse")
    .max(100, "E-post kan ikke være lengre enn 100 tegn")
    .toLowerCase(),

  phone: z.string().regex(/^\d{8}$/, "Telefonnummer må være nøyaktig 8 siffer"),

  subject: z
    .string()
    .min(5, "Emne må være minst 5 tegn")
    .max(200, "Emne kan ikke være lengre enn 200 tegn"),

  message: z
    .string()
    .min(10, "Melding må være minst 10 tegn")
    .max(2000, "Melding kan ikke være lengre enn 2000 tegn"),
});

// Enkelt spam-filter
const containsSpam = (text: string): boolean => {
  const spamKeywords = [
    "http://",
    "https://",
    "www.",
    ".com",
    ".net",
    ".org",
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations",
    "click here",
    "free money",
    "make money fast",
  ];

  const lowerText = text.toLowerCase();
  return spamKeywords.some((keyword) => lowerText.includes(keyword));
};

export async function POST(req: NextRequest) {
  try {
    // Hent IP adresse for logging
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : req.headers.get("x-real-ip") || "127.0.0.1";

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Ugyldig JSON i request" },
        { status: 400 }
      );
    }

    // Valider input med Zod
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      console.log("Contact validation errors:", errors);

      return NextResponse.json(
        {
          error: "Ugyldig input",
          details: errors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    // Spam-sjekk
    if (containsSpam(message) || containsSpam(subject)) {
      console.log("Spam detected from:", ip, email);
      return NextResponse.json(
        {
          error: "Meldingen inneholder ulovlig innhold",
        },
        { status: 400 }
      );
    }

    // Sanitiser data
    const sanitizedName = name.trim().replace(/\s+/g, " ");
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    // Konfigurer e-post transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // E-post innhold
    const emailContent = `
Ny kontaktforespørsel fra nettsiden:

Fra: ${sanitizedName}
E-post: ${sanitizedEmail}
Telefon: ${phone}
Emne: ${sanitizedSubject}

Melding:
${sanitizedMessage}

---
Sendt fra: ${ip}
Tidspunkt: ${new Date().toLocaleString("no-NO")}
    `.trim();

    // Send e-post
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `Kontaktskjema: ${sanitizedSubject}`,
      text: emailContent,
      replyTo: sanitizedEmail,
    });

    console.log("Contact email sent successfully");

    return NextResponse.json({
      ok: true,
      message: "Melding sendt! Vi svarer så snart som mulig.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        error: "Kunne ikke sende melding. Prøv igjen senere.",
      },
      { status: 500 }
    );
  }
}
