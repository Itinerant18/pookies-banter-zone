import 'package:intl/intl.dart';

class AppDateUtils {
  static String formatTime(DateTime dateTime) {
    return DateFormat.jm().format(dateTime);
  }

  static String formatMessageDate(DateTime dateTime) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final date = DateTime(dateTime.year, dateTime.month, dateTime.day);

    if (date == today) {
      return 'Today';
    } else if (date == today.subtract(const Duration(days: 1))) {
      return 'Yesterday';
    } else {
      return DateFormat('MMM dd, yyyy').format(dateTime);
    }
  }

  static bool isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }

  static bool shouldShowDateHeader(DateTime current, DateTime? previous) {
    if (previous == null) return true;
    return !isSameDay(current, previous);
  }
}
