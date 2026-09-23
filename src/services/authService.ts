import { AppUser, SubscriptionPurchase, TOOL_PRICING_PLANS } from '../types/auth';
import { db } from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

const STORAGE_USERS_KEY = 'webempresa_app_users_v2';
const STORAGE_CURRENT_USER_KEY = 'webempresa_current_auth_v2';
const STORAGE_SUBSCRIPTIONS_KEY = 'webempresa_subscriptions_v2';

// Default initial admin account for the app owner
export const DEFAULT_ADMIN_USER: AppUser = {
  id: 'user_admin_owner',
  name: 'Administrador (Dono)',
  email: 'kaiow631@gmail.com',
  password: 'admin',
  role: 'admin',
  plan: 'vitalicio_230',
  planName: 'Plano Vitalício Completo',
  planPrice: 230.99,
  daysTotal: 99999,
  isLifetime: true,
  status: 'active',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString()
};

// Initial demo member account (active with 25 days remaining)
export const DEMO_MEMBER_USER: AppUser = {
  id: 'user_demo_client_1',
  name: 'Carlos Oliveira',
  email: 'cliente@teste.com',
  password: '123',
  role: 'member',
  plan: 'padrao_60',
  planName: 'Plano Padrão Econômico',
  planPrice: 60.99,
  daysTotal: 30,
  isLifetime: false,
  status: 'active',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString()
};

// Load cached users from local storage
export function loadCachedUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading cached users:', err);
  }
  return [DEFAULT_ADMIN_USER, DEMO_MEMBER_USER];
}

// Save users to cache
export function saveUsersToCache(users: AppUser[]): void {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Error saving cached users:', err);
  }
}

// Load currently logged-in user
export function loadCurrentSession(): AppUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading auth session:', err);
  }
  // Default to logged-in as admin for seamless experience, but can log out
  return DEFAULT_ADMIN_USER;
}

// Save current session
export function saveCurrentSession(user: AppUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (err) {
    console.warn('Error saving auth session:', err);
  }
}

// Calculate remaining days for an account
export function calculateDaysRemaining(user: AppUser): { days: number; isExpired: boolean } {
  if (user.isLifetime || user.role === 'admin') {
    return { days: 99999, isExpired: false };
  }

  const expiry = new Date(user.expiresAt).getTime();
  const now = Date.now();
  const diffMs = expiry - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    days: Math.max(0, days),
    isExpired: days <= 0
  };
}

// Firestore operations for Users
export async function saveUserToFirestore(user: AppUser): Promise<void> {
  try {
    const docRef = doc(db, 'app_users', user.id);
    await setDoc(docRef, user, { merge: true });
  } catch (err) {
    console.warn('Firestore save user fallback to local:', err);
  }
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  try {
    const docRef = doc(db, 'app_users', userId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete user fallback to local:', err);
  }
}

export async function fetchUsersFromFirestore(): Promise<AppUser[]> {
  try {
    const colRef = collection(db, 'app_users');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => d.data() as AppUser);
      saveUsersToCache(list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch users fallback to cache:', err);
  }
  return loadCachedUsers();
}

export function subscribeAppUsers(callback: (users: AppUser[]) => void): () => void {
  try {
    const colRef = collection(db, 'app_users');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as AppUser);
        saveUsersToCache(list);
        callback(list);
      }
    }, (error) => {
      console.warn('Users snapshot fallback to cache:', error);
    });
  } catch {
    return () => {};
  }
}

// Subscriptions & Purchases
export function loadCachedSubscriptions(): SubscriptionPurchase[] {
  try {
    const raw = localStorage.getItem(STORAGE_SUBSCRIPTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading cached subscriptions:', err);
  }
  return [
    {
      id: 'SUB-101',
      userName: 'Marcos Vinicius Ribeiro',
      userEmail: 'marcos.v@gmail.com',
      userPhone: '(11) 98765-1122',
      planId: 'vitalicio_230',
      planName: 'Plano Vitalício Completo',
      amount: 230.99,
      paymentMethod: 'pix',
      status: 'pago',
      daysDuration: 99999,
      isLifetime: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    },
    {
      id: 'SUB-100',
      userName: 'Luciana Ferreira',
      userEmail: 'luciana.f@hotmail.com',
      userPhone: '(21) 99887-3344',
      planId: 'padrao_60',
      planName: 'Plano Padrão Econômico',
      amount: 60.99,
      paymentMethod: 'pix',
      status: 'pago',
      daysDuration: 30,
      isLifetime: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
  ];
}

export function saveSubscriptionsToCache(subs: SubscriptionPurchase[]): void {
  try {
    localStorage.setItem(STORAGE_SUBSCRIPTIONS_KEY, JSON.stringify(subs));
  } catch (err) {
    console.warn('Error saving subscriptions cache:', err);
  }
}

export async function saveSubscriptionToFirestore(sub: SubscriptionPurchase): Promise<void> {
  try {
    const docRef = doc(db, 'subscriptions', sub.id);
    await setDoc(docRef, sub, { merge: true });
  } catch (err) {
    console.warn('Firestore save subscription fallback to local:', err);
  }
}

export async function fetchSubscriptionsFromFirestore(): Promise<SubscriptionPurchase[]> {
  try {
    const colRef = collection(db, 'subscriptions');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(d => d.data() as SubscriptionPurchase);
      saveSubscriptionsToCache(list);
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch subscriptions fallback to cache:', err);
  }
  return loadCachedSubscriptions();
}

export function subscribeSubscriptions(callback: (subs: SubscriptionPurchase[]) => void): () => void {
  try {
    const colRef = collection(db, 'subscriptions');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as SubscriptionPurchase);
        saveSubscriptionsToCache(list);
        callback(list);
      }
    }, (error) => {
      console.warn('Subscriptions snapshot fallback to cache:', error);
    });
  } catch {
    return () => {};
  }
}
