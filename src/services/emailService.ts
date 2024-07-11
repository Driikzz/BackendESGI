// src/services/emailService.ts
import nodemailer from 'nodemailer';
import rdvRepository from '../repositories/rdvRepository';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true,
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});

export async function sendPasswordEmail(email: string, password: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER!,
        to: email,
        subject: 'Your new account password',
        text: `Your new password is: ${password}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

export async function sendRdvCreatedEmail(tuteurEmail: string, alternantEmail: string, suiveurEmail: string, rdv: any): Promise<void> {
    const mailOptionsTuteur = {
        from: process.env.EMAIL_USER!,
        to: tuteurEmail,
        subject: 'Nouveau rendez-vous créé',
        text: `Bonjour, \n\nUn nouveau rendez-vous a été créé pour vous avec l'alternant.\n\nDétails du rendez-vous :\nDate: ${rdv.dateRdv}\nEntreprise: ${rdv.entreprise}\nFormation: ${rdv.formation}`,
    };

    const mailOptionsAlternant = {
        from: process.env.EMAIL_USER!,
        to: alternantEmail,
        subject: 'Nouveau rendez-vous créé',
        text: `Bonjour, \n\nUn nouveau rendez-vous a été créé avec votre tuteur.\n\nDétails du rendez-vous :\nDate: ${rdv.dateRdv}\nEntreprise: ${rdv.entreprise}\nFormation: ${rdv.formation}`,
    };

    const mailOptionsSuiveur = {
        from: process.env.EMAIL_USER!,
        to: suiveurEmail,
        subject: 'Nouveau rendez-vous créé',
        text: `Bonjour, \n\nUn nouveau rendez-vous a été créé que vous devez suivre.\n\nDétails du rendez-vous :\nDate: ${rdv.dateRdv}\nEntreprise: ${rdv.entreprise}\nFormation: ${rdv.formation}`,
    };

    try {
        await Promise.all([
            transporter.sendMail(mailOptionsTuteur),
            transporter.sendMail(mailOptionsAlternant),
            transporter.sendMail(mailOptionsSuiveur)
        ]);
        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending emails:', error);
        throw new Error('Failed to send emails');
    }
}

export async function sendRdvCancelledEmail(email: string, rdv: any): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER!, // L'email à partir duquel envoyer
      to: email, // L'email de l'utilisateur
      subject: 'Annulation de Rendez-vous',
      text: `Le rendez-vous prévu pour ${rdv.dateRdv.toLocaleString()} a été annulé. Veuillez prendre les dispositions nécessaires.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send cancellation email');
    }
}

export async function sendRdvRelanceEmail(tuteurEmail: string, alternantEmail: string): Promise<void> {
    console.log("id"  + tuteurEmail + alternantEmail);
    const mailOptionsTuteur = {
        from: process.env.EMAIL_USER!,
        to: tuteurEmail,
        subject: 'Relance pour la prise de rendez-vous',
        html: `
            <p>Bonjour,</p>
            <p>Nous vous contactons pour vous rappeler de planifier un rendez-vous prochainement.</p>
            <p>Nous sommes disponibles pour convenir d'un moment qui convient à toutes les parties.</p>
            <p>Merci de votre attention et de votre coopération.</p>
            <p>Cordialement,</p>
            <p>Campus Science U</p>
        `,
    };

    const mailOptionsAlternant = {
        from: process.env.EMAIL_USER!,
        to: alternantEmail,
        subject: 'Relance pour la prise de rendez-vous',
        html: `
            <p>Bonjour,</p>
            <p>Nous vous contactons pour vous rappeler de planifier un rendez-vous prochainement.</p>
            <p>Nous sommes disponibles pour convenir d'un moment qui convient à toutes les parties.</p>
            <p>Merci de votre attention et de votre coopération.</p>
            <p>Cordialement,</p>
            <p>Campus Science U</p>
        `,
    };

    try {
        await Promise.all([
            transporter.sendMail(mailOptionsTuteur),
            transporter.sendMail(mailOptionsAlternant),
        ]);
        console.log('Relance e-mails sent successfully');
    } catch (error) {
        console.error('Error sending relance e-mails:', error);
        throw new Error('Failed to send relance e-mails');
    }
}

