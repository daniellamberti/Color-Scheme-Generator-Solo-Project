document.addEventListener("DOMContentLoaded", function () {

    // Selecting DOM elements

    const colorContainer = document.querySelector('section');
    const hexColorsContainer = document.querySelector('footer');
    const sectionCursorPointer = document.querySelector('section');

    const colorSelector = document.querySelector('#color-selector');
    const schemeSelector = document.querySelector('#scheme-selector');
    const generateSchemeBtn = document.querySelector('#generate-scheme-btn');
    const colors = document.querySelectorAll('.colors');
    const hexCodes = document.querySelectorAll('.hex');
    const resetBtn = document.querySelector('#reset-btn');


    // Variable to allow color copying to the clipboard only after the generateSchemeBtn has been pressed

    let isSchemeGenerated = false;

    // Update input color background dynamically

    colorSelector.addEventListener('input', function () {
        isSchemeGenerated = false;
        colorSelector.style.backgroundColor = colorSelector.value;
        sectionCursorPointer.style.cursor = 'default'
        hexColorsContainer.style.cursor = 'default'
    });


    // Fetch and render color scheme on button click

    generateSchemeBtn.addEventListener("click", function () {
        isSchemeGenerated = true;
        sectionCursorPointer.style.cursor = 'pointer'
        hexColorsContainer.style.cursor = 'pointer'
        const colorValue = colorSelector.value.substring(1);
        fetch(`https://www.thecolorapi.com/scheme?hex=${colorValue}&mode=${schemeSelector.value}`)
            .then(response => response.json())
            .then(data => {
                renderColors(data.colors);
            });
    });

    // Function to render colors

    function renderColors(colorsArray) {
        // Loop through each color and update elements
        colorsArray.forEach((color, index) => {
            if (colors[index] && hexCodes[index]) {
                colors[index].style.backgroundColor = color.hex.value;
                hexCodes[index].textContent = color.hex.value;
            }
        });
    }

    // Function to copy colors to the clipboard

    function copyColor(text, fromHex) {
        const colorText = fromHex ? text : hexCodes[Array.from(colors).indexOf(event.target)].textContent;
        navigator.clipboard.writeText(colorText).then(() => {
            alert(`Color ${colorText} was copied to the clipboard`);
        });
    }

    // Add click event listeners to color and hex containers

    [colorContainer, hexColorsContainer].forEach(container => {
        container.addEventListener("click", function (event) {
            if(isSchemeGenerated) {
            const target = event.target;
            if (target.classList.contains('colors')) {
                copyColor(null, false);
            } else if (target.classList.contains('hex')) {
                copyColor(target.textContent, true);
            }
        }
        });
    });

    // Add event listener to the reset button

    resetBtn.addEventListener("click", function () {
        // Refresh the browser
        location.reload();
    });

});
