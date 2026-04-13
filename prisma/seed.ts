import "dotenv/config";
import { prismaClient } from "@/utils/constanst";
import { users } from "./data/users";
import { consoles } from "./data/consoles";
import { players } from "./data/players";
import { hours } from "./data/hours";

async function main() {
  try {
    await prismaClient.user.createMany({
      data: users,
      skipDuplicates: true,
    });
    await prismaClient.console.createMany({
      data: consoles,
      skipDuplicates: true,
    });
    await prismaClient.player.createMany({
      data: players,
      skipDuplicates: true,
    });
    await prismaClient.hours.createMany({
      data: hours,
      skipDuplicates: true,
    });

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error in main function:", error);
    await prismaClient.$disconnect();
    process.exit(1);
  });
