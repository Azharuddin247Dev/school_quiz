// Running Messages Configuration
// TO ADD NEW MESSAGES: Add new message objects at the TOP of this array
const runningMessages = [
  {
    id: 1,
    text: "🎉 নতুন ইংরেজি কুইজ অ্যাপ শীঘ্রই আসছে! প্রস্তুত থাকুন।",
    type: "announcement", // announcement, update, promotion
    active: true,
    priority: 1, // 1=high, 2=medium, 3=low
  },
  {
    id: 2,
    text: "📱 মোবাইল অ্যাপ ভার্সন ডেভেলপমেন্টে রয়েছে। খুব শীঘ্রই পাবেন!",
    type: "update",
    active: false,
    priority: 2,
  },
  {
    id: 3,
    text: "🏆 সেরা স্কোরারদের জন্য বিশেষ পুরস্কারের ব্যবস্থা করা হচ্ছে।",
    type: "promotion",
    active: false,
    priority: 3,
  },
];

// INSTRUCTIONS FOR ADDING NEW MESSAGES:
// 1. Add new message object at the TOP of the runningMessages array
// 2. Use Bengali text with emojis for better visibility
// 3. Set active: true to show the message
// 4. Format:
//    {
//        id: unique_number,
//        text: 'Your message in Bengali',
//        type: 'announcement' | 'update' | 'promotion',
//        active: true | false,
//        priority: 1 | 2 | 3  (1=high priority, shows first)
//    }
//
// MESSAGE TYPES:
// - announcement: General announcements (🎉, 📢, ⭐)
// - update: App updates info (📱, 🔄, ⚡)
// - promotion: Promotions/events (🏆, 🎁, 💎)
//
// EXAMPLES:
// {
//     id: 4,
//     text: "🔥 নতুন গণিত চ্যালেঞ্জ মোড আসছে পরের সপ্তাহে!",
//     type: "announcement",
//     active: true,
//     priority: 1
// }
//
// {
//     id: 5,
//     text: "⚡ পারফরম্যান্স উন্নতি ও নতুন ফিচার নিয়ে আপডেট আসছে।",
//     type: "update",
//     active: true,
//     priority: 2
// }
