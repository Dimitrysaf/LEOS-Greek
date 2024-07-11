const locationHref = window.location.href.split('/');
document.write(
  "<base href='/" + locationHref[3] + '/' + locationHref[4] + "/'/>",
);
