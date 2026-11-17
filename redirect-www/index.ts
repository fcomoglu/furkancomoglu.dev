// www.furkancomoglu.dev/<path>?<query>  ->  301  https://furkancomoglu.dev/<path>?<query>
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "furkancomoglu.dev";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  },
};
