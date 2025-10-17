"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";

/**
 * Avatar wrapper
 */
export const Avatar = ({ children, className }) => (
  <div
    className={`inline-flex items-center justify-center overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

/**
 * Avatar image
 * Supports optional src and alt, falls back if not provided
 */
export const AvatarImage = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-full w-full object-cover" />
);

/**
 * Fallback when no image is available
 */
export const AvatarFallback = ({ children }) => (
  <span className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
    {children}
  </span>
);

/**
 * Dynamic Avatar for logged-in user
 * Automatically fetches Google profile via NextAuth session
 */
export const UserAvatar = ({ className }) => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    // No user session, show generic fallback
    return (
      <Avatar className={className}>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={className}>
      {session.user.image ? (
        <AvatarImage src={session.user.image} alt={session.user.name} />
      ) : (
        <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
      )}
    </Avatar>
  );
};

/**
 * Optional: Dropdown with user info and logout
 */
export const UserMenu = () => {
  const { data: session } = useSession();

  if (!session || !session.user) return null;

  return (
    <div className="flex items-center gap-2">
      <UserAvatar className="w-10 h-10" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{session.user.name}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {session.user.email}
        </span>
      </div>
      <button
        onClick={() => signOut()}
        className="ml-2 px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};
