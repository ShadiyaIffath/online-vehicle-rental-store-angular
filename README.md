# Online vehicle rental store

A vehicle hire automated online frontend which will allow the users to search, view vehicles and make reservations online and administrator to access inventory data, reservation and competitor information with better ease and improved security. Developed using Angular 9 to provide dynamic dashboard with summarized system data provided angular component based plug and play, was used to develop this system. This application supports 2 user roles, Admin and Customer. There are 2 navigation bars, A top navigation for the customer and side navigation for Admins upon successful authorization.

The application cannot display main functionality without a backend. The endpoints are defined in services folder, the original application utilized jwwt tokens for user authorization.

## Customer functionality

   1. Create a reservation
         During this process the account license will be validated against the DMV data and the fraudulent license claims
         Once a reservation is created an email will be sent to the respective user’s email address
   2. Cancel and delete booking
   3. Extend active booking
   4. Make inquiry [Additional]
   5. Update account details
   6. Update login credentials
         This will send a confirmation code to the users registered email [Additional]
   7. View bookings
   8. Register
         During the registration process customer is required to submit license and an additional proof of identity, the license id will be cross validated with the data from           the DMV and external insurer database.
         A successful email will be sent to the user’s email address.
   9. Login
         An existing blacklisted account will not be able to gain authorization to the system
        
## Admin functionality

   1. Dynamic dashboard with summarized system data [Additional]
   2. Manage accounts - Ban customer, Delete customer
         Upon banning an account all reservations under the account will be cancelled
   3. Manage inquiries
         When admin submits a response, an email with the response is sent to the customer registered or not [Additional]
   4. Manage bookings
         If a booking has not been collected during the duration the customer will be banned by admin
   5. Manage Vehicles
   6. Manage Equipment
   7. View all users registered in the system with fraudulent licenses [Additional]
   8. Web scraping competition price rates
         This is an automated weekly process [Additional]
   9. Hangfire integration
         Admin can view the automated process details [Additional]
## Terminal Commands

1. Install NodeJs from [NodeJs Official Page](https://nodejs.org/en).
2. Open Terminal
3. Go to your file project
4. Run in terminal: ```npm install -g @angular/cli```
5. Then: ```npm install```
6. And: ```npm start```
7. Navigate to [localhost:4200](localhost:4200)
### What's included

