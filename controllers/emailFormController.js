//Local Dependcies
const { sendEmail } = require("../utils/sendmail");

const emailSent = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Return If Partial Information Provided
    if (email === undefined || name === undefined || subject === undefined || message === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Please fill all details" } });
    }
    
    //To email
    const adminEmail = "Anishmishra143@gmail.com";

    // Email template
    const emailTemplate = (email, message, subject) => `
    <html>
    <body>
      <p>hello Kreative Machine Team<p>
      <p> You have a message from: email : ${email}</p>
      <p>Subject: ${subject}</p>
      <p>Message: ${message}</p>
      <p>Regards,<br>Kreative Machine</p>
    </body>
    </html>
`;

    try {
      await sendEmail(adminEmail,subject, emailTemplate(email,message, subject));
      res.status(200).json({
        success: true,
        message: `message sent to mail id ${adminEmail} succesfully `,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  emailSent,
};
