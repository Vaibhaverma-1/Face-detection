# 👁️‍🗨️ FaceVision: Real-Time Face Detection and Analysis

A responsive React web application for **real-time face detection**, **age**, **gender**, and **emotion** recognition using **face-api.js** and webcam integration. Powered by a clean UI, modern React components, and hosted seamlessly on **Vercel**.

🔗 **Live Demo:** [https://face-detection-two-wheat.vercel.app/](https://face-detection-two-wheat.vercel.app/)

---

## ✨ Features

- 🔍 Real-time face detection via webcam
- 🧠 Emotion recognition (happy, sad, angry, etc.)
- 👦 Gender prediction with confidence %
- 🎂 Age estimation
- 🎨 Responsive UI with dark/light mode toggle
- 📦 Modular, reusable React components
- 🚀 Hosted on **Vercel** with zero config deployment

---

## 🛠 Tech Stack

| Category        | Tools & Libraries                                                                 |
|-----------------|------------------------------------------------------------------------------------|
| **Frontend**    | React, TypeScript, Vite                                                           |
| **Styling**     | Tailwind CSS, Bootstrap                                                          |
| **Icons**       | React Icons                                                                      |
| **AI/ML Models**| [face-api.js](https://github.com/justadudewhohacks/face-api.js)                  |
| **Deployment**  | **Vercel** – seamless integration with GitHub for CI/CD                          |
| **Other**       | HTML5 Media APIs (getUserMedia), React Context API                               |

---

## 📁 Folder Structure

Face-detection/
├── public/
│ ├── models/ # FaceAPI model files (age, gender, emotion, detection)
│ │ ├── age_gender_model/
│ │ ├── face_expression/
│ │ └── tiny_face_detector/
│ └── index.html
├── src/
│ ├── components/
│ │ ├── Navbar.tsx # Top navigation bar with theme toggle
│ │ ├── Toggle.tsx # Dark/light mode toggle
│ │ ├── Display.tsx # Webcam video + canvas overlay + detection logic
│ │ ├── Information.tsx # Circular progress indicators for predictions
│ │ ├── Upload.tsx # (Optional) Image/video upload handler
│ │ └── Footer.tsx # Footer with copyright
│ ├── context/
│ │ └── WebcamContext.tsx # Global webcam stream state
│ ├── App.tsx # Main layout wrapper
│ ├── main.tsx # App entry point
│ └── App.css # Global styles
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md



---

## 🧠 How It Works

1. Loads face-api.js models from `/public/models`
2. Accesses webcam stream with `navigator.mediaDevices.getUserMedia`
3. Runs face detection every frame using `TinyFaceDetector`
4. Uses `withAgeAndGender()` and `withFaceExpressions()` to extract:
   - Age (approximate)
   - Gender (male/female with confidence)
   - Emotion (happy, sad, angry, neutral, etc.)
5. Draws bounding boxes and overlays labels on a canvas
6. Sends predictions to `Information.tsx` to render live circular progress bars

---

## 🖥️ Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Git

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Vaibhaverma-1/Face-detection.git
cd Face-detection

# 2. Install dependencies
npm install

# 3. Place the model files inside public/models
# (Download from face-api.js GitHub or link externally)

# 4. Run development server
npm run dev
```
## 🚀 Deployment

This project is deployed using [**Vercel**](https://vercel.com), a platform for frontend frameworks and static sites, built to integrate with Git.


Steps to Deploy:
Go to https://vercel.com

Connect your GitHub account

Import your repository Face-detection

Set:

Framework: Vite / React

Build Command: npm run build

Output Directory: dist

Click Deploy

Vercel will handle CI/CD automatically and host your site on a live URL like:

🔗 https://face-detection-two-wheat.vercel.app/

📸 Screenshots
You can add screenshots or screen recordings here for visual representation.

📄 License
This project is open source under the MIT License.

🙋‍♂️ Author
Vaibhav Verma
Third-year B.Tech CSE @ KIIT
GitHub Profile

⭐️ Acknowledgements
face-api.js – for deep learning models in the browser

Vercel – for blazing-fast React app hosting

Bootstrap + Tailwind – for responsive design

