
import { GeneratedImage } from "../types";

const DB_NAME = "YouyeyeIconDB";
const STORE_NAME = "history";
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    try {
      if (!window.indexedDB) {
        reject("您的浏览器不支持本地存储功能。");
        return;
      }
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject("数据库打开失败: " + request.error?.message);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
    } catch (e) {
      reject("初始化存储失败");
    }
  });
};

export const saveHistory = async (image: GeneratedImage): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(image);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("保存到历史记录失败");
  });
};

export const getAllHistory = async (): Promise<GeneratedImage[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const result = request.result as GeneratedImage[];
      resolve(result.sort((a, b) => b.timestamp - a.timestamp));
    };
    request.onerror = () => reject("获取历史记录失败");
  });
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("删除记录失败");
  });
};

export const clearAllHistory = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject("清空数据库失败");
      
      transaction.onerror = () => reject("事务处理失败");
    } catch (e) {
      reject("开启清空事务失败");
    }
  });
};
