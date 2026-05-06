import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'app.dart';
import 'firebase_options.dart'; // Add this import

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Pass the generated options here:
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}
