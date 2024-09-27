import emailjs from 'emailjs-com';

export const sendContactEmail = async (formData) => {
  const { firstName, lastName, email, phone, message } = formData;

  const templateParams = {
    from_name: `${firstName} ${lastName}`,
    from_email: email,
    from_phone: phone,
    message
  };

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_MESSAGES_ID,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID
    );
    return true;
  } catch (error) {
    throw new Error('Failed to send the message');
  }
};
