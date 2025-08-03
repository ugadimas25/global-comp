// EmailJS Configuration Template
// Copy this to js/main.js after setting up EmailJS

const EMAILJS_CONFIG = {
  serviceID: 'service_gcs2025',        // Replace with your Service ID from EmailJS
  templateID: 'template_subscription', // Replace with your Template ID from EmailJS  
  userID: 'YOUR_EMAILJS_USER_ID',     // Replace with your User ID from EmailJS
  adminEmail: 'ugadimas@gmail.com'
};

// Email Template for EmailJS Dashboard:
/*
Subject: 🎉 New Subscription - {{plan_type}} Plan

Body:
Halo Admin Global Climate Solution!

Ada subscription baru:

👤 User: {{user_name}}
📧 Email: {{user_email}}
💰 Plan: {{plan_type}} ({{plan_price}})
🕐 Waktu: {{timestamp}}

💬 Pesan: {{message}}

---
Global Climate Solution Notification System
*/
