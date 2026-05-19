# Groq API Setup Guide — Alone Monster Coding Hub

## Tujhe kya karna hai

Tera chatbot abhi **Render Proxy** ke through Groq use karta hai.
Iska matlab hai ek backend server chahiye jiske paas Groq API key hai.

---

## Step 1 — Free Groq API Key lena

1. Ja **https://console.groq.com** pe
2. "Sign Up" karo (GitHub ya Google se login kar sakte ho)
3. Left sidebar mein **"API Keys"** click karo
4. **"Create API Key"** press karo
5. Key copy karo — dikhnee kuch aisi: `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   **Yeh key kisi ko mat dikhana!**

---

## Step 2 — Render Pe Free Proxy Server Deploy Karna

Tera index.html mein yeh line hai:
```javascript
const RENDER_PROXY = 'https://ai-proxy-vq3q.onrender.com/proxy';
```

Agar yeh server already kaam kar raha hai toh **Step 3 skip karo**.
Agar nahi kaam kar raha (chatbot error de raha hai) toh apna khud ka proxy banao:

### 2a. Proxy Code (Express server)

Ek naya file `server.js` banao:

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// CORS allow karo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/proxy', async (req, res) => {
  const { provider, model, messages, system } = req.body;

  if (provider !== 'groq') return res.status(400).json({ error: 'Only groq supported' });

  const msgs = system
    ? [{ role: 'system', content: system }, ...messages]
    : messages;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({ model, messages: msgs, max_tokens: 1024 })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
```

`package.json`:
```json
{
  "name": "groq-proxy",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.2" }
}
```

### 2b. Render Pe Deploy Karna (Free)

1. **https://render.com** pe account banao (free hai)
2. "New Web Service" → "Deploy from GitHub" → apna proxy repo connect karo
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
4. "Environment Variables" section mein:
   - Key: `GROQ_API_KEY`
   - Value: `gsk_xxxxxx` (teri Groq key)
5. Deploy karo — URL milega jaise `https://my-proxy.onrender.com`

### 2c. index.html mein URL update karo

```javascript
// Apna Render URL yahan daalo:
const RENDER_PROXY = 'https://my-proxy.onrender.com/proxy';
```

---

## Step 3 — Test Karo

1. Apni website open karo
2. AI chatbot button click karo
3. Kuch type karo — **Llama 3.3 70B (Groq)** reply karega!

---

## Quick Summary

| Cheez | Detail |
|-------|--------|
| Model | Llama 3.3 70B Versatile |
| Provider | Groq |
| Speed | ~500 tokens/sec (bahut fast!) |
| Cost | **FREE** (daily limit hai) |
| Daily Limit | ~14,400 requests/day (free tier) |
| Context | 128K tokens |

---

## Groq Free Tier Limits (2026)

- **llama-3.3-70b-versatile**: 14,400 req/day, 6,000 req/min, 200K tokens/min
- Zyada chahiye toh Groq ka paid plan lo

---

## Problem? Chatbot error de raha hai?

**"Failed to fetch"** — RENDER_PROXY URL galat hai ya Render server down hai (free tier 15 min baad sleep ho jaata hai)

**Fix:** Render.com pe ja aur service ko manually "Wake Up" karo, ya paid plan lo jo always-on ho.

---

*Guide by Alone Monster Coding Hub*
