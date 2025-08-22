(function() {
    console.log('Script running: Attempting to insert sample links in header');

    // Array of links to insert (edit name and href as needed)
    const linksToInsert = [
        { name: 'Upbase', href: '/test2' },
        { name: 'DBs', href: '/test3' },
        { name: 'Vik', href: '/test4' }
    ];

    // Function to insert the links
    function insertLinks() {
        // Find the group containing the Home link using stable attributes
        const homeGroup = document.querySelector('div.mantine-visible-from-sm[style*="margin-left"]');
        
        if (homeGroup) {
            // Find the Home link to insert after
            const homeLink = homeGroup.querySelector('a[href="/home"][data-discover="true"]');
            
            if (homeLink) {
                // Insert each link from the array
                linksToInsert.forEach(link => {
                    // Check if link already exists to avoid duplicates
                    if (!homeGroup.querySelector(`a[href="${link.href}"]`)) {
                        const newLink = document.createElement('a');
                        newLink.className = '_link_14bkk_10';
                        newLink.href = link.href;
                        newLink.setAttribute('data-discover', 'true');
                        newLink.textContent = link.name;
                        
                        // Insert after the Home link
                        homeLink.insertAdjacentElement('afterend', newLink);
                        console.log(`Link ${link.name} inserted successfully`);
                    } else {
                        console.log(`Link ${link.name} already exists, skipping`);
                    }
                });
            } else {
                console.log('Home link not found, appending links to group');
                // Fallback: append to the group
                linksToInsert.forEach(link => {
                    if (!homeGroup.querySelector(`a[href="${link.href}"]`)) {
                        const newLink = document.createElement('a');
                        newLink.className = '_link_14bkk_10';
                        newLink.href = link.href;
                        newLink.setAttribute('data-discover', 'true');
                        newLink.textContent = link.name;
                        homeGroup.appendChild(newLink);
                        console.log(`Link ${link.name} appended to group`);
                    }
                });
            }
        } else {
            console.log('Header group not found, retrying...');
            setTimeout(insertLinks, 1000); // Retry after 1 second
        }
    }

    // Run after DOM is loaded
    document.addEventListener('DOMContentLoaded', insertLinks);

    // Fallback: Try immediately in case DOMContentLoaded already fired
    insertLinks();
})();