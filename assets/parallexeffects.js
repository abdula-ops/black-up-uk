(() => {
  const button = document.querySelector('.hero__button');
  const heroPics = document.querySelectorAll('#shopify-section-template--17998465892519__image_with_text_iWUUY3 picture.hero__pic img');
  const heroPics1 = document.querySelectorAll('.wt-multicol__text .hero__pic img');
  const heroPicsBeaut = document.querySelectorAll('#shopify-section-template--17998465892519__image_with_text_eTjVPF picture.hero__pic img');

  // Détecter si on est sur la page black-week
  const isBlackWeekPage = () => {
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/pages/black-week') || 
           pathname.includes('/black-week') ||
           (pathname.includes('/pages/') && pathname.includes('black-week'));
  };

  let currentScroll = 0;
  let targetScroll = 0;

  let heroStart = 0;
  if (heroPics.length > 0) {
    heroStart = heroPics[0].getBoundingClientRect().top + window.scrollY;
  } 

  console.log(heroStart);
  
  function animateOnScroll() {
    targetScroll = window.scrollY;
    currentScroll += (targetScroll - currentScroll) * 0.1;

    // Button parallax (scrolls upward slightly) - désactivé sur la page black-week
    if (button && !isBlackWeekPage()) {
      button.style.transform = `translateY(${currentScroll * -0.2}px)`;
    } else if (button && isBlackWeekPage()) {
      // Réinitialiser la transformation sur la page black-week pour garder le bouton statique
      button.style.transform = 'translateY(0px)';
    }



    // Hero image parallax + zoom out
    heroPics.forEach((img) => {
      const scrollOffset = Math.max(0, currentScroll - 4668);
      const scale = 1 + scrollOffset * 0.0004; // starts at 1, zooms out
      img.style.transform = `scale(${scale})`;
    });

     heroPics1.forEach((img) => {
      const translateY = currentScroll * 0;
      const scale = 0.8 + currentScroll * 0.0002;
      img.style.transform = `translateY(${translateY}px) scale(${scale})`;
    });

    heroPicsBeaut.forEach((img) => {
      const translateY = currentScroll * 0;
      const scale = 0.8 + currentScroll * 0.0001;
      img.style.transform = `translateY(${translateY}px) scale(${scale})`;
    });

    requestAnimationFrame(animateOnScroll);
  }

  animateOnScroll();
})();



document.addEventListener("DOMContentLoaded", function () {
  const heading = document.querySelector('h2.hero__subheading.hero');
  const targetText = "chaque nuance";

  if (heading && heading.textContent.includes(targetText)) {
    heading.innerHTML = heading.innerHTML.replace(
      targetText,
      `<span class="highlight-text">${targetText}</span> <br>`
    );
  }
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 780) {
    const heroText = document.querySelector('#shopify-section-template--17998465892519__image_with_text_eTjVPF .hero__text');
    
    const heroTextElement = document.querySelector('#shopify-section-template--17998465892519__image_with_text_eTjVPF .hero__text p:first-child');
    const heroTextHeight =  heroTextElement.offsetHeight;
    console.log(heroTextHeight)
                    
    const maxHeight = heroTextHeight;
    const needMoreBtn = document.createElement('span');
    const isFrench = document.documentElement.lang === "fr";
  
    if (heroText && heroText.scrollHeight > maxHeight) {
      needMoreBtn.textContent = isFrench ? 'En savoir plus' : 'Need More';
      needMoreBtn.classList.add('need-more-btn'); 
  
      heroText.style.maxHeight = `${maxHeight}px`;
      heroText.style.overflow = 'hidden';
      heroText.after(needMoreBtn);
  
      needMoreBtn.addEventListener('click', function () {
        const isCollapsed = heroText.style.maxHeight === `${maxHeight}px`;
        heroText.style.maxHeight = isCollapsed ? 'none' : `${maxHeight}px`;
        needMoreBtn.textContent = isCollapsed
          ? (isFrench ? 'Lire moins' : 'Read Less')
          : (isFrench ? 'En savoir plus' : 'Need More');
      });
    }
  }
});



