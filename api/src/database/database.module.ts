import { Global, Module } from "@nestjs/common";
import { Pool } from "pg";

// Creates the Pool and logs (without crashing) if PostgreSQL drops a connection
function createPool() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  pool.on("error", (error) => console.error("PostgreSQL:", error.message));
  return pool;
}

// @Global: every module can ask for the Pool without importing DatabaseModule
@Global()
@Module({
  providers: [{ provide: Pool, useFactory: createPool }],
  exports: [Pool],
})
export class DatabaseModule {}
