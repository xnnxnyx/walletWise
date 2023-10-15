[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/KRLE_tfD)

# Project Proposal
## <ins>Description of Web Application</ins>:
The web application, named "WalletWise", aims to provide a practical solution for simplifying budget management and enhancing financial literacy. WalletWise will serve as a supportive financial companion, allowing users to navigate the complexities of budgeting with ease and confidence. Users will be able to create customizable budgets, set savings goals, and receive notifications such as reminding users of when they are about to exceed their spending budget. WalletWise also allows for collaborative budgeting so users can collaborate with close friends and family to meet their financial goals. One of our key features is allowing users to take a picture of their receipts using a QR code provided on the website and keep a list of receipt history in the dashboard. Furthermore, users will be able to track their expenses and get a comprehensive detail of their spending habits. We allow all of these features while also being cautious of our user’s privacy so the app will be highly secured with authentication to ensure that only authorised users have access to their financial data. The ultimate goal of the app is to make user experience with budgeting easier.


## <ins>Key Features of the Beta Version</ins>:
- **Budgeting Goals:** Users can set specific financial goals and they can also specify the target date that they want to accomplish this budgeting goal. For example, the user can set a goal of how much money they want to spend on groceries, shopping etc. based on their monthly budgeting goals. The app allows users to define these goals, set target dates, and allocate funds accordingly.

- **Expense Tracking:** Given a user’s transaction history, we will keep track of their expenses of different categories. Users will also be given an option to manually input the money they spend through cash. Therefore, the app can analyse a user’s spending habits and provide them with insights into where their money is going.

- **Data Visualization:** Users can visualise their spending habits through informative and interactive charts, including pie charts that break down expenses by category. This visual representation provides a clear understanding of where their money is being spent.

## <ins>Key Features of the Final Version</ins>:
- **Expense Receipt Scanning/Upload:** We allow users to take a picture of their receipt, or upload a receipt so this could be a method of tracking when users pay by cash. They will be provided with a google form to upload or take the picture of the receipt and they can input the total amount spent so the expense can be tracked on our website. 

- **Budget Reminders:** The app sends timely reminders to users when they are approaching or about to exceed their budget limits. This feature helps users stay on track and avoid overspending. 

- **Collaborative Budgeting:** The app enables users to collaborate on budget goals with family members, friends, or partners. This feature is perfect for households looking to manage finances together.

- **Secure Financial Data:** The app prioritises user data security, with encryption and authentication protocols in place to protect sensitive financial information.


## <ins>Technology Stack</ins>: 
- **Frontend:** React\
*React* is a frontend JavaScript library. We will be using React for our frontend as it is a widely used frontend framework for development. We will also be using the Material UI library for helping us with designing. 

- **Backend:** Node, Express\
*Node* is a server environment used to spin up a server and Express is a backend web application framework that will help to build our REST APIs. We will be using Node and Express as it will be seamless to set it up since most of the members know about it and it's a great framework for backend web development in the industry. 

- **Database:** MongoDB\
*MongoDB* is a non-relational database and it stores data in JSON-format. We will be using MongoDB as it will be useful to have schema flexibility as we are still exploring the format of our data. 

- **Deployment Tools:** AWS\
*AWS* is a cloud platform that we can use for deploying our frontend, backend and database. AWS is robust and used for deploying many applications in the industry.

## <ins>5 Technical Challenges</ins>: 

- **Generating QR code**\
Generating a QR code will be challenging due to the fact that we would be generating QR codes and displaying it on the frontend for the users, which can be challenging to produce. The challenge would also arise from integrating an API for generating a QR code for each user.

- **Data Visualization**\
We would be using the APIs mentioned in the resource section on the course website. We will also be generating graphical visualisations of the budgeting and expenses data, which might be challenging as we have never done it before.

- **Navigation of QR code to google form on mobile**\
The user will first have to scan a QR code that is given to them to upload their receipt. This will open a google form on their phone, and the user can then add all the required information. This can be particularly challenging during the process of generating the form based on the QR code and navigating the complete process.

- **OAuth2 integration**\
We would have to read the documents for integrating OAuth2 for user authentication. This is a new concept to us that we have not yet familiarised ourselves with. We would have to learn and understand how to integrate OAuth2 into our system, allowing for a safe and secure environment. 

- **Collaborative Budgeting**\
Here the users will be able to link 2 accounts and collaborate on setting shared budget goals. Each user will be able to have their own separate accounts, but will also have the feature to collaborate with other people. The challenge will arise by syncing the data of two different users into one shared budget view. This in itself is a challenging because we have to ensure that we are not allowing different users to see each others sensitive information.