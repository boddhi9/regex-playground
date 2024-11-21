import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

type DebounceOptions = {
  delay?: number
  immediate?: boolean
  maxWait?: number
  leading?: boolean
  trailing?: boolean
}

type DebouncedFunction<T> = {
  (value: T): void
  cancel: () => void
  flush: () => void
}

export default function useDebounce<T>(
  initialValue: T,
  options: DebounceOptions = {}
): [T, DebouncedFunction<T>] {
  const {
    delay = 250,
    immediate = false,
    maxWait,
    leading = false,
    trailing = true,
  } = options

  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)
  const lastCallTime = useRef<number | null>(null)
  const lastInvokeTime = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const valueRef = useRef<T>(initialValue)
  const isMounted = useRef(true)

  const clearDebounceTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      isMounted.current = false
      clearDebounceTimeout()
    }
  }, [clearDebounceTimeout])

  const invokeFunc = useCallback(
    (time: number) => {
      const shouldInvoke = leading
        ? !lastInvokeTime.current
        : trailing && time - lastInvokeTime.current >= delay

      if (shouldInvoke) {
        lastInvokeTime.current = time
        if (isMounted.current) {
          setDebouncedValue(valueRef.current)
        }
      }
    },
    [delay, leading, trailing]
  )

  const debounce = useCallback<DebouncedFunction<T>>(
    ((newValue: T) => {
      valueRef.current = newValue
      const time = Date.now()
      lastCallTime.current = time

      clearDebounceTimeout()

      if (immediate && !timeoutRef.current) {
        invokeFunc(time)
      }

      const invokeDeferred = () => {
        const currentTime = Date.now()
        if (lastCallTime.current === null) {
          return
        }
        if (currentTime - lastCallTime.current >= delay) {
          invokeFunc(currentTime)
        } else if (maxWait && currentTime - lastInvokeTime.current >= maxWait) {
          invokeFunc(currentTime)
        } else {
          timeoutRef.current = setTimeout(invokeDeferred, delay)
        }
      }

      timeoutRef.current = setTimeout(invokeDeferred, delay)
    }) as DebouncedFunction<T>,
    [delay, immediate, maxWait, invokeFunc, clearDebounceTimeout]
  )

  debounce.cancel = useCallback(() => {
    clearDebounceTimeout()
    lastInvokeTime.current = 0
    lastCallTime.current = null
  }, [clearDebounceTimeout])

  debounce.flush = useCallback(() => {
    if (timeoutRef.current) {
      invokeFunc(Date.now())
      debounce.cancel()
    }
  }, [debounce, invokeFunc])

  return useMemo(() => [debouncedValue, debounce], [debouncedValue, debounce])
}
