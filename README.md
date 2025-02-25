# 🗣️ Accessibility Menu – React + AWS Transcribe & Polly
---

This is a **React-based accessibility app** that integrates **AWS Transcribe** (for speech-to-text) and **AWS Polly** (for text-to-speech). It also provides **contrast adjustments, text resizing, and magnification options** to enhance accessibility for users with visual impairments.  

Note: The page utilized here is just a sample—designed to demonstrate the features of the menu.

---

## **🚀 Features**
✅ **Speech-to-Text (AWS Transcribe)** – Convert recorded speech into text.  
✅ **Text-to-Speech (AWS Polly)** – Read aloud selected text.  
✅ **S3 Storage for Audio Files** – Store recorded audio files on AWS S3.  
✅ **Contrast Adjustment** – Toggle high-contrast mode for better readability.  
✅ **Text Resizing** – Increase or decrease font size for improved accessibility.  
✅ **Screen Magnification** – Zoom in on content for better visibility.  
✅ **React & AWS SDK Integration** – Uses the latest AWS SDK for frontend processing.  

---

## **📦 Tech Stack**
- **React.js** (Frontend UI)
- **AWS Transcribe** (Speech-to-Text)
- **AWS Polly** (Text-to-Speech)
- **AWS S3** (Storage for audio files)
- **AWS SDK for JavaScript (v3)**  

---

## 🛠️ Getting Started

These instructions will help you set up the project locally for development and testing.

### ✅ Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher) – [Download Here](https://nodejs.org/)
- **npm** (v8 or higher) – Comes with Node.js
- **Git** – [Download Here](https://git-scm.com/)
- **AWS Account** with access keys

### 📥 Installing

1️⃣ **Clone the repository:**
```sh
git clone https://github.com/alfred-jgv/accessibility-menu-proj.git
cd folder-name
```

2️⃣ Install dependencies:

```sh
npm install
```

3️⃣ Set up environment variables:
Create a .env file in the root directory and add your AWS credentials:

```sh
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_AWS_REGION=your_region
VITE_AWS_S3_BUCKET=your_bucket_name
```

4️⃣ Start the development server:
```sh
npm run dev
```

---
### 👤 Required IAM User Policies

```sh
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "transcribe:StartTranscriptionJob",
                "transcribe:GetTranscriptionJob",
                "transcribe:ListTranscriptionJobs"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "polly:SynthesizeSpeech"
            ],
            "Resource": "*"
        }
    ]
}
```
---

### 🪣 Bucket Policy

```sh
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::transcribe-bucket/*"
        }
    ]
}
```
---
