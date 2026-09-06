#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    let app = tauri_graphql_app::composition::compose(tauri::Builder::default())
        .build(tauri::generate_context!())
        .expect("the Tauri application failed to build");
    app.run(|app, event| {
        if let tauri::RunEvent::Ready = event {
            tauri_graphql_app::overlay::configure(app)
                .expect("the overlay window failed to configure");
        }
    });
}
