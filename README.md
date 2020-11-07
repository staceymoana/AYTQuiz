# Quiz Application

This project was created as part of the requirements for completing the course Business Application Programming at EIT - Hawkes Bay.

## Overview

This application allows users to create, manage, and take quizzes. Each of these functions belong to a specific component. The Create Quiz component allows quizzes to be created with a set of questions. The Take Quiz component allows a quiz to be accessed and subsequently answered. The Quiz Reports component generates reports and aggregate data for a specific quiz.

## Users

This application has two main users: the administrator, and the participant. The administrator has the ability to view reports, create, and manage quizzes while the participant is able to answer quizzes.

## Technology

This application makes use of Angular for the frontend and Serverless/Amazon Web Services (Lambda, DynamoDB, S3, API Gateway) for the backend

## Frontend (Angular)

The frontend component was built using Angular. Apart from built-in libraries, Bootstrap, Chart.js, and Sweetalert2 were used. These three packages must first be installed before editing/running the component (see https://www.npmjs.com/ for more details).

## Backend (Serverless/AWS)

The backend component was written using Python. To deploy the changes, the AWS credentials must first be updated (see https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html for more details). After updating, run "sls deploy" on the backend folder to deploy the latest changes to AWS.

