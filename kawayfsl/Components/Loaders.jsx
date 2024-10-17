import { useEffect } from 'react'

export default function Loaders(props) {
  useEffect(() => {
    async function getLoader() {
      const { quantum } = await import('ldrs')
      quantum.register()
    }
    getLoader()
  }, [])
  return <l-quantum size={props.size} speed="1.75" color="azure"></l-quantum>
}