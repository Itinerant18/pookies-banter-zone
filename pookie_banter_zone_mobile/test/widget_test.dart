import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pookie_banter_zone_mobile/app.dart';

void main() {
  testWidgets('App builds smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
