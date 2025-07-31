// main.js

import Swup from 'https://cdn.skypack.dev/swup';

const swup = new Swup();



/////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////

$(document).ready(function(){
    $('.btn').on('click', function() {
        $(this).toggleClass('active'); // Toggle 'active' class on button click
    });
});

document.addEventListener("contextmenu", function (e) {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});


/////////////////////////////////////////////////////////

function initScrollToTop() {
    const scrollBtn = $("#scrollTopBtn");

    // Show button when user scrolls down 300px
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            scrollBtn.addClass("show");
        } else if (scrollBtn.hasClass("show")) {
            scrollBtn.removeClass("show").addClass("hiding");
            setTimeout(() => scrollBtn.removeClass("hiding"), 500); // match CSS transition time
        }
    });

    // Scroll to top on click
    scrollBtn.click(function() {
        $("html, body").animate({ scrollTop: 0 }, 600);
    });
};

/////////////////////////////////////////////////////////

async function loadImages() {
    try {
        // Fetch the JSON file
        const response = await fetch('./photos.json');
        const images = await response.json();
  
        // Select the container where images will be displayed
        const imageGrid = document.querySelector('.grid');
  
        // Loop through each image object and create <img> elements
        images.forEach((image) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt || 'Image'; // Default alt text if missing
            img.className = image.class; // Add classes from JSON
            img.loading = 'lazy'; // Enable lazy loading
            img.setAttribute('data-title', image.dataTitle);
            img.setAttribute('data-location', image.dataLocation);
            img.setAttribute('data-equipment', image.dataEquipment);
  
            // Append the image to the grid
            imageGrid.appendChild(img);

            setupFilters(); // Reinitialize the filters for the loaded images
            setupEventListeners(); // Bind click events to the newly added images

        });

        // Reapply the filter logic to the newly added images
        
    } catch (error) {
        console.error('Error loading images:', error);
    }
}




////////////////////////////////////////////////////////

let currentIndex = 0;              // Track which image is active
let photoElements = [];            // Store all photos in the grid

function setupEventListeners() {
    photoElements = $('.photo').toArray();  // ✅ Refresh the photo list every time
    //console.log("Photos found:", photoElements.length);

    $('.photo').off('click').on('click', function () {
        currentIndex = photoElements.indexOf(this); // ✅ Track index here
        const description = `<em>${$(this).data('title')}</em> <br>
                             ${$(this).data('location')} <br>${
                               $(this).data('equipment')}`;  
        openModal(this, description);
    });

    $('#modalCloseButton').off('click').on('click', closeModal);

    // ✅ Rebind arrows here too
    $('#prevImage').off('click').on('click', function (e) {
        e.stopPropagation();
        showPrevImage();
    });
    $('#nextImage').off('click').on('click', function (e) {
        e.stopPropagation();
        showNextImage();
    });
}


function showPrevImage() {
    currentIndex = (currentIndex - 1 + photoElements.length) % photoElements.length;
    updateModal(photoElements[currentIndex]);
}

function showNextImage() {
    currentIndex = (currentIndex + 1) % photoElements.length;
    updateModal(photoElements[currentIndex]);
}



function positionDescription(modalImage, modalDescription) {
    modalImage.onload = function() {
        modalDescription.style.left = `${(window.innerWidth / 2) - (modalImage.offsetWidth / 2)}px`;
    };
}


function updateModal(image) {
    if (!image) return; // Prevent error if undefined

    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById("modalDescription");

    // Convert jQuery object to DOM if needed
    const imgElement = image instanceof jQuery ? image[0] : image;

    modalImage.classList.add("fade-out");
    modalDescription.classList.add("fade-out");

    setTimeout(() => {
        modalImage.src = imgElement.src;
        modalDescription.innerHTML = `<em>${$(imgElement).data('title')}</em><br>${$(imgElement).data('location')}<br>${$(imgElement).data('equipment')}`;

        positionDescription(modalImage, modalDescription);

        modalImage.classList.remove("fade-out");
        modalImage.classList.add("fade-in");
        modalDescription.classList.remove("fade-out");
        modalDescription.classList.add("fade-in");
        setTimeout(() => modalImage.classList.remove("fade-in"), 300);
        setTimeout(() => modalDescription.classList.remove("fade-in"), 300);
    }, 200);
}



function setupEventListenerstwo() {
    // Bind click events for photo elements
    $('.photo').off('click').on('click', function () { // Use off to avoid duplicate listeners
        const description = `<em>${$(this).data('title')}</em> <br>
                                 ${$(this).data('location')} <br>${
                                   $(this).data('equipment')}`;  
        openModal(this, description);
    });

    // Bind close modal functionality
    $('#modalCloseButton').off('click').on('click', closeModal);
}



function openModal(image, description) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalDescription = document.getElementById('modalDescription');
    
    modal.classList.add("show"); // Show modal
    modalImage.src = image.src; // Set the modal image source to the clicked image
    modalDescription.innerHTML = description;
    

    // Set the left position of the description
    positionDescription(modalImage, modalDescription);
    //modalDescription.style.transform = 'translateX(-93%)'; // Shift left by half its own width


    var blur = document.getElementById('blur');
    blur.classList.toggle('active');

}

window.openModal = openModal;

function closeModal() {
    const modal = document.getElementById("imageModal");
    
    modal.classList.remove("show"); // Hide modal
    
    // Optional: Remove blur
    document.getElementById('blur')?.classList.remove('active');
}

window.closeModal = closeModal;


////////////////////////////////////////////////////////

// Define a named function for setting up filters
function setupFilters() {
    // Array to hold active filters
    var activeFilters = [];

    // Function to disable/enable filters based on selection
    function toggleFilterAvailability() {

        if (activeFilters.includes('.black&white')) {
            $('.filter button[data-name=".color"]').prop('disabled', true).addClass('disabled');

        } else {
            $('.filter button[data-name=".color"]').prop('disabled', false).removeClass('disabled');
        }

        if (activeFilters.includes('.color')) {
            $('.filter button[data-name=".black&white"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".120_film"]').prop('disabled', true).addClass('disabled');
        } else {
            $('.filter button[data-name=".black&white"]').prop('disabled', false).removeClass('disabled');
            $('.filter button[data-name=".120_film"]').prop('disabled', false).removeClass('disabled');
        }

        if (activeFilters.includes('.digital')) {
            $('.filter button[data-name=".35mm"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".120_film"]').prop('disabled', true).addClass('disabled');

        } else if (activeFilters.includes('.35mm')) {
            $('.filter button[data-name=".digital"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".120_film"]').prop('disabled', true).addClass('disabled');

        } else if (activeFilters.includes('.120_film')) {
            $('.filter button[data-name=".digital"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".35mm"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".color"]').prop('disabled', true).addClass('disabled');
            $('.filter button[data-name=".black&white"]').prop('disabled', true).addClass('disabled');
        } else {
            $('.filter button[data-name=".35mm"]').prop('disabled', false).removeClass('disabled');
            $('.filter button[data-name=".digital"]').prop('disabled', false).removeClass('disabled');


            //$('.filter button[data-name=".color"]').prop('disabled', false).removeClass('disabled');
            //$('.filter button[data-name=".black&white"]').prop('disabled', false).removeClass('disabled');
        }

    }

    // Filter button click event
    $('.filter button').on("click", function () {
        var value = $(this).attr('data-name');

        // Prevent clicks on disabled filters
        if ($(this).prop('disabled')) {
            return;
        }

        // Toggle specific filters
        if (activeFilters.includes(value)) {
            // If filter is already active, remove it
            activeFilters = activeFilters.filter(function(item) {
                return item !== value;
            });
        } else {
            // Add the filter if it's not already active
            activeFilters.push(value);
        }

        // Update the availability of other filters
        toggleFilterAvailability();

        // First, hide all images by fading out
        $('.grid img').removeClass('show').addClass('hide');

        // Delay to allow the fade-out animation, then set `display: none`
        setTimeout(function() {
            $('.grid img').each(function() {
                var img = $(this);

                var matchesAllFilters = activeFilters.every(function(filter) {
                    return img.hasClass(filter);
                });

                if (activeFilters.length === 0 || matchesAllFilters) {
                    img.removeClass('hide').addClass('show').css('display', 'block');
                } else {
                    img.css('display', 'none');
                }
            });
        }, 500);

        // Highlight active buttons
        $('.filter button').removeClass('active'); // Remove active class from all buttons
        activeFilters.forEach(function(filter) {
            $('.filter button[data-name="' + filter + '"]').addClass('active'); // Add active class to currently active filters
        });
    });
}

////////////////////////////////////////////////////////////////

function setActiveButton() {
    const buttons = document.querySelectorAll('.button');
    const currentPath = window.location.pathname;
    // Ensure all buttons lose the 'active' class first
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Add 'active' class to the matching button
    buttons.forEach(button => {
        const buttonPath = new URL(button.href).pathname; // Get the pathname from the button's href
        console.log(buttonPath);
        console.log(currentPath);
        if ((buttonPath === currentPath)) {
            button.classList.add('active');
        }else if (currentPath === '/'){
            buttons[0].classList.add('active');
        }else if(currentPath === '/GPCdS_Photos/'){
            buttons[0].classList.add('active');
        }
    });
}


///////////////////////////////////////////////////////////////

$(document).ready(function () {
    initScrollToTop();
    loadImages();
    setupFilters();
    setActiveButton();
    setupEventListeners(); // Initialize event listeners
    window.scrollTo({ top: 0, behavior: 'smooth' });

    //showPrevImage();
    //showNextImage();
    //positionDescription(modalImage, modalDescription);
    //updateModal(image);
    //openModal(image, description);
    //closeModal();
});

swup.hooks.on('page:view', () => {
    initScrollToTop();
    loadImages();
    setupFilters();
    setActiveButton();
    setupEventListeners(); // Re-bind event listeners after Swup content replacement
    window.scrollTo({ top: 0, behavior: 'smooth' });
});



////////////////////////////////////////////////////////////////