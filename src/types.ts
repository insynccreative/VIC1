/** Roles for community members */
export enum MemberRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
  GUEST = 'guest',
}

export interface Member {
  userId: string;
  displayName: string;
  role: MemberRole;
  phoneNumber?: string;
  email?: string;
  joinedAt: any;
}

export interface Community {
  id: string;
  name: string;
  ownerId: string;
  description?: string;
  settings: {
    blockContacts: boolean;
    privateMessaging: 'all' | 'admin-only' | 'none';
  };
  createdAt: any;
}

/** Status of a message in the approval queue */
export enum MessageStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/** Private messaging settings */
export enum PrivateMessagingLevel {
  ALL = 'all',
  ADMIN_ONLY = 'admin-only',
  NONE = 'none',
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
