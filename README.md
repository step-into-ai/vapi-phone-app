# Vapi AI Phone App

Eine moderne, schöne Web-App mit Smartphone-Interface für Gespräche mit KI-Agenten über die Vapi SDK.

## Features

- 📱 **Smartphone-Design**: Authentisches Smartphone-Interface mit modernem Design
- 🎤 **Spracherkennung**: Natürliche Sprachinteraktion mit KI
- 🤖 **KI-Agent**: Powered by Vapi AI für intelligente Gespräche
- ⚡ **Echtzeit**: Sofortige Antworten und Live-Status-Updates
- 🎨 **Modern UI**: Gradient-Hintergründe, Animationen und glasmorphe Effekte
- 🔒 **Sicher**: Sichere Token-Verwaltung über API-Routen

## Technologie-Stack

- **Frontend**: Next.js 15 mit TypeScript
- **Styling**: Tailwind CSS 4
- **Animationen**: Framer Motion
- **Icons**: Lucide React
- **Voice AI**: Vapi AI SDK
- **Deployment**: Vercel-ready

## Schnellstart

1. **Repository klonen**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vapi-phone-app.git
   cd vapi-phone-app
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen einrichten**
   ```bash
   cp .env.example .env.local
   ```
   
   Fügen Sie Ihren Vapi Public Key in `.env.local` ein:
   ```
   VAPI_PUBLIC_KEY=your_vapi_public_key_here
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Browser öffnen**
   Besuchen Sie [http://localhost:3000](http://localhost:3000)

## Vapi Konfiguration

1. Erstellen Sie ein Konto bei [Vapi AI](https://vapi.ai)
2. Gehen Sie zum Dashboard und holen Sie sich Ihren Public Key
3. Erstellen Sie einen Assistenten oder verwenden Sie eine bestehende Assistant-ID
4. Aktualisieren Sie die Umgebungsvariablen

## Deployment auf Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vapi-phone-app)

### Manuelle Deployment-Schritte:

1. **Vercel CLI installieren**
   ```bash
   npm i -g vercel
   ```

2. **Mit Vercel anmelden**
   ```bash
   vercel login
   ```

3. **Projekt deployen**
   ```bash
   vercel
   ```

4. **Umgebungsvariablen in Vercel setzen**
   - Gehen Sie zu Ihrem Projekt-Dashboard auf Vercel
   - Navigieren Sie zu Settings > Environment Variables
   - Fügen Sie `VAPI_PUBLIC_KEY` hinzu

## Projektstruktur

```
vapi-phone-app/
├── src/
│   ├── app/
│   │   ├── api/vapi-token/route.ts  # Secure token API
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main page
│   ├── components/
│   │   └── VapiSmartphone.tsx       # Smartphone interface
│   └── lib/
│       └── utils.ts                 # Utility functions
├── public/                          # Static assets
├── .env.example                     # Environment template
└── package.json                     # Dependencies
```

## Anpassung

### Assistent ändern
Aktualisieren Sie die `assistantId` in `src/components/VapiSmartphone.tsx`:

```typescript
const assistantId = 'your-assistant-id-here';
```

### Styling anpassen
Das Design kann über Tailwind CSS-Klassen in den Komponenten angepasst werden.

### Weitere Features hinzufügen
- Gespräch-Historie
- Benutzer-Authentifizierung
- Anruf-Aufzeichnungen
- Multi-Language-Support

## Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei für Details.

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue auf GitHub.

---

**Powered by [Vapi AI](https://vapi.ai) & [Next.js](https://nextjs.org)**