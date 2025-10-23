# 🔍 Email Debug Guide

## **Detailed Logging Added!**

I've added comprehensive logging to help debug the "Could not send verification code" error.

## **📊 What Logs to Look For:**

### **1. Check Browser Console:**
Open Developer Tools (F12) → Console tab

### **2. Look for these log messages:**

**✅ Success logs:**
```
📧 Starting email send process...
📧 Payload: { to: "user@example.com", subject: "Your verification code", codeLength: 6 }
🔑 Token exists: true
🔑 Token length: 25
📧 Subject: Your verification code
📦 Importing ZeptoMail SDK...
✅ ZeptoMail SDK imported successfully
🌐 ZeptoMail URL: api.zeptomail.in/
🔧 Creating ZeptoMail client...
✅ ZeptoMail client created successfully
📧 Sending email with data: { from: {...}, to: [...], subject: "...", htmlLength: 1234 }
📤 Calling client.sendMail()...
✅ Email sent successfully: {...}
```

**❌ Error logs:**
```
❌ VITE_ZEPTO_TOKEN environment variable is required
❌ ZeptoMail error details:
❌ Error type: object
❌ Error message: [specific error message]
❌ Error stack: [stack trace]
❌ Response status: [HTTP status]
❌ Response data: [API response]
```

## **🔧 Common Issues & Solutions:**

### **1. Token Issues:**
- **Check:** `🔑 Token exists: false` → Set `VITE_ZEPTO_TOKEN` in `.env`
- **Check:** `🔑 Token length: 0` → Token is empty
- **Solution:** Get token from ZeptoMail dashboard

### **2. SDK Import Issues:**
- **Check:** `📦 Importing ZeptoMail SDK...` but no success message
- **Solution:** Run `npm install` to install zeptomail package

### **3. API Issues:**
- **Check:** `❌ Response status: 401` → Invalid token
- **Check:** `❌ Response status: 403` → Token permissions issue
- **Check:** `❌ Response status: 400` → Invalid email format

### **4. Network Issues:**
- **Check:** `❌ Request details: {...}` → Network connectivity
- **Solution:** Check internet connection

## **🚀 Quick Debug Steps:**

1. **Open Browser Console** (F12)
2. **Try sending an email**
3. **Look for the log messages above**
4. **Check which step fails**
5. **Follow the solution for that step**

## **📧 Test Your Setup:**

1. **Set environment variable:**
   ```env
   VITE_ZEPTO_TOKEN=your_zepto_token_here
   ```

2. **Restart your dev server:**
   ```bash
   npm run dev
   ```

3. **Try sending an email and check console logs**

The detailed logs will show exactly where the process fails! 🔍
