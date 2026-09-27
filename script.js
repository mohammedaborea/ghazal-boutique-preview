const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'فتح القائمة');
  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) return closeMenu();
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'إغلاق القائمة');
  mobileNav.classList.add('open');
  document.body.classList.add('menu-open');
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 32);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

document.querySelectorAll('[data-delay]').forEach(el => {
  el.style.setProperty('--delay', `${el.dataset.delay}ms`);
});

if (!reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

const filters = document.querySelectorAll('.gallery-filters button');
const galleryItems = document.querySelectorAll('.gallery-item');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  galleryItems.forEach(item => {
    item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
  });
}));

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
galleryItems.forEach(item => item.addEventListener('click', () => {
  lightboxImage.src = item.dataset.src;
  lightboxImage.alt = item.querySelector('img').alt;
  lightboxCaption.textContent = item.dataset.caption;
  lightbox.showModal();
}));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector('#year').textContent = new Date().getFullYear();

const bookingForm = document.querySelector('.booking-form');
const bookingStatus = bookingForm.querySelector('.form-status');
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  bookingStatus.className = 'form-status';
  if (!bookingForm.checkValidity()) {
    bookingStatus.textContent = 'يرجى إكمال الحقول المطلوبة والموافقة على التواصل.';
    bookingStatus.classList.add('error');
    bookingForm.reportValidity();
    return;
  }
  const submitButton = bookingForm.querySelector('.booking-submit');
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'جاري تجهيز الطلب...';
  window.setTimeout(() => {
    bookingStatus.textContent = 'تم تجهيز الطلب بنجاح. عند ربط الباكند سيصل مباشرة إلى لوحة إدارة الحجوزات.';
    bookingStatus.classList.add('success');
    submitButton.disabled = false;
    submitButton.querySelector('span').textContent = 'إرسال طلب الحجز';
  }, 700);
});
