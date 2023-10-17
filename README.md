
# Project Overview

- This project is a web application built with React.
- The development server is set up using Vite.
- JSON Server is used to store the entered information in a data.json file.

## Getting Started

Follow the instructions below to run this project on your local machine.

### Prerequisites

- Node.js and npm should be installed on your computer.

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/andrito9755/DRRreport.git

2. Navigate to the project directory:

    ```bash
    cd DRRreport

3. Install project dependencies:
 
    ```bash
    npm install

## Running the Development Server
To run the development server for this application, use the following command:

    npm run dev

The development server will start, and your application will be available at http://localhost:5137. You can start making changes to the code, and the application will auto-refresh.It is 

### Running the JSON Server
Data submission is implemented using AJAX (Asynchronous JavaScript and XML) technology. AJAX allows you to send and receive data from the server without requiring a full page refresh. 

To run the JSON Server, which stores the information entered in the application, use the following command:
  bash 
   json-server --watch JSON-server/data.json --port 3001
   
### Usage 
Access the React application by visiting https://localhost:5137. All the data entered in the application is  stored in the 'data.json' file located in the 'JSON-server' folder.
