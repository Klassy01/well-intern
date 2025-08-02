const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Session = require('./models/Session');

// Sample data
const sampleSessions = [
  {
    title: "Morning Meditation - 10 Minute Mindfulness",
    description: "Start your day with a peaceful 10-minute guided meditation focusing on breath awareness and mindfulness. Perfect for beginners and experienced practitioners alike.",
    tags: ["meditation", "mindfulness", "morning", "beginner"],
    json_file_url: "https://raw.githubusercontent.com/example/meditation-sessions/main/morning-10min.json",
    status: "published"
  },
  {
    title: "Gentle Yoga Flow for Stress Relief",
    description: "A soothing 20-minute yoga sequence designed to release tension and promote relaxation. Includes gentle stretches and breathing exercises.",
    tags: ["yoga", "stress-relief", "gentle", "flexibility"],
    json_file_url: "https://raw.githubusercontent.com/example/yoga-sessions/main/gentle-flow.json",
    status: "published"
  },
  {
    title: "Deep Sleep Relaxation Technique",
    description: "Unwind with this 15-minute guided relaxation session designed to prepare your mind and body for restful sleep.",
    tags: ["sleep", "relaxation", "evening", "guided"],
    json_file_url: "https://raw.githubusercontent.com/example/sleep-sessions/main/deep-sleep.json",
    status: "published"
  },
  {
    title: "Breathing Exercises for Anxiety",
    description: "Learn powerful breathing techniques to manage anxiety and stress. This session includes 4-7-8 breathing and box breathing methods.",
    tags: ["breathing", "anxiety", "stress", "techniques"],
    json_file_url: "https://raw.githubusercontent.com/example/breathing-sessions/main/anxiety-relief.json",
    status: "published"
  },
  {
    title: "Walking Meditation in Nature",
    description: "Experience mindful walking with this guided meditation designed for outdoor practice. Connect with nature while cultivating presence.",
    tags: ["walking", "nature", "outdoor", "mindfulness"],
    json_file_url: "https://raw.githubusercontent.com/example/walking-sessions/main/nature-walk.json",
    status: "published"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wellness-platform');
    console.log('✅ Connected to MongoDB');

    // Create a demo user
    const demoUser = new User({
      email: 'demo@wellnesshub.com',
      password_hash: '$2a$12$demo.hash.for.seeding.purposes.only' // This is just for demo
    });

    // Save the demo user
    const savedUser = await demoUser.save();
    console.log('✅ Demo user created');

    // Create sessions with the demo user
    const sessions = sampleSessions.map(session => ({
      ...session,
      user_id: savedUser._id
    }));

    // Insert sessions
    await Session.insertMany(sessions);
    console.log(`✅ ${sessions.length} sample sessions created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('📧 Email: demo@wellnesshub.com');
    console.log('🔑 Password: Use the register form to create a new account');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
