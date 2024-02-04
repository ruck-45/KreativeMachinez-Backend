//Local Dependcies
const { sendEmail } = require("../utils/sendmail");

 const emailSent = async(req,res) =>{
  try {
    const { name, email, subject, message } = req.body;
  
    // Return If Partial Information Provided
    if (email === undefined || name === undefined || subject === undefined || message === undefined) {
      return res.status(206).json({ success: false, payload: { message: "Please fill all details" } });
    }

    try {
      await sendEmail(email, subject, message);
      res.status(200).json({
        success: true,
        message: `message sent to mail id ${email} succesfully `,
        email,
        subject,
        
        
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Failed to send email`,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
    
  }


}


module.exports = {
 emailSent,
};