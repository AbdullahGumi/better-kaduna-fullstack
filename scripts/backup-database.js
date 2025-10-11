import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

// Function to create timestamped backup directory
function createBackupDirectory() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const backupDir = path.join("backups", timestamp);
  const dataDir = path.join(backupDir, "data");

  // Create directories if they don't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return { backupDir, dataDir, timestamp };
}

// Main backup function
async function backupDatabase() {
  console.log("Starting database backup...");

  try {
    // Create backup directory
    const { backupDir, dataDir, timestamp } = createBackupDirectory();
    console.log(`Backup directory created: ${backupDir}`);

    // Initialize backup data structure
    const backupData = {
      timestamp,
      backupDir,
      models: {},
    };

    // Query all Users
    console.log("Backing up users...");
    const users = await prisma.user.findMany({
      include: {
        comments: true,
      },
    });
    backupData.models.users = users;
    console.log(`Found ${users.length} users`);

    // Query all Posts with comments
    console.log("Backing up posts...");
    const posts = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
            replies: true,
          },
        },
      },
    });
    backupData.models.posts = posts;
    console.log(`Found ${posts.length} posts`);

    // Query all Events with comments
    console.log("Backing up events...");
    const events = await prisma.event.findMany({
      include: {
        comments: {
          include: {
            user: true,
            replies: true,
          },
        },
      },
    });
    backupData.models.events = events;
    console.log(`Found ${events.length} events`);

    // Query all Comments with full relations
    console.log("Backing up comments...");
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        post: true,
        event: true,
        parent: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
    });
    backupData.models.comments = comments;
    console.log(`Found ${comments.length} comments`);

    // Query all MDAs
    console.log("Backing up MDAs...");
    const mdas = await prisma.mDA.findMany();
    backupData.models.mdas = mdas;
    console.log(`Found ${mdas.length} MDAs`);

    // Write backup data to JSON file
    const backupFile = path.join(dataDir, "backup.json");
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`Backup completed successfully!`);
    console.log(`Backup file: ${backupFile}`);
    console.log(`Total records backed up:`);
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Posts: ${posts.length}`);
    console.log(`  - Events: ${events.length}`);
    console.log(`  - Comments: ${comments.length}`);
    console.log(`  - MDAs: ${mdas.length}`);
  } catch (error) {
    console.error("Error during backup:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the backup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  backupDatabase();
}

export default backupDatabase;
