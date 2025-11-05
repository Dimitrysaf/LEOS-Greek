self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/html')) {
          return response.text().then((body) => {
            if ((body.indexOf('<meta name="Keywords" content="EU Login, ECAS, Authentication, Security" />') >= 0 &&
                body.indexOf('<meta name="Description" content="EU Login" />') >= 0) ||
              body.indexOf('<meta name="Description" content="European Commission Authentication Service" />') >= 0 ||
              body.indexOf('<title>Mock Login Form</title>') >= 0 ||
              body.indexOf('<title>Redirecting To ECAS</title>') >= 0) {
              self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                  client.postMessage({ type: 'ECAS_SESSION_EXPIRED' });
                });
              });
            }
            return new Response(body, response);
          });
        }
        return response;
      })
  );
});
