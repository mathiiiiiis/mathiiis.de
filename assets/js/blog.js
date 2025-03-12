document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    if (localStorage.getItem('theme') === 'dark' || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
        document.documentElement.classList.add('dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark');
        
        // update icon
        if (document.documentElement.classList.contains('dark')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    const modal = document.getElementById('postModal');
    const closeModal = document.querySelector('.close-modal');
    
    closeModal.addEventListener('click', function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // fetch and display blog posts
    fetchBlogPosts();
});

// function to fetch blog posts metadata from JSON file
async function fetchBlogPosts() {
    try {
        const response = await fetch('/posts/meta.json');
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('posts-container').innerHTML = `
            <div class="error-message">
                <p>Failed to load blog posts. Please try again later.</p>
            </div>
        `;
    }
}

// function to display posts based on metadata
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    const featuredPostContainer = document.getElementById('featured-post');
    
    // sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // find featured post
    const featuredPost = posts.find(post => post.featured);
    
    // display featured post if exists
    if (featuredPost) {
        featuredPostContainer.innerHTML = `
            <img src="${featuredPost.image}" alt="${featuredPost.title}" class="featured-image">
            <div class="featured-content">
                <span class="featured-tag">Featured</span>
                <h3 class="featured-title">${featuredPost.title}</h3>
                <p class="post-date">${formatDate(featuredPost.date)}</p>
                <p class="featured-excerpt">${featuredPost.excerpt}</p>
                <a href="#" class="read-more" data-slug="${featuredPost.slug}">Continue Reading</a>
            </div>
        `;
        
        // make the entire featured post clickable
        featuredPostContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('read-more')) {
                e.preventDefault();
            }
            openPost(featuredPost.slug);
        });
    }
    
    // display regular posts (not featured one)
    let regularPosts = posts.filter(post => post !== featuredPost);
    
    if (regularPosts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available at the moment.</p>';
        return;
    }
    
    postsContainer.innerHTML = regularPosts.map(post => `
        <article class="post-card" data-slug="${post.slug}">
            <img src="${post.image}" alt="${post.title}" class="post-image">
            <div class="post-content">
                <p class="post-date">${formatDate(post.date)}</p>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        </article>
    `).join('');
    
    // add click events to all post cards
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', function() {
            openPost(this.dataset.slug);
        });
    });
}

// function to open a post in the modal
async function openPost(slug) {
    try {
        // fetch the markdown content
        const response = await fetch(`/posts/${slug}.md`);
        if (!response.ok) {
            throw new Error('Failed to fetch post content');
        }
        
        const markdownContent = await response.text();
        
        // fetch metadata to get title and date
        const metaResponse = await fetch('/posts/meta.json');
        if (!metaResponse.ok) {
            throw new Error('Failed to fetch post metadata');
        }
        
        const posts = await metaResponse.json();
        const postData = posts.find(post => post.slug === slug);
        
        if (!postData) {
            throw new Error('Post not found');
        }
        
        // Convert markdown to html and display in modal
        document.getElementById('modalTitle').textContent = postData.title;
        document.getElementById('modalDate').textContent = formatDate(postData.date);
        document.getElementById('modalContent').innerHTML = marked.parse(markdownContent);
        
        const modal = document.getElementById('postModal');
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
    } catch (error) {
        console.error('Error opening post:', error);
        alert('Failed to load the post. Please try again later.');
    }
}

// helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}