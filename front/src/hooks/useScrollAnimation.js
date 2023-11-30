import { useState, useRef, useEffect } from "react";

export default function useScrollAnimation() {
  // 뷰포트 내부에 존재하는 지 확인하는 상태
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef();
  const options = { root: null, rootMargin: "0px", threshold: 0.5 };

  // 요소들의 가시성 확인하여 뷰포트 상태 전달
  const callback = (entries) => {
    if (entries[0].isIntersecting) {
      setIsInViewport(true);
    } else {
      setIsInViewport(false);
    }
  };

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(callback, options);
    // 모든 요소들 관찰
    observer.observe(ref.current);

    return () => {
      // 언마운트 시, 관찰 종료
      observer.disconnect();
    };
  }, []);

  return { isInViewport, ref };
}
