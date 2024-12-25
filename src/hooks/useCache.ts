// useCache.ts
import { ref } from 'vue';

/**
 * 自定义 Hook，用于使用 WebStorage（localStorage 或 sessionStorage）管理缓存。
 */
export function useCache(storageType: 'localStorage' | 'sessionStorage' = 'localStorage') {
  // 可选：用于追踪缓存状态的 ref（根据需求决定是否使用）
  const cache = ref<{ [key: string]: any }>({});

  // 获取对应存储的 helper 方法（localStorage 或 sessionStorage）
  const getStorage = () => (storageType === 'localStorage' ? localStorage : sessionStorage);

  /**
   * 将数据存储到指定的 WebStorage（localStorage 或 sessionStorage）中。
   * @param key - 存储的键名
   * @param value - 存储的值
   */
  const set = (key: string, value: any): void => {
    try {
      const storage = getStorage();
      storage.setItem(key, JSON.stringify(value));
      cache.value[key] = value; // 可选：更新 ref 中的缓存状态以保持响应性
    } catch (error) {
      console.error('设置缓存时出错:', error);
    }
  };

  /**
   * 从指定的 WebStorage（localStorage 或 sessionStorage）中获取数据。
   * @param key - 获取的键名
   * @returns 存储的值，如果没有找到则返回 null
   */
  const get = <T>(key: string): T | null => {
    try {
      const storage = getStorage();
      const storedValue = storage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      return null;
    } catch (error) {
      console.error('获取缓存时出错:', error);
      return null;
    }
  };

  /**
   * 从指定的 WebStorage（localStorage 或 sessionStorage）中移除某个项。
   * @param key - 要移除的键名
   */
  const remove = (key: string): void => {
    try {
      const storage = getStorage();
      storage.removeItem(key);
      delete cache.value[key]; // 可选：更新 ref 中的缓存状态
    } catch (error) {
      console.error('移除缓存时出错:', error);
    }
  };

  /**
   * 清空指定的 WebStorage（localStorage 或 sessionStorage）中的所有数据。
   */
  const clear = (): void => {
    try {
      const storage = getStorage();
      storage.clear();
      cache.value = {}; // 可选：重置缓存状态
    } catch (error) {
      console.error('清空缓存时出错:', error);
    }
  };

  return { set, get, remove, clear, cache };
}