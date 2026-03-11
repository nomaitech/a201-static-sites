// ========================================
// PHILOSOFRIENDS* - Global Philosophy Network
// Application Logic
// ========================================

// Sample Data - Replace with API calls or static JSON
const nodesData = [
    {
        id: 'london',
        name: 'London',
        country: 'UK',
        flag: '🇬🇧',
        format: 'Socratic Dialogue',
        schedule: 'Every 2nd Thursday',
        members: 24,
        link: 'https://lu.ma/philosofriends-london',
        organizer: '@philosophylondon'
    },
    {
        id: 'berlin',
        name: 'Berlin',
        country: 'Germany',
        flag: '🇩🇪',
        format: 'Philosophy Walks',
        schedule: 'Sundays, bi-weekly',
        members: 18,
        link: 'https://lu.ma/philosofriends-berlin',
        organizer: '@berlinphilos'
    },
    {
        id: 'nyc',
        name: 'New York',
        country: 'USA',
        flag: '🇺🇸',
        format: 'Book Discussions',
        schedule: 'Monthly, 1st Saturday',
        members: 31,
        link: 'https://lu.ma/philosofriends-nyc',
        organizer: '@nycphilosophy'
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        flag: '🇯🇵',
        format: 'Ethics Debates',
        schedule: 'Fridays, weekly',
        members: 15,
        link: 'https://lu.ma/philosofriends-tokyo',
        organizer: '@tokyothinkers'
    },
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        flag: '🇫🇷',
        format: 'Café Philosophy',
        schedule: 'Wednesdays, weekly',
        members: 27,
        link: 'https://lu.ma/philosofriends-paris',
        organizer: '@philoparis'
    },
    {
        id: 'sydney',
        name: 'Sydney',
        country: 'Australia',
        flag: '🇦🇺',
        format: 'Open Discussion',
        schedule: 'Every 3rd Sunday',
        members: 12,
        link: 'https://lu.ma/philosofriends-sydney',
        organizer: '@sydneyphilos'
    }
];

const peopleData = [
    { name: 'Marcus Chen', node: 'london', interests: 'Stoicism, Ethics, Existentialism', twitter: 'marcusphilo', website: '' },
    { name: 'Elena Vogt', node: 'berlin', interests: 'Phenomenology, Heidegger, Continental', twitter: 'elenavogt', website: '' },
    { name: 'James Wright', node: 'nyc', interests: 'Political Philosophy, Rawls, Justice', twitter: '', website: 'jameswright.com' },
    { name: 'Yuki Tanaka', node: 'tokyo', interests: 'Zen Buddhism, Aesthetics, Nishida', twitter: 'yukitanaka', website: '' },
    { name: 'Sophie Martin', node: 'paris', interests: 'Existentialism, Sartre, de Beauvoir', twitter: 'sophiemartin', website: '' },
    { name: 'Alex Thompson', node: 'sydney', interests: 'Philosophy of Mind, Consciousness', twitter: 'alexthompson', website: '' },
    { name: 'Priya Sharma', node: 'london', interests: 'Eastern Philosophy, Epistemology', twitter: 'priyasharma', website: '' },
    { name: 'Felix Müller', node: 'berlin', interests: 'Wittgenstein, Language, Logic', twitter: '', website: 'felixmuller.de' },
    { name: 'Maria Santos', node: 'nyc', interests: 'Feminist Philosophy, Ethics of Care', twitter: 'mariasantos', website: '' },
    { name: 'Kenji Ito', node: 'tokyo', interests: 'Bioethics, Technology Ethics', twitter: 'kenjiito', website: '' },
    { name: 'Claire Dubois', node: 'paris', interests: 'Absurdism, Camus, Nihilism', twitter: 'clairedubois', website: '' },
    { name: 'Oliver Brown', node: 'sydney', interests: 'Metaphysics, Free Will, Determinism', twitter: 'oliverbrown', website: '' }
];

const photosData = [
    { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', caption: 'London Meetup - Ethics Discussion', node: 'london' },
    { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', caption: 'Berlin Philosophy Walk', node: 'berlin' },
    { src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400', caption: 'NYC Book Club Session', node: 'nyc' },
    { src: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400', caption: 'Paris Café Philosophy', node: 'paris' },
    { src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400', caption: 'Tokyo Discussion Group', node: 'tokyo' },
    { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', caption: 'Sydney Open Forum', node: 'sydney' }
];

// ========================================
// Three.js Platonic Solids Background
// Sacred geometry beloved by Greek philosophers
// ========================================
function initGlobe() {
    const canvas = document.getElementById('globe');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const solids = [];
    const goldColor = 0xC9A227;
    const lightGold = 0xE8D48B;

    // Dodecahedron - Plato's universe
    const dodecahedron = new THREE.Mesh(
        new THREE.DodecahedronGeometry(3, 0),
        new THREE.MeshBasicMaterial({
            color: goldColor,
            wireframe: true,
            transparent: true,
            opacity: 0.12
        })
    );
    dodecahedron.position.set(-4, 2, -5);
    scene.add(dodecahedron);
    solids.push({ mesh: dodecahedron, speedX: 0.001, speedY: 0.0015, speedZ: 0.0005 });

    // Icosahedron - Water element
    const icosahedron = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.5, 0),
        new THREE.MeshBasicMaterial({
            color: lightGold,
            wireframe: true,
            transparent: true,
            opacity: 0.08
        })
    );
    icosahedron.position.set(5, -1, -8);
    scene.add(icosahedron);
    solids.push({ mesh: icosahedron, speedX: 0.0008, speedY: 0.001, speedZ: 0.0012 });

    // Octahedron - Air element
    const octahedron = new THREE.Mesh(
        new THREE.OctahedronGeometry(2, 0),
        new THREE.MeshBasicMaterial({
            color: goldColor,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        })
    );
    octahedron.position.set(3, 4, -6);
    scene.add(octahedron);
    solids.push({ mesh: octahedron, speedX: 0.0012, speedY: 0.0008, speedZ: 0.001 });

    // Tetrahedron - Fire element
    const tetrahedron = new THREE.Mesh(
        new THREE.TetrahedronGeometry(1.8, 0),
        new THREE.MeshBasicMaterial({
            color: lightGold,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        })
    );
    tetrahedron.position.set(-5, -3, -4);
    scene.add(tetrahedron);
    solids.push({ mesh: tetrahedron, speedX: 0.0015, speedY: 0.001, speedZ: 0.0008 });

    // Large background dodecahedron
    const bgDodeca = new THREE.Mesh(
        new THREE.DodecahedronGeometry(8, 0),
        new THREE.MeshBasicMaterial({
            color: goldColor,
            wireframe: true,
            transparent: true,
            opacity: 0.03
        })
    );
    bgDodeca.position.set(0, 0, -15);
    scene.add(bgDodeca);
    solids.push({ mesh: bgDodeca, speedX: 0.0003, speedY: 0.0004, speedZ: 0.0002 });

    // Scattered star points - constellation effect
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 120;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
        color: lightGold,
        size: 0.03,
        transparent: true,
        opacity: 0.4
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 10;

    // Animation - slow, contemplative movement
    function animate() {
        requestAnimationFrame(animate);

        solids.forEach(solid => {
            solid.mesh.rotation.x += solid.speedX;
            solid.mesh.rotation.y += solid.speedY;
            solid.mesh.rotation.z += solid.speedZ;
        });

        stars.rotation.y += 0.0001;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================================
// Render Functions
// ========================================
function renderNodes() {
    const grid = document.getElementById('nodes-grid');
    grid.innerHTML = nodesData.map(node => `
        <div class="node-card" data-node="${node.id}" onclick="window.open('${node.link}', '_blank')">
            <div class="node-header">
                <span class="node-name">${node.name}</span>
                <span class="node-flag">${node.flag}</span>
            </div>
            <div class="node-meta">${node.format} · ${node.schedule}</div>
            <div class="node-attendance">
                <span class="attendance-dot"></span>
                <span>${node.members} members</span>
            </div>
        </div>
    `).join('');
}

function renderPeople(filter = '', search = '') {
    const table = document.getElementById('people-table');
    let filtered = peopleData;

    if (filter) {
        filtered = filtered.filter(p => p.node === filter);
    }

    if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.interests.toLowerCase().includes(searchLower)
        );
    }

    table.innerHTML = filtered.map(person => {
        const node = nodesData.find(n => n.id === person.node);
        const social = person.twitter
            ? `<a href="https://x.com/${person.twitter}" target="_blank">@${person.twitter}</a>`
            : person.website
                ? `<a href="https://${person.website}" target="_blank">${person.website}</a>`
                : '';

        return `
            <div class="person-row">
                <div class="person-info">
                    <span class="person-name">${person.name}</span>
                    <span class="person-interests">${person.interests}</span>
                </div>
                <span class="person-node">${node ? node.name : person.node}</span>
                <span class="person-social">${social}</span>
            </div>
        `;
    }).join('');

    if (filtered.length === 0) {
        table.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">No thinkers found.</p>';
    }
}

function renderPhotos() {
    const grid = document.getElementById('photo-grid');
    grid.innerHTML = photosData.map((photo, index) => `
        <div class="photo-item" onclick="openLightbox(${index})">
            <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
        </div>
    `).join('');
}

function populateNodeFilter() {
    const select = document.getElementById('node-filter');
    nodesData.forEach(node => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = `${node.flag} ${node.name}`;
        select.appendChild(option);
    });
}

// ========================================
// Lightbox
// ========================================
function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    img.src = photosData[index].src.replace('w=400', 'w=1200');
    caption.textContent = photosData[index].caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ========================================
// Tooltip
// ========================================
function showTooltip(e, content) {
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = content;
    tooltip.classList.add('visible');

    const rect = e.target.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
    let top = rect.top - tooltip.offsetHeight - 10;

    // Boundary detection
    if (left < 10) left = 10;
    if (left + tooltip.offsetWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltip.offsetWidth - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

// ========================================
// Event Listeners
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize globe
    if (typeof THREE !== 'undefined') {
        initGlobe();
    }

    // Render content
    renderNodes();
    renderPeople();
    renderPhotos();
    populateNodeFilter();

    // Filter events
    document.getElementById('node-filter').addEventListener('change', (e) => {
        const search = document.getElementById('search').value;
        renderPeople(e.target.value, search);
    });

    document.getElementById('search').addEventListener('input', (e) => {
        const filter = document.getElementById('node-filter').value;
        renderPeople(filter, e.target.value);
    });

    // Lightbox events
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});

// ========================================
// Utility Functions
// ========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { nodesData, peopleData, photosData };
}
