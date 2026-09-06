//! The overlay window: stretched over the primary monitor, above every other
//! window, and transparent to the cursor so clicks reach whatever is beneath.

use tauri::{Manager, PhysicalPosition, Runtime};

pub const OVERLAY_WINDOW: &str = "main";

/// Must run once the window exists: Tauri creates config windows inside
/// `run()`, not `build()`, so call this from the `RunEvent::Ready` callback.
pub fn configure<R: Runtime>(app: &impl Manager<R>) -> tauri::Result<()> {
    let Some(window) = app.get_webview_window(OVERLAY_WINDOW) else {
        return Ok(());
    };
    if let Some(monitor) = window.primary_monitor()? {
        window.set_position(PhysicalPosition::new(0, 0))?;
        window.set_size(*monitor.size())?;
    }
    window.set_ignore_cursor_events(true)
}
