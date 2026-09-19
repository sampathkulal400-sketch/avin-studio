/**
 * AVIN Studio — Editorial Photography Portfolio JavaScript
 * Full Mobile & Laptop/Desktop Device Compatibility
 * Fast, Touch-Friendly, Lightweight, Zero AI Gimmicks
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- 1. Subtle Viewport Reveal (90% Design, 10% Motion) ---
  const fadeElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // --- 2. Fullscreen Editorial Lightbox with Touch Swiping & Keyboard Controls ---
  const galleryItems = document.querySelectorAll('.lightbox-trigger');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const activeGalleryArray = Array.from(galleryItems);

  function openLightbox(index) {
    if (!activeGalleryArray[index]) return;
    currentGalleryIndex = index;
    const item = activeGalleryArray[index];
    const imgEl = item.querySelector('img') || item;
    const title = item.dataset.title || 'AVIN Studio Capture';
    const category = item.dataset.categoryLabel || 'Photography Portfolio';

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;

    if (lightboxModal) {
      lightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scrolling
    }
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.id === 'lightbox-modal') {
        closeLightbox();
      }
    });
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
      openLightbox(currentGalleryIndex);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryArray.length;
      openLightbox(currentGalleryIndex);
    });
  }

  // --- Keyboard navigation for Laptops & Desktops ---
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
      openLightbox(currentGalleryIndex);
    }
    if (e.key === 'ArrowRight') {
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryArray.length;
      openLightbox(currentGalleryIndex);
    }
  });

  // --- Mobile Touch Gestures (Swipe Left / Right / Down to Dismiss) ---
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleGesture();
    }, { passive: true });
  }

  function handleGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // Horizontal swipe threshold: 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Swipe Left -> Next
        currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryArray.length;
        openLightbox(currentGalleryIndex);
      } else {
        // Swipe Right -> Prev
        currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryArray.length) % activeGalleryArray.length;
        openLightbox(currentGalleryIndex);
      }
    } 
    // Vertical swipe down threshold: 75px -> Dismiss Lightbox
    else if (diffY > 75 && Math.abs(diffY) > Math.abs(diffX)) {
      closeLightbox();
    }
  }

  // --- 3. Mobile Navigation Drawer Toggle & Auto-Close on Click ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenuDrawer.classList.toggle('hidden');
    });

    // Close mobile drawer when link is tapped
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('hidden');
      });
    });

    // Close mobile drawer if clicked outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuDrawer.classList.add('hidden');
      }
    });
  }
});
