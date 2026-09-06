// Which window this page is running in. The overlay window loads
// `index.html?view=overlay`; every other window shows the control panel.
export type View = "overlay" | "panel";

export function currentView(search: string = window.location.search): View {
  return new URLSearchParams(search).get("view") === "overlay" ? "overlay" : "panel";
}
