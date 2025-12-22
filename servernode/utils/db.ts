import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/videoprojectmanager';

interface MongooseConnectionCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseConnection: MongooseConnectionCache | undefined;
}

const cached: MongooseConnectionCache = global.mongooseConnection || { conn: null, promise: null };
if (!global.mongooseConnection) {
    global.mongooseConnection = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(DATABASE_URL, {
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
            })
            .then((mongooseInstance) => {
                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;
                throw error;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
