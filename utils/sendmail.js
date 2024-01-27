import nodemailer from "nodemailer"

const sendEmail = async function (email, subject, message) {
    // create reusable transporter object using defualt SMTP transport

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user:SMPT_MAIL= 'elda30@ethereal.email',
        pass:SMPT_PASSWORD= '75WXsN3My6MZBKbK3w'
    }
    });

    await transporter.sendEmail({
        from: SMPT_MAIL,
        to: email,
        subject: subject,
        html: message,
    })

    // const mailInfo ={
    //     from: process.env.SMTP_FROM_EMAIL,
    //     to: email,
    //      subject: subject,
    //      html: message,
    // }

    await transporter.sendMail(mailInfo);
}

export default sendEmail;