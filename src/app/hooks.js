import { useEffect, useRef } from "react";

// 自定义 Hook: usePrevious
export function usePrevious(value) {
  // useRef 用来存储前一个值
  const ref = useRef();

  // 在每次 render 之后更新 ref.current 的值
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // 返回前一个值
  return ref.current;
}

export default usePrevious;
