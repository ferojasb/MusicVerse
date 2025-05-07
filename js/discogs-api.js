const DISCOGS_TOKEN = 'skCHyCwaqbAYBuilGGKrKjVnkJVUaLNGVcEmeOKk';
let lastCallTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second between calls

function detectAnalogOrDigital(notes) {
    const lowerNotes = (notes || '').toLowerCase();
    if (lowerNotes.includes('analog') || lowerNotes.includes('analogue')) {
        return { type: 'analog', label: 'Analog Recording 🎛️' };
    } else if (lowerNotes.includes('digital') || lowerNotes.includes('remastered')) {
        return { type: 'digital', label: 'Digital Recording 💻' };
    } else {
        return { type: 'unknown', label: 'Recording Type Unknown ❔' };
    }
}

/**
 * Fetch album details from Discogs API
 * @param {string} albumName - The name of the album to search for
 * @returns {Promise<Object|null>} Album details or null if not found
 */
async function fetchAlbumDetailsFromDiscogs(albumName) {
    try {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastCall = now - lastCallTime;
        if (timeSinceLastCall < RATE_LIMIT_DELAY) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastCall));
        }
        lastCallTime = Date.now();

        // First, search for the release
        const searchUrl = `https://api.discogs.com/database/search?q=${encodeURIComponent(albumName)}&type=release&token=${DISCOGS_TOKEN}`;
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
                'User-Agent': 'MusicVerse/1.0.0'
            }
        });

        if (!searchResponse.ok) {
            throw new Error(`Discogs search error: ${searchResponse.status}`);
        }

        const searchData = await searchResponse.json();
        const firstResult = searchData.results[0];

        if (!firstResult) {
            console.warn('No Discogs results for', albumName);
            return null;
        }

        // Add delay before second request
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

        // Then, fetch detailed release information
        const releaseUrl = `https://api.discogs.com/releases/${firstResult.id}`;
        const releaseResponse = await fetch(releaseUrl, {
            headers: {
                'Authorization': `Discogs token=${DISCOGS_TOKEN}`,
                'User-Agent': 'MusicVerse/1.0.0'
            }
        });

        if (!releaseResponse.ok) {
            throw new Error(`Discogs release error: ${releaseResponse.status}`);
        }

        const releaseData = await releaseResponse.json();
        const recordingDetails = detectAnalogOrDigital(releaseData.notes);

        return {
            title: releaseData.title || 'Unknown Title',
            year: releaseData.year || 'Unknown Year',
            format: releaseData.formats?.map(f => f.name).join(', ') || 'Unknown Format',
            label: releaseData.labels?.[0]?.name || 'Unknown Label',
            catalog_number: releaseData.labels?.[0]?.catno || 'Unknown Catalog Number',
            country: releaseData.country || 'Unknown Country',
            notes: releaseData.notes || '',
            genre: releaseData.genres?.join(', ') || 'Unknown Genre',
            recordingType: recordingDetails
        };
    } catch (error) {
        console.error('Error fetching from Discogs:', error);
        return null;
    }
}

export { fetchAlbumDetailsFromDiscogs };
