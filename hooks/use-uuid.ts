import { useMemo } from 'react'

const useUUIDs = <T>(
  dependencies: T[],
  uuidGenerator = () => crypto.randomUUID()
): string[] => {
  return useMemo(
    () => dependencies.map(() => uuidGenerator()),
    [dependencies, uuidGenerator]
  )
}

export default useUUIDs
