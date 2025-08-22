(function() {
    // Debug setting: Set to true to enable logs, false to disable
    const debug = false;

    // Array of links to insert (edit name and href as needed)
    const linksToInsert = [
        { name: 'Linkedin', href: '/linkedin' },
        { name: 'Upwork', href: '/upwork' },
        { name: 'Slack', href: '/slack' },
        { name: 'Outline', href: '/outline' },
        { name: 'Upbase', href: '/upbase' },
        { name: 'DBs', href: '/dbs' },
        { name: 'Vik', href: '/vik' }
    ];

    // Flag to track if links have been inserted
    let linksInserted = false;

    // Function to insert the links
    function insertLinks() {
        if (linksInserted) {
            return; // Exit if links already inserted
        }

        // Find the group containing the Home link using stable attributes
        const homeGroup = document.querySelector('div.mantine-visible-from-sm[style*="margin-left"]');
        
        if (homeGroup) {
            // Find the Home link to insert after
            const homeLink = homeGroup.querySelector('a[href="/home"][data-discover="true"]');
            
            if (homeLink) {
                // Insert each link from the array
                linksToInsert.forEach(link => {
                    if (!homeGroup.querySelector(`a[href="${link.href}"]`)) {
                        const newLink = document.createElement('a');
                        newLink.className = '_link_14bkk_10';
                        newLink.href = link.href;
                        newLink.setAttribute('data-discover', 'true');
                        newLink.textContent = link.name;
                        homeLink.insertAdjacentElement('afterend', newLink);
                        if (debug) console.log(`Link ${link.name} inserted`);
                    } else if (debug) {
                        console.log(`Link ${link.name} already exists, skipping`);
                    }
                });
            } else {
                // Fallback: append to the group
                linksToInsert.forEach(link => {
                    if (!homeGroup.querySelector(`a[href="${link.href}"]`)) {
                        const newLink = document.createElement('a');
                        newLink.className = '_link_14bkk_10';
                        newLink.href = link.href;
                        newLink.setAttribute('data-discover', 'true');
                        newLink.textContent = link.name;
                        homeGroup.appendChild(newLink);
                        if (debug) console.log(`Link ${link.name} appended to group`);
                    } else if (debug) {
                        console.log(`Link ${link.name} already exists, skipping`);
                    }
                });
            }
            linksInserted = true; // Mark as inserted to prevent retries
            if (debug) console.log('All links inserted successfully');
        } else {
            if (debug) console.log('Header group not found, retrying...');
            setTimeout(insertLinks, 1000); // Retry after 1 second
        }
    }

    // Run after DOM is loaded
    document.addEventListener('DOMContentLoaded', insertLinks);

    // Fallback: Try immediately in case DOMContentLoaded already fired
    insertLinks();
})();