document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const notesContainer = document.getElementById('notes-container');
    const btnText = refreshBtn.querySelector('.btn-text');
    const spinner = refreshBtn.querySelector('.spinner');

    // Parse dates to a more readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        try {
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (e) {
            return dateString;
        }
    };

    // Strip HTML to get plain text for tweet
    const stripHtml = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const fetchNotes = async () => {
        // UI updates for loading
        refreshBtn.disabled = true;
        btnText.textContent = 'Refreshing...';
        spinner.classList.remove('hidden');

        try {
            const response = await fetch('/api/notes');
            if (!response.ok) throw new Error('Failed to fetch notes');
            
            const data = await response.json();
            renderNotes(data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            notesContainer.innerHTML = `
                <div class="note-card" style="text-align: center; border-color: #ef4444;">
                    <p style="color: #ef4444;">Failed to load release notes. Please try again later.</p>
                </div>
            `;
        } finally {
            // Restore UI state
            refreshBtn.disabled = false;
            btnText.textContent = 'Refresh';
            spinner.classList.add('hidden');
        }
    };

    const renderNotes = (notes) => {
        notesContainer.innerHTML = '';
        
        if (!notes || notes.length === 0) {
            notesContainer.innerHTML = `
                <div class="note-card" style="text-align: center;">
                    <p>No release notes found.</p>
                </div>
            `;
            return;
        }

        notes.forEach((note, index) => {
            const dateStr = formatDate(note.date);
            
            // Extract a short snippet for the tweet (first 100 chars of content or title)
            const plainTextContent = stripHtml(note.content).trim();
            const snippet = plainTextContent.length > 100 
                ? plainTextContent.substring(0, 100) + '...' 
                : plainTextContent;
            
            // Construct tweet text
            const tweetText = encodeURIComponent(`BigQuery Update (${dateStr}):\n\n${snippet}\n\nRead more: ${note.link}`);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

            const card = document.createElement('article');
            card.className = 'note-card';
            // Stagger animations
            card.style.animationDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="note-header">
                    <div>
                        <h2 class="note-title">${note.title}</h2>
                        <div class="note-date">${dateStr}</div>
                    </div>
                    <a href="${tweetUrl}" target="_blank" rel="noopener noreferrer" class="tweet-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Tweet
                    </a>
                </div>
                <div class="note-content">
                    ${note.content}
                </div>
            `;
            
            notesContainer.appendChild(card);
        });
    };

    // Initial fetch
    fetchNotes();

    // Setup event listener
    refreshBtn.addEventListener('click', fetchNotes);
});
