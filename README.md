# Forkify

Forkify is a web application that allows users to search for recipes and bookmark their favorites. Users can explore a variety of recipes fetched from external APIs, view detailed cooking instructions, and save their favorite recipes for easy access.

## Features

- Search for recipes by ingredients or keywords
- View detailed information about each recipe, including ingredients and cooking instructions
- Bookmark favorite recipes for quick access
- Built with a clean and responsive design

## Architecture

This project is structured using the MVC architecture to ensure a clear separation of concerns. The Publisher-Subscriber pattern is employed for efficient data management and event handling.

## Technologies Used

- Frontend: JavaScript, HTML, CSS, Sass
- Build Tool: Parcel
- Transpiler: Babel
- API Integration:
  - [Forkify API](https://forkify-api.herokuapp.com/api/v2) for recipe data
  - [Calorie Ninjas API](https://api.calorieninjas.com/v1/nutrition) for nutritional information
- Libraries: Core-js, Fractional, Regenerator-runtime

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (with npm) installed on your machine

### Installation

1. Clone the repository:

   ```bash
   git clone (https://github.com/callmedeci/Forkify.git)
   ```

   ```bash
   cd Forkify
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm start
   ```

## Usage

- Open your browser and navigate to http://localhost:1234 to access the application.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to create an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Forkify API
- Calorie Ninjas API
- Special thanks to all contributors and mentors.
