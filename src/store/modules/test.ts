import { defineStore } from "pinia";
import { useCache } from "@/hooks/useCache"; // 导入 useCache

type ITypes = {
  count: number;
};

export const useTestStore = defineStore("test", {
  state: (): ITypes => {
    // 使用 useCache 来获取缓存的值
    const { get, set } = useCache("localStorage");

    // 尝试从 localStorage 获取 count 的值，如果没有则默认值为 0
    const cachedCount = get<number>("count");
    if (cachedCount !== null) {
      return {
        count: cachedCount
      };
    }

    return {
      count: 0
    };
  },
  actions: {
    increment() {
      this.count++;
      // 更新 localStorage 中的 count 值
      const { set } = useCache("localStorage");
      set("count", this.count);
    },
  },
  getters: {
    getTest: (state) => state.count,
  },
});