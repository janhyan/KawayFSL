# KawayFSL - FIlipino Sign Language Tutoring Application

## Learning Management System (LMS) for Filipino Sign Language

### Overview
This project is a Learning Management System (LMS) designed to teach Filipino Sign Language (FSL) through active gesture and pose recognition. It uses technologies like LSTM (Long Short-Term Memory) for sequence prediction and MediaPipe for real-time gesture detection. The system helps users learn sign language more effectively by providing interactive tutorials and assessments that require real-time gesture accuracy.

### Key Features
* Filipino Sign Language Tutorials: Step-by-step lessons covering various FSL topics.
* Gesture and Pose Recognition: Integrated with MediaPipe and LSTM for real-time gesture recognition during assessments.
* Assessments and Progress Tracking: Users can only proceed to the next lesson after successfully completing assessments.

### Application Architecture
1. Frontend: Built with React for a dynamic and responsive user interface.
2. Backend: Using Node.js/Express for robust and scalable backend services.
3. Cloud Hosting: Hosted on AWS using:
    * CloudFront for global content delivery and low latency.
    * S3 for scalable storage of lesson content (e.g., videos, images) and Frontend.
    * AWS Cognito for secure user authentication and management.
    * AWS Lambda for handling serverless tasks such as assessment predictions.
    * Docker for containerized Lambda Functions and backend.
    * AWS RDS (PostgreSQL) as the primary database for tracking user progress, lessons, and assessments.
