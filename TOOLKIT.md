Flutter Beginner's Toolkit - Moringa AI Capstone
Student: Kelvin404535

================================================================================
1. OVERVIEW OF CHOSEN TECHNOLOGY
================================================================================

Technology: Flutter

Description:
Flutter is Google's open-source framework for building apps that run on Android, iOS, Web, Windows, Mac, and Linux - all from one codebase.

Why I chose Flutter:
It is beginner-friendly and very popular in the industry. Companies like Google Pay, BMW, and many startups use Flutter.

Where it is used:
- Mobile apps (Android and iOS)
- Web applications
- Desktop software

================================================================================
2. FEATURES
================================================================================

- Single codebase runs on Windows, macOS, Linux, Android, iOS, and Web
- Hot reload for instant updates
- Simple centered text UI
- Minimal setup required

================================================================================
3. SYSTEM REQUIREMENTS
================================================================================

Before you start, make sure your computer meets these requirements:

Operating System: Windows 10 or 11 (64-bit)
RAM: 4GB minimum (8GB recommended for smooth performance)
Storage Space: At least 2.5GB of free space
Editor: VS Code (free) or Android Studio
Internet Connection: Required for downloading Flutter and packages
Other: Git for Windows (optional, but helpful)

That's it. Nothing fancy needed. A normal laptop works fine.

================================================================================
4. SETUP INSTRUCTIONS
================================================================================

Step 1: Download Flutter
Go to flutter.dev/docs/get-started/install/windows
Click the Windows download button
Save the ZIP file

Step 2: Extract the files
Extract the ZIP folder to C:\flutter
Make sure you see C:\flutter\bin\flutter.bat

Step 3: Add to PATH
Open Windows search and type "Environment Variables"
Click "Edit the system environment variables"
Click "Environment Variables"
Under System variables, find "Path" and click Edit
Click New and add: C:\flutter\bin
Click OK on all windows
Restart your computer

Step 4: Verify installation
Open Command Prompt and type:
flutter --version

You should see Flutter and Dart version numbers.

Step 5: Create your first app
flutter create hello_flutter
cd hello_flutter
flutter run

================================================================================
5. MINIMAL WORKING EXAMPLE
================================================================================

What this example does:
It creates a simple mobile/desktop app with a blue app bar and centered text that says "Hello, Flutter!".

The code (save as lib/main.dart):

import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hello Flutter',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Flutter App'),
        ),
        body: Center(
          child: Text(
            'Hello, Flutter!',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}

How to run:
1. Save the file
2. In the terminal where "flutter run" is running, press the letter "r" (for hot reload)
3. The app updates instantly

Expected output:
A window appears showing:
- A blue bar at the top saying "Flutter App"
- Large text in the middle saying "Hello, Flutter!"

================================================================================
6. AI PROMPTS AND LEARNING REFLECTIONS
================================================================================

Prompt 1:
What I asked: "Give me step-by-step instructions to install Flutter on Windows"
How the AI helped: Provided the download link, extraction steps, and PATH setup instructions
My reflection: This saved me about an hour of searching through different websites

Prompt 2:
What I asked: "How do I display text in the center of a Flutter app?"
How the AI helped: Showed me to use Center() widget wrapping the Text() widget
My reflection: The answer was simple and worked immediately

Prompt 3:
What I asked: "Flutter not recognized as command - how to fix?"
How the AI helped: Walked me through checking if Flutter was actually installed in the right place
My reflection: The AI diagnosed that I had extracted Flutter to Downloads instead of C:\flutter

Prompt 4:
What I asked: "LNK1168 cannot open exe for writing error"
How the AI helped: Explained that another Flutter app was already running
My reflection: I had left a terminal window open from before. Closing it fixed the problem

Overall reflection on using AI for learning:
Using AI speeded up my learning a lot. Instead of getting stuck on small errors for hours, I asked AI and got answers in seconds. The key was being specific about my problem and my operating system. I learned Flutter faster than if I had just read documentation alone.

================================================================================
7. COMMON ERRORS AND HOW TO FIX THEM
================================================================================

Error 1: 'flutter' is not recognized as a command
Cause: Flutter is not installed correctly or not in PATH
Fix: Extract Flutter to C:\flutter and add C:\flutter\bin to System PATH, then restart your computer

Error 2: LNK1168 - cannot open .exe for writing
Cause: Another Flutter app is already running in the background
Fix: Close all Command Prompt windows and any Flutter app windows, then run "flutter clean" and "flutter run" again

Error 3: Access denied when moving files
Cause: Windows permissions
Fix: Open Command Prompt as Administrator (right-click and select Run as Administrator)

Error 4: Out of disk space during git commit
Cause: Hard drive is full
Fix: Run Disk Cleanup, empty Recycle Bin, and delete temporary files

================================================================================
8. REFERENCE RESOURCES
================================================================================

Official Documentation:
- Flutter website: https://flutter.dev
- Flutter install guide: https://docs.flutter.dev/get-started/install
- Flutter widget catalog: https://docs.flutter.dev/ui/widgets

Video Tutorials:
- Flutter for Beginners by freeCodeCamp on YouTube
- Flutter Crash Course by The Net Ninja on YouTube

Community Help:
- Stack Overflow (search "flutter" tag)
- Flutter Discord server
- r/FlutterDev on Reddit

================================================================================
9. LINK TO WORKING CODEBASE
================================================================================

GitHub Repository: https://github.com/Kelvin404535/Hello-Flutter

The repository contains:
- lib/main.dart (the working Flutter code)
- pubspec.yaml (dependencies)
- README.md (how to run the project)
- screenshot.png (proof the app runs)

================================================================================
10. LICENSE
================================================================================

MIT License - free to use, modify, and share.

Built with Flutter and AI-assisted learning at Moringa School

================================================================================
END OF TOOLKIT DOCUMENT
================================================================================
