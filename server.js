const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs'); // To URL-encode the data

const SSLCommerzPayment = require('sslcommerz-lts');

// SSLCommerz configuration
const store_id = 'qwiki6703b71d41151';  // Replace with your actual store ID
const store_passwd = 'qwiki6703b71d41151@ssl';  // Replace with your actual store password
const is_live = false; // Set to `true` for live mode

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Route for SSLCommerz success callback
app.post('/success', (req, res) => {
  // Here you can handle the success response
  console.log('Payment Success:', req.body);
  res.send('Payment successful!'); // Respond back to the client
});



// =========================================
// ========== First Way ====================
// =========================================

// SSLCommerz Initialize Payment
// app.post('/init', async (req, res) => {
//   const { amount, customer_name, customer_email, customer_address, customer_phone, customer_city, customer_postcode } = req.body;

//   // Check if all required fields are provided
//   if (!amount || !customer_name || !customer_email || !customer_address || !customer_phone || !customer_city || !customer_postcode) {
//     return res.status(400).json({ message: 'All fields are required for payment.' });
//   }

//   const paymentData = {
//     store_id: store_id,
//     store_passwd: store_passwd,
//     total_amount: amount,
//     currency: 'BDT',
//     tran_id: `TRAN_${Date.now()}`, // Unique transaction ID
//     success_url: 'http://localhost:3000/success',
//     fail_url: 'http://localhost:3000/fail',
//     cancel_url: 'http://localhost:3000/cancel',
//     cus_name: customer_name,
//     cus_email: customer_email,
//     cus_add1: customer_address,
//     cus_city: customer_city,
//     cus_country: 'Bangladesh',
//     cus_phone: customer_phone,
//     ship_name: customer_name,
//     ship_add1: customer_address,
//     ship_city: customer_city,
//     ship_country: 'Bangladesh',
//     ship_postcode: customer_postcode, // Added field
//     shipping_method: 'Courier',
//     product_name: 'Test Product',
//     product_category: 'Test Category',
//     product_profile: 'general',
//   };

//   console.log('Payment data being sent to SSLCommerz:', paymentData); // Log payment data

//   try {
//     const sslcommerzResponse = await axios.post(
//       is_live
//         ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php' // Live URL
//         : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',  // Sandbox URL
//       qs.stringify(paymentData),  // URL-encode the payment data
//       { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }  // Set content type
//     );

//     console.log('SSLCommerz Response:', sslcommerzResponse.data);

//     if (sslcommerzResponse.data.GatewayPageURL) {
//       res.status(200).json({ url: sslcommerzResponse.data.GatewayPageURL });
//     } else {
//       console.error('Failed to initialize payment session:', sslcommerzResponse.data);
//       res.status(400).json({
//         message: 'Failed to initialize payment session.',
//         details: sslcommerzResponse.data,
//       });
//     }
//   } catch (error) {
//     console.error('Error initializing payment:', error.response ? error.response.data : error.message);
//     res.status(500).json({
//       message: 'Server error while initializing payment.',
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// });



// =========================================
// ========== Second Way ===================
// =========================================
app.post('/init', (req, res) => {
  console.log(req.body);
  const paymentDetails = req.body;

  const data = {
    total_amount: paymentDetails.amount,
    currency: 'BDT',
    tran_id: `TRAN_${Date.now()}`, // use unique tran_id for each api call
    success_url: 'http://localhost:3000/success',
    fail_url: 'http://localhost:3000/fail',
    cancel_url: 'http://localhost:3000/cancel',
    ipn_url: 'http://localhost:3000/ipn',
    shipping_method: 'Courier',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: paymentDetails.customer_name,
    cus_email: paymentDetails.customer_email,
    cus_add1: paymentDetails.customer_address,
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: paymentDetails.customer_phone,
    cus_fax: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then(apiResponse => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.json({ url: GatewayPageURL });
    console.log('Redirecting to: ', GatewayPageURL);
  });
});




app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
