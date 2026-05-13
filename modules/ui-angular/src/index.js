const locationHref = window.location.href.split('/');
const base = document.createElement('base');
base.href = '/' + encodeURIComponent(locationHref[3]) + '/' + encodeURIComponent(locationHref[4]) + '/';
document.head.appendChild(base);
