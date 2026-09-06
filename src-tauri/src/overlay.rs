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
    #[cfg(target_os = "macos")]
    float_above_everything(&window)?;
    window.set_ignore_cursor_events(true)
}

/// Puts the overlay above every other window.
///
/// The distraction is by definition the window in front, so a pet drawn
/// behind it is indistinguishable from the overlay being broken -- and that
/// is the default: `alwaysOnTop` maps to `NSFloatingWindowLevel`, which is 3,
/// above ordinary windows but under anything that raises itself. Set the
/// level outright, above the menu bar and the Dock. `CanJoinAllSpaces` and
/// `FullScreenAuxiliary` are asked for too, so the window at least tries to
/// follow across Spaces and over a fullscreen app; neither is relied upon.
#[cfg(target_os = "macos")]
fn float_above_everything<R: Runtime>(window: &tauri::WebviewWindow<R>) -> tauri::Result<()> {
    apply_window_flags(window, "ready")?;
    // tao applies `alwaysOnTop` through a block on the main dispatch queue;
    // anything already queued when this runs would land after the call above
    // and put the level back. Queue once more behind whatever is there.
    let queued = window.clone();
    window.run_on_main_thread(move || {
        let _ = apply_window_flags(&queued, "queued");
    })
}

#[cfg(target_os = "macos")]
fn apply_window_flags<R: Runtime>(
    window: &tauri::WebviewWindow<R>,
    stage: &str,
) -> tauri::Result<()> {
    use objc2_app_kit::{NSScreenSaverWindowLevel, NSWindow, NSWindowCollectionBehavior};

    let handle = window.ns_window()?;
    // Safety: `ns_window` hands back this window's live NSWindow, and the
    // borrow does not outlive the call.
    let ns_window = unsafe { &*(handle as *const NSWindow) };
    ns_window.setCollectionBehavior(
        NSWindowCollectionBehavior::CanJoinAllSpaces
            | NSWindowCollectionBehavior::FullScreenAuxiliary,
    );
    ns_window.setLevel(NSScreenSaverWindowLevel);

    #[cfg(debug_assertions)]
    println!(
        "overlay ({stage}): level {}, collectionBehavior {:?}",
        ns_window.level(),
        ns_window.collectionBehavior(),
    );
    #[cfg(not(debug_assertions))]
    let _ = stage;
    Ok(())
}
