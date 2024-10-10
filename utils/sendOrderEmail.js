import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export const sendOrderEmail = async (orderData) => {
  const {
    name,
    phone,
    email,
    address,
    zip,
    city,
    orderDetails,
    pickupDate,
    returnDate
  } = orderData;

  const templateParams = {
    from_name: name,
    from_phone: phone,
    from_email: email,
    from_address: address,
    postal_code: zip,
    from_city: city,
    order_details: orderDetails,
    pickup_date: pickupDate,
    return_date: returnDate
  };

  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_USER_ID
    );
    toast.success('Order email sent successfully!');
  } catch (error) {
    toast.error('Failed to send order email. Please try again.');
  }
};
