// Defines an array of image objects, each with a file name for illustrations
var images = [
  {
    file: "mnich",
  },
  {
    file: "bilapani",
  },
  {
    file: "bilyrytir",
  },
  {
    file: "radous",
  },
  {
    file: "splhac",
  },
  {
    file: "strakakal",
  },
];

// Iterates over the images array to set background images for corresponding cells
images.forEach((image) => {
  // Gets the DOM element (cell) matching the image's file name
  let imagecell = document.getElementById(image.file);

  // Creates a new Image object for lazy loading to prevent blurry previews
  const img = new Image();
  // Sets the image source to a WebP file in the media/ilustrace directory
  img.src = `./media/ilustrace/${image.file}.webp`;
  // Sets the cell's background to the loaded image, centered and covering the area
  img.onload = () => {
    imagecell.style.background = `url('${img.src}') no-repeat center/cover`;
  };
});

// Runs code after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Defines an array of checkbox IDs for state persistence
  const checkboxIds = [
    "mnich_check",
    "bilapani_check",
    "bilyrytir_check",
    "radous_check",
    "splhac_check",
    "strakakal_check",
  ];

  // Iterates over checkbox IDs to manage their state using localStorage
  checkboxIds.forEach((id) => {
    // Gets the checkbox element by ID
    const checkbox = document.getElementById(id);
    // Retrieves the saved state from localStorage
    const saved = localStorage.getItem(id);

    // Sets checkbox to checked if localStorage value is "true"
    if (saved === "true") {
      checkbox.checked = true;
    }

    // Adds event listener to save checkbox state to localStorage on change
    checkbox.addEventListener("change", () => {
      // Saves the checkbox state (true or false) to localStorage
      localStorage.setItem(id, checkbox.checked);
    });
  });
});
