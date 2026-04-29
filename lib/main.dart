// ============================================================
// Flutter Application - Hello World Example
// ============================================================

// Import the Flutter Material Design library
// This provides access to Flutter's pre-built UI components
// following Google's Material Design guidelines.
import 'package:flutter/material.dart';

// ============================================================
// Entry Point
// ============================================================
// The main() function is the starting point of every Flutter app.
// It calls runApp() to launch the application and pass the root widget.
void main() {
  runApp(MyApp());
}

// ============================================================
// Root Widget - MyApp
// ============================================================
// MyApp is a StatelessWidget, meaning it doesn't manage any state.
// It simply builds and returns the UI defined in its build method.
// This is the top-level widget that wraps the entire application.
class MyApp extends StatelessWidget {
  @override
  // The build() method describes how to display this widget.
  // It returns a MaterialApp, which provides the Material Design
  // visual layout structure for the app.
  Widget build(BuildContext context) {
    return MaterialApp(
      // title: Sets the title shown in the device's task switcher
      // (e.g., in the Android recent apps screen).
      title: 'Hello Flutter',

      // home: Defines the default route (screen) of the app.
      // Scaffold provides the basic visual material design structure.
      home: Scaffold(
        // AppBar: Creates a material design app bar at the top.
        // Typically contains the screen title and action buttons.
        appBar: AppBar(
          // title: The text displayed in the app bar.
          title: Text('Flutter App'),
        ),

        // body: The main content area of the scaffold.
        // Center widget positions its child (Text) in the middle.
        body: Center(
          child: Text(
            'Hello, Flutter!',
            // style: Defines the text appearance.
            // TextStyle allows customizing font size, color, weight, etc.
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
