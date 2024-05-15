interface Options {
  href: string;
  id: string;
}
export function appendStylesheet({ href, id }: Options) {
  const materialOutlinedLink = document.createElement("link");
  materialOutlinedLink.href = href;
  materialOutlinedLink.type = "text/css";
  materialOutlinedLink.rel = "stylesheet";
  materialOutlinedLink.id = id;
  document.getElementsByTagName("head")[0].appendChild(materialOutlinedLink);
}
