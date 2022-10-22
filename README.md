# MTMS Frontend
Marker & Tutor Management System - One COMPSCI399 Project

The University of Auckland

---

## Installation for Development
Clone the repository to your PC

```bash
git clone https://github.com/uoa-compsci399-s2-2022/team3-front-end.git
```

Enter the project directory

```bash
cd team3-front-end
```

Install the required dependencies.

*make sure you have installed node.js in order the install dependencies via `npm`*

```bash
npm install
```

Run the Vite development server. (which will run the script defined in the packge.json)

```bash
npm run dev
```

## Build for Production
Build the project for production
```bash
npm run build
```
After running, a static folder dist will be generated in the project root directory, you can deploy this folder to a static web server (Apache2, Nginx and so on)
