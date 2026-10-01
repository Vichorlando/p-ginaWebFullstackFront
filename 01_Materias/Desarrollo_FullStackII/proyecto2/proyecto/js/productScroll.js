document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.products-scroll');
    if (!scrollContainer) return;
    const cards = document.querySelectorAll('.product-card');
    let isScrolling = false;

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isScrolling) {
            const offsetX = e.offsetX;
            const containerWidth = scrollContainer.clientWidth;

            if (offsetX > containerWidth * 0.75) {
                scrollContainer.scrollBy(20, 0);
            } else if (offsetX < containerWidth * 0.25) {
                scrollContainer.scrollBy(-20, 0);
            }
        }
    });

    // Touch support for mobile devices
    scrollContainer.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const offsetX = touch.clientX;
        const containerWidth = scrollContainer.clientWidth;

        if (offsetX > containerWidth * 0.75) {
            scrollContainer.scrollBy(20, 0);
        } else if (offsetX < containerWidth * 0.25) {
            scrollContainer.scrollBy(-20, 0);
        }
    });
});