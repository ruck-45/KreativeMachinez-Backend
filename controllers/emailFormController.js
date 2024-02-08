//Local Dependcies
const { sendEmail } = require("../utils/sendmail");

const emailSent = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (email === undefined || name === undefined || subject === undefined || message === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Please fill all details" } });
    }
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailTemplate = (clientEmail, clientMessage, clientSubject) => `
                                                              <html>
                                                              <body>
                                                                <p>hello Kreative Machine Team<p>
                                                                <p> You have a message from: email : ${clientEmail}</p>
                                                                <p>Subject: ${clientSubject}</p>
                                                                <p>Message: ${clientMessage}</p>
                                                                <p>Regards,<br>Kreative Machine</p>
                                                              </body>
                                                              </html>
                                                          `;
    try {
      const mailQuery = await sendEmail(adminEmail,subject, emailTemplate(email,message, subject));
      if (!mailQuery.success) {
        return res.status(500).json({ success: false, payload: { message: "Email Not Sent" } });
      }
      res.status(200).json({
        success: true,
        payload: { message: `message sent to mail id ${adminEmail} succesfully` },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        payload: { message: error.message },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      payload: { message: error.message },
    });
  }
};

module.exports = {
  emailSent,
};
