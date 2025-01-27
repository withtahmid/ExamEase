# ExamEase: A Modern Online Examination Platform

ExamEase is an innovative platform designed to revolutionize the online examination process by integrating advanced technologies to ensure security, adaptability, and comprehensive assessment. This platform caters to educators and students, offering features like multiple question formats, auto-proctoring, and automated grading.

## Features

- **Comprehensive Question Formats**: Support for MCQs, written responses, and Micro-Viva assessments.
- **Micro-Viva Functionality**: Voice-recorded questions and responses for interactive assessments.
- **AI-Powered Auto-Proctoring**: Facial recognition ensures academic integrity during exams.
- **Automated Grading**: Advanced evaluation mechanisms for prompt and unbiased feedback.
- **User-Centric Design**: Intuitive interface with seamless integration for educational contexts.
- **Cutting-Edge Technology**: Utilizes OpenAI Whisper (speech-to-text) and BERT (text similarity) for efficiency.

## Tech Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Build Optimization**: Vit

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)

### AI Components
- **Framework**: Python with Flask
- **Technologies**:
  - OpenAI Whisper for speech-to-text conversion.  
  - dlib's `face_recognition` for facial recognition.
  - BERT for semantic text analysis.

## Architecture
- **Frontend**: Handles user interactions and cohort management.
- **Backend**: Manages authentication, exam workflows, and API integrations.
- **Neural End**: Executes AI functionalities like facial recognition and grading.
## Installation

1. **Navigate to the project directory:** 
```bash
    cd ExamEase 
```
2. **Install dependencies for both frontend and backend:**
```bash
    # Frontend
    cd frontend   
    npm install
    # Backend
    cd ../backend
    npm install
    cd ../neuralend
    pip3 install -r requirements.txt
```
3. **Set up environment variables:**   
- Create `.env` files in both `frontend` and `backend` folders.
- Add configurations for API keys, MongoDB URI, etc.

4. **Run the application:**
```bash   
    # Frontend
    cd frontend   
    npm run dev
    # Backend   
    cd ../backend
    npm run dev
    cd ../neuralend
    python3 app.py
```

## Limitations
- Dependency on external APIs like OpenAI Whisper and face_recognition.
- Requires robust internet connectivity and hardware for AI features.
- Limited scalability beyond 100 concurrent users (further optimization required).

## Future Improvements

- Multilingual support for speech-to-text.
- Behavioral analytics to enhance proctoring.
- Support for hybrid questions like image-based responses.
- Reduced dependency on third-party APIs through in-house AI models.

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository.**
2. **Create a feature branch:**
```bash   
git checkout -b feature-name  
```
3. **Commit your changes:**
```bash   
   git commit -m "<Add feature-name>"
```
4. **Push to your fork:**
```bash
   git push origin feature-name   
```
5. **Submit a pull request.**


## Authors

The project was built from the ground up by:

- **[Sarowar Alam Minhaj](https://github.com/sarwar76200)** - Frontend Developer
- **[Md Tahmid Ahmed Rakib](https://github.com/withtahmid)** - Backend and AI Architect 

## References
- [OpenAI Whisper](https://openai.com/index/whisper/)
- [BERT](https://huggingface.co/sentence-transformers/stsb-bert-base)
- [dlib face_recognition](https://github.com/ageitgey/face_recognition)

---

Transforming online assessments with ExamEase!
