function generatePrice(albumName, isCollectorsEdition = false) {
    // Generate a semi-random price based on the album name
    const basePrice = 20;
    const hash = albumName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variation = (hash % 30) + (isCollectorsEdition ? 50 : 0); // Up to 30€ variation, +50€ for collector's
    return (basePrice + variation).toFixed(2);
}

// Update the album card template to include price and add to cart button
function createAlbumCard(album, details) {
    const price = generatePrice(album.name, details?.format?.toLowerCase().includes('collector'));
    return `
        <div class="album">
            <div class="price-tag">${details.format || 'Album'}</div>
            <div class="album-img">
                <img src="${getAlbumImage(album)}" 
                     alt="${album.name}"
                     onerror="this.src='https://via.placeholder.com/500x500.png?text=No+Cover+Available'"/>
            </div>
            <div class="album-content">
                <h3 class="album-title">${album.name}</h3>
                <p class="album-artist">${album.artist.name || album.artist}</p>
                <div class="album-details">
                    <p>${details.year} • ${details.country}</p>
                    <p>Label: ${details.label}</p>
                    <p class="catalog-number">${details.catalog_number}</p>
                    <p class="recording-type ${details.recordingType.type}">
                        ${details.recordingType.label}
                    </p>
                </div>
                <div class="album-actions">
                    <span class="album-price">€${price}</span>
                    <button class="add-to-cart" onclick="addToCart('${album.name}', ${price})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add to cart functionality
function addToCart(albumName, price) {
    // You can implement actual cart functionality here
    console.log(`Added ${albumName} to cart - €${price}`);
    // Show a nice notification
    alert(`Added ${albumName} to your cart!`);
}

export { createAlbumCard, generatePrice };
