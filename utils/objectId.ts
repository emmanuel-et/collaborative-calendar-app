// This is a client-safe version of ObjectId
// It's just a type definition, not the actual implementation
export type ObjectId = string;

// Helper function to convert string to ObjectId (for type compatibility)
export function toObjectId(id: string): ObjectId {
  return id;
}

// Helper function to convert ObjectId to string
export function fromObjectId(id: ObjectId): string {
  return id;
} 