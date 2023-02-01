# Meetup Clone Backend Application

Welcome to the Meetup Clone Backend Application! 
This is a coding bootcamp project aimed at cloning the popular website Meetup.com.

## Prerequisites

    Node.js
    npm 
    Sequelize CLI
    PostgreSQL
## Installation

Installation

1. Clone the repository. 

```bash
git clone https://github.com/<your-username>/meetup-clone-backend.git. 
```
2. Navigate to the directory. 

```bash
cd meetup-clone-backend. 
```

3. Install the dependencies. 

```bash
npm install. 
```
4. Set up the PostgreSQL database. 

* Create a database named "meetup-clone-backend". 

* Update the username and password in the config/config.json file to match your PostgreSQL setup.  

5. Run the migrations. 
```bash
sequelize db:migrate. 
````
## Usage/Examples -- Work In Progress

1. Start the applicaiton

```bash
npm app.js
```

2. Access the API endpoints with a REST client like Postman at http://localhost:3000


## API Endpoints -- Work In Progress

    GET /events: Retrieve all events. 

    GET /events/:id: Retrieve an event by id. 

    POST /events: Create a new event. 

    PUT /events/:id: Update an event by id. 

    DELETE /events/:id: Delete an event by id. 


## Contributing 

    1. Fork the repository. 
    2. Create your feature branch (git checkout -b feature/my-feature). 
    3. Commit your changes (git commit -am 'Add some feature'). 
    4. Push to the branch (git push origin feature/my-feature). 
    5. Create a new Pull Request. 



## Acknowledgements

Special thanks to [Meetup.com](www.meetup.com) 
for inspiring this project.
## License

[MIT](https://choosealicense.com/licenses/mit/)

