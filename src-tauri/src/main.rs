#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    let builder =
        tauri::Builder::default().plugin(tauri_plugin_global_shortcut::Builder::new().build());
    let app = tauri_graphql_app::composition::compose(builder)
        .build(tauri::generate_context!())
        .expect("the Tauri application failed to build");
    app.run(|app, event| {
        if let tauri::RunEvent::Ready = event {
            tauri_graphql_app::overlay::configure(app)
                .expect("the overlay window failed to configure");
            tauri_graphql_app::lockin::install(app);
        }
    });
}
