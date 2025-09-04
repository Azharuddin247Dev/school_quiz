// App Updates Configuration
// TO ADD NEW UPDATES: Add new version objects at the TOP of this array
const appUpdates = [
  {
    version: "ভার্সন ২.১",
    date: "০৪/০৯/২০২৫",
    changes: [
      "নতুন ফিচার যোগ করা হয়েছে",
      "বাগ ফিক্স করা হয়েছে",
      "UI উন্নতি করা হয়েছে",
    ],
    newApps: [
      {
        name: "QuizMaster Pro",
        description: "Play single or Multiplayer Mode",
        link: "https://azharuddin247dev.github.io/quiz_app/",
      },
    ],
  },
  {
    version: "ভার্সন ২.০",
    date: "০১/০৯/২০২৪",
    changes: [
      "সেট ভিত্তিক কুইজ সিস্টেম যোগ করা হয়েছে",
      "সম্পন্ন সেট পুনরায় খেলার সুবিধা",
      "ডাইনামিক সেট ইন্ডিকেটর যোগ করা হয়েছে",
      "সেট নম্বর সহ স্কোর সেভ করা হয়",
      "স্কোর লিডারবোর্ড উন্নত করা হয়েছে",
      "আপডেট নোটিফিকেশন বোর্ড যোগ করা হয়েছে",
    ],
  },
  {
    version: "ভার্সন ১.৫",
    date: "২৪/১২/২০২৪",
    changes: [
      "মাল্টি গেম সাপোর্ট যোগ করা হয়েছে",
      "ইংরেজি পাজল, গণিত পাজল, রসায়ন কুইজ",
      "ডাইনামিক ডিজাইন ও অ্যানিমেশন",
      "পারফরম্যান্স অপটিমাইজেশন",
    ],
  },
];

// INSTRUCTIONS FOR ADDING NEW UPDATES:
// 1. Add new version object at the TOP of the appUpdates array
// 2. Use Bengali numbers and text
// 3. Format:
//    {
//        version: 'ভার্সন X.X',
//        date: 'DD/MM/YYYY (in Bengali)',
//        changes: [
//            'First change description',
//            'Second change description'
//        ],
//        newApps: [  // OPTIONAL - for sharing new app links
//            {
//                name: 'App Name in Bengali',
//                description: 'App description in Bengali',
//                link: 'https://your-app-link.com'
//            }
//        ]
//    }
//
// EXAMPLE WITH APP LINK:
// {
//     version: 'ভার্সন ২.২',
//     date: '২৭/১২/২০২৪',
//     changes: [
//         'নতুন ফিচার যোগ করা হয়েছে'
//     ],
//     newApps: [
//         {
//             name: 'ইংরেজি কুইজ অ্যাপ',
//             description: 'নতুন ইংরেজি কুইজ অ্যাপ লঞ্চ করা হয়েছে',
//             link: 'https://example.com/english-quiz'
//         }
//     ]
// }
