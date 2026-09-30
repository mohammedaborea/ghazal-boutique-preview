document.documentElement.classList.add('reveal-ready');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* =========================
   MOBILE NAVIGATION
   ========================= */

const closeMenu = () => {
  if (!menuButton || !mobileNav) return;

  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'فتح القائمة');

  mobileNav.classList.remove('open');
  document.body.classList.remove('menu-open');
};


const openMenu = () => {
  if (!menuButton || !mobileNav) return;

  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'إغلاق القائمة');

  mobileNav.classList.add('open');
  document.body.classList.add('menu-open');
};


if (menuButton && mobileNav) {

  menuButton.addEventListener('click', () => {

    const isOpen =
      menuButton.getAttribute('aria-expanded') === 'true';

    isOpen ? closeMenu() : openMenu();

  });


  mobileNav.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', closeMenu);

  });


  document.addEventListener('keydown', event => {

    if (
      event.key === 'Escape' &&
      mobileNav.classList.contains('open')
    ) {

      closeMenu();
      menuButton.focus();

    }

  });


  window.addEventListener('resize', () => {

    if (
      window.innerWidth > 1100 &&
      mobileNav.classList.contains('open')
    ) {

      closeMenu();

    }

  });

}


/* =========================
   HEADER ON SCROLL
   ========================= */

const updateHeader = () => {

  if (!header) return;

  header.classList.toggle(
    'scrolled',
    window.scrollY > 32
  );

};


window.addEventListener(
  'scroll',
  updateHeader,
  { passive: true }
);

updateHeader();


/* =========================
   REVEAL ANIMATIONS
   ========================= */

document
  .querySelectorAll('[data-delay]')
  .forEach(element => {

    const delay = Number.parseInt(
      element.dataset.delay,
      10
    );

    element.style.setProperty(
      '--delay',
      `${Number.isFinite(delay) ? delay : 0}ms`
    );

  });


const revealElements =
  document.querySelectorAll('.reveal');


if (
  !reducedMotion &&
  'IntersectionObserver' in window
) {

  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');

          observer.unobserve(entry.target);

        });

      },

      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px 0px'
      }

    );


  revealElements.forEach(element => {

    observer.observe(element);

  });

  window.setTimeout(() => {

    revealElements.forEach(element => {

      element.classList.add('visible');

    });

  }, 1800);

} else {

  revealElements.forEach(element => {

    element.classList.add('visible');

  });

}


/* =========================
   GALLERY FILTERS
   ========================= */

const filters =
  document.querySelectorAll(
    '.gallery-filters button'
  );

const galleryItems =
  document.querySelectorAll(
    '.gallery-item'
  );


filters.forEach(button => {

  button.addEventListener('click', () => {

    filters.forEach(item => {

      item.classList.remove('active');

      item.setAttribute(
        'aria-pressed',
        'false'
      );

    });


    button.classList.add('active');

    button.setAttribute(
      'aria-pressed',
      'true'
    );


    const filter =
      button.dataset.filter;


    galleryItems.forEach(item => {

      const shouldHide =
        filter !== 'all' &&
        item.dataset.category !== filter;


      item.classList.toggle(
        'hidden',
        shouldHide
      );


      item.setAttribute(
        'aria-hidden',
        String(shouldHide)
      );

    });

  });

});


filters.forEach(button => {

  button.setAttribute(
    'aria-pressed',

    button.classList.contains('active')
      ? 'true'
      : 'false'
  );

});


/* =========================
   GALLERY LIGHTBOX
   ========================= */

const lightbox =
  document.querySelector('.lightbox');


if (lightbox) {

  const lightboxImage =
    lightbox.querySelector('img');

  const lightboxCaption =
    lightbox.querySelector('p');

  const closeButton =
    lightbox.querySelector(
      '.lightbox-close'
    );


  const closeLightbox = () => {

    if (lightbox.open) {

      lightbox.close();

    }

  };


  galleryItems.forEach(item => {

    item.addEventListener(
      'click',
      () => {

        const image =
          item.querySelector('img');


        if (
          !image ||
          !item.dataset.src
        ) {

          return;

        }


        lightboxImage.src =
          item.dataset.src;

        lightboxImage.alt =
          image.alt || '';

        lightboxCaption.textContent =
          item.dataset.caption || '';


        if (
          typeof lightbox.showModal ===
          'function'
        ) {

          lightbox.showModal();

        }

      }
    );

  });


  closeButton?.addEventListener(
    'click',
    closeLightbox
  );


  lightbox.addEventListener(
    'click',
    event => {

      if (event.target === lightbox) {

        closeLightbox();

      }

    }
  );


  lightbox.addEventListener(
    'close',
    () => {

      lightboxImage.src = '';

      lightboxCaption.textContent = '';

    }
  );

}


/* =========================
   CURRENT YEAR
   ========================= */

const yearElement =
  document.querySelector('#year');


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================
   BOOKING FORM
   ========================= */

const bookingForm =
  document.querySelector(
    '.booking-form'
  );


if (bookingForm) {

  const bookingStatus =
    bookingForm.querySelector(
      '.form-status'
    );


  const submitButton =
    bookingForm.querySelector(
      '.booking-submit'
    );


  const submitButtonText =
    submitButton?.querySelector('span');


  const setStatus = (
    message = '',
    type = ''
  ) => {

    if (!bookingStatus) return;


    bookingStatus.className =
      'form-status';


    bookingStatus.textContent =
      message;


    if (type) {

      bookingStatus.classList.add(type);

    }

  };


  const setSubmitting =
    isSubmitting => {

      if (!submitButton) return;


      submitButton.disabled =
        isSubmitting;


      if (submitButtonText) {

        submitButtonText.textContent =
          isSubmitting
            ? 'جار إرسال الطلب...'
            : 'إرسال طلب الحجز';

      }

    };


  bookingForm.addEventListener(
    'submit',
    event => {

      event.preventDefault();

      setStatus();


      if (
        !bookingForm.checkValidity()
      ) {

        setStatus(
          'أكملي الحقول المطلوبة ووافقي على التواصل.',
          'error'
        );


        bookingForm.reportValidity();

        return;

      }


      setSubmitting(true);


      /*
       * نموذج الحجز حاليًا Frontend فقط.
       *
       * عندما يتم تجهيز الـ Backend،
       * يمكن استبدال setTimeout بطلب fetch
       * إلى الـ endpoint الموجود في:
       *
       * data-api-endpoint="/api/bookings"
       */


      window.setTimeout(() => {

        setStatus(
          'شكرا لك. سنتواصل معك لتأكيد الموعد.',
          'success'
        );


        setSubmitting(false);

      }, 700);

    }
  );


  bookingForm.addEventListener(
    'input',
    () => {

      if (
        bookingStatus
          ?.classList
          .contains('error') &&

        bookingForm.checkValidity()
      ) {

        setStatus();

      }

    }
  );

}
