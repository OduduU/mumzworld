<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<h3 align="center">MumzyWorld Backend Task</h3>

  <p align="center">
    A NestJS application that serves as a wrapper for a third-party weather API and provides additional features.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This is a NestJS application that serves as a wrapper for weatherapi.com third-party weather API.
It allows users to create account, login, access weather information for a given city, save, access and delete favorite cities.
The projects covers core features;

- Authentication
- Authorization
- Logging
- Error handling
- Caching
- Rate Limiting
- Job Scheduling to continuously update weather data
- Testing

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [NestJS]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Ensure you have nodejs installed
- Ensure you have npm installed
- Ensure you have postgressql database installed

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/OduduU/mumzworld.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enter your env variable in your created in `.env` file as shown in .env.example file.
   You can create your weather apikey weatherapi.com or use the one provided in .env.example
   ```js
   DATABASE_URL =
   WEATHER_APIKEY =
   SALT_ROUND =
   JWT_KEY =
   ```
4. Generate Prisma client and Run database migration by running the below commands
   ```sh
   npx prisma migrate deploy
   npx prisma generate
   ```
5. Run application
   ```sh
   npm run start:dev
   ```
6. Run unit test
   ```sh
   npm run test
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Caching Strategy Explanation

Caching improves request response time to frequently used data by acting as a temporary storage layer.
To implement this, I leveraged on the @nestjs/cache-manager and cache-manager packages, configured it to use the in-momery caching and be accessible on the needed service(s).

On the get city's current weather and get city's forecast weather endpoints;

- I first checked to know if the queried city data has already been cached and return the cashed data immediately as response.
- If the data was not cached, I went ahead to make an api call to the third pary weather service to fetch the desired response.
- I went ahead to cached the requested city's data and set a time to live on the caching manager.

## Assumptions and Design decisions

- I assumed that the get city recent weather and city forecast weather would be the most frequently accessed endpoints so I implemented rate limiting and also caching mechanism on them.

- The current implementation of caching and rate limiting uses in-memory for storage reduces the dependencies needed to run the application and is suitable for testing and local development. The most efficient configuration for production would be to use an external datastore like Redis.

- I assumed that to properly demonstrate authorization and authentication, and also route protection using Guard, I created additional endpoints for user signup and signin. This also allowed me to demonstrate database relationship between a user and Favorite locations

- I assumed that the Add Favorite Location and Delete Favorite location endpoints needs to be protected and a user needs to be authorized before they can add or delete their favorite location.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## API documentation

The APIs to this project were comprehensively documented using Postman Collection.
An exported json copy of the documentation can be found in the root directory of the project with the name MumzWorld.postman_collection.json

You can also access the Postman collection through Documentation Link: [Postman Link](https://blue-rocket-509663.postman.co/workspace/Team-Workspace~43e6eb93-9450-4d15-8fd8-ad57eb21a5f4/collection/19242122-2bcaec81-feb8-4005-9824-e2bb3c8bdf05?action=share&creator=19242122)

The Endpoints are categorized in User and Weather folders

User endpoints includes;

- Signup endpoint - This endpoint enables a user to create an account
- Signin endpoint - This endpoint enables a user to login and get an access token
- Add Favorite Location endpoint - This endpoint enables user to save a favorite city to the database and it requires Authentication: login_token to be passed in the request header
- Get Favorite Location endpoint - This endpoint enables user to get an array of their favorite cities, it requires Authentication: login_token to be passed in the request header
- Delete Favorite Location endpoint - This endpoint enables user to delete a favorite city, it requires Authentication: login_token to be passed in the request header

Weather endpoints includes;

- Get City Weatger endpoint - This endpoint enables a user to get the recent weather details of a city.
- Get City Forecast Weather - This endpoint enables a user to get a 5 days forecast detail of a city.

To test the APIs;

- Import MumzWorld.postman_collection.json in a postman client

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

OduduAbasi Udeme Umoeka
oumoeka@gmail.com
2347013201735

Project Link: [https://github.com/OduduU/mumzworld.git](https://github.com/OduduU/mumzworld.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
