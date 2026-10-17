# The IT Pro Community 🇧🇭

The official website of **The IT Pro Community** ([www.it-bh.pro](https://www.it-bh.pro)), a premier virtual network in the Kingdom of Bahrain dedicated to advancing the craftsmanship of AI-assisted software engineering.

The community champions software craftsmanship, algorithmic efficiency, and clean architecture over superficial "vibe coding" and AI-generated bloatware.

## Philosophy and Architecture

In keeping with our values, this website is built with **zero bloatware**:
- **Pure Web Standards:** Plain HTML5, Vanilla CSS3, and Vanilla ECMAScript.
- **Zero Dependencies:** No frameworks, no build steps, no npm packages, and no external libraries.
- **Zero Cross-Origin Requests:** Zero CDNs or external fonts. Every asset is self-contained and hosted locally for fast, private, and resilient delivery.
- **Accessible and Fast:** Semantic markup, full keyboard navigability, responsive layouts, and support for user preferences such as `prefers-reduced-motion`.

## Project Structure

```
.
├── assets/
│   └── logo.jpg         # Official community insignia
├── favicon.svg          # Vector favicon inspired by the official shield
├── index.html           # Semantic markup, metadata, and structured sections
├── styles.css           # Vanilla CSS properties, grid/flex, fluid typography
├── script.js            # Vanilla JS for navigation, scrollspy, and email copying
├── LICENSE              # MIT License
└── README.md            # Project documentation
```

## Running Locally

Because this project uses standard static files, no compilation or packaging is required. You can serve it using any local HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx serve .
```

Open `http://localhost:8080` in your browser.

## Contact and Links

- **Official Website:** [www.it-bh.pro](https://www.it-bh.pro)
- **Official Email:** [info@it-bh.pro](mailto:info@it-bh.pro)

## License

Copyright (c) 2026 The IT Pro Community. All rights reserved.
This project is open source and available under the [MIT License](LICENSE).
