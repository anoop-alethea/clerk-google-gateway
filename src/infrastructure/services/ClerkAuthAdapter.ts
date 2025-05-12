
import { useUser } from "@clerk/clerk-react";
import type { UserResource } from "@clerk/types";
import { User } from "../../domain/entities/User";

export class ClerkAuthAdapter {
  static mapToUser(clerkUser: UserResource | null | undefined): User | null {
    if (!clerkUser) return null;

    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      fullName: clerkUser.fullName,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    };
  }
}
