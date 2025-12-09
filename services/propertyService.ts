
import { Imovel, PropertyStatus } from '../types';
import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';

/**
 * SERVICE INTERFACE
 * This ensures both the Mock and Real service have the same API.
 */
interface PropertyService {
  subscribeToProperties: (callback: (properties: Imovel[]) => void) => () => void;
  addProperty: (property: Omit<Imovel, 'id'>) => Promise<void>;
  updateProperty: (id: string, data: Partial<Imovel>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  restoreDefaults: () => Promise<void>;
}

/**
 * 1. REAL FIRESTORE SERVICE
 * Use this when you have configured firebaseConfig.ts
 */
const firestoreService: PropertyService = {
  subscribeToProperties: (callback) => {
    if (!db) {
      console.error("Firebase not initialized");
      return () => {};
    }
    const q = query(collection(db, 'imoveis'), orderBy('dataAtualizacao', 'desc'));
    
    // Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const properties: Imovel[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Imovel));
      callback(properties);
    });

    return unsubscribe;
  },

  addProperty: async (property) => {
    if (!db) throw new Error("Firebase not initialized");
    await addDoc(collection(db, 'imoveis'), {
      ...property,
      dataAtualizacao: Date.now(),
      observacao: property.observacao || '',
      fichaStatus: property.fichaStatus || 'Sem ficha',
      fichaDataAtualizacao: property.fichaDataAtualizacao || null,
      captador: property.captador || 'Não informado',
      vagoEm: property.vagoEm || null,
      liberadoEm: property.liberadoEm || null
    });
  },

  updateProperty: async (id, data) => {
    if (!db) throw new Error("Firebase not initialized");
    const docRef = doc(db, 'imoveis', id);
    await updateDoc(docRef, {
      ...data,
      dataAtualizacao: Date.now()
    });
  },

  deleteProperty: async (id) => {
    if (!db) throw new Error("Firebase not initialized");
    await deleteDoc(doc(db, 'imoveis', id));
  },

  clearAll: async () => {
    console.warn("clearAll not implemented for production Firestore to prevent accidental data loss.");
  },

  restoreDefaults: async () => {
    console.warn("restoreDefaults not implemented for production Firestore.");
  }
};

/**
 * 2. MOCK SERVICE (LOCAL STORAGE)
 * Simulates Firestore behavior for the demo.
 */

// Helper to get the key based on the current logged in user
const getStorageKey = () => {
  const user = localStorage.getItem('varp_active_user');
  // If no user is logged in (shouldn't happen with auth guard), use a default/public key
  return user ? `imobi_data_${user}` : 'imobi_data_public';
};

// Return empty array to start without data
const generateMockData = (): Imovel[] => [];

const mockService: PropertyService = {
  subscribeToProperties: (callback) => {
    const key = getStorageKey();
    
    // Load initial
    let data = localStorage.getItem(key);
    if (!data) {
      const initial = generateMockData();
      localStorage.setItem(key, JSON.stringify(initial));
      data = JSON.stringify(initial);
    }
    
    // Initial callback
    setTimeout(() => callback(JSON.parse(data!)), 100);

    // Mock "Real-time" updates via polling specifically for this demo to catch localStorage changes
    const interval = setInterval(() => {
       const currentKey = getStorageKey(); // Re-check key in case user changed
       const currentData = localStorage.getItem(currentKey);
       if (currentData) callback(JSON.parse(currentData));
    }, 1000);

    return () => clearInterval(interval);
  },

  addProperty: async (property) => {
    await new Promise(r => setTimeout(r, 500)); // Simulate network
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    const list: Imovel[] = raw ? JSON.parse(raw) : [];
    const newDoc = { 
      ...property, 
      id: Math.random().toString(36).substr(2, 9), 
      dataAtualizacao: Date.now(),
      observacao: property.observacao || '',
      fichaStatus: property.fichaStatus || 'Sem ficha',
      captador: property.captador || 'Desconhecido'
    };
    list.unshift(newDoc as Imovel);
    localStorage.setItem(key, JSON.stringify(list));
  },

  updateProperty: async (id, data) => {
    await new Promise(r => setTimeout(r, 300));
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    let list: Imovel[] = raw ? JSON.parse(raw) : [];
    list = list.map(item => item.id === id ? { ...item, ...data, dataAtualizacao: Date.now() } : item);
    localStorage.setItem(key, JSON.stringify(list));
  },

  deleteProperty: async (id) => {
    await new Promise(r => setTimeout(r, 300));
    const key = getStorageKey();
    const raw = localStorage.getItem(key);
    let list: Imovel[] = raw ? JSON.parse(raw) : [];
    list = list.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(list));
  },

  clearAll: async () => {
    await new Promise(r => setTimeout(r, 300));
    const key = getStorageKey();
    localStorage.setItem(key, JSON.stringify([]));
  },

  restoreDefaults: async () => {
    await new Promise(r => setTimeout(r, 300));
    const key = getStorageKey();
    const initial = generateMockData();
    localStorage.setItem(key, JSON.stringify(initial));
  }
};

// TOGGLE THIS to switch between Real and Mock
// export const propertyService = firestoreService; 
export const propertyService = mockService;
