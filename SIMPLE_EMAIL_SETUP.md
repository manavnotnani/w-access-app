# 🚀 Simple Email Setup - ZeptoMail with Local Server

## **CORS Issue Fixed!**

The CORS issue is now solved with a simple local server approach.

## **🔧 Quick Setup:**

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Set Environment Variables:**
Create a `.env` file with:
```env
VITE_API_URL=http://localhost:3001/api/send-email
ZEPTO_ZOHO_TOKEN=your_zepto_token_here
```

### **3. Run Both Servers:**

**Option A: Run Both Separately (Recommended)**
```bash
# Terminal 1: Start the email server
npm run dev:server

# Terminal 2: Start the Vite dev server  
npm run dev
```

**Option B: Run Both Together**
```bash
npm run dev:full
```

## **🎯 How It Works:**

1. **Frontend** (localhost:8080) → **Email Server** (localhost:3001) → **ZeptoMail API**
2. **No CORS issues** - Server handles external API calls
3. **Secure** - Token never exposed to browser
4. **Same beautiful emails** - Template preserved
5. **Production ready** - Can send to any email address

## **✅ Benefits:**

- 🚀 **No CORS issues** - Server handles API calls
- 🚀 **No domain verification** - Works immediately
- 🚀 **Send to any email** - Gmail, Yahoo, Outlook, etc.
- 🚀 **High deliverability** - Professional email service
- 🚀 **Simple setup** - Just two commands

## **🚀 Production Deployment:**

For production, deploy the server as a serverless function:
1. **Deploy to Vercel/Netlify** with the server.js file
2. **Set environment variables** in your hosting platform
3. **Update VITE_API_URL** to your production domain

## **📊 Expected Logs:**

**Success flow:**
```
📧 Starting email send process...
🌐 Using local server: http://localhost:3001/api/send-email
📊 Response status: 200
✅ Email sent successfully: {...}
```

Your email functionality should now work without any CORS errors! 🎉
