class ImageRenderer {
    constructor(container, imageName) {
        // 2D Canvas context for image drawing
        const ctx = container.getContext("2d", { alpha: false });;

        // Load the image to draw on the canvas
        const image = new Image();
        function renderImage() {
            // Draw the image when it's loaded
            ctx.drawImage(image, 0, 0, container.width, container.height);
            requestAnimationFrame(renderImage);
        }
        image.onload = function () {
            // Draw the image when it's loaded
            renderImage()
        };
        image.src = `./media/${imageName}.webp`;
    }
}

export { ImageRenderer };