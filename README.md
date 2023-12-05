# WalletWise

## Project URL

**Task:** Provide the link to your deployed application. Please make sure the link works. 
https://wallet-wise-a58c2ed22061.herokuapp.com/


## Project Video URL 

**Task:** Provide the link to your youtube video. Please make sure the link works. 

https://drive.google.com/drive/home

## Project Description

**Task:** The web application, named "WalletWise", aims to provide a practical solution for simplifying budget management and enhancing financial literacy. Users will be able to create customizable budgets, keep track of their expenses, and receive notifications notifying the users of their budget and expense updates. Users are also able to use a calendar to mark any payments, which are then displayed on the dashboard as upcoming payments. WalletWise also allows for collaborative budgeting so users can collaborate with close friends and family to meet their financial goals. Users are able to search other existing users, and request to create a joint account with them. Once a user accepts a joint account request, they are both seamlessly able to switch from their personal accounts to a joint account, where they share all their budgets and expenses. Another key feature of ours is allowing users to scan a QR code to insert their expenses. Users will then be able to track these expenses and get a comprehensive detail of their spending habits in the expenses tab. The ultimate goal of the app is to make user experience with budgeting easier.

Expense Tracking: Given a user’s transaction history, we will keep track of their expenses of different categories. Users will also be given an option to manually input the money they spent using the QR code. Therefore, the app can analyse a user’s spending habits and provide them with insights into where their money is going.

Data Visualization: Users can visualise their spending habits through informative and interactive charts, including pie charts that break down expenses by category. This visual representation provides a clear understanding of where their money is being spent.

Expense Upload: We allow users to input the money they spend to track their expenses. They will be provided with a google form to upload the total amount spent so the expense can be tracked on our website.

Budget Reminders: The app sends timely reminders to users when they are approaching or about to exceed their budget limits. This feature helps users stay on track and avoid overspending.

Collaborative Budgeting: The app enables users to collaborate on budget goals with family members, friends, or partners. This feature is perfect for households looking to manage finances together.

Secure Financial Data: The app prioritises user data security, with encryption and authentication protocols in place to protect sensitive financial information.


## Development

**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. 

Backend: 
The backend uses Javascript and uses MongoDb. We are using node and express as our middleware.

We have models that describle our collections. It was a bit tricky to have join accounts so we used polymorphisum in the models to have 2 different types of userRef (if it's a user from the userColl or JoinAccountCollection)
We are also storing 3 things in the session in the backed to make the switch account seemless. The 3 things are userName (so that we can display the right name in the accounts section when the user is in a collaborative account to switch back to their own, this stays same throughout a session), then we have userType (UserColl/ JointAccount so that when any post request is make to the backend, we can identify what account it is for, this changes when a user switches their account), userId (this helps us to fetch data from the backed depending on if it's a normal user or collaborative accouunt, this changes when a user switches account)

We are also using google apis to fetch data from the excel. This is the data that is stored when a user scans the qr code and goes to the google form. We know it would have been simpler to display a form and get data, but just so that we could expand our horizons and get a change to work with 3rd party api we chose this path. It took a while to figure out and there are modifications that we can make (currently the userId and userType is being dispalyed to the user but we could have made our own scripts for google form due to time constraints we chose not to for now)

Frontend: 
This uses libraries like chakra, MUI, React. 
We have dates, calendar, selecter from MUI  

## Deployment

**Task:** Explain how you have deployed your application.

The website WalletWise is deployed both on the GCP and Heroku. The frontend is deployed on heroku and the backend is deployed on the GCP. 
We realised a long time after that our frontend wasn't using react, so the structure wasn't aligned. We first changed the frontend.docker to follow the structure but that didn't work as it always got stuck on "npm install". We found a way out by deploying it on Heroku. 
For the backend, we faces a few issues in the starting but then while doing the deployment, things started to make sense. 

## Challenges

**Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. 

1. Adding Payments to Calendar and displaying
2. Seemlessly switching to joint accounts
3. Deployment

## Contributions

**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number). 

Annanya Sharma
- Moslty worked on the backend, deployed the backend on GCP,  and helped a bit on the frontend for calendar, pie chart and bar graph.

Jumana Fanous
- Mostly worked on the frontend, deployed the frontend on heroku, and also on the backend for api calls like upcoming payment, get userProfile etc.

## Credits 

We used figma for our icons, stackOverflow and ChatGPT. 

# One more thing? 

**Task:** Any additional comment you want to share with the course staff? 
