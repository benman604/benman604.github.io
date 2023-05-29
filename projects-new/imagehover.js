const links = document.querySelectorAll('#linklist');
const followingImage = document.getElementById('following-image');

// Add event listeners to each link
links.forEach(link => {
    link.addEventListener('mouseover', (event) => {
        // Get the data-image attribute value of the link
        const imageUrl = event.target.getAttribute('data-image');
        // Create a new image element and set its src attribute
        const img = new Image();
        img.src = imageUrl;
        // Add the new image to the following image div
        followingImage.appendChild(img);
        // Show the following image div
        followingImage.style.display = 'block';
    });
    link.addEventListener('mousemove', (event) => {
        // Calculate the position of the following image based on the mouse position
        const x = event.clientX + 20;
        const y = event.clientY + 20;
        // Set the position of the following image
        followingImage.style.left = x + 'px';
        followingImage.style.top = y + 'px';
    });
    link.addEventListener('mouseout', () => {
        // Remove the image from the following image div
        followingImage.removeChild(followingImage.firstChild);
        // Hide the following image div
        followingImage.style.display = 'none';
    });
});